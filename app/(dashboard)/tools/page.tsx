import type { Metadata } from "next"
import { ToolsInstaller } from "@/components/tools-installer"

export const metadata: Metadata = {
  title: "Tools | reNgine",
  description: "Install and manage reconnaissance tools",
}

export default function ToolsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tools Management</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
        <ToolsInstaller />
      </div>
    </div>
  )
}

