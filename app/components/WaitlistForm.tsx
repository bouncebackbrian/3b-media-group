"use client";

import { useState } from "react";

export default function WaitlistForm() {
  const [email, setEmail]   = useState("");
  const [status, setStatus] = useState<"idle" | "success">("idle");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: wire to Supabase or email service
    setStatus("success");
  }

  if (status === "success") {
    return (
      <div style={{
        padding: "20px 24px", borderRadius: "12px",
        background: "rgba(0,230,118,0.08)",
        border: "1px solid rgba(0,230,118,0.3)",
        color: "#00E676", fontWeight: 600, fontSize: "15px", textAlign: "center",
      }}>
        ✓ You&apos;re on the list! We&apos;ll be in touch soon.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "420px", margin: "0 auto" }}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        required
        style={{
          padding: "14px 18px",
          borderRadius: "10px",
          border: "1px solid rgba(157,123,255,0.25)",
          background: "rgba(16,27,51,0.6)",
          color: "#F5F7FA",
          fontSize: "15px",
          outline: "none",
        }}
      />
      <button
        type="submit"
        style={{
          background: "linear-gradient(135deg, #9D7BFF 0%, #7B5CE0 100%)",
          color: "#fff", padding: "14px", borderRadius: "10px",
          fontWeight: 700, fontSize: "15px", border: "none", cursor: "pointer",
          boxShadow: "0 0 20px rgba(157,123,255,0.4)",
          transition: "box-shadow 0.2s ease",
        }}
      >
        Join the Waitlist →
      </button>
    </form>
  );
}
