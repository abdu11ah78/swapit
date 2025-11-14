import type { Product, ProductCategory } from "../types/product"
import type { Order } from "../types/order"
import type { User } from "../types/user"
import type { Invoice } from "../types/invoice"

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Wireless Headphones Pro",
    sku: "WHP-001",
    category: "Electronics",
    price: 299.99,
    cost: 150,
    stock: 45,
    status: "active",
    image: "/wireless-headphones.png",
    description: "Premium wireless headphones with active noise cancellation",
    createdAt: "2024-01-15",
    updatedAt: "2024-11-08",
    size: "",
    color: ""
  },
  {
    id: "2",
    name: "Smart Watch Ultra",
    sku: "SWU-002",
    category: "Wearables",
    price: 499.99,
    cost: 250,
    stock: 32,
    status: "active",
    image: "/smartwatch-lifestyle.png",
    description: "Advanced fitness tracking with 7-day battery",
    createdAt: "2024-01-20",
    updatedAt: "2024-11-08",
    size: "",
    color: ""
  },
  {
    id: "3",
    name: "USB-C Cable 2M",
    sku: "USB-003",
    category: "Accessories",
    price: 19.99,
    cost: 5,
    stock: 200,
    status: "active",
    image: "/usb-cable.png",
    description: "Fast charging USB-C cable",
    createdAt: "2024-02-01",
    updatedAt: "2024-11-08",
    size: "",
    color: ""
  },
]

export const mockCategories: ProductCategory[] = [
  { id: "1", name: "Electronics", description: "Electronic devices", productCount: 24 },
  { id: "2", name: "Wearables", description: "Wearable technology", productCount: 12 },
  { id: "3", name: "Accessories", description: "Product accessories", productCount: 56 },
]

export const mockOrders: Order[] = [
  {
    id: "1",
    orderNumber: "#ORD-001",
    customer: "John Doe",
    customerEmail: "john@example.com",
    total: 1299.99,
    status: "completed",
    items: 3,
    date: "2024-11-01",
    paymentStatus: "paid",
  },
  {
    id: "2",
    orderNumber: "#ORD-002",
    customer: "Jane Smith",
    customerEmail: "jane@example.com",
    total: 599.99,
    status: "processing",
    items: 2,
    date: "2024-11-05",
    paymentStatus: "paid",
  },
  {
    id: "3",
    orderNumber: "#ORD-003",
    customer: "Bob Wilson",
    customerEmail: "bob@example.com",
    total: 299.99,
    status: "pending",
    items: 1,
    date: "2024-11-07",
    paymentStatus: "pending",
  },
]

export const mockUsers: User[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    role: "admin",
    status: "active",
    joinDate: "2024-01-01",
    avatar: "/diverse-woman-avatar.png",
  },
  {
    id: "2",
    name: "Mike Chen",
    email: "mike@example.com",
    role: "seller",
    status: "active",
    joinDate: "2024-02-15",
    avatar: "/man-avatar.png",
  },
  {
    id: "3",
    name: "Emma Davis",
    email: "emma@example.com",
    role: "customer",
    status: "inactive",
    joinDate: "2024-03-20",
    avatar: "/woman-avatar-2.png",
  },
]

export const mockInvoices: Invoice[] = [
  {
    id: "1",
    invoiceNumber: "INV-2024-001",
    customer: "Acme Corporation",
    amount: 2500.0,
    status: "paid",
    date: "2024-10-01",
    dueDate: "2024-10-31",
  },
  {
    id: "2",
    invoiceNumber: "INV-2024-002",
    customer: "Tech Solutions Inc",
    amount: 5000.0,
    status: "sent",
    date: "2024-10-15",
    dueDate: "2024-11-15",
  },
  {
    id: "3",
    invoiceNumber: "INV-2024-003",
    customer: "Global Enterprises",
    amount: 3500.0,
    status: "overdue",
    date: "2024-09-01",
    dueDate: "2024-10-01",
  },
]

export const dashboardStats = [
  { label: "Total Sales", value: "$24,580", change: "+12.5%", trend: "up" },
  { label: "Total Orders", value: "1,234", change: "+8.2%", trend: "up" },
  { label: "Total Customers", value: "892", change: "-2.1%", trend: "down" },
  { label: "Conversion Rate", value: "3.24%", change: "+1.5%", trend: "up" },
]

export const salesChartData = [
  { month: "Jan", sales: 4000, revenue: 2400 },
  { month: "Feb", sales: 3000, revenue: 1398 },
  { month: "Mar", sales: 2000, revenue: 9800 },
  { month: "Apr", sales: 2780, revenue: 3908 },
  { month: "May", sales: 1890, revenue: 4800 },
  { month: "Jun", sales: 2390, revenue: 3800 },
]
export const salesChartTitle = "Monthly Sales and Revenue Performance";
export const MOCK_EVENTS = [
  { date: "2025-01-15", title: "Project Alpha Review", color: "blue", time: "10:00 AM" },
  { date: "2025-01-22", title: "Team Lunch", color: "green", time: "1:00 PM" },
  { date: "2025-02-05", title: "Client Demo", color: "purple", time: "2:30 PM" },
  { date: "2025-02-14", title: "Valentine's Day Holiday", color: "red", time: "All Day" },
  { date: "2025-02-28", title: "Monthly Report Deadline", color: "yellow", time: "5:00 PM" },
  { date: "2025-03-10", title: "Training Session", color: "blue", time: "9:00 AM" },
  { date: "2025-03-25", title: "Budget Review Meeting", color: "red", time: "11:00 AM" },
]
export const sizes = [
  { id: 1, name: "XS", count: 5 },
  { id: 2, name: "S", count: 12 },
  { id: 3, name: "M", count: 25 },
  { id: 4, name: "L", count: 18 },
  { id: 5, name: "XL", count: 9 },
  { id: 6, name: "XXL", count: 3 },
]

export const colors = [
  { id: 1, name: "Red", code: "#EF4444", count: 12 },
  { id: 2, name: "Blue", code: "#3B82F6", count: 8 },
  { id: 3, name: "Green", code: "#10B981", count: 15 },
  { id: 4, name: "Black", code: "#000000", count: 20 },
]
export const reviews = [
  {
    id: 1,
    customer: "John Doe",
    product: "Wireless Headphones",
    rating: 5,
    review: "Excellent product!",
    status: "approved",
  },
  {
    id: 2,
    customer: "Jane Smith",
    product: "Smart Watch Ultra",
    rating: 4,
    review: "Great but pricey",
    status: "approved",
  },
]
export const coupons = [
  { id: 1, code: "SUMMER20", discount: "20%", usage: "45/100", status: "active" },
  { id: 2, code: "SAVE10", discount: "10%", usage: "120/200", status: "active" },
  { id: 3, code: "HOLIDAY25", discount: "25%", usage: "5/50", status: "scheduled" },
]
export const adminData = {
name: "Sarah",
    title: "Admin",
    email: "sarah@example.com",
    photoUrl: "https://images.pexels.com/photos/1642228/pexels-photo-1642228.jpeg",
};