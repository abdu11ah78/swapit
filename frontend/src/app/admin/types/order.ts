export interface Order {
  id: string
  orderNumber: string
  customer: string
  customerEmail: string
  buyer: string
  seller: string
  total: number
  status: "pending" | "accepted" | "in_progress" | "completed" | "disputed" | "cancelled"
  items: number
  date: string
  paymentStatus: "held" | "released" | "failed"
  linkedOfferId?: string
}
