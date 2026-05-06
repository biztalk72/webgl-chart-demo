"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar, Pie, Scatter } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { labels: { color: "#ededed" } },
  },
  scales: {
    x: { ticks: { color: "#888" }, grid: { color: "#262626" } },
    y: { ticks: { color: "#888" }, grid: { color: "#262626" } },
  },
};

const pieOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { labels: { color: "#ededed" }, position: "bottom" as const },
  },
};

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const lineData = {
  labels: months,
  datasets: [
    {
      label: "Revenue ($K)",
      data: [12, 19, 15, 25, 22, 30, 28, 35, 40, 38, 45, 50],
      borderColor: "#6366f1",
      backgroundColor: "rgba(99, 102, 241, 0.1)",
      fill: true,
      tension: 0.4,
    },
    {
      label: "Expenses ($K)",
      data: [8, 12, 10, 14, 13, 18, 16, 20, 22, 21, 25, 28],
      borderColor: "#ef4444",
      backgroundColor: "rgba(239, 68, 68, 0.1)",
      fill: true,
      tension: 0.4,
    },
  ],
};

const barData = {
  labels: ["React", "Vue", "Angular", "Svelte", "Next.js", "Nuxt"],
  datasets: [
    {
      label: "GitHub Stars (K)",
      data: [220, 210, 95, 78, 125, 52],
      backgroundColor: [
        "#6366f1",
        "#22c55e",
        "#ef4444",
        "#eab308",
        "#06b6d4",
        "#f97316",
      ],
      borderRadius: 6,
    },
  ],
};

const pieData = {
  labels: ["Desktop", "Mobile", "Tablet", "Smart TV", "Other"],
  datasets: [
    {
      data: [45, 30, 12, 8, 5],
      backgroundColor: [
        "#6366f1",
        "#22c55e",
        "#eab308",
        "#ef4444",
        "#06b6d4",
      ],
      borderColor: "#111111",
      borderWidth: 2,
    },
  ],
};

const scatterData = {
  datasets: [
    {
      label: "Cluster A",
      data: Array.from({ length: 30 }, () => ({
        x: Math.random() * 40 + 10,
        y: Math.random() * 40 + 10,
      })),
      backgroundColor: "#6366f1",
    },
    {
      label: "Cluster B",
      data: Array.from({ length: 30 }, () => ({
        x: Math.random() * 40 + 50,
        y: Math.random() * 40 + 50,
      })),
      backgroundColor: "#22c55e",
    },
    {
      label: "Cluster C",
      data: Array.from({ length: 20 }, () => ({
        x: Math.random() * 30 + 60,
        y: Math.random() * 30 + 10,
      })),
      backgroundColor: "#eab308",
    },
  ],
};

export function Charts2D() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ChartCard title="Line Chart — Revenue vs Expenses">
        <Line data={lineData} options={chartOptions} />
      </ChartCard>

      <ChartCard title="Bar Chart — Framework Popularity">
        <Bar data={barData} options={chartOptions} />
      </ChartCard>

      <ChartCard title="Pie Chart — Device Distribution">
        <Pie data={pieData} options={pieOptions} />
      </ChartCard>

      <ChartCard title="Scatter Chart — Data Clusters">
        <Scatter data={scatterData} options={chartOptions} />
      </ChartCard>
    </div>
  );
}

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <h3 className="text-sm font-medium text-muted mb-4">{title}</h3>
      <div className="h-[320px]">{children}</div>
    </div>
  );
}
