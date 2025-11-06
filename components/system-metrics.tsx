"use client"

import { useTheme } from "next-themes"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

export function SystemMetrics() {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          color: isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(34, 47, 62, 0.8)",
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(34, 47, 62, 0.8)",
        },
      },
      y: {
        grid: {
          color: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(34, 47, 62, 0.1)",
        },
        ticks: {
          color: isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(34, 47, 62, 0.8)",
        },
      },
    },
  }

  const labels = Array.from({ length: 12 }, (_, i) => `${i}:00`)

  const data = {
    labels,
    datasets: [
      {
        label: "CPU Usage",
        data: labels.map(() => Math.random() * 100),
        borderColor: "rgb(147, 51, 234)",
        backgroundColor: "rgba(147, 51, 234, 0.2)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Memory Usage",
        data: labels.map(() => Math.random() * 100),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  }

  return (
    <div className="h-[300px]">
      <Line options={options} data={data} />
    </div>
  )
}

