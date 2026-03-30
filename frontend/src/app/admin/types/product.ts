export interface Item {
  id: string
  name: string
  sku: string
  category: string
  price: number // LT Points Value
  cost: number
  stock: number
  status: "active" | "inactive" | "draft"
  image: string
  description: string
  createdAt: string
  updatedAt: string
  size: string
  color: string
  // SwapIt Specific Fields
  aiEstimatedValue: number
  highestBid: number
  isAuctionEnabled: boolean
  isBarterEnabled: boolean
  location: string
  condition: "new" | "used-like-new" | "good" | "fair" | "poor"
  ownerTrustScore: number
}

export interface ItemCategory {
  id: string
  name: string
  description: string
  itemCount: number
}

export type Product = Item
