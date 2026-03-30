export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "seller" | "customer"
  status: "active" | "inactive" | "suspended" | "banned"
  joinDate: string
  avatar: string
  trustScore?: number
  reviewsCount?: number
  tradesCount?: number
  suspicious?: boolean
}

export interface UserPermission {
  id: string
  name: string
  description: string
}
