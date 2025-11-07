"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

export function AddTargetForm() {
  const [targets, setTargets] = useState("")
  const [description, setDescription] = useState("")
  const [hackerOneHandle, setHackerOneHandle] = useState("")
  const [organization, setOrganization] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!targets.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter at least one target",
      })
      return
    }

    // In a real app, you would send this data to your backend
    toast({
      title: "Target added",
      description: "Your target has been added successfully",
    })

    // Redirect to targets page
    router.push("/targets")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          You can add one or more targets. If you are adding multiple targets, separate them using new line. If the
          subdomain already exists, it will be skipped.
        </p>
        <Textarea
          placeholder="example.com"
          className="min-h-[120px]"
          value={targets}
          onChange={(e) => setTargets(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Target Description (Optional)</label>
        <Textarea
          placeholder="Interesting Target"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">HackerOne Target Team Handle</label>
        <p className="text-sm text-muted-foreground">
          This is used to send vulnerability reports to the HackerOne Program automatically. Team handle can be found
          from the program URL. https://hackerone.com/team_handle
        </p>
        <Input placeholder="team_handle" value={hackerOneHandle} onChange={(e) => setHackerOneHandle(e.target.value)} />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Target Organization (Optional)</label>
        <Input placeholder="Example Org" value={organization} onChange={(e) => setOrganization(e.target.value)} />
      </div>

      <Button type="submit" className="w-full">
        Add Target
      </Button>
    </form>
  )
}

