import type { Item, ItemCategory } from "../types/product"
import type { Order } from "../types/order"
import type { User } from "../types/user"
import type { Invoice } from "../types/invoice"

export const mockProducts: Item[] = [
  {
    id: "1",
    name: "Wireless Headphones Pro",
    sku: "WHP-001",
    category: "Electronics",
    price: 300, // LTC
    cost: 150,
    stock: 45,
    status: "active",
    image: "/wireless-headphones.png",
    description: "Premium wireless headphones with active noise cancellation (Protocol Validated)",
    createdAt: "2024-01-15",
    updatedAt: "2024-11-08",
    size: "",
    color: "",
    aiEstimatedValue: 310,
    highestBid: 285,
    isAuctionEnabled: true,
    isBarterEnabled: true,
    location: "Neo-Tokyo Node",
    condition: "new",
    ownerTrustScore: 4.8
  },
  {
    id: "2",
    name: "Smart Watch Ultra",
    sku: "SWU-002",
    category: "Wearables",
    price: 500, // LTC
    cost: 250,
    stock: 32,
    status: "active",
    image: "/smartwatch-lifestyle.png",
    description: "Advanced fitness tracking with 7-day battery (Node Verified)",
    createdAt: "2024-01-20",
    updatedAt: "2024-11-08",
    size: "",
    color: "",
    aiEstimatedValue: 490,
    highestBid: 450,
    isAuctionEnabled: true,
    isBarterEnabled: false,
    location: "Berlin Mesh",
    condition: "used-like-new",
    ownerTrustScore: 4.5
  },
  {
    id: "3",
    name: "USB-C Cable 2M",
    sku: "USB-003",
    category: "Accessories",
    price: 20, // LTC
    cost: 5,
    stock: 200,
    status: "active",
    image: "/usb-cable.png",
    description: "Fast charging USB-C cable (Alpha Link)",
    createdAt: "2024-02-01",
    updatedAt: "2024-11-08",
    size: "",
    color: "",
    aiEstimatedValue: 22,
    highestBid: 15,
    isAuctionEnabled: false,
    isBarterEnabled: true,
    location: "Sector 7 Hub",
    condition: "new",
    ownerTrustScore: 4.9
  },
]

export const mockCategories: ItemCategory[] = [
  { id: "1", name: "Electronics", description: "Electronic assets", itemCount: 24 },
  { id: "2", name: "Wearables", description: "Wearable tech-nodes", itemCount: 12 },
  { id: "3", name: "Accessories", description: "Asset accessories", itemCount: 56 },
]

export const mockOrders: Order[] = [
  {
    id: "1",
    orderNumber: "#SWP-001",
    customer: "John Doe",
    customerEmail: "john@trader.io",
    total: 1300, // LTC
    status: "completed",
    items: 3,
    date: "2024-11-01",
    paymentStatus: "paid",
  },
  {
    id: "2",
    orderNumber: "#SWP-002",
    customer: "Jane Smith",
    customerEmail: "jane@trader.io",
    total: 600, // LTC
    status: "processing",
    items: 2,
    date: "2024-11-05",
    paymentStatus: "paid",
  },
  {
    id: "3",
    orderNumber: "#SWP-003",
    customer: "Bob Wilson",
    customerEmail: "bob@trader.io",
    total: 300, // LTC
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
    email: "sarah@swapit.io",
    role: "admin", // Network Architect
    status: "active",
    joinDate: "2024-01-01",
    avatar: "/diverse-woman-avatar.png",
  },
  {
    id: "2",
    name: "Mike Chen",
    email: "mike@swapit.io",
    role: "seller", // Pro Trader
    status: "active",
    joinDate: "2024-02-15",
    avatar: "/man-avatar.png",
  },
  {
    id: "3",
    name: "Emma Davis",
    email: "emma@swapit.io",
    role: "customer", // Entry Trader
    status: "inactive",
    joinDate: "2024-03-20",
    avatar: "/woman-avatar-2.png",
  },
]

