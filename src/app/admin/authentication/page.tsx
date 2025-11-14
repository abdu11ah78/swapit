"use client"

import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent } from "../../admin/components/ui/Card"
import { Badge } from "../../admin/components/ui/Badge"
import { Button } from "../../admin/components/ui/Button"
import { Shield, Key } from "lucide-react"

export default function AuthenticationPage() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-foreground">Authentication & Security</h1>
      </motion.div>

      <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Two-Factor Authentication
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-secondary rounded-lg">
              <p className="text-sm text-muted-foreground">Status:</p>
              <Badge variant="warning" className="mt-2">
                Not Enabled
              </Badge>
            </div>
            <Button className="w-full">Enable 2FA</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5 text-primary" />
              API Keys
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-secondary rounded-lg">
              <p className="text-xs text-muted-foreground font-mono">pk_live_abcdef123456</p>
              <p className="text-xs text-muted-foreground mt-2">Created 30 days ago</p>
            </div>
            <Button className="w-full">Generate New Key</Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}