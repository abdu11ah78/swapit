"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/Table";
import { useAdmin } from "../context/AdminContext";

export default function UsersPage() {
  const { users, updateUser } = useAdmin();

  return (
    <div className="pt-24 md:pt-32 space-y-6 bg-slate-950 min-h-screen px-4 pb-12">
      <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-black text-white">
        Users Management
      </motion.h1>
      <Card className="bg-slate-900/70 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Users, Trust and Moderation</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Name</TableHeader>
                <TableHeader>Role</TableHeader>
                <TableHeader>Trust</TableHeader>
                <TableHeader>Trades</TableHeader>
                <TableHeader>Flags</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Action</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>{u.name}</TableCell>
                  <TableCell>{u.role}</TableCell>
                  <TableCell>{u.trustScore?.toFixed(1) ?? "N/A"}</TableCell>
                  <TableCell>{u.tradesCount ?? 0}</TableCell>
                  <TableCell><Badge variant={u.suspicious ? "warning" : "success"}>{u.suspicious ? "Suspicious" : "Clean"}</Badge></TableCell>
                  <TableCell><Badge>{u.status}</Badge></TableCell>
                  <TableCell>
                    <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={() => updateUser(u.id, { status: "suspended" })}>
                      Suspend
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