export const mockInvoices: Invoice[] = [
  {
    id: "1",
    invoiceNumber: "TRD-2024-001",
    customer: "Acme Trade Node",
    amount: 2500,
    status: "paid",
    date: "2024-10-01",
    dueDate: "2024-10-31",
  },
  {
    id: "2",
    invoiceNumber: "TRD-2024-002",
    customer: "Tech Barter Inc",
    amount: 5000,
    status: "sent",
    date: "2024-10-15",
    dueDate: "2024-11-15",
  },
  {
    id: "3",
    invoiceNumber: "TRD-2024-003",
    customer: "Global Assets",
    amount: 3500,
    status: "overdue",
    date: "2024-09-01",
    dueDate: "2024-10-01",
  },
]

export const dashboardStats = [
  { label: "LTC Trading Volume", value: "24,580 LTC", change: "+12.5%", trend: "up" },
  { label: "Total Asset Swaps", value: "1,234", change: "+8.2%", trend: "up" },
  { label: "Active Traders", value: "892", change: "-2.1%", trend: "down" },
  { label: "Swap Success Rate", value: "98.24%", change: "+1.5%", trend: "up" },
]

export const salesChartData = [
  { month: "Jan", sales: 4000, revenue: 2400 },
  { month: "Feb", sales: 3000, revenue: 1398 },
  { month: "Mar", sales: 2000, revenue: 9800 },
  { month: "Apr", sales: 2780, revenue: 3908 },
  { month: "May", sales: 1890, revenue: 4800 },
  { month: "Jun", sales: 2390, revenue: 3800 },
]
export const salesChartTitle = "Monthly Trade Performance and Protocol Fees";
export const MOCK_EVENTS = [
  { date: "2025-01-15", title: "Protocol V2 Review", color: "blue", time: "10:00 AM" },
  { date: "2025-01-22", title: "Network Synchronization", color: "green", time: "1:00 PM" },
  { date: "2025-02-05", title: "Asset Audit Demo", color: "purple", time: "2:30 PM" },
  { date: "2025-02-14", title: "Governance Holiday", color: "red", time: "All Day" },
  { date: "2025-02-28", title: "Handshake Deadline", color: "yellow", time: "5:00 PM" },
  { date: "2025-03-10", title: "Node Operator Training", color: "blue", time: "9:00 AM" },
  { date: "2025-03-25", title: "LTC Yield Meeting", color: "red", time: "11:00 AM" },
]
export const sizes = [
  { id: 1, name: "Mint", count: 5 },
  { id: 2, name: "Near-Mint", count: 12 },
  { id: 3, name: "Excellent", count: 25 },
  { id: 4, name: "Good", count: 18 },
  { id: 5, name: "Fair", count: 9 },
  { id: 6, name: "Poor", count: 3 },
]

export const colors = [
  { id: 1, name: "Cyber Red", code: "#EF4444", count: 12 },
  { id: 2, name: "Indigo Link", code: "#3B82F6", count: 8 },
  { id: 3, name: "Jade Node", code: "#10B981", count: 15 },
  { id: 4, name: "Onyx Escrow", code: "#000000", count: 20 },
]
export const reviews = [
  {
    id: 1,
    customer: "John Doe",
    product: "Wireless Headphones",
    rating: 5,
    review: "Excellent trade! Asset condition accurately reported.",
    status: "approved",
  },
  {
    id: 2,
    customer: "Jane Smith",
    product: "Smart Watch Ultra",
    rating: 4,
    review: "Fair swap. Condition verified via AI audit.",
    status: "approved",
  },
]
export const coupons = [
  { id: 1, code: "WELCOME_LTC", discount: "20% Fee", usage: "45/100", status: "active" },
  { id: 2, code: "TOP_TRADER", discount: "10% Fee", usage: "120/200", status: "active" },
  { id: 3, code: "NODE_REWARD", discount: "25% Fee", usage: "5/50", status: "scheduled" },
]
export const adminData = {
  name: "Sarah",
  title: "Network Architect",
  email: "sarah@swapit.io",
  photoUrl: "https://images.pexels.com/photos/1642228/pexels-photo-1642228.jpeg",
};
