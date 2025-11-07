"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoggedOut, setIsLoggedOut] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    // In a real app, you would validate credentials against a backend
    if (username && password) {
      toast({
        title: "Login successful",
        description: "Welcome to reNgine dashboard",
      })
      router.push("/dashboard")
    } else {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Please check your credentials and try again",
      })
    }
  }

  return (
    <div className="w-full rounded-lg bg-white p-8 shadow-lg">
      <div className="mb-6 flex flex-col items-center justify-center">
        <div className="mb-2 h-16 w-16">
          <Image
            src="/placeholder.svg?height=64&width=64"
            alt="reNgine Logo"
            width={64}
            height={64}
            className="h-full w-full"
          />
        </div>
        <h1 className="text-xl font-semibold text-gray-800">Login to reNgine</h1>
        <p className="text-sm text-gray-500">Current release: v2.2.0</p>
      </div>

      {isLoggedOut && (
        <Alert className="mb-4 bg-yellow-50 text-yellow-800">
          <AlertDescription>You have been successfully logged out. Thank you for using reNgine.</AlertDescription>
        </Alert>
      )}

      <div className="mb-4 text-sm text-blue-600">
        <a href="#" className="hover:underline">
          Learn how to create reNgine account.
        </a>
      </div>

      <form onSubmit={handleLogin}>
        <div className="mb-4">
          <label htmlFor="username" className="mb-1 block text-sm font-medium text-gray-700">
            Username
          </label>
          <div className="flex items-center rounded-md border border-gray-300 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
            <span className="pl-3 text-gray-500">@</span>
            <Input
              id="username"
              type="text"
              placeholder="username"
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600">
          Log In
        </Button>
      </form>

      <div className="mt-4 text-center text-sm text-gray-600">
        <p>
          If you have any issues or feature request, feel free to{" "}
          <a href="https://github.com" className="text-blue-600 hover:underline">
            raise issue on Github
          </a>
          .
        </p>
      </div>
    </div>
  )
}

