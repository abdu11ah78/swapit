"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/Table";
import { Badge } from "../components/ui/Badge";
import { useAdmin } from "../context/AdminContext";

export default function ItemsPage() {
  const { products } = useAdmin();

  return (
    <div className="pt-24 md:pt-32 space-y-6 bg-slate-950 min-h-screen px-4 pb-12">
      <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-black text-white">
        Items Management
      </motion.h1>
      <Card className="bg-slate-900/70 border-slate-800">
        <CardHeader><CardTitle className="text-white">All Listings</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Item</TableHeader>
                <TableHeader>Category</TableHeader>
                <TableHeader>LTP</TableHeader>
                <TableHeader>Owner Trust</TableHeader>
                <TableHeader>Status</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>{p.category}</TableCell>
                  <TableCell>{p.price}</TableCell>
                  <TableCell>{p.ownerTrustScore.toFixed(1)}</TableCell>
                  <TableCell><Badge>{p.status}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
