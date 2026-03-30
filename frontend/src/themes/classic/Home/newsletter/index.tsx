"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function NewsletterSignup() {
  const [email, setEmail] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    // TODO: hook into your backend or service (Mailchimp, Resend, etc.)
    console.log("Subscribed with:", email)
    setEmail("")
  }

  return (
    <section className="w-full bg-gray-100 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Join Our Newsletter
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Subscribe & get <span className="font-semibold">10% off</span> your
          first order
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full sm:w-80"
            required
          />
          <Button type="submit" size="lg" className="bg-black text-white hover:bg-gray-800">
            Subscribe
          </Button>
        </form>
      </div>
    </section>
  )
}