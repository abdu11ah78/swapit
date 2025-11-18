// FILE 2: app/api/admin/login/route.ts
// ======================================

import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate inputs
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      )
    }

    // IMPORTANT: This is a demo. In production, verify against your database
    // For now, we'll use hardcoded credentials
    const ADMIN_EMAIL = "admin@example.com"
    const ADMIN_PASSWORD = "admin123"

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      )
    }

    // Generate a simple token (in production, use JWT)
    const token = Buffer.from(`${email}:${Date.now()}`).toString("base64")

    return NextResponse.json(
      { token, message: "Login successful" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { message: "An error occurred during login" },
      { status: 500 }
    )
  }
}

