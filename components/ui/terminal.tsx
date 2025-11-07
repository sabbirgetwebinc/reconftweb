import * as React from "react"
import { cn } from "@/lib/utils"

interface TerminalProps extends React.HTMLAttributes<HTMLDivElement> {}

const Terminal = React.forwardRef<HTMLDivElement, TerminalProps>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("rounded-md border bg-black p-4 text-sm text-green-400 font-mono overflow-auto", className)}
      {...props}
    >
      {children}
    </div>
  )
})

Terminal.displayName = "Terminal"

export { Terminal }

