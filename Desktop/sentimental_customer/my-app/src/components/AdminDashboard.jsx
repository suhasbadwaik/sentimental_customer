import { useSocketContext } from "../context/SocketContext";
import MoodChart from "./MoodChart";

export default function AdminDashboard() {
  const { counts, timeline, isConnected } = useSocketContext();
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

      <MoodChart counts={counts} timeline={timeline} />

      <p style={{ textAlign: "center", marginTop: "16px", fontSize: "0.8rem", color: "#94a3b8" }}>
        Total comments received: <strong>{total}</strong>
      </p>
    </div>
  );
}