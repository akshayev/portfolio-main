"use client";

import { useActionState } from "react";
import { sendEmail, ContactFormState } from "@/actions/sendEmail";
import { GlassPanel } from "@/components/ui/glass/GlassPanel";
import { GlassButton } from "@/components/ui/glass/GlassButton";
import { Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const initialState: ContactFormState = {};

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(
    sendEmail,
    initialState
  );

  return (
    <GlassPanel intensity="heavy" className="relative overflow-hidden w-full max-w-xl mx-auto">
      {/* Decorative subtle ambient glow background */}
      <div
        className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10 space-y-6">
        <div className="space-y-1.5">
          <h3 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Initiate Contact Protocol
          </h3>
          <p className="text-sm text-slate-400">
            Dispatch a secure message. Response time usually within 24 standard hours.
          </p>
        </div>

        <form action={formAction} className="space-y-4" noValidate>
          {/* Name Field */}
          <div className="space-y-1.5">
            <label
              htmlFor="name"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
            >
              Sender Identity (Name)
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              placeholder="e.g. Elena Rostova"
              disabled={isPending}
              className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-3 text-sm text-white placeholder-slate-500 backdrop-blur-md outline-none transition-colors duration-200 focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/80 disabled:opacity-50"
            />
            {state.errors?.name && (
              <p className="text-xs text-rose-400 flex items-center gap-1 mt-1">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                {state.errors.name[0]}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
            >
              Comms Link (Email)
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="e.g. elena@quantum.tech"
              disabled={isPending}
              className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-3 text-sm text-white placeholder-slate-500 backdrop-blur-md outline-none transition-colors duration-200 focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/80 disabled:opacity-50"
            />
            {state.errors?.email && (
              <p className="text-xs text-rose-400 flex items-center gap-1 mt-1">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                {state.errors.email[0]}
              </p>
            )}
          </div>

          {/* Message Field */}
          <div className="space-y-1.5">
            <label
              htmlFor="message"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
            >
              Payload Dispatch (Message)
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={4}
              placeholder="Describe project context, technical scope, or inquiries..."
              disabled={isPending}
              className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-3 text-sm text-white placeholder-slate-500 backdrop-blur-md outline-none transition-colors duration-200 focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/80 disabled:opacity-50 resize-none"
            />
            {state.errors?.message && (
              <p className="text-xs text-rose-400 flex items-center gap-1 mt-1">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                {state.errors.message[0]}
              </p>
            )}
          </div>

          {/* Form Level Notification Banner */}
          <AnimatePresence mode="wait">
            {state.message && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
                  state.success
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                    : "bg-rose-500/10 border-rose-500/30 text-rose-300"
                }`}
              >
                {state.success ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                ) : (
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
                )}
                <span>{state.message}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Action */}
          <div className="pt-2">
            <GlassButton
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={isPending}
              icon={
                isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )
              }
            >
              {isPending ? "Transmitting Protocol..." : "Transmit Protocol"}
            </GlassButton>
          </div>
        </form>
      </div>
    </GlassPanel>
  );
}
