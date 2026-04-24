import { useSocketContext } from "../context/SocketContext";
import CommentCard from "./CommentCard";
import CommentForm from "./CommentForm";

export default function CommentWall() {
  const { comments, isConnected } = useSocketContext();

  return (
    <div>
      <div className="wall-header">
        <h1>Customer Feedback</h1>
        <span className={isConnected ? "badge-live" : "badge-offline"}>
          {isConnected ? "● Live" : "○ Reconnecting…"}
        </span>
      </div>

      <CommentForm />

      <div className="comment-list">
        {comments.length === 0 && (
          <p className="empty-state">No feedback yet. Be the first to post!</p>
        )}
        {comments.map((c) => (
          <CommentCard key={c.id} comment={c} />
        ))}
      </div>

      <style>{`
        .wall-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }
        .wall-header h1 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1a1a2e;
        }
        .badge-live {
          font-size: 0.75rem;
          color: #16a34a;
          background: #dcfce7;
          padding: 2px 10px;
          border-radius: 999px;
        }
        .badge-offline {
          font-size: 0.75rem;
          color: #dc2626;
          background: #fee2e2;
          padding: 2px 10px;
          border-radius: 999px;
        }
        .comment-list {
          margin-top: 28px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .empty-state {
          text-align: center;
          color: #94a3b8;
          font-size: 0.875rem;
          padding: 48px 0;
        }
      `}</style>
    </div>
  );
}