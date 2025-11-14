"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "../../components/ui/Card"
import { Badge } from "../../components/ui/Badge"
import { Star, ThumbsUp, ThumbsDown } from "lucide-react"
import { reviews } from "../../lib/mockData"


export default function AllReviewsPage() {
  return (
    <div className="pt-24 md:pt-32 space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-foreground">Reviews</h1>
      </motion.div>

      <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {reviews.map((review) => (
          <motion.div key={review.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="font-semibold text-foreground">{review.customer}</p>
                    <p className="text-sm text-muted-foreground">{review.product}</p>
                  </div>
                  <Badge variant="success">{review.status}</Badge>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                      />
                    ))}
                </div>
                <p className="text-sm text-foreground mb-4">{review.review}</p>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="p-2 bg-green-500/10 hover:bg-green-500/20 text-green-500 rounded-lg transition-colors"
                  >
                    <ThumbsUp className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
                  >
                    <ThumbsDown className="w-4 h-4" />
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
