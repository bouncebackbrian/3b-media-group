import WaitlistForm from "./components/WaitlistForm";

const ACCENT = "#F97316";
const BORDER = "rgba(255,255,255,0.08)";
const SURFACE = "#111111";

const services = [
  {
    icon: "🎨",
    title: "Brand Design",
    desc: "Logos, color systems, and brand identity kits that make you look like a million-dollar operation from day one.",
  },
  {
    icon: "📱",
    title: "Social Media Content",
    desc: "Scroll-stopping graphics, reels scripts, and content calendars built around your brand voice — posted consistently.",
  },
  {
    icon: "🎬",
    title: "Video Production",
    desc: "From concept to final edit. Brand films, product videos, testimonials, and short-form content that converts.",
  },
  {
    icon: "🎙️",
    title: "Podcast Production",
    desc: "Full-service podcast launch and production — recording, editing, cover art, episode notes, and distribution.",
  },
  {
    icon: "✍️",
    title: "Copywriting & Content",
    desc: "Website copy, email sequences, ad scripts, and blog posts written in your voice with one goal: results.",
  },
  {
    icon: "📰",
    title: "Press & PR",
    desc: "Press releases, media outreach, and feature placements that put your name in front of the right people.",
  },
];

const whyPoints = [
  { title: "3B Ecosystem Integrated", desc: "Built in-house and aligned with Credit Builder, Fleet Commander, and the full 3B suite. Your brand stays consistent everywhere." },
  { title: "Done-For-You", desc: "You run your business. We handle the media. No learning curves, no part-time freelancers — dedicated production." },
  { title: "Built for Entrepreneurs", desc: "We speak your language. We know what it takes to build from scratch and we create content that reflects that journey." },
];

export default function MediaGroupPage() {
  return (
    <div style={{ background: "#0a0a0a", color: "#fff", minHeight: "100vh" }}>

      {/* NAV */}
      <nav style={{ borderBottom: `1px solid ${BORDER}`, padding: "0 1.5rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "32px", height: "32px", background: ACCENT, borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: "14px", color: "#fff" }}>
              3B
            </div>
            <span style={{ fontWeight: 700, fontSize: "16px" }}>3B Media Group</span>
          </div>
          <a
            href="https://bouncebackbrian.com"
            style={{ fontSize: "13px", color: "rgba(255,255,255,0.55)", textDecoration: "none" }}
          >
            ← 3B Ecosystem
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ padding: "96px 1.5rem", textAlign: "center", borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <p style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: ACCENT, marginBottom: "16px" }}>
            3B Media Group
          </p>
          <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", fontWeight: 900, lineHeight: 1.1, marginBottom: "24px" }}>
            Your Brand. Your Story.<br />
            <span style={{ color: ACCENT }}>Our Expertise.</span>
          </h1>
          <p style={{ fontSize: "1.125rem", lineHeight: 1.7, color: "rgba(255,255,255,0.6)", marginBottom: "40px", maxWidth: "600px", margin: "0 auto 40px" }}>
            Done-for-you media production built for entrepreneurs who are serious about growth.
            Branding, content, video, podcasts — we handle the media so you can focus on the mission.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href="#contact"
              style={{ background: ACCENT, color: "#fff", padding: "14px 28px", borderRadius: "10px", fontWeight: 700, fontSize: "15px", textDecoration: "none" }}
            >
              Work With Us →
            </a>
            <a
              href="#services"
              style={{ border: `1px solid rgba(249,115,22,0.4)`, color: "#FB923C", padding: "14px 28px", borderRadius: "10px", fontWeight: 600, fontSize: "15px", textDecoration: "none" }}
            >
              See What We Do
            </a>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" style={{ padding: "96px 1.5rem", borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <p style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: ACCENT, marginBottom: "12px" }}>
              What We Do
            </p>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900 }}>
              Full-Service Media Production
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
            {services.map((s) => (
              <div key={s.title} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: "16px", padding: "32px" }}>
                <div style={{ fontSize: "36px", marginBottom: "16px" }}>{s.icon}</div>
                <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "10px" }}>{s.title}</h3>
                <p style={{ fontSize: "14px", lineHeight: 1.7, color: "rgba(255,255,255,0.55)" }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY 3B MEDIA */}
      <section style={{ padding: "96px 1.5rem", borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <p style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: ACCENT, marginBottom: "12px" }}>
              Why 3B Media
            </p>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900 }}>
              Media Built for the Movement
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
            {whyPoints.map((p) => (
              <div key={p.title} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: "16px", padding: "32px" }}>
                <div style={{ width: "40px", height: "4px", background: ACCENT, borderRadius: "2px", marginBottom: "20px" }} />
                <h3 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "12px" }}>{p.title}</h3>
                <p style={{ fontSize: "14px", lineHeight: 1.7, color: "rgba(255,255,255,0.55)" }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" style={{ padding: "96px 1.5rem" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
          <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: "24px", padding: "64px 40px" }}>
            <p style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: ACCENT, marginBottom: "16px" }}>
              Get Started
            </p>
            <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 900, marginBottom: "16px" }}>
              Ready to Build Your Brand?
            </h2>
            <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.55)", marginBottom: "40px", lineHeight: 1.7 }}>
              Join the waitlist and we&apos;ll reach out with next steps. Media production packages launching soon.
            </p>
            <WaitlistForm />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: `1px solid ${BORDER}`, padding: "32px 1.5rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)" }}>
            © {new Date().getFullYear()} 3B Media Group — Part of the{" "}
            <a href="https://bouncebackbrian.com" style={{ color: ACCENT, textDecoration: "none" }}>
              3B Ecosystem
            </a>{" "}
            by Brian A Martin
          </p>
        </div>
      </footer>

    </div>
  );
}
