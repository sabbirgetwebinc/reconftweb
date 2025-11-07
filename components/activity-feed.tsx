import { Circle } from "lucide-react"

export function ActivityFeed() {
  const activities = [
    {
      type: "Http crawl",
      target: "example.com",
      user: "sabir",
      time: "21 hours ago",
    },
    {
      type: "OS Intelligence",
      target: "example.com",
      user: "sabir",
      time: "2 days, 17 hours ago",
    },
    {
      type: "Subdomain discovery",
      target: "example.com",
      user: "sabir",
      time: "3 days, 21 hours ago",
    },
    {
      type: "Port scan",
      target: "example.com",
      user: "sabir",
      time: "2 weeks, 1 day ago",
    },
    {
      type: "Subdomain discovery",
      target: "test-site.com",
      user: "sabir",
      time: "2 weeks, 3 days ago",
    },
    {
      type: "Http crawl",
      target: "test-site.com",
      user: "sabir",
      time: "2 weeks, 5 days ago",
    },
  ]

  return (
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <div key={index} className="flex items-start gap-2">
          <Circle className="mt-1 h-4 w-4 text-primary" fill="currentColor" />
          <div className="flex-1">
            <p className="text-sm">
              <span className="font-medium">{activity.type}</span>
              <span className="text-muted-foreground"> for </span>
              <span className="text-blue-400">{activity.target}</span>
            </p>
            <p className="text-xs text-muted-foreground">
              Completed by <span className="text-blue-400">{activity.user}</span>
              <span> • {activity.time}</span>
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

