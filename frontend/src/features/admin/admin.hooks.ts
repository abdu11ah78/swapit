import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getDashboardStats, getAdminUsers, getAdminItems, getAdminTrades, getAdminDisputes, getAdminOffers, getAdminSuggestions, approveSuggestion, toggleCategoryStatus } from "./admin.api"
import { toast } from "sonner"

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

export const useAdminSuggestions = () => {
  return useQuery({
    queryKey: ["admin", "suggestions"],
    queryFn: getAdminSuggestions,
  })
}

export const useApproveSuggestion = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => approveSuggestion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "suggestions"] })
      toast.success("Suggestion approved.")
    }
  })
}

export const useToggleCategory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => toggleCategoryStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] })
      toast.success("Category status updated.")
    }
  })
}
