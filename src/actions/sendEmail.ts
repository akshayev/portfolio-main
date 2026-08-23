"use server";

import { z } from "zod";
import { Resend } from "resend";

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

export async function sendEmail(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const rawData = {
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  };

  // Validate form fields using Zod
  const validatedFields = contactFormSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Please fix the validation errors below.",
    };
  }

  const { name, email, message } = validatedFields.data;
  const apiKey = process.env.RESEND_API_KEY;
  const recipientEmail = process.env.CONTACT_EMAIL || "hello@akshay.is-a.dev";

  if (!apiKey || apiKey === "re_123456789") {
    // Graceful fallback for development / missing API key
    console.log("[Contact Action] Mock sendEmail executed:", {
      name,
      email,
      message,
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
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
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
