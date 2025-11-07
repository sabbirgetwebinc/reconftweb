"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Terminal } from "@/components/ui/terminal"
import { AlertCircle, CheckCircle2, Download, Play, RefreshCw, PenToolIcon as Tool } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function ToolsInstaller() {
  const [isInstalling, setIsInstalling] = useState(false)
  const [output, setOutput] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("all")
  const [installedTools, setInstalledTools] = useState<Record<string, boolean>>({})

  const simulateInstallation = (toolType: string) => {
    setIsInstalling(true)
    setOutput([])

    const tools = {
      all: [
        "subfinder",
        "httpx",
        "nuclei",
        "naabu",
        "katana",
        "dnsx",
        "gf",
        "qsreplace",
        "ffuf",
        "dalfox",
        "massdns",
        "anew",
      ],
      subdomain: ["subfinder", "dnsx", "massdns", "anew"],
      web: ["httpx", "katana", "ffuf", "gf", "qsreplace"],
      vuln: ["nuclei", "dalfox", "gf"],
    }

    const selectedTools = tools[toolType as keyof typeof tools] || tools.all

    let i = 0
    const interval = setInterval(() => {
      if (i < selectedTools.length) {
        const tool = selectedTools[i]
        setOutput((prev) => [...prev, `[+] Installing ${tool}...`])

        // Simulate installation time
        setTimeout(
          () => {
            setOutput((prev) => [...prev, `[✓] Successfully installed ${tool}`])
            setInstalledTools((prev) => ({ ...prev, [tool]: true }))
          },
          1000 + Math.random() * 2000,
        )

        i++
      } else {
        clearInterval(interval)
        setOutput((prev) => [...prev, "[✓] All tools installed successfully!"])
        setIsInstalling(false)
      }
    }, 1500)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Tool className="h-5 w-5" />
          Reconnaissance Tools Installer
        </CardTitle>
        <CardDescription>
          Install and manage the tools required for web reconnaissance and vulnerability scanning
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Tools</TabsTrigger>
            <TabsTrigger value="subdomain">Subdomain Tools</TabsTrigger>
            <TabsTrigger value="web">Web Tools</TabsTrigger>
            <TabsTrigger value="vuln">Vulnerability Tools</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                "subfinder",
                "httpx",
                "nuclei",
                "naabu",
                "katana",
                "dnsx",
                "gf",
                "qsreplace",
                "ffuf",
                "dalfox",
                "massdns",
                "anew",
              ].map((tool) => (
                <div key={tool} className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{tool}</span>
                    {installedTools[tool] && (
                      <Badge variant="outline" className="bg-green-500/10 text-green-500">
                        Installed
                      </Badge>
                    )}
                  </div>
                  {installedTools[tool] ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                  )}
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="subdomain" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {["subfinder", "dnsx", "massdns", "anew"].map((tool) => (
                <div key={tool} className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{tool}</span>
                    {installedTools[tool] && (
                      <Badge variant="outline" className="bg-green-500/10 text-green-500">
                        Installed
                      </Badge>
                    )}
                  </div>
                  {installedTools[tool] ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                  )}
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="web" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {["httpx", "katana", "ffuf", "gf", "qsreplace"].map((tool) => (
                <div key={tool} className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{tool}</span>
                    {installedTools[tool] && (
                      <Badge variant="outline" className="bg-green-500/10 text-green-500">
                        Installed
                      </Badge>
                    )}
                  </div>
                  {installedTools[tool] ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                  )}
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="vuln" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {["nuclei", "dalfox", "gf"].map((tool) => (
                <div key={tool} className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{tool}</span>
                    {installedTools[tool] && (
                      <Badge variant="outline" className="bg-green-500/10 text-green-500">
                        Installed
                      </Badge>
                    )}
                  </div>
                  {installedTools[tool] ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                  )}
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6">
          <Terminal className="h-64">
            {output.map((line, i) => (
              <div key={i} className={line.includes("Successfully") ? "text-green-400" : ""}>
                {line}
              </div>
            ))}
            {isInstalling && <div className="animate-pulse">Installing...</div>}
          </Terminal>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" disabled={isInstalling}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Check Status
        </Button>
        <div className="space-x-2">
          <Button variant="outline" disabled={isInstalling}>
            <Download className="mr-2 h-4 w-4" />
            Download Script
          </Button>
          <Button onClick={() => simulateInstallation(activeTab)} disabled={isInstalling}>
            {isInstalling ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Installing...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Install Tools
              </>
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

