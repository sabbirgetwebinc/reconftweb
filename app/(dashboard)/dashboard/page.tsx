import type { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ActivityFeed } from "@/components/activity-feed"
import { GeographicalDistribution } from "@/components/geographical-distribution"
import { VulnerabilityBreakdown } from "@/components/vulnerability-breakdown"
import { MostVulnerableTarget } from "@/components/most-vulnerable-target"
import { TechnologyBreakdown } from "@/components/technology-breakdown"
import { ScanMetrics } from "@/components/scan-metrics"
import { SystemMetrics } from "@/components/system-metrics"

export const metadata: Metadata = {
  title: "Dashboard | reNgine",
  description: "reNgine Dashboard",
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
          reNgine 2.2.0
        </Badge>
      </div>

      {/* System Performance Metrics */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-white border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Scan Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ScanMetrics />
          </CardContent>
        </Card>

        <Card className="bg-white border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">System Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <SystemMetrics />
          </CardContent>
        </Card>
      </div>

      {/* Scan Statistics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Active Scans"
          value="4"
          trend="+2"
          trendLabel="from last hour"
          chartData={[65, 75, 70, 80, 85, 90, 95, 100]}
          chartColor="rgb(74, 222, 128)"
        />
        <MetricCard
          title="Scan Queue"
          value="8"
          trend="-1"
          trendLabel="from last hour"
          chartData={[20, 30, 25, 35, 32, 40, 38, 45]}
          chartColor="rgb(251, 146, 60)"
        />
        <MetricCard
          title="CPU Usage"
          value="78%"
          trend="+5%"
          trendLabel="from last hour"
          chartData={[60, 65, 75, 70, 80, 75, 78, 77]}
          chartColor="rgb(147, 51, 234)"
        />
        <MetricCard
          title="Memory Usage"
          value="12.4GB"
          trend="+0.8GB"
          trendLabel="from last hour"
          chartData={[40, 45, 50, 55, 60, 58, 65, 62]}
          chartColor="rgb(59, 130, 246)"
        />
      </div>

      {/* Activity and Distribution */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-white border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Activity Feed</CardTitle>
          </CardHeader>
          <CardContent>
            <ActivityFeed />
          </CardContent>
        </Card>

        <Card className="bg-white border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Geographical Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <GeographicalDistribution />
          </CardContent>
        </Card>
      </div>

      {/* Vulnerability Analysis */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-white border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Vulnerability Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <VulnerabilityBreakdown />
          </CardContent>
        </Card>

        <Card className="bg-white border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">Most Vulnerable Target</CardTitle>
          </CardHeader>
          <CardContent>
            <MostVulnerableTarget />
          </CardContent>
        </Card>
      </div>

      {/* Technology Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-white border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">IP Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <TechnologyBreakdown type="ip" />
          </CardContent>
        </Card>

        <Card className="bg-white border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Port Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <TechnologyBreakdown type="ports" />
          </CardContent>
        </Card>

        <Card className="bg-white border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Technology Stack</CardTitle>
          </CardHeader>
          <CardContent>
            <TechnologyBreakdown type="tech" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

interface MetricCardProps {
  title: string
  value: string
  trend: string
  trendLabel: string
  chartData: number[]
  chartColor: string
}

function MetricCard({ title, value, trend, trendLabel, chartData, chartColor }: MetricCardProps) {
  const isPositive = trend.startsWith("+")

  return (
    <Card className="bg-white border shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline justify-between">
          <div className="text-2xl font-bold">{value}</div>
          <div className={`text-sm ${isPositive ? "text-green-500" : "text-red-500"}`}>{trend}</div>
        </div>
        <div className="text-xs text-muted-foreground mt-1">{trendLabel}</div>
        <div className="h-[80px] mt-4">
          <svg viewBox="0 0 100 20" className="h-full w-full">
            <path
              d={`M 0,10 ${chartData.map((d, i) => `L ${(i * 100) / (chartData.length - 1)},${20 - d / 5}`).join(" ")}`}
              fill="none"
              stroke={chartColor}
              strokeWidth="1.5"
            />
          </svg>
        </div>
      </CardContent>
    </Card>
  )
}

