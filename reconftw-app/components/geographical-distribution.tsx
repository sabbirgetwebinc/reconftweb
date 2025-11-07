"use client"

import { useTheme } from "next-themes"

export function GeographicalDistribution() {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const countries = [
    { name: "China", assets: 30 },
    { name: "Japan", assets: 17 },
    { name: "Hong Kong", assets: 8 },
    { name: "United States", assets: 8 },
    { name: "Singapore", assets: 4 },
    { name: "Austria", assets: 1 },
    { name: "United Kingdom", assets: 1 },
  ]

  return (
    <div className="space-y-4">
      <div className="h-[300px] w-full bg-muted/20 rounded-md relative">
        {/* This would be a real map in a production app */}
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
          World Map Visualization
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Country</h3>
        <div className="space-y-2">
          {countries.map((country) => (
            <div key={country.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-4 w-6 bg-primary/80 rounded-sm"></div>
                <span className="text-sm">{country.name}</span>
              </div>
              <span className="text-sm">{country.assets}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

