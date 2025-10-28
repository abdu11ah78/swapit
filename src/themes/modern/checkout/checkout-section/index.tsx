
"use client"

import { useAppContext } from "@/context/AppContext"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, ArrowLeft, Check, Truck, CreditCard, Eye, ShoppingBag, Sparkles, AlertCircle } from "lucide-react"
import toast from 'react-hot-toast'
import type { Order, ShippingInfo, PaymentMethod, OrderResponse } from "../../../../data/classic/user/types/types"

interface ValidationErrors {
  [key: string]: string
}

interface CardDetails {
  cardNumber: string
  expiry: string
  cvc: string
}

export function CheckoutPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useAppContext()
  const [step, setStep] = useState<"cart" | "shipping" | "payment" | "review">("cart")
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card")
  const [isLoading, setIsLoading] = useState(false)
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})

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

  const [cardDetails, setCardDetails] = useState<CardDetails>({
    cardNumber: "",
    expiry: "",
    cvc: "",
  })

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 100 ? 0 : 10
  const total = subtotal + shipping

  const steps = [
    { id: "cart", label: "Cart", icon: ShoppingBag },
    { id: "shipping", label: "Shipping", icon: Truck },
    { id: "payment", label: "Payment", icon: CreditCard },
    { id: "review", label: "Review", icon: Eye },
  ]

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/
    return phoneRegex.test(phone)
  }

  const validatePostalCode = (code: string): boolean => {
    return code.trim().length >= 3
  }

  const validateCardNumber = (number: string): boolean => {
    const cleaned = number.replace(/\s/g, "")
    const cardRegex = /^\d{13,19}$/
    if (!cardRegex.test(cleaned)) return false
    
    // Luhn algorithm
    let sum = 0
    let isEven = false
    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned[i])
      if (isEven) {
        digit *= 2
        if (digit > 9) digit -= 9
      }
      sum += digit
      isEven = !isEven
    }
    return sum % 10 === 0
  }

  const validateExpiry = (expiry: string): boolean => {
    const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/
    if (!expiryRegex.test(expiry)) return false
    
    const [month, year] = expiry.split("/")
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear() % 100
    const currentMonth = currentDate.getMonth() + 1
    
    const expYear = parseInt(year)
    const expMonth = parseInt(month)
    
    if (expYear < currentYear) return false
    if (expYear === currentYear && expMonth < currentMonth) return false
    
    return true
  }

  const validateCVC = (cvc: string): boolean => {
    const cvcRegex = /^\d{3,4}$/
    return cvcRegex.test(cvc)
  }

  const validateShippingInfo = (): boolean => {
    const errors: ValidationErrors = {}

    if (!shippingInfo.fullName.trim()) {
      errors.fullName = "Full name is required"
    } else if (shippingInfo.fullName.trim().length < 2) {
      errors.fullName = "Name must be at least 2 characters"
    }

    if (!shippingInfo.email.trim()) {
      errors.email = "Email is required"
    } else if (!validateEmail(shippingInfo.email)) {
      errors.email = "Please enter a valid email address"
    }

    if (!shippingInfo.phone.trim()) {
      errors.phone = "Phone number is required"
    } else if (!validatePhone(shippingInfo.phone)) {
      errors.phone = "Please enter a valid phone number"
    }

    if (!shippingInfo.street.trim()) {
      errors.street = "Street address is required"
    } else if (shippingInfo.street.trim().length < 5) {
      errors.street = "Please enter a complete address"
    }

    if (!shippingInfo.city.trim()) {
      errors.city = "City is required"
    } else if (shippingInfo.city.trim().length < 2) {
      errors.city = "Please enter a valid city name"
    }

    if (!shippingInfo.state.trim()) {
      errors.state = "State/Province is required"
    }

    if (!shippingInfo.postalCode.trim()) {
      errors.postalCode = "Postal code is required"
    } else if (!validatePostalCode(shippingInfo.postalCode)) {
      errors.postalCode = "Please enter a valid postal code"
    }

    if (!shippingInfo.country.trim()) {
      errors.country = "Country is required"
    } else if (shippingInfo.country.trim().length < 2) {
      errors.country = "Please enter a valid country name"
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const validatePaymentInfo = (): boolean => {
    if (paymentMethod === "cod") return true

    const errors: ValidationErrors = {}

    if (!cardDetails.cardNumber.trim()) {
      errors.cardNumber = "Card number is required"
    } else if (!validateCardNumber(cardDetails.cardNumber)) {
      errors.cardNumber = "Please enter a valid card number"
    }

    if (!cardDetails.expiry.trim()) {
      errors.expiry = "Expiry date is required"
    } else if (!validateExpiry(cardDetails.expiry)) {
      errors.expiry = "Please enter a valid expiry date (MM/YY)"
    }

    if (!cardDetails.cvc.trim()) {
      errors.cvc = "CVC is required"
    } else if (!validateCVC(cardDetails.cvc)) {
      errors.cvc = "Please enter a valid CVC (3-4 digits)"
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const nextStep = () => {
    setValidationErrors({})

    if (step === "cart") {
      if (cart.length === 0) {
        toast.error("Your cart is empty!")
        return
      }
      setStep("shipping")
    } else if (step === "shipping") {
      if (!validateShippingInfo()) {
        toast.error("Please fix the errors in the form")
        return
      }
      setStep("payment")
    } else if (step === "payment") {
      if (!paymentMethod) {
        toast.error("Please select a payment method")
        return
      }
      if (!validatePaymentInfo()) {
        toast.error("Please fix the errors in payment details")
        return
      }
      setStep("review")
    }
  }

  const prevStep = () => {
    setValidationErrors({})
    if (step === "review") setStep("payment")
    else if (step === "payment") setStep("shipping")
    else if (step === "shipping") setStep("cart")
  }

  const placeOrder = async () => {
    setIsLoading(true)
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
        setShippingInfo({
          fullName: "",
          email: "",
          phone: "",
          street: "",
          city: "",
          state: "",
          postalCode: "",
          country: "",
        })
        setCardDetails({
          cardNumber: "",
          expiry: "",
          cvc: "",
        })
      } else {
        toast.error(`Failed: ${data.error}`)
      }
    } catch (err) {
      toast.error("Something went wrong while placing order")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, "")
    const formatted = cleaned.match(/.{1,4}/g)?.join(" ") || cleaned
    return formatted.slice(0, 19)
  }

  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, "")
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + "/" + cleaned.slice(2, 4)
    }
    return cleaned
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white">
      {/* Background Grid */}
      <div className="fixed inset-0 opacity-2">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="checkout-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="gray" strokeWidth="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#checkout-grid)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto p-4 md:p-8 lg:p-20 pt-24 md:pt-32">
        {/* Header */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600 text-lg">Complete your purchase in just a few steps</p>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-start justify-between mb-12 gap-2">
            {steps.map((s, idx) => {
              const stepIndex = steps.findIndex((x) => x.id === step)
              const isActive = s.id === step
              const isCompleted = idx < stepIndex
              const Icon = s.icon

              return (
                <motion.div
                  key={s.id}
                  className="flex-1 flex flex-col items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <div className="flex items-center w-full mb-4">
                    <motion.div
                      className={`flex items-center justify-center w-12 h-12 rounded-full border-2 font-bold transition-all duration-300 flex-shrink-0 ${
                        isActive
                          ? "bg-gray-900 border-gray-900 text-white shadow-lg"
                          : isCompleted
                            ? "bg-green-500 border-green-500 text-white"
                            : "bg-white border-gray-300 text-gray-400"
                      }`}
                      whileHover={isActive ? { scale: 1.1 } : {}}
                    >
                      {isCompleted ? (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <Check size={20} />
                        </motion.div>
                      ) : (
                        <Icon size={20} />
                      )}
                    </motion.div>

                    {idx < steps.length - 1 && (
                      <motion.div
                        className={`h-1 flex-1 mx-2 rounded-full transition-all duration-300 ${
                          isCompleted ? "bg-green-500" : "bg-gray-200"
                        }`}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: idx * 0.15 }}
                        style={{ originX: 0 }}
                      />
                    )}
                  </div>

                  <motion.span
                    className={`text-sm font-semibold text-center ${s.id === step ? "text-gray-900" : "text-gray-400"} transition-colors`}
                  >
                    {s.label}
                  </motion.span>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* Step 1: Cart */}
              {step === "cart" && (
                <motion.div
                  key="cart"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="bg-white/60 backdrop-blur-xl rounded-3xl border-2 border-white/40 p-8 shadow-lg">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Cart</h2>

                    {cart.length === 0 ? (
                      <motion.div
                        className="text-center py-12"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                      >
                        <motion.div
                          animate={{ y: [0, -10, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        </motion.div>
                        <p className="text-gray-600 text-lg font-semibold mb-2">Your cart is empty</p>
                        <Link href="/shop" className="text-gray-900 font-bold hover:text-gray-700 inline-flex items-center gap-2">
                          Go shopping <ArrowRight size={18} />
                        </Link>
                      </motion.div>
                    ) : (
                      <motion.div className="space-y-4">
                        {cart.map((item, idx) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="flex items-center gap-4 p-4 bg-white/50 rounded-2xl border border-gray-200/50 hover:border-gray-300 transition-all"
                            whileHover={{ scale: 1.01 }}
                          >
                            <div className="relative overflow-hidden rounded-xl flex-shrink-0">
                              <Image
                                src={item.imageUrl || "/shop/placeholder-product.jpg"}
                                alt={item.name}
                                width={80}
                                height={80}
                                className="object-cover"
                              />
                            </div>

                            <div className="flex-1">
                              <h3 className="font-bold text-gray-900">{item.name}</h3>
                              <p className="text-sm text-gray-600 font-semibold">${item.price.toFixed(2)} each</p>
                            </div>

                            <div className="flex items-center gap-2">
                              <motion.button
                                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                disabled={item.quantity <= 1}
                                className="px-3 py-2 cursor-pointer bg-white/50 hover:bg-white/80 border border-gray-200/50 rounded-lg disabled:opacity-50 font-bold"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                −
                              </motion.button>
                              <span className="w-8 text-center cursor-pointer font-bold text-gray-900">{item.quantity}</span>
                              <motion.button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="px-3 py-2 bg-white/50 hover:bg-white/80 border border-gray-200/50 rounded-lg font-bold"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                +
                              </motion.button>
                            </div>

                            <p className="text-lg font-bold text-gray-900 min-w-fit">${(item.price * item.quantity).toFixed(2)}</p>

                            <motion.button
                              onClick={() => removeFromCart(item.id)}
                              className="px-4 py-2 text-red-600 cursor-pointer hover:bg-red-500/10 rounded-lg font-semibold transition-all"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Remove
                            </motion.button>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Step 2: Shipping */}
              {step === "shipping" && (
                <motion.div
                  key="shipping"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="bg-white/60 backdrop-blur-xl rounded-3xl border-2 border-white/40 p-8 shadow-lg">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Information</h2>

                    <form className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {[
                        { key: "fullName", placeholder: "Full Name", type: "text" },
                        { key: "email", placeholder: "Email", type: "email" },
                        { key: "phone", placeholder: "Phone", type: "tel" },
                        { key: "city", placeholder: "City", type: "text" },
                        { key: "state", placeholder: "State/Province", type: "text" },
                        { key: "postalCode", placeholder: "Postal Code", type: "text" },
                      ].map(({ key, placeholder, type }, idx) => (
                        <motion.div
                          key={key}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                        >
                          <input
                            type={type}
                            placeholder={placeholder}
                            className={`w-full px-4 py-3 bg-white/50 border-2 rounded-2xl font-medium text-gray-900 focus:border-gray-600/50 focus:ring-4 focus:ring-gray-400/30 focus:bg-white/70 transition-all duration-300 backdrop-blur-sm ${
                              validationErrors[key]
                                ? "border-red-500 focus:border-red-500 focus:ring-red-400/30"
                                : "border-white/30"
                            }`}
                            value={shippingInfo[key as keyof ShippingInfo]}
                            onChange={(e) => {
                              setShippingInfo({ ...shippingInfo, [key]: e.target.value })
                              if (validationErrors[key]) {
                                const newErrors = { ...validationErrors }
                                delete newErrors[key]
                                setValidationErrors(newErrors)
                              }
                            }}
                          />
                          {validationErrors[key] && (
                            <motion.div
                              className="flex items-center gap-1 mt-1.5 text-xs text-red-600"
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                            >
                              <AlertCircle size={12} />
                              {validationErrors[key]}
                            </motion.div>
                          )}
                        </motion.div>
                      ))}

                      <motion.div
                        className="md:col-span-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <input
                          type="text"
                          placeholder="Street Address"
                          className={`w-full px-4 py-3 bg-white/50 border-2 rounded-2xl font-medium text-gray-900 focus:border-gray-600/50 focus:ring-4 focus:ring-gray-400/30 focus:bg-white/70 transition-all duration-300 backdrop-blur-sm ${
                            validationErrors.street
                              ? "border-red-500 focus:border-red-500 focus:ring-red-400/30"
                              : "border-white/30"
                          }`}
                          value={shippingInfo.street}
                          onChange={(e) => {
                            setShippingInfo({ ...shippingInfo, street: e.target.value })
                            if (validationErrors.street) {
                              const newErrors = { ...validationErrors }
                              delete newErrors.street
                              setValidationErrors(newErrors)
                            }
                          }}
                        />
                        {validationErrors.street && (
                          <motion.div
                            className="flex items-center gap-1 mt-1.5 text-xs text-red-600"
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                          >
                            <AlertCircle size={12} />
                            {validationErrors.street}
                          </motion.div>
                        )}
                      </motion.div>

                      <motion.div
                        className="md:col-span-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35 }}
                      >
                        <input
                          type="text"
                          placeholder="Country"
                          className={`w-full px-4 py-3 bg-white/50 border-2 rounded-2xl font-medium text-gray-900 focus:border-gray-600/50 focus:ring-4 focus:ring-gray-400/30 focus:bg-white/70 transition-all duration-300 backdrop-blur-sm ${
                            validationErrors.country
                              ? "border-red-500 focus:border-red-500 focus:ring-red-400/30"
                              : "border-white/30"
                          }`}
                          value={shippingInfo.country}
                          onChange={(e) => {
                            setShippingInfo({ ...shippingInfo, country: e.target.value })
                            if (validationErrors.country) {
                              const newErrors = { ...validationErrors }
                              delete newErrors.country
                              setValidationErrors(newErrors)
                            }
                          }}
                        />
                        {validationErrors.country && (
                          <motion.div
                            className="flex items-center gap-1 mt-1.5 text-xs text-red-600"
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                          >
                            <AlertCircle size={12} />
                            {validationErrors.country}
                          </motion.div>
                        )}
                      </motion.div>
                    </form>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Payment */}
              {step === "payment" && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="bg-white/60 backdrop-blur-xl rounded-3xl border-2 border-white/40 p-8 shadow-lg">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Method</h2>

                    <div className="space-y-4">
                      {[
                        { value: "card", label: "Credit / Debit Card" },
                        { value: "cod", label: "Cash on Delivery (COD)" },
                      ].map((option, idx) => (
                        <motion.label
                          key={option.value}
                          className={`flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                            paymentMethod === option.value
                              ? "border-gray-900 bg-gray-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          whileHover={{ scale: 1.01 }}
                        >
                          <input
                            type="radio"
                            name="payment"
                            value={option.value}
                            checked={paymentMethod === option.value}
                            onChange={() => {
                              setPaymentMethod(option.value as PaymentMethod)
                              setValidationErrors({})
                            }}
                            className="w-4 h-4 cursor-pointer"
                          />
                          <span className="font-bold text-gray-900">{option.label}</span>
                        </motion.label>
                      ))}

                      {paymentMethod === "card" && (
                        <motion.form
                          className="space-y-4 mt-6 p-6 bg-white/50 rounded-2xl border border-gray-200/50"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div>
                            <input
                              type="text"
                              placeholder="Card Number"
                              className={`w-full px-4 py-3 bg-white/50 border-2 rounded-2xl font-medium text-gray-900 focus:border-gray-600/50 focus:ring-4 focus:ring-gray-400/30 focus:bg-white/70 transition-all duration-300 backdrop-blur-sm ${
                                validationErrors.cardNumber
                                  ? "border-red-500 focus:border-red-500 focus:ring-red-400/30"
                                  : "border-white/30"
                              }`}
                              value={cardDetails.cardNumber}
                              onChange={(e) => {
                                const formatted = formatCardNumber(e.target.value)
                                setCardDetails({ ...cardDetails, cardNumber: formatted })
                                if (validationErrors.cardNumber) {
                                  const newErrors = { ...validationErrors }
                                  delete newErrors.cardNumber
                                  setValidationErrors(newErrors)
                                }
                              }}
                              maxLength={19}
                            />
                            {validationErrors.cardNumber && (
                              <motion.div
                                className="flex items-center gap-1 mt-1.5 text-xs text-red-600"
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                              >
                                <AlertCircle size={12} />
                                {validationErrors.cardNumber}
                              </motion.div>
                            )}
                          </div>
                          <div className="flex gap-4">
                            <div className="flex-1">
                              <input
                                type="text"
                                placeholder="MM/YY"
                                className={`w-full px-4 py-3 bg-white/50 border-2 rounded-2xl font-medium text-gray-900 focus:border-gray-600/50 focus:ring-4 focus:ring-gray-400/30 focus:bg-white/70 transition-all duration-300 backdrop-blur-sm ${
                                  validationErrors.expiry
                                    ? "border-red-500 focus:border-red-500 focus:ring-red-400/30"
                                    : "border-white/30"
                                }`}
                                value={cardDetails.expiry}
                                onChange={(e) => {
                                  const formatted = formatExpiry(e.target.value)
                                  setCardDetails({ ...cardDetails, expiry: formatted })
                                  if (validationErrors.expiry) {
                                    const newErrors = { ...validationErrors }
                                    delete newErrors.expiry
                                    setValidationErrors(newErrors)
                                  }
                                }}
                                maxLength={5}
                              />
                              {validationErrors.expiry && (
                                <motion.div
                                  className="flex items-center gap-1 mt-1.5 text-xs text-red-600"
                                  initial={{ opacity: 0, y: -5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                >
                                  <AlertCircle size={12} />
                                  {validationErrors.expiry}
                                </motion.div>
                              )}
                            </div>
                            <div className="flex-1">
                              <input
                                type="text"
                                placeholder="CVC"
                                className={`w-full px-4 py-3 bg-white/50 border-2 rounded-2xl font-medium text-gray-900 focus:border-gray-600/50 focus:ring-4 focus:ring-gray-400/30 focus:bg-white/70 transition-all duration-300 backdrop-blur-sm ${
                                  validationErrors.cvc
                                    ? "border-red-500 focus:border-red-500 focus:ring-red-400/30"
                                    : "border-white/30"
                                }`}
                                value={cardDetails.cvc}
                                onChange={(e) => {
                                  const value = e.target.value.replace(/\D/g, "")
                                  setCardDetails({ ...cardDetails, cvc: value })
                                  if (validationErrors.cvc) {
                                    const newErrors = { ...validationErrors }
                                    delete newErrors.cvc
                                    setValidationErrors(newErrors)
                                  }
                                }}
                                maxLength={4}
                              />
                              {validationErrors.cvc && (
                                <motion.div
                                  className="flex items-center gap-1 mt-1.5 text-xs text-red-600"
                                  initial={{ opacity: 0, y: -5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                >
                                  <AlertCircle size={12} />
                                  {validationErrors.cvc}
                                </motion.div>
                              )}
                            </div>
                          </div>
                        </motion.form>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Review */}
              {step === "review" && (
                <motion.div
                  key="review"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="bg-white/60 backdrop-blur-xl rounded-3xl border-2 border-white/40 p-8 shadow-lg">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Review Your Order</h2>

                    <div className="space-y-3 mb-6">
                      {cart.map((item, idx) => (
                        <motion.div
                          key={item.id}
                          className="flex justify-between p-3 rounded-lg bg-white/50 border border-gray-200/50"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                        >
                          <span className="font-semibold text-gray-900">
                            {item.name} × {item.quantity}
                          </span>
                          <span className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                        </motion.div>
                      ))}
                    </div>

                    <div className="space-y-2 p-4 bg-white/50 rounded-2xl border border-gray-200/50">
                      <div className="flex justify-between text-gray-700">
                        <span>Subtotal:</span>
                        <span className="font-semibold">${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-gray-700">
                        <span>Shipping:</span>
                        <span className="font-semibold">{shipping === 0 ? "FREE" : `${shipping.toFixed(2)}`}</span>
                      </div>
                      <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-2" />
                      <div className="flex justify-between">
                        <span className="font-bold text-gray-900">Total:</span>
                        <motion.span
                          className="text-2xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
                        >
                          ${total.toFixed(2)}
                        </motion.span>
                      </div>
                    </div>

                    <div className="mt-4 p-4 bg-white/50 rounded-2xl border border-gray-200/50">
                      <p className="text-sm text-gray-600">
                        Payment: <span className="font-bold text-gray-900">{paymentMethod === "cod" ? "Cash on Delivery" : "Card"}</span>
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar - Order Summary */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="sticky top-8 bg-white/60 backdrop-blur-xl rounded-3xl border-2 border-white/40 p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h3>

              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {cart.map((item) => (
                  <motion.div
                    key={item.id}
                    className="flex justify-between text-sm text-gray-700"
                    whileHover={{ x: 4 }}
                  >
                    <span>{item.name}</span>
                    <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                  </motion.div>
                ))}
              </div>

              <div className="space-y-2 p-4 bg-white/50 rounded-2xl border border-gray-200/50 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span className="text-sm">Subtotal</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span className="text-sm">Shipping</span>
                  <span className="font-semibold">{shipping === 0 ? "FREE" : `${shipping.toFixed(2)}`}</span>
                </div>
                <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                <div className="flex justify-between">
                  <span className="font-bold text-gray-900">Total</span>
                  <motion.span
                    className="text-lg font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
                    key={total}
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                  >
                    ${total.toFixed(2)}
                  </motion.span>
                </div>
              </div>

              {subtotal > 100 && (
                <motion.div
                  className="p-3 bg-green-500/10 border border-green-500/30 rounded-xl text-xs font-semibold text-green-700 mb-4"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  ✓ Free shipping on orders over $100!
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Navigation Buttons */}
        <motion.div
          className="flex justify-between gap-4 mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <motion.button
            onClick={prevStep}
            disabled={step === "cart"}
            className="flex items-center cursor-pointer gap-2 px-6 py-3 bg-white/50 hover:bg-white/70 border-2 border-white/40 text-gray-900 font-bold rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            whileHover={{ scale: 1.05, x: -4 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft size={18} />
            Back
          </motion.button>

          {step !== "review" ? (
            <motion.button
              onClick={nextStep}
              disabled={step === "cart" && cart.length === 0}
              className="flex items-center cursor-pointer gap-2 px-8 py-3 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white font-bold rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05, x: 4 }}
              whileTap={{ scale: 0.95 }}
            >
              Continue
              <ArrowRight size={18} />
            </motion.button>
          ) : (
            <motion.button
              onClick={placeOrder}
              disabled={isLoading}
              className="flex items-center cursor-pointer gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isLoading ? (
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
                  <Sparkles size={18} />
                </motion.div>
              ) : (
                <>
                  <Check size={18} />
                  Place Order
                </>
              )}
            </motion.button>
          )}
        </motion.div>
      </div>
    </div>
  )
}