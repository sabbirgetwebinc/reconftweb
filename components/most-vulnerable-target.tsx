export function MostVulnerableTarget() {
  return (
    <div className="flex items-center justify-center h-[200px] border border-dashed rounded-md p-4 text-center">
      <div className="text-muted-foreground">
        <p>Could not find most vulnerable targets.</p>
        <p className="text-xs mt-1">
          Once the vulnerability scan is performed, reNgine will identify the most vulnerable targets.
        </p>
      </div>
    </div>
  )
}

