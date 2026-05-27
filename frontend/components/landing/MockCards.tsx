"use client";

function VisionCard() {
  const areas = [
    { label: "Professional", score: 8 },
    { label: "Health", score: 7 },
    { label: "Relationships", score: 9 },
  ];
  return (
    <div className="lp-mock-card" style={{
      width: 252, background: "#FFFFFF", borderRadius: 16, padding: 20,
      boxShadow: "0 12px 40px rgba(28,25,23,0.10), 0 2px 8px rgba(28,25,23,0.06)",
      transform: "rotate(-2deg)", border: "1px solid #EDE5D8", flexShrink: 0,
    }}>
      <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#E8651A", margin: "0 0 2px" }}>Vision Canvas</p>
      <p style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A", margin: "0 0 16px" }}>10-Year Picture</p>
      {areas.map((a, i) => (
        <div key={i} style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 11, color: "#6B6B6B", fontWeight: 500 }}>{a.label}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#E8651A" }}>{a.score}/10</span>
          </div>
          <div style={{ height: 4, background: "#F0EAE3", borderRadius: 2 }}>
            <div style={{ height: "100%", width: `${a.score * 10}%`, background: "#E8651A", borderRadius: 2 }} />
          </div>
        </div>
      ))}
      <p style={{ fontSize: 11, color: "#9A8F87", marginTop: 14, fontStyle: "italic", lineHeight: 1.55, margin: "14px 0 0" }}>
        "Running my own firm, financially free, leading by example for my family."
      </p>
    </div>
  );
}

function HabitCard() {
  const habits = [
    { name: "Morning Meditation", days: [true, true, true, true, true, false, true] },
    { name: "Read 30 Minutes",    days: [true, false, true, true, true, true, true] },
    { name: "Exercise",           days: [true, true, false, true, true, true, false] },
  ];
  const dayLabels = ["M", "T", "W", "T", "F", "S", "S"];
  return (
    <div className="lp-mock-card" style={{
      width: 272, background: "#FFFFFF", borderRadius: 16, padding: 20,
      boxShadow: "0 20px 60px rgba(28,25,23,0.14), 0 4px 12px rgba(28,25,23,0.08)",
      border: "1px solid #EDE5D8", flexShrink: 0, position: "relative", zIndex: 2,
    }}>
      <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#E8651A", margin: "0 0 2px" }}>Habit Tracker</p>
      <p style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A", margin: "0 0 14px" }}>This Week</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr repeat(7, 18px)", gap: 3, marginBottom: 6, alignItems: "center" }}>
        <span />
        {dayLabels.map((d, i) => (
          <span key={i} style={{ fontSize: 9, fontWeight: 600, color: "#A8A29E", textAlign: "center" }}>{d}</span>
        ))}
      </div>
      {habits.map((h, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr repeat(7, 18px)", gap: 3, marginBottom: 8, alignItems: "center" }}>
          <span style={{ fontSize: 11, color: "#1A1A1A", fontWeight: 500, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", paddingRight: 4 }}>{h.name}</span>
          {h.days.map((done, j) => (
            <div key={j} style={{
              width: 16, height: 16, borderRadius: 3,
              background: done ? "#E8651A" : "#F0EAE3",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {done && <span style={{ fontSize: 8, color: "#fff", lineHeight: 1 }}>✓</span>}
            </div>
          ))}
        </div>
      ))}
      <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #F0EAE3", display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ fontSize: 18 }}>🔥</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#E8651A" }}>12-day streak</span>
        <span style={{ fontSize: 11, color: "#6B6B6B" }}>— best so far</span>
      </div>
    </div>
  );
}

function DailyPlanCard() {
  const tasks = [
    { text: "Review Q2 pipeline",        done: true  },
    { text: "Write vision statement",    done: false },
    { text: "Call re: partnership",      done: false },
  ];
  return (
    <div className="lp-mock-card" style={{
      width: 252, background: "#FFFFFF", borderRadius: 16, padding: 20,
      boxShadow: "0 12px 40px rgba(28,25,23,0.10), 0 2px 8px rgba(28,25,23,0.06)",
      transform: "rotate(2deg)", border: "1px solid #EDE5D8", flexShrink: 0,
    }}>
      <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#E8651A", margin: "0 0 2px" }}>Daily Plan</p>
      <p style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A", margin: "0 0 16px" }}>Today's Focus</p>
      {tasks.map((t, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <div style={{
            width: 16, height: 16, borderRadius: 4, flexShrink: 0,
            background: t.done ? "#E8651A" : "transparent",
            border: t.done ? "none" : "1.5px solid #D4CEC8",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {t.done && <span style={{ fontSize: 9, color: "#fff" }}>✓</span>}
          </div>
          <span style={{ fontSize: 12, color: t.done ? "#A8A29E" : "#1A1A1A", textDecoration: t.done ? "line-through" : "none" }}>
            {t.text}
          </span>
        </div>
      ))}
      <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #F0EAE3" }}>
        <p style={{ fontSize: 9, color: "#6B6B6B", margin: "0 0 6px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>Evening Energy</p>
        <div style={{ display: "flex", gap: 5 }}>
          {[1, 2, 3, 4, 5].map((n) => (
            <div key={n} style={{
              width: 24, height: 24, borderRadius: "50%",
              background: n <= 4 ? "#E8651A" : "#F0EAE3",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 10, color: n <= 4 ? "#fff" : "#A8A29E", fontWeight: 700,
            }}>
              {n}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function MockCards() {
  return (
    <>
      <VisionCard />
      <HabitCard />
      <DailyPlanCard />
    </>
  );
}
