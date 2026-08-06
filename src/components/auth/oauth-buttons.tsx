"use client"

import * as React from "react"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6.2s2.7-6.2 6-6.2c1.9 0 3.2.8 3.9 1.5l2.7-2.6C16.9 3 14.7 2 12 2 6.9 2 2.7 6.2 2.7 11.3S6.9 20.6 12 20.6c6.9 0 9.6-4.8 9.6-7.3 0-.5 0-.9-.1-1.3H12Z"/>
    </svg>
  )
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden="true">
      <path d="M16.36 1.43c0 1.14-.42 2.2-1.2 3.02-.85.9-2.05 1.55-3.1 1.46-.13-1.1.42-2.26 1.18-3.05.85-.9 2.28-1.55 3.12-1.43ZM19.9 17.36c-.52 1.2-.77 1.74-1.44 2.8-.94 1.5-2.26 3.36-3.9 3.38-1.45.02-1.83-.94-3.8-.93-1.98 0-2.4.94-3.86.92-1.65-.02-2.9-1.7-3.84-3.2-2.64-4.16-2.9-9.05-1.28-11.65 1.15-1.85 2.97-2.93 4.68-2.93 1.75 0 2.85 1 4.3 1 1.4 0 2.25-1 4.3-1 1.5 0 3.1.83 4.24 2.24-3.72 2.06-3.12 7.4.6 9.36Z"/>
    </svg>
  )
}

export function OAuthButtons({ callbackUrl = "/dashboard" }: { callbackUrl?: string }) {
  const [loading, setLoading] = React.useState<"google" | "apple" | null>(null)

  return (
    <div className="grid grid-cols-2 gap-3">
      <Button
        variant="outline"
        className="h-11 gap-2"
        disabled={loading !== null}
        onClick={() => {
          setLoading("google")
          signIn("google", { callbackUrl })
        }}
      >
        <GoogleIcon />
        Google
      </Button>
      <Button
        variant="outline"
        className="h-11 gap-2"
        disabled={loading !== null}
        onClick={() => {
          setLoading("apple")
          signIn("apple", { callbackUrl })
        }}
      >
        <AppleIcon />
        Apple
      </Button>
    </div>
  )
}
