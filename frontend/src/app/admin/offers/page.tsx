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
import { useAdminOffers } from "@/features/admin/admin.hooks"
import { Loader2, Gavel, Scale, AlertTriangle, Eye } from "lucide-react"

export default function OffersPage() {
  const { data: offers, isLoading } = useAdminOffers()

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
            Offer <span className="text-[var(--admin-primary)]">Negotiations</span>
          </h1>
          <p className="text-[var(--admin-text-muted)] mt-1 font-medium">
            Monitor active marketplace negotiations and potential high-risk offers.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Negotiation Offers</CardTitle>
        </CardHeader>
        <CardContent className="mt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Offer ID</TableHead>
                <TableHead>Linked Trade</TableHead>
                <TableHead>Made By</TableHead>
                <TableHead>Offered LTP</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {offers?.map((offer) => (
                <TableRow key={offer.id}>
                  <TableCell>
                    <span className="font-mono text-xs text-[var(--admin-text-muted)]">#{offer.id.slice(-6).toUpperCase()}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-[var(--admin-text-muted)] hover:text-[var(--admin-primary)] cursor-pointer">
                      <Scale size={14} />
                      <span className="text-xs font-mono">#{offer.tradeId.slice(-6).toUpperCase()}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-bold text-[var(--admin-text)]">{offer.makerName}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-black text-[var(--admin-text)]">{offer.offeredLtp} LTP</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={offer.status === 'Accepted' ? "success" : offer.status === 'Rejected' ? "destructive" : "warning"} className="capitalize">
                      {offer.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {offer.offeredLtp > 5000 ? (
                      <Badge variant="warning" className="flex items-center gap-1">
                        <AlertTriangle size={12} />
                        High Value
                      </Badge>
                    ) : (
                      <Badge variant="success">Normal</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <button className="p-2 hover:bg-[var(--admin-primary)]/10 text-[var(--admin-primary)] rounded-lg transition-colors group" title="View Details">
                      <Eye size={18} className="group-hover:scale-110 transition-transform" />
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
