"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card"
import { Badge } from "../components/ui/Badge"
import { useAppContext } from "@/context/AppContext"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { 
  updateAdminName, 
  changeAdminPassword, 
  getSystemDiagnostics, 
  getMaintenanceStatus, 
  toggleMaintenanceMode 
} from "@/features/admin/admin.api"
import { 
  User, 
  Shield, 
  Globe, 
  Database, 
  Save, 
  Key, 
  Server,
  AlertCircle,
  Loader2,
  CheckCircle2,
  X,
  Mail,
  Camera,
  Upload,
  Image as ImageIcon
} from "lucide-react"

export default function AdminSettingsPage() {
  const { currentUser, login } = useAppContext()
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Local states
  const [adminName, setAdminName] = useState(currentUser?.name || "")
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [emailRequested, setEmailRequested] = useState(false)
  const [tempAvatar, setTempAvatar] = useState<string | null>(null)

  // Password Modal State
  const [passForm, setPassForm] = useState({ current: "", new: "", confirm: "" })

  // Queries
  const { data: diagnostics, refetch: runDiagnostics, isFetching: isDiagnosing } = useQuery({
    queryKey: ["admin", "diagnostics"],
    queryFn: getSystemDiagnostics,
    enabled: false
  })

  const { data: isMaintenanceActive } = useQuery({
    queryKey: ["admin", "maintenance"],
    queryFn: getMaintenanceStatus
  })

  // Mutations
  const updateNameMutation = useMutation({
    mutationFn: (name: string) => updateAdminName(name), // Pass just the string
    onSuccess: () => {
      login({ ...currentUser, name: adminName }) 
      showSuccess("Name updated successfully")
    },
    onError: (err: any) => showError(err.response?.data?.message || "Failed to update name")
  })

  const changePasswordMutation = useMutation({
    mutationFn: changeAdminPassword,
    onSuccess: () => {
      setShowPasswordModal(false)
      setPassForm({ current: "", new: "", confirm: "" })
      showSuccess("Password changed successfully")
    },
    onError: (err: any) => showError(err.response?.data?.message || "Verification failed")
  })

  const maintenanceMutation = useMutation({
    mutationFn: toggleMaintenanceMode,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "maintenance"] })
      showSuccess("System status updated")
    }
  })

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result as string
        setTempAvatar(base64)
        login({ ...currentUser, avatarUrl: base64 }) // Sync with global context
        showSuccess("Avatar updated")
      }
      reader.readAsDataURL(file)
    }
  }

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg)
    setTimeout(() => setSuccessMsg(null), 3000)
  }

  const showError = (msg: string) => {
    setErrorMsg(msg)
    setTimeout(() => setErrorMsg(null), 3000)
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between sticky top-0 z-20 py-4 bg-[var(--admin-bg)]/80 backdrop-blur-md">
        <div>
          <h1 className="text-3xl font-black text-[var(--admin-text)] tracking-tight">
            Security & <span className="text-[var(--admin-primary)]">Privacy</span>
          </h1>
        </div>
        <div className="flex flex-col items-end gap-2">
          {successMsg && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 bg-green-500/10 text-green-500 px-4 py-2 rounded-lg border border-green-500/20">
              <CheckCircle2 size={16} /> <span className="text-sm font-bold">{successMsg}</span>
            </motion.div>
          )}
          {errorMsg && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 bg-red-500/10 text-red-500 px-4 py-2 rounded-lg border border-red-500/20">
              <AlertCircle size={16} /> <span className="text-sm font-bold">{errorMsg}</span>
            </motion.div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          
          {/* Basic Profile */}
          <Card>
            <CardHeader>
              <CardTitle>Public Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="flex items-center gap-8">
                <div className="relative group">
                  <div className="w-28 h-28 rounded-3xl bg-[var(--admin-primary)] flex items-center justify-center overflow-hidden border-4 border-[var(--admin-surface)] shadow-2xl transition-transform group-hover:scale-105 duration-300">
                    <img 
                      src={tempAvatar || `https://ui-avatars.com/api/?name=${currentUser?.name || 'Admin'}&background=98A31D&color=fff`} 
                      alt="Avatar" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <ImageIcon className="text-white" size={24} />
                    </div>
                  </div>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-2 -right-2 p-3 bg-white rounded-2xl shadow-xl text-[var(--admin-primary)] hover:scale-110 active:scale-95 transition-all border border-[var(--admin-border)]"
                  >
                    <Camera size={18} />
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleImageUpload}
                  />
                </div>
                <div className="flex-1 space-y-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-[var(--admin-text-muted)] tracking-[0.2em]">Display Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--admin-text-muted)]" size={16} />
                      <input 
                        type="text" 
                        value={adminName}
                        onChange={(e) => setAdminName(e.target.value)}
                        className="admin-input admin-input-with-icon h-12" 
                      />
                    </div>
                  </div>
                  <button 
                    onClick={() => updateNameMutation.mutate(adminName)} // Pass string
                    disabled={updateNameMutation.isPending}
                    className="admin-button-primary flex items-center gap-2 h-12 px-8"
                  >
                    {updateNameMutation.isPending ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    <span className="font-bold">Save Profile Changes</span>
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Secure Access */}
          <Card>
            <CardHeader>
              <CardTitle>Account Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Password */}
              <div className="flex items-center justify-between p-6 bg-[var(--admin-surface)] rounded-2xl border border-[var(--admin-border)]">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-500/10 text-orange-500 rounded-xl">
                    <Key size={24} />
                  </div>
                  <div>
                    <p className="font-black text-[var(--admin-text)]">Account Password</p>
                    <p className="text-xs text-[var(--admin-text-muted)] mt-1 font-medium">Last changed 3 months ago</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowPasswordModal(true)}
                  className="px-6 py-2.5 bg-white border border-[var(--admin-border)] text-xs font-black uppercase tracking-widest rounded-xl hover:bg-[var(--admin-bg)] transition-all shadow-sm"
                >
                  Change Password
                </button>
              </div>

              {/* Email */}
              <div className="flex items-center justify-between p-6 bg-[var(--admin-surface)] rounded-2xl border border-[var(--admin-border)]">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
                    <Mail size={24} />
                  </div>
                  <div>
                    <p className="font-black text-[var(--admin-text)]">Email Address</p>
                    <p className="text-xs text-[var(--admin-text-muted)] mt-1 font-medium">{currentUser?.email}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setEmailRequested(true)}
                  disabled={emailRequested}
                  className={`px-6 py-2.5 border text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-sm ${emailRequested ? 'bg-green-500/10 border-green-500/20 text-green-600' : 'bg-white border-[var(--admin-border)] hover:bg-[var(--admin-bg)]'}`}
                >
                  {emailRequested ? "Verification Sent" : "Update Email"}
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System & Health */}
        <div className="space-y-8">
           <Card>
            <CardHeader>
              <CardTitle>System Control</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-2">
                    <Globe size={18} className="text-red-500" />
                    <span className="text-sm font-black text-[var(--admin-text)] uppercase tracking-tighter">Maintenance</span>
                  </div>
                  <button 
                    onClick={() => maintenanceMutation.mutate(!isMaintenanceActive)}
                    className={`w-14 h-7 rounded-full relative transition-all duration-300 ${isMaintenanceActive ? 'bg-red-500 shadow-lg shadow-red-500/20' : 'bg-slate-200'}`}
                  >
                    <motion.div 
                      animate={{ x: isMaintenanceActive ? 32 : 4 }}
                      className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md" 
                    />
                  </button>
                </div>
                <p className="text-[10px] text-[var(--admin-text-muted)] font-bold leading-relaxed">
                  Enabling maintenance mode will redirect all public traffic to the maintenance landing page.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2 text-[var(--admin-text-muted)] font-black uppercase tracking-widest">
                    <Database size={14} />
                    <span>Database</span>
                  </div>
                  <span className={`font-black ${diagnostics?.databaseConnection ? 'text-green-500' : 'text-slate-300'}`}>
                    {diagnostics?.databaseConnection ? 'OPTIMAL' : 'OFFLINE'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2 text-[var(--admin-text-muted)] font-black uppercase tracking-widest">
                    <Server size={14} />
                    <span>Uptime</span>
                  </div>
                  <span className="font-black text-[var(--admin-primary)]">{diagnostics?.serverUptime || '---'}</span>
                </div>
              </div>
              
              <button 
                onClick={() => runDiagnostics()}
                disabled={isDiagnosing}
                className="w-full py-3 bg-[var(--admin-surface)] border border-[var(--admin-border)] text-[var(--admin-text)] text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-[var(--admin-bg)] transition-all flex items-center justify-center gap-2"
              >
                {isDiagnosing ? <Loader2 size={14} className="animate-spin" /> : "Verify System Health"}
              </button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Password Change Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowPasswordModal(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-[var(--admin-surface)] rounded-[2rem] shadow-2xl overflow-hidden border border-[var(--admin-border)]"
            >
              <div className="p-8 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-black text-[var(--admin-text)] uppercase tracking-tighter">Secure Password Reset</h3>
                  <button onClick={() => setShowPasswordModal(false)} className="p-2 hover:bg-[var(--admin-bg)] rounded-full transition-colors">
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                   <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-[var(--admin-text-muted)] tracking-widest">Current Password</label>
                    <input 
                      type="password" 
                      value={passForm.current}
                      onChange={(e) => setPassForm(prev => ({ ...prev, current: e.target.value }))}
                      className="admin-input" 
                      placeholder="Enter existing password"
                    />
                  </div>
                  <hr className="border-[var(--admin-border)]" />
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-[var(--admin-text-muted)] tracking-widest">New Password</label>
                    <input 
                      type="password" 
                      value={passForm.new}
                      onChange={(e) => setPassForm(prev => ({ ...prev, new: e.target.value }))}
                      className="admin-input" 
                      placeholder="Choose new password"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-[var(--admin-text-muted)] tracking-widest">Confirm New Password</label>
                    <input 
                      type="password" 
                      value={passForm.confirm}
                      onChange={(e) => setPassForm(prev => ({ ...prev, confirm: e.target.value }))}
                      className="admin-input" 
                      placeholder="Repeat new password"
                    />
                  </div>
                </div>

                <button 
                  onClick={() => {
                    if (passForm.new !== passForm.confirm) {
                       showError("New passwords do not match");
                       return;
                    }
                    changePasswordMutation.mutate({ 
                      currentPassword: passForm.current, 
                      newPassword: passForm.new 
                    })
                  }}
                  disabled={!passForm.current || !passForm.new || changePasswordMutation.isPending}
                  className="w-full py-4 bg-[var(--admin-primary)] text-white font-black uppercase tracking-widest rounded-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {changePasswordMutation.isPending ? <Loader2 size={18} className="animate-spin" /> : <Shield size={18} />}
                  <span>Authorize Update</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
