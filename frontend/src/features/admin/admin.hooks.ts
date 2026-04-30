import { useQuery } from "@tanstack/react-query"
import { getDashboardStats, getAdminUsers, getAdminItems, getAdminTrades, getAdminDisputes, getAdminOffers } from "./admin.api"

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: getDashboardStats,
  })
}

export const useAdminUsers = () => {
  return useQuery({
    queryKey: ["admin", "users"],
    queryFn: getAdminUsers,
  })
}

export const useAdminProducts = () => {
  return useQuery({
    queryKey: ["admin", "items"],
    queryFn: getAdminItems,
  })
}

export const useAdminTrades = () => {
  return useQuery({
    queryKey: ["admin", "trades"],
    queryFn: getAdminTrades,
  })
}

export const useAdminDisputes = () => {
  return useQuery({
    queryKey: ["admin", "disputes"],
    queryFn: getAdminDisputes,
  })
}

export const useAdminOffers = () => {
  return useQuery({
    queryKey: ["admin", "offers"],
    queryFn: getAdminOffers,
  })
}
