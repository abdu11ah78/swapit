export interface Order {
  id: string
  orderNumber: string
  customer: string
  customerEmail: string
  total: number
  status: "pending" | "processing" | "completed" | "cancelled"
  items: number
  date: string
  paymentStatus: "paid" | "pending" | "failed"
}
