"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"
import { colors } from "../../lib/mockData"
import { Plus, Trash2 } from "lucide-react"



export default function ColorsPage() {
  return (
    <div className="pt-24 md:pt-32 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <h1 className="text-3xl font-bold text-foreground">Colors</h1>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Color
        </Button>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {colors.map((color) => (
          <motion.div key={color.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardContent className="pt-6">
                <div className="h-24 rounded-lg mb-4 border-2 border-border" style={{ backgroundColor: color.code }} />
                <p className="font-semibold text-foreground">{color.name}</p>
                <p className="text-xs text-muted-foreground font-mono">{color.code}</p>
                <p className="text-xs text-muted-foreground mt-2">{color.count} products</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="w-full mt-4 p-2 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-lg transition-colors flex items-center justify-center gap-2"
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
