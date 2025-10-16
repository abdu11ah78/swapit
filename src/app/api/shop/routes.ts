import { NextRequest, NextResponse } from "next/server"
import { products } from "@/data/classic/user/shop/shopData"

export async function GET(req: NextRequest) {
    const url = new URL(req.url)
    const category = url.searchParams.get("category") || undefined
    const search = url.searchParams.get("search") || ""
    const minPrice = Number(url.searchParams.get("minPrice") || 0)
    const maxPrice = Number(url.searchParams.get("maxPrice") || Infinity)

    let filteredProducts = products

    if (category) {
        filteredProducts = filteredProducts.filter(p => p.category === category)
    }

    if (search) {
        filteredProducts = filteredProducts.filter(p =>
            p.name.toLowerCase().includes(search.toLowerCase())
        )
    }

    filteredProducts = filteredProducts.filter(
        p => p.price >= minPrice && p.price <= maxPrice
    )

    return NextResponse.json(filteredProducts)
}