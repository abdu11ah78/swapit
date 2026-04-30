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
import { useAdminProducts } from "@/features/admin/admin.hooks"
import { Loader2, Package, Tag, User, MapPin, ExternalLink } from "lucide-react"

export default function ItemsPage() {
  const { data: items, isLoading } = useAdminProducts()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-[var(--admin-primary)] animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[var(--admin-text)] tracking-tight">
            Listing <span className="text-[var(--admin-primary)]">Oversight</span>
          </h1>
          <p className="text-[var(--admin-text-muted)] mt-1 font-medium">
            Monitor all active marketplace listings and categories.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Listings</CardTitle>
        </CardHeader>
        <CardContent className="mt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item Details</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>LTP Value</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[var(--admin-bg)] border border-[var(--admin-border)] flex items-center justify-center overflow-hidden">
                        {item.images && item.images.length > 0 ? (
                          <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                          <Package className="text-[var(--admin-text-muted)]" size={20} />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-[var(--admin-text)]">{item.title}</span>
                        <div className="flex items-center gap-1 text-xs text-[var(--admin-text-muted)]">
                          <User size={12} />
                          <span>{item.ownerName}</span>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Tag size={14} className="text-[var(--admin-primary)]" />
                      <span className="font-medium text-[var(--admin-text)]">{item.category}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-black text-[var(--admin-text)]">{item.ltpValue} LTP</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-[var(--admin-text-muted)]">
                      <MapPin size={14} />
                      <span className="text-sm">{item.location}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.status === 'Available' ? "success" : "warning"}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <button className="p-2 hover:bg-[var(--admin-primary)]/10 text-[var(--admin-primary)] rounded-lg transition-colors group">
                      <ExternalLink size={18} className="group-hover:scale-110 transition-transform" />
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
