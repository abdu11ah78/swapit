"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"
import { Input } from "../../components/ui/Input"
import {
  Mail, Phone, MapPin, Calendar, Edit2, Save, X,
  Camera, ArrowLeft, CheckCircle, AlertCircle,
  User, Shield, LogOut, Zap, Star, Award,
  ShieldCheck, Activity, Globe, Info
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function TraderDossierPage() {
  const [isEditing, setIsEditing] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState({
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah@swapit.io",
    phone: "+1 (555) 123-4567",
    location: "Neo-Tokyo Sector 7",
    bio: "Specializing in high-value electronic assets and node-to-node logistics.",
    trustScore: 4.8,
    tradeTier: "Gold",
    ltcBalance: 12500,
    activeSwaps: 14,
    successfulHandshakes: 242
  })

  const handleFieldChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
    setHasChanges(true)
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid protocol format"
    if (!formData.phone.trim()) newErrors.phone = "Comms link is required"
    if (!formData.location.trim()) newErrors.location = "Node location is required"

    return newErrors
  }

  const handleSaveChanges = () => {
    const newErrors = validateForm()

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    console.log("Protocol Dossier updated:", formData)
    setSuccessMessage("Dossier updated successfully!")
    setIsEditing(false)
    setHasChanges(false)

    setTimeout(() => {
      setSuccessMessage("")
    }, 3000)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setHasChanges(false)
    setErrors({})
    setFormData({
      ...formData,
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah@swapit.io",
      phone: "+1 (555) 123-4567",
      location: "Neo-Tokyo Sector 7",
      bio: "Specializing in high-value electronic assets and node-to-node logistics.",
    })
  }

  return (
    <div className="min-h-screen bg-slate-950 pt-24 md:pt-32 px-4 md:px-8 pb-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Link href="/admin" className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition mb-4 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Return to Command Center</span>
          </Link>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic flex items-center gap-3">
            <span className="w-2 h-8 bg-indigo-600 rounded-full" />
            Trader Dossier
          </h1>
          <p className="text-slate-500 font-mono text-[10px] mt-1 uppercase tracking-widest">
            AUTHENTICATED SESSION: TRADER-ALPHA-SJ // CLEARANCE: LEVEL 5
          </p>
        </motion.div>

        {/* Success Message */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center gap-3"
            >
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">{successMessage}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Portfolio Brief Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-indigo-600" />
              <CardContent className="pt-8">
                <div className="text-center">
                  <div className="relative inline-block group">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-32 h-32 mx-auto mb-6 rounded-2xl bg-slate-800 border-2 border-slate-700 flex items-center justify-center overflow-hidden relative"
                    >
                      <Image
                        src="https://images.pexels.com/photos/1642228/pexels-photo-1642228.jpeg"
                        alt="Profile"
                        fill
                        className="object-cover"
                      />
                    </motion.div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="absolute bottom-4 -right-2 bg-indigo-600 p-2.5 rounded-xl border border-indigo-400 text-white shadow-xl opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Camera size={16} />
                    </motion.button>
                  </div>

                  <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">
                    {formData.firstName} {formData.lastName}
                  </h2>
                  <div className="flex items-center justify-center gap-2 mt-2 mb-6">
                    <div className="px-3 py-1 bg-indigo-600/10 border border-indigo-500/20 rounded-full flex items-center gap-2">
                      <Award size={12} className="text-indigo-400" />
                      <span className="text-[9px] text-indigo-400 font-black uppercase tracking-widest">{formData.tradeTier} Member</span>
                    </div>
                  </div>

                  {/* Trust Score & Metrics */}
                  <div className="grid grid-cols-2 gap-3 mb-8">
                    <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-2xl">
                      <div className="flex items-center justify-center gap-1.5 text-emerald-400 mb-1">
                        <Star size={14} fill="currentColor" />
                        <span className="text-lg font-black">{formData.trustScore}</span>
                      </div>
                      <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest leading-tight">Trust Rating</p>
                    </div>
                    <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-2xl">
                      <div className="flex items-center justify-center gap-1.5 text-indigo-400 mb-1">
                        <Zap size={14} fill="currentColor" />
                        <span className="text-lg font-black">{formData.ltcBalance.toLocaleString()}</span>
                      </div>
                      <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest leading-tight">LTC Power</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-slate-950/30 border border-slate-800 rounded-xl">
                      <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Successful Handshakes</span>
                      <span className="text-[10px] font-black text-white px-2 py-0.5 bg-slate-800 rounded-lg">{formData.successfulHandshakes}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-950/30 border border-slate-800 rounded-xl">
                      <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Active Swap Signals</span>
                      <span className="text-[10px] font-black text-white px-2 py-0.5 bg-slate-800 rounded-lg">{formData.activeSwaps}</span>
                    </div>
                  </div>

                  <div className="mt-8 space-y-2">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="w-full py-4 bg-slate-900 border border-slate-800 text-slate-300 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                    >
                      <Edit2 size={14} />
                      Modify Dossier
                    </button>
                    <button
                      className="w-full py-4 bg-red-500/5 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-red-500/10 transition-colors flex items-center justify-center gap-2"
                    >
                      <LogOut size={14} />
                      Terminate Session
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-indigo-600 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Shield size={64} className="text-white" />
              </div>
              <CardContent className="p-6">
                <p className="text-[10px] font-black text-indigo-200 uppercase tracking-[0.2em] mb-4">SECURITY PROTOCOL</p>
                <h3 className="text-lg font-black text-white tracking-tighter uppercase leading-tight">BIP-44 Multi-Node Identity Verified</h3>
                <div className="mt-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-[9px] text-indigo-100 font-bold uppercase">Biometric Link Active</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Edit/Information Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-xl h-full">
              <CardHeader className="border-b border-slate-800">
                <CardTitle className="flex items-center gap-3 text-white text-[12px] font-black uppercase tracking-[0.2em]">
                  <Activity className="w-5 h-5 text-indigo-500" />
                  {isEditing ? "Modify Personnel Data" : "Personnel Metadata"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8 pt-8 px-8">
                {isEditing ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">TRADER FIRST NAME</label>
                        <Input
                          value={formData.firstName}
                          onChange={(e) => handleFieldChange("firstName", e.target.value)}
                          className="bg-slate-950 border-slate-800 text-white rounded-xl h-12"
                        />
                        {errors.firstName && <p className="text-red-500 text-[8px] font-bold uppercase mt-1">{errors.firstName}</p>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">TRADER LAST NAME</label>
                        <Input
                          value={formData.lastName}
                          onChange={(e) => handleFieldChange("lastName", e.target.value)}
                          className="bg-slate-950 border-slate-800 text-white rounded-xl h-12"
                        />
                        {errors.lastName && <p className="text-red-500 text-[8px] font-bold uppercase mt-1">{errors.lastName}</p>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">COMMUNICATIONS LINK (EMAIL)</label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleFieldChange("email", e.target.value)}
                        className="bg-slate-950 border-slate-800 text-white rounded-xl h-12"
                      />
                      {errors.email && <p className="text-red-500 text-[8px] font-bold uppercase mt-1">{errors.email}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">ENCRYPTED VOICE ID</label>
                        <Input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleFieldChange("phone", e.target.value)}
                          className="bg-slate-950 border-slate-800 text-white rounded-xl h-12"
                        />
                        {errors.phone && <p className="text-red-500 text-[8px] font-bold uppercase mt-1">{errors.phone}</p>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">PRIMARY NODE COORDINATES</label>
                        <Input
                          value={formData.location}
                          onChange={(e) => handleFieldChange("location", e.target.value)}
                          className="bg-slate-950 border-slate-800 text-white rounded-xl h-12"
                        />
                        {errors.location && <p className="text-red-500 text-[8px] font-bold uppercase mt-1">{errors.location}</p>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">TRADER OBJECTIVES (BIO)</label>
                      <textarea
                        className="w-full px-4 py-4 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none focus:border-indigo-500 transition-colors resize-none"
                        rows={4}
                        value={formData.bio}
                        onChange={(e) => handleFieldChange("bio", e.target.value)}
                      />
                    </div>

                    {hasChanges && (
                      <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-xl p-4 flex items-center gap-3">
                        <AlertCircle className="w-4 h-4 text-indigo-400" />
                        <p className="text-indigo-400 text-[9px] font-black uppercase tracking-widest">Dossier modification detected - Sync required</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-1 group">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                          <User size={10} className="text-slate-600" />
                          Personnel ID
                        </p>
                        <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-2xl group-hover:border-slate-700 transition">
                          <p className="text-sm font-black text-white tracking-widest uppercase italic">{formData.firstName} {formData.lastName}</p>
                        </div>
                      </div>
                      <div className="space-y-1 group">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                          <Globe size={10} className="text-slate-600" />
                          Node Coordination
                        </p>
                        <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-2xl group-hover:border-slate-700 transition">
                          <p className="text-sm font-black text-white tracking-widest uppercase italic">{formData.location}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1 group">
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                        <Mail size={10} className="text-slate-600" />
                        Comm Link
                      </p>
                      <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-2xl group-hover:border-slate-700 transition">
                        <p className="text-sm font-black text-indigo-400 tracking-widest">{formData.email}</p>
                      </div>
                    </div>

                    <div className="space-y-1 group">
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                        <Info size={10} className="text-slate-600" />
                        Operational Directives
                      </p>
                      <div className="p-5 bg-indigo-600/5 border border-indigo-500/10 rounded-2xl group-hover:bg-indigo-600/10 transition group font-mono italic">
                        <p className="text-xs text-white leading-relaxed tracking-tight">{formData.bio}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="p-8 border-t border-slate-800 flex gap-4">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleCancel}
                      className="flex-1 py-4 border border-slate-700 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-800 transition flex items-center justify-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Abort Changes
                    </button>
                    <button
                      onClick={handleSaveChanges}
                      className="flex-1 py-4 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:bg-indigo-500 transition flex items-center justify-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Commit to Ledger
                    </button>
                  </>
                ) : (
                  <div className="w-full p-4 bg-slate-950/50 border border-slate-800 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <ShieldCheck size={20} className="text-emerald-500" />
                      <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Protocol Compliant Account</span>
                    </div>
                    <span className="text-[8px] text-slate-600 font-mono tracking-tighter">TR-48-ALPHA-NEO-01</span>
                  </div>
                )}
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}