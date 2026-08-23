"use server";

import { z } from "zod";
import { Resend } from "resend";
import { headers } from "next/headers";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long." }),
  email: z
    .string()
    .email({ message: "Please enter a valid email address." }),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters long." }),
});

export type ContactFormState = {
  success?: boolean;
  errors?: {
    name?: string[];
    email?: string[];
    message?: string[];
  };
  message?: string;
};

/**
 * Verifies Cloudflare Turnstile CAPTCHA response token.
 */
async function verifyTurnstileToken(token: string): Promise<boolean> {
  const secretKey =
    process.env.TURNSTILE_SECRET_KEY || "1x0000000000000000000000000000000AA";

  // Development bypass when secret key is not configured and token is omitted/mocked
  if (!process.env.TURNSTILE_SECRET_KEY && (!token || token === "mock-dev-token")) {
    console.log("[Turnstile Security] Dev bypass active (no TURNSTILE_SECRET_KEY provided).");
    return true;
  }

  if (!token) return false;

  try {
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: secretKey,
          response: token,
        }),
      }
    );
    const data = (await res.json()) as { success: boolean };
    return Boolean(data.success);
  } catch (error) {
    console.error("[Turnstile Verification Fault]:", error);
    return false;
  }
}

/**
 * Upstash Redis Sliding Window Rate Limiting (3 requests per 1 hour per IP).
 */
async function checkRateLimit(ip: string): Promise<{ success: boolean; reset?: number }> {
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!redisUrl || !redisToken) {
    console.log("[Upstash Redis Security] Dev bypass active (no UPSTASH_REDIS credentials).");
    return { success: true };
  }

  try {
    const redis = new Redis({
      url: redisUrl,
      token: redisToken,
    });

    const ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(3, "1 h"),
      analytics: true,
      prefix: "portfolio_contact_ratelimit",
    });

    const result = await ratelimit.limit(ip);
    return { success: result.success, reset: result.reset };
  } catch (error) {
    console.error("[Upstash Rate Limit Fault]:", error);
    // Fail open in case of Redis service outage to avoid blocking legitimate traffic
    return { success: true };
  }
}

export async function sendEmail(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  // ── 1. Cloudflare Turnstile Bot Defense Check ──
  const turnstileToken =
    (formData.get("cf-turnstile-response") as string) ||
    (formData.get("turnstile-token") as string) ||
    "";

  const isHuman = await verifyTurnstileToken(turnstileToken);

  if (!isHuman) {
    return {
      success: false,
      message: "Security Protocol Triggered: Automated bot detected or CAPTCHA challenge failed.",
    };
  }

  // ── 2. Upstash Redis Sliding Window Rate Limit Check ──
  const headerList = await headers();
  const rawIp = headerList.get("x-forwarded-for");
  const clientIp = rawIp ? rawIp.split(",")[0].trim() : "127.0.0.1";

  const rateLimitResult = await checkRateLimit(clientIp);

  if (!rateLimitResult.success) {
    return {
      success: false,
      message: "Rate Limit Exceeded: Maximum 3 transmissions per hour allowed. Please try again later.",
    };
  }

  // ── 3. Zod Schema Validation ──
  const rawData = {
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  };

  const validatedFields = contactFormSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Validation fault: Please fix the errors highlighted below.",
    };
  }

  // ── 4. Resend Email Dispatch ──
  const { name, email, message } = validatedFields.data;
  const apiKey = process.env.RESEND_API_KEY;
  const recipientEmail = process.env.CONTACT_EMAIL || "hello@akshay.is-a.dev";

  if (!apiKey || apiKey === "re_123456789") {
    console.log("[Contact Action] Mock sendEmail executed:", {
      name,
      email,
      message,
      clientIp,
    });

    return {
      success: true,
      message:
        "Protocol Initiated! (Development Mode: Resend API Key not set, message logged).",
    };
  }

  try {
    const resend = new Resend(apiKey);

    const { error } = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: [recipientEmail],
      replyTo: email,
      subject: `[Spatial Portfolio] New Protocol Dispatch from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nClient IP: ${clientIp}\n\nMessage:\n${message}`,
    });

    if (error) {
      console.error("[Resend Error]:", error);
      return {
        success: false,
        message: `Failed to dispatch protocol: ${error.message}`,
      };
    }

    return {
      success: true,
      message: "Protocol Initiated successfully! I will respond shortly.",
    };
  } catch (err: any) {
    console.error("[Server Action Error]:", err);
    return {
      success: false,
      message: "An unexpected system fault occurred while sending message.",
    };
  }
}
