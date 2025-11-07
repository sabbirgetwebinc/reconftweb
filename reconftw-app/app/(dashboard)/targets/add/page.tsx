import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AddTargetForm } from "@/components/add-target-form"

export const metadata: Metadata = {
  title: "Add Target | reNgine",
  description: "Add new reconnaissance targets",
}

export default function AddTargetPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Add or Import Targets</h1>
        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href="/targets">Targets</Link>
          </Button>
          <span className="text-muted-foreground">/</span>
          <span>Add Target</span>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue="add">
            <TabsList className="mb-6 grid w-full grid-cols-3">
              <TabsTrigger value="add">Add Targets</TabsTrigger>
              <TabsTrigger value="resolve">Resolve and add IP Address</TabsTrigger>
              <TabsTrigger value="import">Import</TabsTrigger>
            </TabsList>
            <TabsContent value="add">
              <AddTargetForm />
            </TabsContent>
            <TabsContent value="resolve">
              <div className="text-center text-muted-foreground">Resolve IP address functionality</div>
            </TabsContent>
            <TabsContent value="import">
              <div className="text-center text-muted-foreground">Import targets functionality</div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

