"use client"

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"
import { Bar } from "react-chartjs-2"
import { useTheme } from "next-themes"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface TechnologyBreakdownProps {
  type: "ip" | "ports" | "tech"
}

export function TechnologyBreakdown({ type }: TechnologyBreakdownProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const options = {
    indexAxis: "y" as const,
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
          color: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(34, 47, 62, 0.1)",
        },
        ticks: {
          color: isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(34, 47, 62, 0.8)",
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          color: isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(34, 47, 62, 0.8)",
        },
      },
    },
  }

  let labels: string[] = []
  let data: number[] = []

  if (type === "ip") {
    labels = [
      "43.77.49.9",
      "43.77.49.8",
      "128.232.132.13",
      "149.126.10.57",
      "54.240.195.197",
      "67.195.228.77",
      "185.243.57.56",
    ]
    data = [3, 3, 4, 4, 5, 8, 12]
  } else if (type === "ports") {
    labels = ["8080/tcp", "8443/tcp", "8000/tcp", "5000/tcp", "3000/tcp", "443/tcp", "80/tcp"]
    data = [2, 2, 3, 3, 4, 8, 10]
  } else if (type === "tech") {
    labels = ["PHP", "OpenSSL", "jQuery", "Apache HTTP Server", "Ubuntu", "Cloudflare", "Nginx"]
    data = [2, 3, 5, 8, 10, 15, 30]
  }

  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: "rgba(54, 162, 235, 0.8)",
      },
    ],
  }

  return (
    <div className="h-full">
      <Bar options={options} data={chartData} />
    </div>
  )
}

