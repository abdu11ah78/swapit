"use client"

import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { useAppContext } from "@/context/AppContext"
import { CartItem } from "./../cartItem"
import { useRouter } from "next/navigation"

interface CartSidebarProps {
  close: () => void
}

export function CartSidebar({ close }: CartSidebarProps) {
  const { cart } = useAppContext()
  const router = useRouter()

  const total = cart.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0)

  const handleCheckout = () => {
    close() 
    router.push("/checkout") 
  }

  return (
    <div className="fixed top-0 right-0 w-80 h-full bg-white shadow-xl z-50 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">Your Cart</h2>
        <button onClick={close} className="cursor-pointer">
          <X className="h-5 w-5 text-gray-700" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {cart.length === 0 ? (
          <p className="text-gray-500">Your cart is empty.</p>
        ) : (
          cart.map((item) => <CartItem key={item.id} item={item} />)
        )}
      </div>

      {cart.length > 0 && (
        <div className="p-4 border-t flex flex-col gap-2">
          <p className="font-semibold text-lg">Total: ${total.toFixed(2)}</p>
          <Button
            className="w-full bg-black text-white hover:bg-gray-800 cursor-pointer"
            onClick={handleCheckout}
          >
            Go to Checkout
          </Button>
        </div>
      )}
    </div>
  )
}