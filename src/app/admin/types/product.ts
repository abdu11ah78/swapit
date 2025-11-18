export interface Product {
  id: string
  name: string
  sku: string
  category: string
  price: number
  cost: number
  stock: number
  status: "active" | "inactive" | "draft"
  image: string
  description: string
  createdAt: string
  updatedAt: string
  size: string
  color : string
}

export interface ProductCategory {
  id: string
  name: string
  description: string
  productCount: number
}
