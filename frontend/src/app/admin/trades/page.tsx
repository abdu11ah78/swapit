"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/Table";
import { Badge } from "../components/ui/Badge";
import { useAdmin } from "../context/AdminContext";

export default function TradesPage() {
  const { orders, updateOrder } = useAdmin();

  return (
    <div className="pt-24 md:pt-32 space-y-6 bg-slate-950 min-h-screen px-4 pb-12">
      <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-black text-white">
        Trades Management
      </motion.h1>
      <Card className="bg-slate-900/70 border-slate-800">
        <CardHeader><CardTitle className="text-white">All Trades</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Trade</TableHeader>
                <TableHeader>Buyer</TableHeader>
                <TableHeader>Seller</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Escrow</TableHeader>
                <TableHeader>Action</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((o) => (
                <TableRow key={o.id}>
                  <TableCell>{o.orderNumber}</TableCell>
                  <TableCell>{o.buyer}</TableCell>
                  <TableCell>{o.seller}</TableCell>
                  <TableCell><Badge>{o.status}</Badge></TableCell>
                  <TableCell><Badge>{o.paymentStatus}</Badge></TableCell>
                  <TableCell>
                    <button
                      className="px-3 py-1 rounded bg-fuchsia-600 text-white text-xs"
                      onClick={() => updateOrder(o.id, { status: "in_progress" })}
                    >
                      Set In Progress
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
