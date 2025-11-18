"use client"

import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../../../components/ui/Card"
import { Button } from "../../../components/ui/Button"
import { Input } from "../../../components/ui/Input"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CreateSellerPage() {
  return (
    <div className="pt-24 md:pt-32 space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <Link href="/admin/users/sellers/list" className="flex items-center gap-2 text-primary hover:underline mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Sellers
        </Link>
        <h1 className="text-3xl font-bold text-foreground">Add Seller</h1>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>New Seller Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input label="Full Name" placeholder="Enter seller name" />
            <Input label="Email" type="email" placeholder="Enter email" />
            <Input label="Store Name" placeholder="Enter store name" />
            <Input label="Phone" type="tel" placeholder="Enter phone number" />
            <Input label="Address" placeholder="Enter store address" />
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Commission Rate (%)</label>
              <Input type="number" step="0.1" placeholder="15" />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Create Seller</Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
