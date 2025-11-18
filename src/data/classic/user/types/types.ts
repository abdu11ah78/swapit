export type CartItem = {
    id: string
    name: string
    price: number
    imageUrl?: string
    quantity: number
}

export type AppContextType = {
    cart: CartItem[]
    wishlist: CartItem[]
    addToCart: (item: CartItem) => void
    addToWishlist: (item: CartItem) => void
    updateQuantity: (id: string, quantity: number) => void
    removeFromCart: (id: string) => void
    removeFromWishlist: (id: string) => void
}

export type PaymentMethod = "cod" | "card"

export type Order = {
    id: string
    items: CartItem[]
    total: number
    shippingAddress: ShippingInfo
    paymentMethod: PaymentMethod
    status: "pending" | "paid" | "shipped" | "completed" | "cancelled"
    createdAt: string
}

export type ShippingInfo = {
    fullName: string
    email: string
    phone: string
    street: string
    city: string
    state: string
    postalCode: string
    country: string
}

export type OrderResponse = {
    success: boolean
    orderId?: number | string
    error?: string
}

export type Service = {
    id: string
    name: string
    description: string
    price?: number
    imageUrl?: string
    ctaText?: string
    ctaLink?: string
}

export type Work = {
    id: string
    title: string
    description?: string
    images: string[]
}

export type ContactFormData = {
    name: string
    email: string
    message: string
}

export type ContactInfo = {
    email: string
    phone: string
    address: string
    locationEmbedUrl: string
}

export type AboutSection = {
    id: string
    title: string
    content: string
    listItems?: string[]
}

export type AboutPageData = {
    heroImageUrl: string
    sections: AboutSection[]
}