"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/Table";
import { useAdmin } from "../context/AdminContext";

export default function DisputesPage() {
  const { disputes, updateDispute } = useAdmin();

  return (
    <div className="pt-24 md:pt-32 space-y-6 bg-slate-950 min-h-screen px-4 pb-12">
      <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-black text-white">
        Disputes Management
      </motion.h1>

      <Card className="bg-slate-900/70 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Disputes and Evidence</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>ID</TableHeader>
                <TableHeader>Trade</TableHeader>
                <TableHeader>Reporter</TableHeader>
                <TableHeader>Reason</TableHeader>
                <TableHeader>Evidence</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Action</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {disputes.map((dispute) => (
                <TableRow key={dispute.id}>
                  <TableCell>{dispute.id}</TableCell>
                  <TableCell>{dispute.tradeId}</TableCell>
                  <TableCell>{dispute.reporter}</TableCell>
                  <TableCell>{dispute.reason}</TableCell>
                  <TableCell>{dispute.evidenceCount} proofs</TableCell>
                  <TableCell><Badge>{dispute.status}</Badge></TableCell>
                  <TableCell>
                    <Button
                      className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white"
                      onClick={() => updateDispute(dispute.id, { status: "resolved" })}
                    >
                      Resolve
                    </Button>
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
