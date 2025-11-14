"use client"

import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card"
import { Input } from "../components/ui/Input"
import { Search, MessageCircle, FileText } from "lucide-react"

export default function HelpCenterPage() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-foreground">Help Center</h1>
        <p className="text-muted-foreground">Find answers and support resources</p>
      </motion.div>

      {/* Search */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search for help..." className="pl-10" />
        </div>
      </motion.div>

      {/* Help Resources */}
      <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              Contact Support
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Get in touch with our support team</p>
            <button className="text-primary hover:underline font-medium text-sm">Send us a message</button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Documentation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Read our comprehensive guides</p>
            <button className="text-primary hover:underline font-medium text-sm">View guides</button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              Community Forum
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Connect with other users</p>
            <button className="text-primary hover:underline font-medium text-sm">Join forum</button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
