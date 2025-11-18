"use client"

import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../../../components/ui/Card"
import { Button } from "../../../components/ui/Button"
import { Input } from "../../../components/ui/Input"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CreateCustomerPage() {
  return (
    <div className="pt-24 md:pt-32 space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <Link href="/admin/users/customers/list" className="flex items-center gap-2 text-primary hover:underline mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Customers
        </Link>
        <h1 className="text-3xl font-bold text-foreground">Add Customer</h1>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>New Customer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input label="Full Name" placeholder="Enter full name" />
            <Input label="Email" type="email" placeholder="Enter email" />
            <Input label="Phone" type="tel" placeholder="Enter phone number" />
            <Input label="Address" placeholder="Enter address" />
            <div className="grid grid-cols-2 gap-4">
              <Input label="City" placeholder="City" />
              <Input label="ZIP Code" placeholder="ZIP" />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Create Customer</Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
