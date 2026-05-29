import WaitlistForm from "./components/WaitlistForm";

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
  {
    icon: "🔗",
    title: "3B Ecosystem Integrated",
    desc: "Built in-house and aligned with Credit Builder, Fleet Commander, and the full 3B suite. Your brand stays consistent everywhere.",
  },
  {
    icon: "🎯",
    title: "Done-For-You",
    desc: "You run your business. We handle the media. No learning curves, no part-time freelancers — dedicated production that delivers.",
  },
  {
    icon: "🚀",
    title: "Built for Entrepreneurs",
    desc: "We speak your language. We know what it takes to build from scratch and we create content that reflects that journey.",
  },
];

export default function MediaGroupPage() {
  return (
    <div style={{ background: "var(--bg-base)", color: "var(--text-primary)", minHeight: "100vh" }}>

      {/* NAV */}
      <nav className="nav-glass" style={{ position: "sticky", top: 0, zIndex: 50, padding: "0 1.5rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "32px", height: "32px", borderRadius: "8px", flexShrink: 0,
              background: "linear-gradient(135deg, #9D7BFF 0%, #00D4FF 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 900, fontSize: "12px", color: "#fff",
              boxShadow: "0 0 14px rgba(157,123,255,0.5)",
            }}>
              3B
            </div>
            <span style={{ fontWeight: 700, fontSize: "15px", color: "#F5F7FA" }}>
              3B<span style={{ color: "#9D7BFF" }}>Media</span>
            </span>
            <span style={{
              fontSize: "11px", fontWeight: 600, padding: "2px 8px", borderRadius: "20px",
              background: "rgba(157,123,255,0.1)", border: "1px solid rgba(157,123,255,0.2)",
              color: "#9D7BFF", marginLeft: "4px",
            }}>
              Media · Purple & Cyan
            </span>
          </div>
          <a
            href="https://bouncebackbrian.com"
            style={{ fontSize: "13px", color: "var(--text-dim)", textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}
          >
            ← 3B Nexus
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ padding: "96px 1.5rem 80px", textAlign: "center", borderBottom: "1px solid var(--border-subtle)" }}>
        {/* Decorative aurora */}
        <div style={{
          position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
          width: "600px", height: "400px", pointerEvents: "none",
          background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(157,123,255,0.2) 0%, transparent 70%)",
        }} />
        <div style={{ maxWidth: "800px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "6px 14px", borderRadius: "20px", marginBottom: "24px",
            background: "rgba(157,123,255,0.1)", border: "1px solid rgba(157,123,255,0.25)",
          }}>
            <span style={{
              width: "6px", height: "6px", borderRadius: "50%", background: "#9D7BFF",
              boxShadow: "0 0 8px #9D7BFF", display: "inline-block",
            }} />
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#9D7BFF", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              3B Media Group · Coming Soon
            </span>
          </div>

          <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontWeight: 900, lineHeight: 1.05, marginBottom: "24px", color: "#F5F7FA" }}>
            Your Brand. Your Story.<br />
            <span className="gradient-text-media">Our Expertise.</span>
          </h1>
          <p style={{ fontSize: "1.125rem", lineHeight: 1.75, color: "var(--text-muted)", marginBottom: "40px", maxWidth: "580px", margin: "0 auto 40px" }}>
            Done-for-you media production built for entrepreneurs who are serious about growth.
            Branding, content, video, podcasts — we handle the media so you can focus on the mission.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <a href="#contact" className="btn-primary">Work With Us →</a>
            <a href="#services" className="btn-outline">See What We Do</a>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" style={{ padding: "96px 1.5rem", borderBottom: "1px solid var(--border-subtle)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#9D7BFF", marginBottom: "12px" }}>
              What We Do
            </p>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, color: "#F5F7FA" }}>
              Full-Service Media Production
            </h2>
            <p style={{ marginTop: "16px", color: "var(--text-muted)", maxWidth: "500px", margin: "16px auto 0", fontSize: "15px", lineHeight: 1.7 }}>
              Six production lanes. One team. Zero excuses not to show up online.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
            {services.map((s) => (
              <div key={s.title} className="glass-card">
                <div className="icon-badge">{s.icon}</div>
                <h3 style={{ fontSize: "17px", fontWeight: 700, marginBottom: "10px", color: "#F5F7FA" }}>{s.title}</h3>
                <p style={{ fontSize: "14px", lineHeight: 1.7, color: "var(--text-muted)" }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY 3B MEDIA */}
      <section style={{ padding: "96px 1.5rem", borderBottom: "1px solid var(--border-subtle)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#9D7BFF", marginBottom: "12px" }}>
              Why 3B Media
            </p>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, color: "#F5F7FA" }}>
              Media Built for the Movement
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
            {whyPoints.map((p) => (
              <div key={p.title} className="glass-card" style={{ borderColor: "rgba(157,123,255,0.12)" }}>
                <div style={{
                  width: "40px", height: "40px", borderRadius: "12px", marginBottom: "20px",
                  background: "rgba(157,123,255,0.12)", border: "1px solid rgba(157,123,255,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px",
                }}>
                  {p.icon}
                </div>
                <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "12px", color: "#F5F7FA" }}>{p.title}</h3>
                <p style={{ fontSize: "14px", lineHeight: 1.7, color: "var(--text-muted)" }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ECOSYSTEM TIE-IN STRIP */}
      <section style={{ padding: "64px 1.5rem", borderBottom: "1px solid var(--border-subtle)" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{
            display: "flex", flexDirection: "column", gap: "20px",
            background: "linear-gradient(135deg, rgba(157,123,255,0.08) 0%, rgba(0,212,255,0.05) 100%)",
            border: "1px solid rgba(157,123,255,0.2)", borderRadius: "20px", padding: "40px 48px",
          }}>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "24px" }}>
              <div>
                <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#9D7BFF", marginBottom: "10px" }}>
                  Part of the 3B Ecosystem
                </p>
                <h3 style={{ fontSize: "clamp(1.25rem, 3vw, 1.75rem)", fontWeight: 900, color: "#F5F7FA", marginBottom: "10px" }}>
                  One login. Six powerful products.
                </h3>
                <p style={{ fontSize: "15px", color: "var(--text-muted)", lineHeight: 1.7, maxWidth: "500px" }}>
                  3B Media Group works alongside Credit Builder, Fleet Commander, and Funding Machine —
                  all unified under 3B Nexus so your brand, business, and operations grow together.
                </p>
              </div>
              <a
                href="https://bouncebackbrian.com"
                className="btn-outline"
                style={{ whiteSpace: "nowrap", flexShrink: 0 }}
              >
                Explore the Ecosystem →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" style={{ padding: "96px 1.5rem" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto", textAlign: "center" }}>
          <div className="glass-card-lg">
            <div style={{
              width: "56px", height: "56px", borderRadius: "16px", margin: "0 auto 24px",
              background: "linear-gradient(135deg, #9D7BFF, #00D4FF)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "24px", boxShadow: "0 0 24px rgba(157,123,255,0.5)",
            }}>
              🎬
            </div>
            <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#9D7BFF", marginBottom: "16px" }}>
              Get Started
            </p>
            <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 900, marginBottom: "16px", color: "#F5F7FA" }}>
              Ready to Build Your Brand?
            </h2>
            <p style={{ fontSize: "16px", color: "var(--text-muted)", marginBottom: "40px", lineHeight: 1.7 }}>
              Join the waitlist and we&apos;ll reach out with next steps. Media production packages launching soon.
            </p>
            <WaitlistForm />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid var(--border-subtle)", padding: "32px 1.5rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{
              width: "24px", height: "24px", borderRadius: "6px",
              background: "linear-gradient(135deg, #9D7BFF 0%, #00D4FF 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 900, fontSize: "9px", color: "#fff", flexShrink: 0,
            }}>
              3B
            </div>
            <span style={{ fontSize: "13px", color: "var(--text-dim)" }}>
              © {new Date().getFullYear()} 3B Media Group · Part of the{" "}
              <a href="https://bouncebackbrian.com" style={{ color: "#9D7BFF", textDecoration: "none" }}>3B EcoSystem</a>
            </span>
          </div>
          <div style={{ display: "flex", gap: "20px" }}>
            <a href="https://credit.bouncebackbrian.com" style={{ fontSize: "13px", color: "var(--text-dim)", textDecoration: "none" }}>Credit Builder</a>
            <a href="https://fleet.bouncebackbrian.com"  style={{ fontSize: "13px", color: "var(--text-dim)", textDecoration: "none" }}>Fleet Commander</a>
            <a href="https://funding.bouncebackbrian.com" style={{ fontSize: "13px", color: "var(--text-dim)", textDecoration: "none" }}>Funding Machine</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
