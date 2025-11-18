export interface Invoice {
  id: string
  invoiceNumber: string
  customer: string
  amount: number
  status: "draft" | "sent" | "paid" | "overdue"
  date: string
  dueDate: string
}
