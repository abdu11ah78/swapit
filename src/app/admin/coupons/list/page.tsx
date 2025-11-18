"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "../../components/ui/Card"
import { Badge } from "../../components/ui/Badge"
import { Button } from "../../components/ui/Button"
import { Plus, Copy, Trash2 } from "lucide-react"
import Link from "next/link"
import { coupons } from "../../lib/mockData"


export default function CouponsListPage() {
  return (
    <div className="pt-24 md:pt-32 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <h1 className="text-3xl font-bold text-foreground">Coupons</h1>
        <Link href="/admin/coupons/create">
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Coupon
          </Button>
        </Link>
      </motion.div>

      <motion.div className="space-y-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {coupons.map((coupon) => (
          <motion.div key={coupon.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <p className="font-bold text-foreground font-mono">{coupon.code}</p>
                    <p className="text-sm text-muted-foreground">{coupon.discount} discount</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Usage</p>
                    <p className="font-semibold text-foreground">{coupon.usage}</p>
                  </div>
                  <Badge variant={coupon.status === "active" ? "success" : "info"}>{coupon.status}</Badge>
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      className="p-2 cursor-pointer hover:bg-secondary rounded-lg transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      className="p-2 cursor-pointer hover:bg-destructive/20 text-destructive rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
