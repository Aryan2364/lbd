"use client";

import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import {
  Crown, Target, Eye, Flag, RefreshCw, Calendar, Sun, User,
  ArrowRight, Play, Compass, Heart, Telescope, BarChart2,
  Star, ListChecks, Flame, Activity, BookOpen, LayoutGrid,
  Mountain, RefreshCcw, Sunrise,
} from "lucide-react";

const ORANGE = "#E8651A";
const CREAM  = "#FAF9F7";

const JOURNEY_STEPS = [
  { Icon: Crown,     label: "Legacy"      },
  { Icon: Heart,     label: "Purpose"     },
  { Icon: Eye,       label: "Vision"      },
  { Icon: Flag,      label: "Goals"       },
  { Icon: RefreshCw, label: "Habits"      },
  { Icon: Calendar,  label: "Weekly Plan" },
  { Icon: Sun,       label: "Daily Action"},
  { Icon: User,      label: "Reflection"  },
];

const CORE_STACK = [
  {
    num: 1,
    LargeIcon: Sunrise,
    title: "Define the End",
    features: [
      { Icon: Crown,   name: "Legacy Builder",  desc: "Guided reflection on how you want to be remembered." },
      { Icon: Heart,   name: "Purpose Clarity", desc: "Discover your deeper why." },
      { Icon: Compass, name: "Values Compass",  desc: "Rank your values and use them as a decision filter." },
    ],
  },
  {
    num: 2,
    LargeIcon: Telescope,
    title: "Design the Future",
    features: [
      { Icon: LayoutGrid, name: "10-Year Vision Canvas", desc: "Visualize life across 7 dimensions." },
      { Icon: Star,       name: "Bucket List",           desc: "Capture meaningful experiences linked to your vision." },
    ],
  },
  {
    num: 3,
    LargeIcon: Target,
    title: "Convert into Action",
    features: [
      { Icon: Flag,       name: "Goal & Milestone Planner", desc: "Turn vision into goals and milestones." },
      { Icon: ListChecks, name: "Task Tracker",             desc: "Link daily tasks to milestones and goals." },
      { Icon: Flame,      name: "Habit Tracker",            desc: "Build identity-based habits with streaks and reviews." },
    ],
  },
  {
    num: 4,
    LargeIcon: Mountain,
    title: "Live, Track & Realign",
    features: [
      { Icon: Calendar,  name: "Weekly Planning",    desc: "Set your Big 3 and weekly focus." },
      { Icon: Sun,       name: "Daily Planning",     desc: "Plan MITs, priorities, and energy." },
      { Icon: Activity,  name: "Energy Tracking",    desc: "Track your rhythm, mood, and capacity." },
      { Icon: BookOpen,  name: "Reflection Journal", desc: "Capture wins, lessons, and gratitude." },
      { Icon: BarChart2, name: "Progress Dashboard", desc: "See alignment, analytics, and goal progress." },
    ],
  },
] as const;

const HOW_STEPS = [
  { num: 1, Icon: Crown,     title: "Define Your Legacy",        desc: "Start with the end in mind. What impact do you want to leave behind?" },
  { num: 2, Icon: Telescope, title: "Create Your Vision",        desc: "See your next 10 years visually. Visualize your ideal life." },
  { num: 3, Icon: Target,    title: "Break Into Goals & Habits", desc: "Convert your vision into goals, milestones and daily systems." },
  { num: 4, Icon: User,      title: "Review & Reflect Every Day",desc: "Plan your day, review your week and grow consistently." },
];

/* ─── Dashed horizontal arrow ─── */
function DashedArrowH() {
  return (
    <div style={{ flexShrink: 0, display: "flex", alignItems: "center", padding: "0 4px" }}>
      <div style={{ width: 36, height: 2, backgroundImage: `repeating-linear-gradient(to right, ${ORANGE} 0, ${ORANGE} 6px, transparent 6px, transparent 11px)` }} />
      <div style={{ width: 0, height: 0, borderLeft: `9px solid ${ORANGE}`, borderTop: "5px solid transparent", borderBottom: "5px solid transparent" }} />
    </div>
  );
}

