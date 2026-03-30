"use client"

import { useParams } from "next/navigation"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useAppContext } from "@/context/AppContext"
import Link from "next/link"
import { Minus, Plus, Star } from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import type { CarouselApi } from "@/components/ui/carousel"

const PRODUCTS = [
  {
    id: "1",
    name: "Red T-Shirt",
    price: 29.99,
    images: [
      "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1920&q=80",
      "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=1920&q=80",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1920&q=80",
    ],
    description: "Soft cotton red T-shirt for everyday wear.",
    sku: "TSH-001",
    weight: "200g",
    stock: 15,
    reviews: [
      { user: "John D.", rating: 5, comment: "Great quality, fits perfectly!" },
      { user: "Sarah K.", rating: 4, comment: "Nice shirt but color slightly different." },
    ],
  },
]

export function ProductDetailPage() {
  const { id } = useParams() as { id: string }
  const { addToCart, addToWishlist, removeFromWishlist, wishlist, updateQuantity, cart } =
    useAppContext()
  const product = PRODUCTS.find((p) => p.id === id)

  const [quantity, setQuantity] = useState(1)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [api, setApi] = useState<CarouselApi>()

  useEffect(() => {
    if (!api) return
    const onSelect = () => setSelectedIndex(api.selectedScrollSnap())
    setSelectedIndex(api.selectedScrollSnap())
    api.on("select", onSelect)
    return () => {
      api.off("select", onSelect)
    }
  }, [api])

  if (!product) {
    return <div className="p-10 text-center">❌ Product not found</div>
  }

  const isInWishlist = wishlist.some((item) => item.id === product.id)

  const handleWishlistToggle = () => {
    if (isInWishlist) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.images[0] ?? "/shop/placeholder-product.jpg",
        quantity: 1,
      })
    }
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.images[0] ?? "/shop/placeholder-product.jpg",
      quantity,
    })
  }

  const handleQuantityChange = (newQty: number) => {
    if (newQty < 1) return
    setQuantity(newQty)

    const exists = cart.find((c) => c.id === product.id)
    if (exists) {
      updateQuantity(product.id, newQty)
    } else {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.images[0] ?? "/shop/placeholder-product.jpg",
        quantity: newQty,
      })
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Left: Image Carousel */}
      <div className="relative w-full">
        <Carousel className="w-full" opts={{ loop: true }} setApi={setApi}>
          <CarouselContent>
            {product.images.map((img, i) => (
              <CarouselItem
                key={i}
                className="relative w-full h-[500px] bg-gray-100 rounded-lg overflow-hidden"
              >
                <Image src={img} alt={product.name} fill className="object-cover" />
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Arrows */}
          <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/70 hover:bg-white shadow-md rounded-full cursor-pointer" />
          <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/70 hover:bg-white shadow-md rounded-full cursor-pointer" />
        </Carousel>

        {/* Thumbnails */}
        <div className="flex gap-2 mt-4 justify-center">
          {product.images.map((img, i) => (
            <button
              key={i}
              onClick={() => {
                api?.scrollTo(i)
                setSelectedIndex(i)
              }}
              className={`relative w-20 h-20 border-2 rounded-md overflow-hidden cursor-pointer transition ${
                selectedIndex === i ? "border-black" : "border-transparent"
              }`}
            >
              <Image src={img} alt={`Thumbnail ${i + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* Right: Product Details */}
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
        <p className="text-gray-600">{product.description}</p>
        <p className="text-2xl font-semibold text-black">${product.price.toFixed(2)}</p>

        {/* SKU, Weight, Stock */}
        <div className="text-sm text-gray-500 space-y-1">
          <p>
            SKU: <span className="font-medium text-black">{product.sku}</span>
          </p>
          <p>Weight: {product.weight}</p>
          <p>
            {product.stock > 0 ? (
              <span className="text-green-600">In stock ({product.stock})</span>
            ) : (
              <span className="text-red-600">Out of stock</span>
            )}
          </p>
        </div>

        {/* Quantity Selector */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            className="p-2 cursor-pointer"
            onClick={() => handleQuantityChange(quantity - 1)}
          >
            <Minus size={16} />
          </Button>
          <span className="px-4 font-semibold">{quantity}</span>
          <Button
            variant="outline"
            className="p-2 cursor-pointer"
            onClick={() => handleQuantityChange(quantity + 1)}
          >
            <Plus size={16} />
          </Button>
        </div>

        {/* Cart + Wishlist */}
        <div className="flex gap-4 mt-4">
          <Button
            className="flex-1 bg-black text-white hover:bg-gray-900 cursor-pointer"
            onClick={handleAddToCart}
          >
            Add to Cart
          </Button>
          <Button
            className={`flex-1 ${
              isInWishlist ? "bg-red-700" : "bg-red-500"
            } text-white hover:bg-red-600 cursor-pointer`}
            onClick={handleWishlistToggle}
          >
            ♥ {isInWishlist ? "Wishlisted" : "Wishlist"}
          </Button>
        </div>

        {/* Reviews */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-3">Customer Reviews</h2>
          {product.reviews.length === 0 ? (
            <p className="text-gray-500">No reviews yet</p>
          ) : (
            <div className="space-y-4">
              {product.reviews.map((r, i) => (
                <div key={i} className="border-b pb-3">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star
                        key={idx}
                        className={`h-4 w-4 ${
                          idx < r.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="mt-1 text-gray-700">{r.comment}</p>
                  <p className="text-sm text-gray-500">– {r.user}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <Link href="/shop" className="w-full md:w-auto">
          <Button className="bg-black text-white hover:bg-gray-900 cursor-pointer">
            ← Back to Shop
          </Button>
        </Link>
      </div>
    </div>
  )
}