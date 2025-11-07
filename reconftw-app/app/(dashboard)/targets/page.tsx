import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { PlusCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Targets | reNgine",
  description: "Manage reconnaissance targets",
}

export default function TargetsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Targets</h1>
        <Button asChild>
          <Link href="/targets/add">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Target
          </Link>
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Target</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Subdomains</TableHead>
              <TableHead>Endpoints</TableHead>
              <TableHead>Vulnerabilities</TableHead>
              <TableHead>Last Scan</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">example.com</TableCell>
              <TableCell>Example target</TableCell>
              <TableCell>1,245</TableCell>
              <TableCell>42</TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Badge variant="destructive" className="text-xs">
                    2
                  </Badge>
                  <Badge variant="outline" className="bg-amber-500/10 text-amber-500 text-xs">
                    3
                  </Badge>
                  <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 text-xs">
                    5
                  </Badge>
                </div>
              </TableCell>
              <TableCell>2 days ago</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Scan
                  </Button>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">test-site.com</TableCell>
              <TableCell>Test website</TableCell>
              <TableCell>863</TableCell>
              <TableCell>40</TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Badge variant="destructive" className="text-xs">
                    0
                  </Badge>
                  <Badge variant="outline" className="bg-amber-500/10 text-amber-500 text-xs">
                    1
                  </Badge>
                  <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 text-xs">
                    2
                  </Badge>
                </div>
              </TableCell>
              <TableCell>5 days ago</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Scan
                  </Button>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

