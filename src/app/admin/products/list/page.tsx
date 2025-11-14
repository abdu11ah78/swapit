"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"
import { Input } from "../../components/ui/Input"
import { Badge } from "../../components/ui/Badge"
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from "../../components/ui/Table"
import { Edit2, Trash2, Search, Plus, Eye } from "lucide-react"
import { useAdmin } from "../../context/AdminContext"
import { formatCurrency } from "../../lib/utils"
import Link from "next/link"

// ... (imports remain the same)

export default function ProductListPage() {
  const { products, deleteProduct } = useAdmin()
  const [searchTerm, setSearchTerm] = useState("")

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDelete = (id: string) => {
    if (confirm("Are you sure?")) {
      deleteProduct(id)
    }
  }

  return (
    <div className="pt-24 md:pt-32 space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-foreground">Products</h1>
          <Link href="/admin/products/create">
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Product
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>Name</TableHeader>
                  <TableHeader>SKU</TableHeader>
                  <TableHeader>Category</TableHeader>
                  <TableHeader>Price</TableHeader>
                  <TableHeader>Stock</TableHeader>
                  <TableHeader>Status</TableHeader>
                  <TableHeader>Actions</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="text-muted-foreground">{product.sku}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell className="font-semibold">{formatCurrency(product.price)}</TableCell>
                    <TableCell>
                      <span className={product.stock > 10 ? "text-green-500" : "text-orange-500"}>{product.stock}</span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          product.status === "active" ? "success" : product.status === "draft" ? "warning" : "error"
                        }
                      >
                        {product.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {/* View Button (kept as motion.button for consistency, but often better as Link) */}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 hover:bg-secondary rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </motion.button>

                        {/* MODIFICATION HERE: Changed to Next.js Link for Edit */}
                       
                          <motion.a
                          href={`/admin/products/edit`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 hover:bg-secondary rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </motion.a>
                        
                        
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(product.id)}
                          className="p-2 hover:bg-destructive/20 text-destructive rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}