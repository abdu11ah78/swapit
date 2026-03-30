"use client"

import { useAppContext } from "@/context/AppContext"

interface CartItemProps {
  item: {
    id: string
    name: string
    price: number
    quantity?: number
    imageUrl?: string
  }
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useAppContext()

  return (
    <div className="flex items-center gap-3 border-b pb-2">
      <img
        src={item.imageUrl || "/shop/placeholder-product.jpg"}
        alt={item.name}
        className="w-16 h-16 object-cover rounded"
      />
      <div className="flex-1 flex flex-col">
        <p className="font-medium">{item.name}</p>
        <p className="text-gray-600">${item.price.toFixed(2)}</p>
        <div className="flex items-center gap-2 mt-1">
          <button
            className="px-2 py-1 bg-gray-200 rounded cursor-pointer hover:bg-gray-300"
            onClick={() =>
              updateQuantity(item.id, Math.max(1, (item.quantity || 1) - 1))
            }
          >
            -
          </button>
          <span>{item.quantity || 1}</span>
          <button
            className="px-2 py-1 bg-gray-200 rounded cursor-pointer hover:bg-gray-300"
            onClick={() =>
              updateQuantity(item.id, (item.quantity || 1) + 1)
            }
          >
            +
          </button>
        </div>
      </div>
      <p className="font-semibold">${(item.price * (item.quantity || 1)).toFixed(2)}</p>
      <button
        className="ml-2 text-red-500 cursor-pointer"
        onClick={() => removeFromCart(item.id)}
      >
        X
      </button>
    </div>
  )
}