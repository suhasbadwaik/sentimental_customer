const STYLES = {
  positive: {
    border: "4px solid #4ade80",
    badge: { background: "#dcfce7", color: "#15803d" },
    label: "😊 Happy",
  },
  neutral: {
    border: "4px solid #facc15",
    badge: { background: "#fef9c3", color: "#a16207" },
    label: "😐 Neutral",
  },
  negative: {
    border: "4px solid #f87171",
    badge: { background: "#fee2e2", color: "#b91c1c" },
    label: "😠 Unhappy",
  },
};

export default function CommentCard({ comment }) {
  const style = STYLES[comment.sentiment?.label] ?? STYLES.neutral;
  const time = new Date(comment.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div style={{
      background: "white",
      borderRadius: "10px",
      borderLeft: style.border,
      padding: "14px 18px",
      boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
        <span style={{ fontWeight: 600, fontSize: "0.875rem", color: "#334155" }}>
          {comment.author}
        </span>
        <span style={{
          fontSize: "0.7rem",
          fontWeight: 600,
          padding: "2px 10px",
          borderRadius: "999px",
          ...style.badge,
        }}>
          {style.label}
        </span>
      </div>
      <p style={{ fontSize: "0.9rem", color: "#475569", lineHeight: 1.6 }}>
        {comment.text}
      </p>
      <p style={{ fontSize: "0.7rem", color: "#94a3b8", marginTop: "8px" }}>
        {time} · score: {comment.sentiment?.compound?.toFixed(2)}
      </p>
    </div>
  );
}