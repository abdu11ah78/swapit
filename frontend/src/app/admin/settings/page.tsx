"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";

export default function AdminSettingsPage() {
  return (
    <div className="pt-24 md:pt-32 space-y-6 bg-slate-950 min-h-screen px-4 pb-12">
      <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-black text-white">
        Platform Settings
      </motion.h1>
      <Card className="bg-slate-900/70 border-slate-800">
        <CardHeader><CardTitle className="text-white">Configuration</CardTitle></CardHeader>
        <CardContent className="text-slate-300">
          Branding, feature toggles, and theme controls are centralized here.
        </CardContent>
      </Card>
    </div>
  );
}
