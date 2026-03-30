/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAppContext } from "@/context/AppContext"

export type ProductCardProps = {
  id: string
  name: string
  price: number
  imageUrl?: string
  href: string
}

export function ProductCard({ id, name, price, imageUrl, href }: ProductCardProps) {
  const { cart, wishlist, addToCart, addToWishlist, removeFromWishlist } = useAppContext()
  const fallbackImage = "/shop/placeholder-product.jpg"

  const cartItem = {
    id,
    name,
    price,
    imageUrl: imageUrl ?? fallbackImage,
    quantity: 1,
  }

  const isInWishlist = wishlist.some((item) => item.id === id)

  const handleWishlistToggle = () => {
    if (isInWishlist) {
      removeFromWishlist(id)
    } else {
      addToWishlist(cartItem)
    }
  }

  return (
    <div className="group relative border rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow bg-white cursor-pointer">
      {/* Image */}
      <div className="relative w-full h-60 bg-gray-100 overflow-hidden">
        <Image
          src={imageUrl || fallbackImage}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col gap-3">
        <h3 className="text-lg font-semibold line-clamp-1 text-gray-800">{name}</h3>
        <p className="text-gray-600 font-medium">${price.toFixed(2)}</p>

        {/* Buttons */}
        <div className="flex gap-2 mt-2">
          <Link href={href} className="flex-1">
            <Button
              variant="outline"
              className="w-full text-black border-gray-300 hover:bg-gray-100 hover:border-gray-400 cursor-pointer"
            >
              View
            </Button>
          </Link>

          <Button
            className="flex-1 bg-black text-white hover:bg-gray-900 cursor-pointer"
            onClick={() => addToCart(cartItem)}
          >
            Add
          </Button>

          <Button
            className={`flex-1 ${isInWishlist ? "bg-red-700" : "bg-red-500"} text-white hover:bg-red-600 cursor-pointer`}
            onClick={handleWishlistToggle}
          >
            ♥
          </Button>
        </div>
      </div>
    </div>
  )
}