import { useState, useEffect } from "react";
import { useSocket } from "../hooks/useSocket";
import MoodChart from "./MoodChart";

const INITIAL_COUNTS = { positive: 0, neutral: 0, negative: 0 };

export default function AdminDashboard() {
  const { socket, isConnected } = useSocket();
  const [counts, setCounts] = useState(INITIAL_COUNTS);
  const [timeline, setTimeline] = useState([]);
  const [recentComments, setRecentComments] = useState([]);

  useEffect(() => {
    if (!socket) return;

    socket.on("new_comment", ({ sentiment, timestamp, author, text }) => {
      setCounts((prev) => ({
        ...prev,
        [sentiment.label]: prev[sentiment.label] + 1,
      }));

      setTimeline((prev) => [
        ...prev.slice(-29),
        {
          time: new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          compound: sentiment.compound,
        },
      ]);

      setRecentComments((prev) => [
        { author, text, label: sentiment.label, timestamp },
        ...prev.slice(0, 4),
      ]);
    });

    return () => socket.off("new_comment");
  }, [socket]);

  const total = counts.positive + counts.neutral + counts.negative;

  const stats = [
    { key: "positive", label: "Happy",   emoji: "😊", color: "#16a34a", bg: "#dcfce7" },
    { key: "neutral",  label: "Neutral", emoji: "😐", color: "#a16207", bg: "#fef9c3" },
    { key: "negative", label: "Unhappy", emoji: "😠", color: "#b91c1c", bg: "#fee2e2" },
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 600, color: "#1a1a2e" }}>
          Sentiment Dashboard
        </h1>
        <span style={{
          fontSize: "0.75rem",
          padding: "2px 10px",
          borderRadius: "999px",
          background: isConnected ? "#dcfce7" : "#fee2e2",
          color: isConnected ? "#16a34a" : "#dc2626",
        }}>
          {isConnected ? "● Live" : "○ Reconnecting…"}
        </span>
      </div>

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "28px" }}>
        {stats.map(({ key, label, emoji, color, bg }) => (
          <div key={key} style={{
            background: "white",
            borderRadius: "12px",
            padding: "20px",
            textAlign: "center",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            borderTop: `4px solid ${color}`,
          }}>
            <div style={{ fontSize: "2rem" }}>{emoji}</div>
            <div style={{ fontSize: "2rem", fontWeight: 700, color, marginTop: "4px" }}>
              {counts[key]}
            </div>
            <div style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "2px" }}>{label}</div>
            <div style={{
              display: "inline-block",
              marginTop: "6px",
              fontSize: "0.7rem",
              background: bg,
              color,
              borderRadius: "999px",
              padding: "1px 8px",
              fontWeight: 600,
            }}>
              {total ? Math.round((counts[key] / total) * 100) : 0}%
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <MoodChart counts={counts} timeline={timeline} />

      {/* Recent Comments */}
      {recentComments.length > 0 && (
        <div style={{ marginTop: "28px" }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "#334155", marginBottom: "12px" }}>
            Recent Activity
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {recentComments.map((c, i) => {
              const colors = { positive: "#16a34a", neutral: "#a16207", negative: "#b91c1c" };
              return (
                <div key={i} style={{
                  background: "white",
                  borderRadius: "8px",
                  padding: "10px 14px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  fontSize: "0.825rem",
                }}>
                  <div>
                    <span style={{ fontWeight: 600, color: "#334155" }}>{c.author} </span>
                    <span style={{ color: "#64748b" }}>{c.text.slice(0, 60)}{c.text.length > 60 ? "…" : ""}</span>
                  </div>
                  <span style={{ color: colors[c.label], fontWeight: 600, marginLeft: "12px", whiteSpace: "nowrap" }}>
                    {c.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}