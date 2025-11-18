import { MOCK_EVENTS } from "./mockData"

export function cn(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(" ")
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value)
}
export interface CalendarDay {
  date: Date
  isCurrentMonth: boolean
  dayOfMonth: number
  events: typeof MOCK_EVENTS
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date))
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date))
}

export function getStatusColor(status: string): "success" | "warning" | "error" | "info" {
  switch (status.toLowerCase()) {
    case "active":
    case "completed":
    case "paid":
      return "success"
    case "pending":
    case "processing":
      return "warning"
    case "inactive":
    case "cancelled":
    case "failed":
    case "overdue":
      return "error"
    default:
      return "info"
  }
}
