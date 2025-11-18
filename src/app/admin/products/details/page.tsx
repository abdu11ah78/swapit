"use client"

import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card"
import { Badge } from "../../components/ui/Badge"
import { mockProducts } from "../../lib/mockData"
import { formatCurrency } from "../../lib/utils"
import Image from "next/image"

export default function ProductDetailsPage() {
  const product = mockProducts[0]

  return (
    <div className="pt-24 md:pt-32 space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-foreground">{product.name}</h1>
        <p className="text-muted-foreground">SKU: {product.sku}</p>
      </motion.div>

      <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {/* Product Image */}
        <Card className="lg:col-span-1">
          <CardContent className="pt-6">
            <div className="relative w-full h-64 bg-secondary rounded-lg overflow-hidden">
              <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
            </div>
          </CardContent>
        </Card>

        {/* Product Info */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <Badge variant="success" className="mt-1">
                  {product.status}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Category</p>
                <p className="font-medium text-foreground mt-1">{product.category}</p>
              </div>
            </div>
            <p className="text-foreground">{product.description}</p>
            <div className="bg-secondary rounded-lg p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Price</p>
                <p className="text-lg font-bold text-primary">{formatCurrency(product.price)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Cost</p>
                <p className="text-lg font-bold">{formatCurrency(product.cost)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Profit Margin</p>
                <p className="text-lg font-bold text-green-500">
                  {(((product.price - product.cost) / product.price) * 100).toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Stock</p>
                <p className="text-lg font-bold">{product.stock}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
