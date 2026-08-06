"use client";

import { MessageCircle } from "lucide-react";
import { SITE } from "@/lib/format";

/**
 * Floating WhatsApp contact button — fixed bottom-right, slow pulse.
 * Doubles as the sticky mobile contact CTA.
 */
export function WhatsAppButton() {
  return (
    <a
      href={SITE.whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with sales on WhatsApp"
      className="group fixed bottom-5 right-5 z-[70] inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 font-semibold text-[#062b17] shadow-[0_10px_30px_-6px_rgba(37,211,102,0.6)] transition hover:scale-105"
    >
      <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-50 [animation-duration:2.4s]" aria-hidden="true" />
      <MessageCircle className="relative h-6 w-6" />
      <span className="relative hidden text-sm sm:inline">Chat with Sales</span>
    </a>
  );
}
