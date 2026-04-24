import { useState } from "react";

export default function CommentForm() {
  const [author, setAuthor] = useState("");
  const [text, setText] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | error | success

  const submit = async () => {
    if (!text.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author, text }),
      });
      if (!res.ok) throw new Error("Server error");
      setText("");
      setAuthor("");
      setStatus("idle");
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) submit();
  };

  return (
    <div style={{
      background: "white",
      borderRadius: "10px",
      padding: "16px",
      boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    }}>
      <input
        style={inputStyle}
        placeholder="Your name (optional)"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
      />
      <textarea
        style={{ ...inputStyle, resize: "none", height: "90px" }}
        placeholder="Share your feedback… (Ctrl+Enter to send)"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button
        onClick={submit}
        disabled={status === "loading" || !text.trim()}
        style={{
          background: status === "loading" ? "#93c5fd" : "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "8px",
          padding: "10px",
          cursor: status === "loading" || !text.trim() ? "not-allowed" : "pointer",
          fontSize: "0.875rem",
          fontWeight: 600,
          transition: "background 0.2s",
        }}
      >
        {status === "loading" ? "Sending…" : "Post Feedback"}
      </button>
      {status === "error" && (
        <p style={{ fontSize: "0.75rem", color: "#dc2626", textAlign: "center" }}>
          Could not submit. Please try again.
        </p>
      )}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  border: "1px solid #e2e8f0",
  borderRadius: "8px",
  padding: "10px 12px",
  fontSize: "0.875rem",
  outline: "none",
  fontFamily: "inherit",
  color: "#334155",
};