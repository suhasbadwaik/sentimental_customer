import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { SocketProvider } from "./context/SocketContext";
import CommentWall from "./components/CommentWall";
import AdminDashboard from "./components/AdminDashboard";
import "./App.css";

export default function App() {
  return (
    <SocketProvider>
      <BrowserRouter>
        <nav className="navbar">
          <span className="navbar-brand">💬 Sentiment Wall</span>
          <div className="navbar-links">
            <Link to="/">Wall</Link>
            <Link to="/admin">Admin</Link>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<CommentWall />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
      </BrowserRouter>
    </SocketProvider>
  );
}