const CSS = `
  * { box-sizing: border-box; }
  #lp-root { height: 100vh; overflow-y: auto; overflow-x: hidden; scroll-behavior: smooth; }
  .lp-nav-link { color: #1A1A1A; font-size: 14px; font-weight: 500; text-decoration: none; padding: 4px 0; transition: color 0.2s; }
  .lp-nav-link:hover { color: ${ORANGE}; }
  .lp-btn-orange {
    display: inline-flex; align-items: center; gap: 8px;
    background: ${ORANGE}; color: #fff; border: 2px solid ${ORANGE}; border-radius: 999px;
    padding: 13px 24px; font-size: 15px; font-weight: 600; cursor: pointer;
    text-decoration: none; white-space: nowrap;
    transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
    box-shadow: 0 4px 16px rgba(232,101,26,0.3);
  }
  .lp-btn-orange:hover { background: #D05A17; border-color: #D05A17; transform: translateY(-1px); box-shadow: 0 6px 22px rgba(232,101,26,0.38); }
  .lp-btn-outline {
    display: inline-flex; align-items: center; gap: 10px;
    background: transparent; color: #1A1A1A; border: 2px solid #1A1A1A; border-radius: 999px;
    padding: 12px 22px; font-size: 15px; font-weight: 600; cursor: pointer;
    text-decoration: none; white-space: nowrap; transition: border-color 0.2s, color 0.2s;
  }
  .lp-btn-outline:hover { border-color: ${ORANGE}; color: ${ORANGE}; }
  .lp-btn-cta-outline {
    display: inline-flex; align-items: center; gap: 8px;
    background: transparent; color: #fff; border: 2px solid #fff; border-radius: 999px;
    padding: 14px 28px; font-size: 15px; font-weight: 600; cursor: pointer;
    text-decoration: none; white-space: nowrap; transition: background 0.2s, color 0.2s; flex-shrink: 0;
  }
  .lp-btn-cta-outline:hover { background: #fff; color: ${ORANGE}; }
  .lp-play-circle { width: 26px; height: 26px; border-radius: 50%; border: 2px solid currentColor; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; padding-left: 2px; }
  .lp-stack-card {
    flex: 1; background: #fff; border: 1px solid #EDE5D8; border-radius: 16px;
    padding: 28px 24px; min-width: 0;
  }
  .lp-how-step { flex: 1; min-width: 0; display: flex; flex-direction: column; align-items: flex-start; }
  @media (max-width: 1024px) {
    .lp-nav-center { display: none !important; }
    .lp-hero-img  { width: 100% !important; position: relative !important; min-height: 300px; }
    .lp-img-caption { display: none !important; }
    .lp-hero-text { width: 100% !important; min-width: unset !important; }
    .lp-stack-row { flex-direction: column !important; }
    .lp-stack-arrow { display: none !important; }
    .lp-stack-connectors { display: none !important; }
    .lp-how-row { flex-wrap: wrap !important; }
    .lp-how-step { min-width: 44%; }
    .lp-how-arrow { display: none !important; }
  }
  @media (max-width: 768px) {
    .lp-hero-h1-dark, .lp-hero-h1-orange { font-size: 36px !important; letter-spacing: -0.8px !important; }
    .lp-section-pad { padding-left: 20px !important; padding-right: 20px !important; }
    .lp-hero-text { padding: 48px 20px !important; }
    .lp-journey-inner { gap: 6px !important; }
    .lp-nav-root { padding: 0 20px !important; }
    .lp-how-step { min-width: 100%; }
    .lp-cta-inner { flex-direction: column !important; text-align: center !important; gap: 24px !important; }
    .lp-cta-divider { display: none !important; }
    .lp-footer-inner { flex-direction: column !important; gap: 28px !important; }
    .lp-stack-banner { flex-direction: column !important; text-align: center !important; gap: 20px !important; }
    .lp-stack-banner-divider { display: none !important; }
  }
`;

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const el = document.getElementById("lp-root");
    if (!el) return;
    const h = () => setScrolled(el.scrollTop > 8);
    el.addEventListener("scroll", h, { passive: true });
    return () => el.removeEventListener("scroll", h);
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div id="lp-root" style={{ background: CREAM, color: "#1A1A1A", fontFamily: "var(--font-geist-sans, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif)" }}>

        {/* ─── NAV ─── */}
        <nav style={{
          position: "sticky", top: 0, zIndex: 100,
          background: scrolled ? "rgba(255,255,255,0.97)" : "rgba(250,249,247,0.97)",
          backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
          borderBottom: `1px solid ${scrolled ? "#EDE5D8" : "transparent"}`,
          transition: "border-color 0.25s",
        }}>
          <div className="lp-nav-root" style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 40px", height: 66 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9, flexShrink: 0 }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", border: `2px solid ${ORANGE}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Compass size={16} color={ORANGE} strokeWidth={2} />
              </div>
              <span style={{ fontSize: 13, fontWeight: 800, color: ORANGE, letterSpacing: "0.08em", textTransform: "uppercase" }}>Life By Design</span>
            </div>
            {/* <nav className="lp-nav-center" style={{ display: "flex", alignItems: "center", gap: 32 }}>
              {["Why Life By Design", "How It Works", "Features", "Pricing", "Resources"].map((l) => (
                <a key={l} href="#" className="lp-nav-link">{l}</a>
              ))}
            </nav> */}
            <div style={{ display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
              <Link href="/login" style={{ color: "#1A1A1A", fontSize: 14, fontWeight: 500, textDecoration: "none" }}>Log In</Link>
              <Link href="/register" className="lp-btn-orange" style={{ padding: "10px 20px", fontSize: 14 }}>
                Start Designing My Life <ArrowRight size={14} strokeWidth={2.5} />
              </Link>
            </div>
          </div>
        </nav>

        {/* ─── HERO ─── */}
        <section style={{ position: "relative", overflow: "hidden", background: CREAM, minHeight: "76vh", display: "flex", alignItems: "center" }}>
          <div className="lp-hero-img" style={{
            position: "absolute", right: 0, top: 0, bottom: 0, width: "62%", zIndex: 1,
            backgroundImage: "url('/hero-mountain.png')", backgroundSize: "cover", backgroundPosition: "15% center",
          }}>
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to right, ${CREAM} 0%, rgba(250,249,247,0.92) 8%, rgba(250,249,247,0.55) 22%, rgba(250,249,247,0.15) 38%, transparent 55%)` }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.18) 0%, transparent 35%)" }} />
            <div className="lp-img-caption" style={{ position: "absolute", right: 44, top: "50%", transform: "translateY(-50%)", maxWidth: 192, zIndex: 2 }}>
              <p style={{ fontSize: 17, fontWeight: 600, lineHeight: 1.65, color: "#fff", margin: 0, textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}>
                Define your end destination. Then start walking towards it with clarity.
              </p>
            </div>
          </div>
          <div className="lp-hero-text" style={{ position: "relative", zIndex: 2, width: "46%", minWidth: 360, padding: "80px 48px 80px max(40px, 6vw)" }}>
            <h1 className="lp-hero-h1-dark" style={{ fontSize: 60, fontWeight: 800, lineHeight: 1.08, letterSpacing: "-1.8px", color: "#1C1917", margin: "0 0 4px" }}>Build a Life by Design,</h1>
            <h1 className="lp-hero-h1-orange" style={{ fontSize: 60, fontWeight: 800, lineHeight: 1.08, letterSpacing: "-1.8px", color: ORANGE, margin: "0 0 24px" }}>Not by Default.</h1>
            <div style={{ width: 44, height: 3, background: ORANGE, borderRadius: 2, marginBottom: 24 }} />
            <p style={{ fontSize: 16, color: "#4A4035", lineHeight: 1.78, maxWidth: 400, margin: "0 0 36px" }}>
              Start with the legacy you want to leave behind. Then reverse-engineer your purpose, 10-year vision, goals, habits, weekly plans, daily actions, and reflections.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
              <Link href="/register" className="lp-btn-orange">Start Designing My Life <ArrowRight size={16} strokeWidth={2.5} /></Link>
              <a href="#how-it-works" className="lp-btn-outline">
                <span className="lp-play-circle"><Play size={9} fill="currentColor" strokeWidth={0} /></span>
                See How It Works
              </a>
            </div>
          </div>
        </section>

        {/* ─── JOURNEY BAR ─── */}
        <section className="lp-section-pad" style={{ padding: "0 40px 48px" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #EDE5D8", boxShadow: "0 4px 24px rgba(28,25,23,0.07)", padding: "28px 40px", overflowX: "auto" }}>
              <div className="lp-journey-inner" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 4, minWidth: 680 }}>
                {JOURNEY_STEPS.map(({ Icon, label }, i) => (
                  <Fragment key={label}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, flexShrink: 0 }}>
                      <Icon size={22} color={ORANGE} strokeWidth={1.8} />
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#1A1A1A", whiteSpace: "nowrap" }}>{label}</span>
                    </div>
                    {i < JOURNEY_STEPS.length - 1 && (
                      <span style={{ fontSize: 16, color: "#C4B9AD", flexShrink: 0, paddingBottom: 20 }}>›</span>
                    )}
                  </Fragment>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── CORE STACK ─── */}
        <section className="lp-section-pad" style={{ padding: "72px 40px" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            {/* Header */}
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: ORANGE, textAlign: "center", margin: "0 0 12px" }}>
              The Core Stack
            </p>
            <h2 style={{ fontSize: 42, fontWeight: 800, letterSpacing: "-1.2px", textAlign: "center", margin: "0 0 14px", color: "#1A1A1A", lineHeight: 1.15 }}>
              Everything connected from legacy to today.
            </h2>
            <p style={{ fontSize: 15, color: "#6B6B6B", textAlign: "center", maxWidth: 640, margin: "0 auto 52px", lineHeight: 1.7 }}>
              A complete life operating system that connects your legacy, purpose, vision, values,<br />
              goals, habits, tasks, plans, reflections, and progress.
            </p>

            {/* 2×2 grid with arrows */}
            <div>
              {/* ── TOP ROW ── */}
              <div className="lp-stack-row" style={{ display: "flex", alignItems: "stretch", gap: 0 }}>
                {/* Card 1 */}
                <div style={{ position: "relative", flex: 1 }}>
                  <div style={{ position: "absolute", top: -14, left: 20, width: 28, height: 28, borderRadius: "50%", background: ORANGE, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, zIndex: 2 }}>1</div>
                  <div className="lp-stack-card">
                    <div style={{ display: "flex", gap: 20 }}>
                      <div style={{ flexShrink: 0, width: 80, height: 80, borderRadius: "50%", background: "#FDF0E8", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Sunrise size={34} color={ORANGE} strokeWidth={1.5} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: 20, fontWeight: 800, color: "#1A1A1A", margin: "0 0 18px", lineHeight: 1.2 }}>Define the End</h3>
                        {CORE_STACK[0].features.map(({ Icon, name, desc }) => (
                          <div key={name} style={{ display: "flex", gap: 12, marginBottom: 14 }}>
                            <Icon size={17} color={ORANGE} strokeWidth={1.8} style={{ flexShrink: 0, marginTop: 2 }} />
                            <div>
                              <p style={{ fontSize: 13, fontWeight: 700, color: "#1A1A1A", margin: "0 0 2px" }}>{name}</p>
                              <p style={{ fontSize: 12, color: "#6B6B6B", margin: 0, lineHeight: 1.6 }}>{desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Horizontal arrow → */}
                <div className="lp-stack-arrow" style={{ flexShrink: 0, display: "flex", alignItems: "center", padding: "0 6px", paddingTop: 14 }}>
                  <DashedArrowH />
                </div>

                {/* Card 2 */}
                <div style={{ position: "relative", flex: 1 }}>
                  <div style={{ position: "absolute", top: -14, left: 20, width: 28, height: 28, borderRadius: "50%", background: ORANGE, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, zIndex: 2 }}>2</div>
                  <div className="lp-stack-card">
                    <div style={{ display: "flex", gap: 20 }}>
                      <div style={{ flexShrink: 0, width: 80, height: 80, borderRadius: "50%", background: "#FDF0E8", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Telescope size={34} color={ORANGE} strokeWidth={1.5} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: 20, fontWeight: 800, color: "#1A1A1A", margin: "0 0 18px", lineHeight: 1.2 }}>Design the Future</h3>
                        {CORE_STACK[1].features.map(({ Icon, name, desc }) => (
                          <div key={name} style={{ display: "flex", gap: 12, marginBottom: 14 }}>
                            <Icon size={17} color={ORANGE} strokeWidth={1.8} style={{ flexShrink: 0, marginTop: 2 }} />
                            <div>
                              <p style={{ fontSize: 13, fontWeight: 700, color: "#1A1A1A", margin: "0 0 2px" }}>{name}</p>
                              <p style={{ fontSize: 12, color: "#6B6B6B", margin: 0, lineHeight: 1.6 }}>{desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── VERTICAL CONNECTORS ── */}
              <div className="lp-stack-connectors" style={{ display: "flex", height: 56, position: "relative", margin: "0 0" }}>
                {/* Left side: down-curve from card1 → card3 */}
                <div style={{ flex: 1, position: "relative" }}>
                  <div style={{
                    position: "absolute", left: 40, top: 0, width: 52, height: "100%",
                    borderLeft: `2px dashed ${ORANGE}`, borderBottom: `2px dashed ${ORANGE}`,
                    borderBottomLeftRadius: 20,
                  }} />
                  {/* Arrowhead pointing right at bottom-right of curve */}
                  <div style={{
                    position: "absolute", left: 90, bottom: -1,
                    width: 0, height: 0,
                    borderLeft: `8px solid ${ORANGE}`,
                    borderTop: "5px solid transparent", borderBottom: "5px solid transparent",
                  }} />
                </div>
                {/* Gap for the arrow column */}
                <div style={{ width: 58, flexShrink: 0 }} />
                {/* Right side: down-curve from card2 → card4 */}
                <div style={{ flex: 1, position: "relative" }}>
                  <div style={{
                    position: "absolute", right: 40, top: 0, width: 52, height: "100%",
                    borderRight: `2px dashed ${ORANGE}`, borderBottom: `2px dashed ${ORANGE}`,
                    borderBottomRightRadius: 20,
                  }} />
                  {/* Arrowhead pointing left at bottom-left of curve */}
                  <div style={{
                    position: "absolute", right: 90, bottom: -1,
                    width: 0, height: 0,
                    borderRight: `8px solid ${ORANGE}`,
                    borderTop: "5px solid transparent", borderBottom: "5px solid transparent",
                  }} />
                </div>
              </div>

              {/* ── BOTTOM ROW ── */}
              <div className="lp-stack-row" style={{ display: "flex", alignItems: "stretch", gap: 0 }}>
                {/* Card 3 */}
                <div style={{ position: "relative", flex: 1 }}>
                  <div style={{ position: "absolute", top: -14, left: 20, width: 28, height: 28, borderRadius: "50%", background: ORANGE, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, zIndex: 2 }}>3</div>
                  <div className="lp-stack-card">
                    <div style={{ display: "flex", gap: 20 }}>
                      <div style={{ flexShrink: 0, width: 80, height: 80, borderRadius: "50%", background: "#FDF0E8", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Target size={34} color={ORANGE} strokeWidth={1.5} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: 20, fontWeight: 800, color: "#1A1A1A", margin: "0 0 18px", lineHeight: 1.2 }}>Convert into Action</h3>
                        {CORE_STACK[2].features.map(({ Icon, name, desc }) => (
                          <div key={name} style={{ display: "flex", gap: 12, marginBottom: 14 }}>
                            <Icon size={17} color={ORANGE} strokeWidth={1.8} style={{ flexShrink: 0, marginTop: 2 }} />
                            <div>
                              <p style={{ fontSize: 13, fontWeight: 700, color: "#1A1A1A", margin: "0 0 2px" }}>{name}</p>
                              <p style={{ fontSize: 12, color: "#6B6B6B", margin: 0, lineHeight: 1.6 }}>{desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Horizontal arrow → */}
                <div className="lp-stack-arrow" style={{ flexShrink: 0, display: "flex", alignItems: "center", padding: "0 6px", paddingTop: 14 }}>
                  <DashedArrowH />
                </div>

                {/* Card 4 */}
                <div style={{ position: "relative", flex: 1 }}>
                  <div style={{ position: "absolute", top: -14, left: 20, width: 28, height: 28, borderRadius: "50%", background: ORANGE, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, zIndex: 2 }}>4</div>
                  <div className="lp-stack-card">
                    <div style={{ display: "flex", gap: 20 }}>
                      <div style={{ flexShrink: 0, width: 80, height: 80, borderRadius: "50%", background: "#FDF0E8", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Mountain size={34} color={ORANGE} strokeWidth={1.5} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: 20, fontWeight: 800, color: "#1A1A1A", margin: "0 0 18px", lineHeight: 1.2 }}>Live, Track & Realign</h3>
                        {CORE_STACK[3].features.map(({ Icon, name, desc }) => (
                          <div key={name} style={{ display: "flex", gap: 12, marginBottom: 14 }}>
                            <Icon size={17} color={ORANGE} strokeWidth={1.8} style={{ flexShrink: 0, marginTop: 2 }} />
                            <div>
                              <p style={{ fontSize: 13, fontWeight: 700, color: "#1A1A1A", margin: "0 0 2px" }}>{name}</p>
                              <p style={{ fontSize: 12, color: "#6B6B6B", margin: 0, lineHeight: 1.6 }}>{desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── BOTTOM BANNER ── */}
            <div className="lp-stack-banner" style={{
              marginTop: 32, borderRadius: 16,
              border: "1px solid #F0D9C0",
              background: "linear-gradient(135deg, #FDF6EE 0%, #FFF9F5 100%)",
              padding: "28px 36px",
              display: "flex", alignItems: "center", gap: 32,
            }}>
              {/* Left icon */}
              <div style={{ flexShrink: 0, width: 72, height: 72, borderRadius: "50%", border: "1.5px solid #EDD5B8", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <RefreshCcw size={28} color={ORANGE} strokeWidth={1.5} />
              </div>
              {/* Divider */}
              <div className="lp-stack-banner-divider" style={{ width: 1, alignSelf: "stretch", background: "#EDD5B8", flexShrink: 0 }} />
              {/* Text */}
              <div style={{ flex: 1, textAlign: "center" }}>
                <h3 style={{ fontSize: 22, fontWeight: 800, color: "#1A1A1A", margin: "0 0 10px", letterSpacing: "-0.5px" }}>
                  Every feature links back to your legacy.
                </h3>
                <p style={{ fontSize: 13, color: "#6B6B6B", lineHeight: 1.72, margin: "0 0 16px" }}>
                  A task connects to a milestone. A milestone connects to a goal. A goal connects to your vision.<br />
                  Your vision connects to your purpose. Your purpose connects to your legacy.
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 14, justifyContent: "center" }}>
                  <div style={{ flex: 1, height: 1.5, background: ORANGE, maxWidth: 72, borderRadius: 1 }} />
                  <span style={{ fontSize: 14, fontStyle: "italic", fontWeight: 600, color: ORANGE, whiteSpace: "nowrap" }}>
                    Am I walking toward the life I designed?
                  </span>
                  <div style={{ flex: 1, height: 1.5, background: ORANGE, maxWidth: 72, borderRadius: 1 }} />
                </div>
              </div>
              {/* Divider */}
              <div className="lp-stack-banner-divider" style={{ width: 1, alignSelf: "stretch", background: "#EDD5B8", flexShrink: 0 }} />
              {/* Right icon */}
              <div style={{ flexShrink: 0, width: 52, height: 52, borderRadius: "50%", background: ORANGE, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Heart size={22} color="#fff" fill="#fff" strokeWidth={0} />
              </div>
            </div>
          </div>
        </section>

        {/* ─── HOW IT WORKS ─── */}
        <section id="how-it-works" className="lp-section-pad" style={{ padding: "64px 40px", background: "#F5F0EB" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: ORANGE, textAlign: "center", margin: "0 0 12px" }}>How It Works</p>
            <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-1px", textAlign: "center", margin: "0 0 52px", color: "#1A1A1A", lineHeight: 1.2 }}>
              A simple 4-step journey to design your life.
            </h2>
            <div className="lp-how-row" style={{ display: "flex", alignItems: "flex-start", gap: 0 }}>
              {HOW_STEPS.map(({ num, Icon, title, desc }, i) => (
                <Fragment key={num}>
                  <div className="lp-how-step">
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: ORANGE, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, marginBottom: 14 }}>{num}</div>
                    <div style={{ width: 52, height: 52, borderRadius: "50%", border: "1.5px solid #D4CEC8", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                      <Icon size={22} color={ORANGE} strokeWidth={1.8} />
                    </div>
                    <p style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A", margin: "0 0 8px", lineHeight: 1.3 }}>{title}</p>
                    <p style={{ fontSize: 13, color: "#6B6B6B", margin: 0, lineHeight: 1.7, maxWidth: 220 }}>{desc}</p>
                  </div>
                  {i < HOW_STEPS.length - 1 && (
                    <div className="lp-how-arrow" style={{ flexShrink: 0, padding: "0 16px", paddingTop: 52, color: "#C4B9AD", fontSize: 22 }}>→</div>
                  )}
                </Fragment>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CTA BANNER ─── */}
        <section style={{ background: ORANGE, padding: "56px 40px" }} className="lp-section-pad">
          <div className="lp-cta-inner" style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", gap: 48 }}>
            <div style={{ flex: "0 0 auto", maxWidth: 340 }}>
              <h2 style={{ fontSize: 40, fontWeight: 800, color: "#fff", lineHeight: 1.15, letterSpacing: "-1px", margin: 0 }}>Your future should not be accidental.</h2>
            </div>
            <div className="lp-cta-divider" style={{ width: 1, alignSelf: "stretch", background: "rgba(255,255,255,0.35)", flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 18, color: "rgba(255,255,255,0.92)", lineHeight: 1.65, margin: 0, maxWidth: 380 }}>
                Life By Design helps you convert your deepest intentions into daily action.
              </p>
            </div>
            <Link href="/register" className="lp-btn-cta-outline">
              Start My Life Design Journey <ArrowRight size={16} strokeWidth={2.5} />
            </Link>
          </div>
        </section>

        {/* ─── FOOTER ─── */}
        <footer style={{ background: "#fff", borderTop: "1px solid #E8E2DC", padding: "40px 40px" }} className="lp-section-pad">
          <div className="lp-footer-inner" style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "flex-start", gap: 48 }}>
            <div style={{ flexShrink: 0, minWidth: 180 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", border: `1.5px solid ${ORANGE}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Compass size={13} color={ORANGE} strokeWidth={2} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 800, color: ORANGE, letterSpacing: "0.1em", textTransform: "uppercase" }}>Life By Design</span>
              </div>
              <p style={{ fontSize: 12, color: "#6B6B6B", margin: 0, lineHeight: 1.6 }}>Build your life by design,<br />Not by Default.</p>
            </div>
            {/* <nav style={{ display: "flex", gap: 28, flex: 1, flexWrap: "wrap" }}>
              {["Why Life By Design", "How It Works", "Features", "Pricing", "Resources"].map((l) => (
                <a key={l} href="#" style={{ fontSize: 13, color: "#4A4035", textDecoration: "none", fontWeight: 500, whiteSpace: "nowrap" }}>{l}</a>
              ))}
            </nav> */}
            <div style={{ display: "flex", flexDirection: "column", gap: 4, flexShrink: 0 }}>
              {([["Privacy Policy", "/privacy"], ["Terms of Use", "/terms"], ["Contact Us", "#"]] as const).map(([l, h]) => (
                <Link key={l} href={h} style={{ fontSize: 12, color: "#6B6B6B", textDecoration: "none" }}>{l}</Link>
              ))}
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}
