"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"
import { Badge } from "../../components/ui/Badge"
import { Plus, Trash2 } from "lucide-react"
import { sizes } from "../../lib/mockData"



export default function SizesPage() {
  return (
    <div className="pt-24 md:pt-32 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <h1 className="text-3xl font-bold text-foreground">Sizes</h1>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Size
        </Button>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {sizes.map((size) => (
          <motion.div key={size.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center mb-4">
                  <Badge variant="info" className="text-lg px-4 py-2">
                    {size.name}
                  </Badge>
                </div>
                <p className="text-center text-muted-foreground text-sm mb-4">Used in {size.count} products</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="w-full p-2 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
