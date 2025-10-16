"use client"

import { useAppContext } from "@/context/AppContext"
import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { Order, ShippingInfo, PaymentMethod, OrderResponse } from "../../../../data/classic/user/types/types"
import toast from 'react-hot-toast'

export function CheckoutPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useAppContext()
  const [step, setStep] = useState<"cart" | "shipping" | "payment" | "review">("cart")
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card")

  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    fullName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  })

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 100 ? 0 : 10
  const total = subtotal + shipping

  const nextStep = () => {
    if (step === "cart") {
      if (cart.length === 0) {
        toast.error("Your cart is empty!")
        return
      }
      setStep("shipping")
    } else if (step === "shipping") {
      const { fullName, email, phone, street, city, state, postalCode, country } = shippingInfo
      if (!fullName || !email || !phone || !street || !city || !state || !postalCode || !country) {
        toast.error("Please fill in all required shipping fields")
        return
      }
      setStep("payment")
    } else if (step === "payment") {
      if (!paymentMethod) {
        toast.error("Please select a payment method")
        return
      }
      if (paymentMethod === "card") {
        const cardInputs = document.querySelectorAll<HTMLInputElement>(
          "input[placeholder='Card Number'], input[placeholder='MM/YY'], input[placeholder='CVC']"
        )
        for (let input of cardInputs) {
          if (!input.value.trim()) {
            toast.error("Please fill in all card details")
            return
          }
        }
      }
      setStep("review")
    }
  }

  const prevStep = () => {
    if (step === "review") setStep("payment")
    else if (step === "payment") setStep("shipping")
    else if (step === "shipping") setStep("cart")
  }

  const placeOrder = async () => {
    const order: Order = {
      id: Date.now().toString(),
      items: cart,
      total,
      shippingAddress: { ...shippingInfo },
      paymentMethod,
      status: "pending",
      createdAt: new Date().toISOString(),
    }

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      })
      const data: OrderResponse = await res.json()

      if (data.success) {
        toast.success(`Order placed successfully! ID: ${data.orderId}`)
        clearCart()
        setStep("cart")
      } else {
        toast.error(`Failed: ${data.error}`)
      }
    } catch (err) {
      toast.error("Something went wrong while placing order")
      console.error(err)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      {/* Progress Indicator */}
      <div className="flex justify-between mb-10">
        {["Cart", "Shipping", "Payment", "Review"].map((label, i) => (
          <div
            key={i}
            className={`flex-1 text-center text-sm font-semibold ${
              step === label.toLowerCase() ? "text-black" : "text-gray-400"
            }`}
          >
            {label}
          </div>
        ))}
      </div>

      {/* Step 1: Cart */}
      {step === "cart" && (
        <div>
          {cart.length === 0 ? (
            <div className="text-center text-gray-600">
              Your cart is empty.{" "}
              <Link href="/shop" className="text-black underline">
                Go shopping →
              </Link>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center gap-4">
                      <Image
                        src={item.imageUrl || "/shop/placeholder-product.jpg"}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="rounded-md object-cover"
                      />
                      <div>
                        <h2 className="font-semibold">{item.name}</h2>
                        <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </Button>
                      <span>{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-right">
                <p className="font-semibold">Subtotal: ${subtotal.toFixed(2)}</p>
                <p className="text-gray-600">Shipping: ${shipping.toFixed(2)}</p>
                <p className="text-xl font-bold">Total: ${total.toFixed(2)}</p>
              </div>
              <div className="mt-6 flex justify-end">
                <Button className="bg-black text-white" onClick={nextStep}>
                  Continue to Shipping →
                </Button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Step 2: Shipping */}
      {step === "shipping" && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Full Name"
              className="border p-2 rounded-md"
              value={shippingInfo.fullName}
              onChange={(e) => setShippingInfo({ ...shippingInfo, fullName: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              className="border p-2 rounded-md"
              value={shippingInfo.email}
              onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
            />
            <input
              type="text"
              placeholder="Phone"
              className="border p-2 rounded-md"
              value={shippingInfo.phone}
              onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
            />
            <input
              type="text"
              placeholder="Street Address"
              className="border p-2 rounded-md col-span-2"
              value={shippingInfo.street}
              onChange={(e) => setShippingInfo({ ...shippingInfo, street: e.target.value })}
            />
            <input
              type="text"
              placeholder="City"
              className="border p-2 rounded-md"
              value={shippingInfo.city}
              onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
            />
            <input
              type="text"
              placeholder="State"
              className="border p-2 rounded-md"
              value={shippingInfo.state}
              onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
            />
            <input
              type="text"
              placeholder="Postal Code"
              className="border p-2 rounded-md"
              value={shippingInfo.postalCode}
              onChange={(e) => setShippingInfo({ ...shippingInfo, postalCode: e.target.value })}
            />
            <input
              type="text"
              placeholder="Country"
              className="border p-2 rounded-md col-span-2"
              value={shippingInfo.country}
              onChange={(e) => setShippingInfo({ ...shippingInfo, country: e.target.value })}
            />
          </form>
          <div className="mt-6 flex justify-between">
            <Button variant="outline" onClick={prevStep}>
              ← Back to Cart
            </Button>
            <Button className="bg-black text-white" onClick={nextStep}>
              Continue to Payment →
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Payment */}
      {step === "payment" && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
          <div className="space-y-3">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="payment"
                value="card"
                checked={paymentMethod === "card"}
                onChange={() => setPaymentMethod("card")}
              />
              Credit / Debit Card
            </label>
            {paymentMethod === "card" && (
              <form className="space-y-3 ml-6">
                <input type="text" placeholder="Card Number" className="border p-2 rounded-md w-full" />
                <div className="flex gap-4">
                  <input type="text" placeholder="MM/YY" className="border p-2 rounded-md w-1/2" />
                  <input type="text" placeholder="CVC" className="border p-2 rounded-md w-1/2" />
                </div>
              </form>
            )}
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="payment"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={() => setPaymentMethod("cod")}
              />
              Cash on Delivery (COD)
            </label>
          </div>
          <div className="mt-6 flex justify-between">
            <Button variant="outline" onClick={prevStep}>
              ← Back to Shipping
            </Button>
            <Button className="bg-black text-white" onClick={nextStep}>
              Review Order →
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: Review */}
      {step === "review" && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Review Your Order</h2>
          <div className="space-y-3">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 text-right">
            <p className="font-semibold">Subtotal: ${subtotal.toFixed(2)}</p>
            <p className="text-gray-600">Shipping: ${shipping.toFixed(2)}</p>
            <p className="text-xl font-bold">Total: ${total.toFixed(2)}</p>
            <p className="mt-2 text-gray-700">
              Payment Method:{" "}
              <span className="font-semibold">{paymentMethod === "cod" ? "Cash on Delivery" : "Card"}</span>
            </p>
          </div>
          <div className="mt-6 flex justify-between">
            <Button variant="outline" onClick={prevStep}>
              ← Back to Payment
            </Button>
            <Button className="bg-green-600 text-white" onClick={placeOrder}>
              Place Order ✅
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}