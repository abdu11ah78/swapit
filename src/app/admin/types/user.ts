export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "seller" | "customer"
  status: "active" | "inactive"
  joinDate: string
  avatar: string
}

export interface UserPermission {
  id: string
  name: string
  description: string
}
