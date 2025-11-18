"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "../../components/ui/Card"
import { Badge } from "../../components/ui/Badge"
import { useAdmin } from "../../context/AdminContext"
import { formatCurrency } from "../../lib/utils"
import { Edit2, Trash2 } from "lucide-react"
import Image from "next/image"

export default function ProductGridPage() {
  const { products, deleteProduct } = useAdmin()

  return (
    <div className="pt-24 md:pt-32 space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-foreground">Products Grid</h1>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {products.map((product, idx) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow">
              <div className="relative h-48 bg-secondary overflow-hidden">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover hover:scale-105 transition-transform"
                />
              </div>
              <CardContent className="flex-1 flex flex-col pt-6">
                <h3 className="font-semibold text-foreground mb-1 line-clamp-2">{product.name}</h3>
                <p className="text-xs text-muted-foreground mb-3">{product.sku}</p>
                <div className="mb-3 flex-1">
                  <Badge variant={product.status === "active" ? "success" : "warning"}>{product.status}</Badge>
                </div>
                <div className="mb-3 flex justify-between items-start">
                  <div>
                    <p className="text-xs text-muted-foreground">Price</p>
                    <p className="font-bold text-primary">{formatCurrency(product.price)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Stock</p>
                    <p className="font-bold">{product.stock} units</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {/* MODIFICATION HERE: Changed to motion.a and added href */}
                  <motion.a
                    href={`/admin/products/edit`} // Assuming you want to pass the product ID
                    whileHover={{ scale: 1.05 }}
                    className="flex-1 p-2 bg-secondary hover:bg-accent rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </motion.a>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => deleteProduct(product.id)}
                    className="flex-1 cursor-pointer p-2 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}