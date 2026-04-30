"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card"
import { Badge } from "../components/ui/Badge"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "../components/ui/Table"
import { useAdminUsers } from "@/features/admin/admin.hooks"
import { Loader2, ShieldAlert, UserCheck, UserX } from "lucide-react"

export default function UsersPage() {
  const { data: users, isLoading, isError } = useAdminUsers()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-[var(--admin-primary)] animate-spin" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-red-500">
        <ShieldAlert size={48} className="mb-4" />
        <h2 className="text-xl font-bold">Failed to load users</h2>
        <p className="text-sm opacity-70">Please check your connection and try again.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[var(--admin-text)] tracking-tight">
            Users <span className="text-[var(--admin-primary)]">Management</span>
          </h1>
          <p className="text-[var(--admin-text-muted)] mt-1 font-medium">
            Review trust scores and moderate platform participants.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users, Trust and Moderation</CardTitle>
        </CardHeader>
        <CardContent className="mt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User Profile</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Trust Score</TableHead>
                <TableHead>Trades</TableHead>
                <TableHead>Moderation</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold text-[var(--admin-text)]">{u.name}</span>
                      <span className="text-xs text-[var(--admin-text-muted)]">{u.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="capitalize">
                      {u.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-[var(--admin-border)] rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${u.trustScore > 70 ? 'bg-green-500' : u.trustScore > 40 ? 'bg-[var(--admin-primary)]' : 'bg-red-500'}`} 
                          style={{ width: `${u.trustScore}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-[var(--admin-text)]">{u.trustScore.toFixed(0)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-[var(--admin-text)]">{u.tradesCount}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={u.suspicious ? "warning" : "success"}>
                      {u.suspicious ? "Suspicious" : "Clean"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={u.status === 'active' ? "success" : "destructive"} className="capitalize">
                      {u.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <button className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors group" title="Suspend User">
                      <UserX size={18} className="group-hover:scale-110 transition-transform" />
                    </button>
                    <button className="p-2 hover:bg-green-500/10 text-green-500 rounded-lg transition-colors group ml-2" title="Verify User">
                      <UserCheck size={18} className="group-hover:scale-110 transition-transform" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
