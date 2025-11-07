"use client"

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"
import { Bar } from "react-chartjs-2"
import { useTheme } from "next-themes"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface StatisticsChartsProps {
  type: "cve" | "cwe" | "tags"
}

export function StatisticsCharts({ type }: StatisticsChartsProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
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

  // Empty data for now
  const data = {
    labels: ["1", "2", "3", "4", "5", "6"],
    datasets: [
      {
        data: [0, 0, 0, 0, 0, 0],
        backgroundColor: "rgba(54, 162, 235, 0.8)",
      },
    ],
  }

  return (
    <div className="h-full">
      <Bar options={options} data={data} />
    </div>
  )
}

