import { apiClient as axiosInstance } from "@/api/axios"

export interface DashboardStats {
  totalUsers: number
  totalItems: number
  totalTrades: number
  openDisputes: number
  monthlyActivity: {
    month: string
    trades: number
    revenue: number
  }[]
}

export interface UserAdmin {
  id: string
  name: string
  email: string
  role: string
  trustScore: number
  tradesCount: number
  suspicious: boolean
  status: string
}

export interface ItemAdmin {
  id: string
  title: string
  description: string
  images: string[]
  category: string
  condition: string
  location: string
  ltpValue: number
  status: string
  ownerName: string
}

export interface TradeAdmin {
  id: string
  mainItemTitle: string
  buyerName: string
  sellerName: string
  status: string
  escrowHold: boolean
  createdAt: string
}

export interface DisputeAdmin {
  id: string
  tradeId: string
  reporterName: string
  reason: string
  status: string
  createdAt: string
}

export interface OfferAdmin {
  id: string
  tradeId: string
  makerName: string
  offeredLtp: number
  status: string
  createdAt: string
}

export interface Diagnostics {
  databaseConnection: boolean
  serverUptime: string
  memoryUsage: string
  cpuUsage: string
  timestamp: string
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await axiosInstance.get<DashboardStats>("/admin/stats")
  return response.data
}

export const getAdminUsers = async (): Promise<UserAdmin[]> => {
  const response = await axiosInstance.get<UserAdmin[]>("/admin/users")
  return response.data
}

export const getAdminItems = async (): Promise<ItemAdmin[]> => {
  const response = await axiosInstance.get<ItemAdmin[]>("/admin/items")
  return response.data
}

export const getAdminTrades = async (): Promise<TradeAdmin[]> => {
  const response = await axiosInstance.get<TradeAdmin[]>("/admin/trades")
  return response.data
}

export const getAdminDisputes = async (): Promise<DisputeAdmin[]> => {
  const response = await axiosInstance.get<DisputeAdmin[]>("/admin/disputes")
  return response.data
}

export const getAdminOffers = async (): Promise<OfferAdmin[]> => {
  const response = await axiosInstance.get<OfferAdmin[]>("/admin/offers")
  return response.data
}

export const updateAdminName = async (name: string) => {
  await axiosInstance.put("/admin/name", { name })
}

export const changeAdminPassword = async (data: any) => {
  await axiosInstance.put("/admin/password", data)
}

export const getSystemDiagnostics = async (): Promise<Diagnostics> => {
  const response = await axiosInstance.get<Diagnostics>("/admin/diagnostics")
  return response.data
}

export const getMaintenanceStatus = async (): Promise<boolean> => {
  const response = await axiosInstance.get<boolean>("/admin/maintenance")
  return response.data
}

export const toggleMaintenanceMode = async (enabled: boolean) => {
  await axiosInstance.post("/admin/maintenance", enabled, {
    headers: { "Content-Type": "application/json" }
  })
}

export const getAdminCategories = async () => {
  const response = await axiosInstance.get("/admin/categories")
  return response.data
}

export const getAdminProvinces = async () => {
  const response = await axiosInstance.get("/admin/provinces")
  return response.data
}

export const getAdminSuggestions = async () => {
  const response = await axiosInstance.get("/admin/suggestions")
  return response.data
}

export const approveSuggestion = async (id: string) => {
  await axiosInstance.post(`/admin/suggestions/${id}/approve`)
}

export const toggleCategoryStatus = async (id: string) => {
  await axiosInstance.patch(`/admin/categories/${id}/toggle`)
}

export const createAdminCategory = async (data: any) => {
  const response = await axiosInstance.post("/admin/categories", data)
  return response.data
}

export const updateAdminCategory = async (id: string, data: any) => {
  await axiosInstance.put(`/admin/categories/${id}`, data)
}
