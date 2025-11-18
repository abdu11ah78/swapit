import { NextResponse } from "next/server"
import type { Order, OrderResponse } from "../../../data/classic/user/types/types"

export async function POST(req: Request) {
    try {
        const body: Order = await req.json()
        console.log("📦 New Order Received:", body)

        // TODO: Save to DB (Prisma, MongoDB, etc.)
        const response: OrderResponse = {
            success: true,
            orderId: body.id,
        }

        return NextResponse.json(response)
    } catch (error) {
        console.error(error)
        const response: OrderResponse = {
            success: false,
            error: "Failed to process order",
        }
        return NextResponse.json(response, { status: 500 })
    }
}
