// FILE 3: app/api/admin/verify/route.ts
// ========================================

import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Missing or invalid token" },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)

    // Verify token (in production, use JWT verification)
    if (!token) {
      return NextResponse.json(
        { message: "Invalid token" },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { message: "Token is valid" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Verification error:", error)
    return NextResponse.json(
      { message: "An error occurred during verification" },
      { status: 500 }
    )
  }
}