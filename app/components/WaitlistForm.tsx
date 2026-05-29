"use client";

import { useState } from "react";

const ACCENT = "#F97316";
const BORDER = "rgba(255,255,255,0.08)";

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success">("idle");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: wire to Supabase or email service
    setStatus("success");
  }

  if (status === "success") {
    return (
      <div style={{
        padding: "20px 24px",
        borderRadius: "10px",
        background: "rgba(34,197,94,0.1)",
        border: "1px solid rgba(34,197,94,0.3)",
        color: "#4ade80",
        fontWeight: 600,
        fontSize: "15px",
        textAlign: "center",
      }}>
        ✓ You&apos;re on the list! We&apos;ll be in touch soon.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "400px", margin: "0 auto" }}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        required
        style={{
          padding: "14px 18px",
          borderRadius: "10px",
          border: `1px solid ${BORDER}`,
          background: "rgba(255,255,255,0.05)",
          color: "#fff",
          fontSize: "15px",
          outline: "none",
        }}
      />
      <button
        type="submit"
        style={{ background: ACCENT, color: "#fff", padding: "14px", borderRadius: "10px", fontWeight: 700, fontSize: "15px", border: "none", cursor: "pointer" }}
      >
        Join the Waitlist →
      </button>
    </form>
  );
}
