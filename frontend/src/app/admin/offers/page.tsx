"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/Table";
import { useAdmin } from "../context/AdminContext";

export default function OffersPage() {
  const { offers } = useAdmin();

  return (
    <div className="pt-24 md:pt-32 space-y-6 bg-slate-950 min-h-screen px-4 pb-12">
      <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-black text-white">
        Offers Management
      </motion.h1>

      <Card className="bg-slate-900/70 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">All Negotiation Offers</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Offer ID</TableHeader>
                <TableHeader>Trade</TableHeader>
                <TableHeader>From / To</TableHeader>
                <TableHeader>Items + LTP</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Risk Flag</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {offers.map((offer) => (
                <TableRow key={offer.id}>
                  <TableCell>{offer.id}</TableCell>
                  <TableCell>{offer.tradeId}</TableCell>
                  <TableCell>{offer.fromUser} {"->"} {offer.toUser}</TableCell>
                  <TableCell>{offer.offeredItems} items + {offer.offeredLtp} LTP</TableCell>
                  <TableCell>
                    <Badge>{offer.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={offer.suspicious ? "error" : "success"}>{offer.suspicious ? "Suspicious" : "Normal"}</Badge>
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
