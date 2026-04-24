import { Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
} from "chart.js";

ChartJS.register(
  ArcElement, Tooltip, Legend,
  LineElement, PointElement,
  LinearScale, CategoryScale, Filler
);

export default function MoodChart({ counts, timeline }) {
  const doughnutData = {
    labels: ["Happy", "Neutral", "Unhappy"],
    datasets: [{
      data: [counts.positive, counts.neutral, counts.negative],
      backgroundColor: ["#4ade80", "#facc15", "#f87171"],
      borderColor: ["#16a34a", "#a16207", "#dc2626"],
      borderWidth: 1,
    }],
  };

  const doughnutOptions = {
    plugins: {
      legend: { position: "bottom", labels: { font: { size: 12 } } },
    },
    cutout: "65%",
    animation: { duration: 400 },
  };

  const lineData = {
    labels: timeline.map((p) => p.time),
    datasets: [{
      label: "Compound Score",
      data: timeline.map((p) => p.compound),
      borderColor: "#2563eb",
      backgroundColor: "rgba(37, 99, 235, 0.08)",
      tension: 0.4,
      fill: true,
      pointRadius: 4,
      pointBackgroundColor: "#2563eb",
    }],
  };

  const lineOptions = {
    scales: {
      y: {
        min: -1,
        max: 1,
        ticks: {
          stepSize: 0.5,
          callback: (v) => v.toFixed(1),
          font: { size: 11 },
        },
        grid: { color: "#f1f5f9" },
      },
      x: {
        ticks: { maxTicksLimit: 8, font: { size: 11 } },
        grid: { display: false },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => ` Score: ${ctx.parsed.y.toFixed(3)}`,
        },
      },
    },
    animation: { duration: 300 },
    responsive: true,
    maintainAspectRatio: true,
  };

  const hasData = counts.positive + counts.neutral + counts.negative > 0;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: "16px" }}>
      <div style={cardStyle}>
        <p style={chartTitle}>Overall Mood Breakdown</p>
        {hasData
          ? <Doughnut data={doughnutData} options={doughnutOptions} />
          : <p style={emptyStyle}>Waiting for feedback…</p>
        }
      </div>
      <div style={cardStyle}>
        <p style={chartTitle}>Sentiment Score Over Time</p>
        {timeline.length > 0
          ? <Line data={lineData} options={lineOptions} />
          : <p style={emptyStyle}>Waiting for feedback…</p>
        }
      </div>
    </div>
  );
}

const cardStyle = {
  background: "white",
  borderRadius: "12px",
  padding: "20px",
  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
};

const chartTitle = {
  fontSize: "0.8rem",
  color: "#64748b",
  fontWeight: 600,
  marginBottom: "16px",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

const emptyStyle = {
  textAlign: "center",
  color: "#cbd5e1",
  fontSize: "0.825rem",
  padding: "40px 0",
};