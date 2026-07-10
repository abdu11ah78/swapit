"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card"
import { Badge } from "../components/ui/Badge"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { 
  getAdminCategories, 
  getAdminProvinces, 
  createAdminCategory,
  updateAdminCategory,
  toggleCategoryStatus
} from "@/features/admin/admin.api"
import { useAdminSuggestions, useApproveSuggestion, useToggleCategory } from "@/features/admin/admin.hooks"
import { 
  Plus, 
  Layers, 
  MapPin, 
  Settings2, 
  Smartphone, 
  Car, 
  Home, 
  Shirt, 
  Trophy, 
  ChevronRight,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  Type,
  Hash,
  List as ListIcon,
  HelpCircle,
  Sparkles,
  Smile,
  Microwave,
  Cpu,
  BookOpen,
  Palette,
  Wrench,
  Zap,
  Bike,
  Settings
} from "lucide-react"

// Dynamic icon mapping
const IconMap: any = {
  Smartphone: Smartphone,
  Car: Car,
  Home: Home,
  Shirt: Shirt,
  Trophy: Trophy,
  Layers: Layers,
  Bike: Bike,
  Settings: Settings,
  Smile: Smile,
  BookOpen: BookOpen,
  Palette: Palette,
  Wrench: Wrench,
  Microwave: Microwave,
  Cpu: Cpu,
  Zap: Zap,
  Sparkles: Sparkles,
  HelpCircle: HelpCircle
}

export default function CategoriesPage() {
  const queryClient = useQueryClient()
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  // Form State
  const [newCat, setNewCat] = useState({
    id: "",
    name: "",
    icon: "Smartphone",
    parentId: null as string | null,
    attributes: [] as any[]
  })

  // Queries
  const { data: categories, isLoading: catsLoading } = useQuery({
    queryKey: ["admin", "categories"],
    queryFn: getAdminCategories
  })

  const { data: provinces, isLoading: provsLoading } = useQuery({
    queryKey: ["admin", "provinces"],
    queryFn: getAdminProvinces
  })

  // Mutations
  const createMutation = useMutation({
    mutationFn: createAdminCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] })
      setShowAddModal(false)
      setNewCat({ id: "", name: "", icon: "Smartphone", parentId: null, attributes: [] })
      setSuccessMsg("Category created successfully")
      setTimeout(() => setSuccessMsg(null), 3000)
    }
  })

  const updateMutation = useMutation({
    mutationFn: (data: any) => updateAdminCategory(data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] })
      setShowAddModal(false)
      setEditingId(null)
      setNewCat({ id: "", name: "", icon: "Smartphone", parentId: null, attributes: [] })
      setSuccessMsg("Category updated successfully")
      setTimeout(() => setSuccessMsg(null), 3000)
    }
  })

  const toggleMutation = useToggleCategory()

  const addAttribute = () => {
    setNewCat(prev => ({
      ...prev,
      attributes: [...prev.attributes, { name: "", type: "text", isRequired: false, options: "" }]
    }))
  }

  const removeAttribute = (index: number) => {
    setNewCat(prev => ({
      ...prev,
      attributes: prev.attributes.filter((_, i) => i !== index)
    }))
  }

  const updateAttribute = (index: number, field: string, value: any) => {
    const updated = [...newCat.attributes]
    updated[index] = { ...updated[index], [field]: value }
    setNewCat({ ...newCat, attributes: updated })
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-20 py-4 bg-[var(--admin-bg)]/80 backdrop-blur-md">
        <div>
          <h1 className="text-3xl font-black text-[var(--admin-text)] tracking-tight">
            Marketplace <span className="text-[var(--admin-primary)]">Taxonomy</span>
          </h1>
          <p className="text-sm text-[var(--admin-text-muted)] font-medium mt-1">Manage categories, smart attributes, and geographic states.</p>
        </div>
        <div className="flex items-center gap-4">
          {successMsg && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-green-500/10 text-green-500 px-4 py-2 rounded-xl border border-green-500/20 flex items-center gap-2">
              <CheckCircle2 size={16} />
              <span className="text-xs font-bold">{successMsg}</span>
            </motion.div>
          )}
          <button 
            onClick={() => setShowAddModal(true)}
            className="admin-button-primary flex items-center gap-2 px-6"
          >
            <Plus size={18} />
            <span>New Category</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Main Categories Tree */}
        <div className="lg:col-span-3 space-y-6">
          {catsLoading ? (
            <div className="space-y-4">
               {[1,2,3].map(i => <div key={i} className="h-48 rounded-3xl bg-[var(--admin-surface)] animate-pulse" />)}
            </div>
          ) : (() => {
            // Build tree structure
            const roots = categories?.filter((c: any) => !c.parentId) ?? []
            const getChildren = (parentId: string) => categories?.filter((c: any) => c.parentId === parentId) ?? []

            return (
              <div className="space-y-6">
                {roots.map((root: any) => {
                  const RootIcon = IconMap[root.icon] || Layers
                  const level2 = getChildren(root.id)
                  return (
                    <motion.div
                      key={root.id}
                      layoutId={root.id}
                      className="bg-[var(--admin-surface)] border border-[var(--admin-border)] rounded-[2rem] overflow-hidden"
                    >
                      {/* Root Header */}
                      <div className="flex justify-between items-center p-6 border-b border-[var(--admin-border)] bg-[var(--admin-primary)]/5">
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-2xl bg-[var(--admin-primary)]/10 text-[var(--admin-primary)]">
                            <RootIcon size={22} />
                          </div>
                          <div>
                            <h3 className="font-black text-[var(--admin-text)] text-base tracking-tight">{root.name}</h3>
                            <p className="text-[10px] font-bold text-[var(--admin-text-muted)] uppercase tracking-widest mt-0.5">
                              Root Category · {level2.length} subcategories
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => toggleMutation.mutate(root.id)} disabled={toggleMutation.isPending} className="cursor-pointer hover:scale-105 transition-transform">
                            <Badge variant={root.isActive ? "success" : "secondary"}>{root.isActive ? "ACTIVE" : "HIDDEN"}</Badge>
                          </button>
                          <button
                            onClick={() => { setEditingId(root.id); setNewCat({ id: root.id, name: root.name, icon: root.icon, parentId: null, attributes: [] }); setShowAddModal(true) }}
                            className="p-2 hover:bg-[var(--admin-bg)] rounded-xl transition-colors"
                          >
                            <Settings2 size={16} className="text-[var(--admin-text-muted)]" />
                          </button>
                        </div>
                      </div>

                      {/* Level 2 Subcategories */}
                      {level2.length > 0 && (
                        <div className="divide-y divide-[var(--admin-border)]">
                          {level2.map((sub: any) => {
                            const SubIcon = IconMap[sub.icon] || Layers
                            const leaves = getChildren(sub.id)
                            return (
                              <div key={sub.id} className="p-5 hover:bg-[var(--admin-bg)]/50 transition-colors">
                                <div className="flex justify-between items-start mb-3">
                                  <div className="flex items-center gap-3">
                                    <ChevronRight size={14} className="text-[var(--admin-primary)]/50" />
                                    <SubIcon size={16} className="text-[var(--admin-primary)]" />
                                    <span className="font-bold text-sm text-[var(--admin-text)]">{sub.name}</span>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-[var(--admin-text-muted)] bg-[var(--admin-bg)] px-2 py-0.5 rounded-full border border-[var(--admin-border)]">
                                      {leaves.length} leaves
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <button onClick={() => toggleMutation.mutate(sub.id)} disabled={toggleMutation.isPending} className="cursor-pointer hover:scale-105 transition-transform">
                                      <Badge variant={sub.isActive ? "success" : "secondary"}>{sub.isActive ? "ACTIVE" : "HIDDEN"}</Badge>
                                    </button>
                                    <button
                                      onClick={() => { setEditingId(sub.id); setNewCat({ id: sub.id, name: sub.name, icon: sub.icon, parentId: root.id, attributes: sub.attributes?.map((a: any) => ({ ...a })) || [] }); setShowAddModal(true) }}
                                      className="p-1.5 hover:bg-[var(--admin-bg)] rounded-lg transition-colors"
                                    >
                                      <Settings2 size={14} className="text-[var(--admin-text-muted)]" />
                                    </button>
                                  </div>
                                </div>

                                {/* Level 3 Leaves */}
                                {leaves.length > 0 && (
                                  <div className="ml-7 flex flex-wrap gap-2 mt-2">
                                    {leaves.map((leaf: any) => (
                                      <div key={leaf.id} className="group flex items-center gap-1.5 px-3 py-1.5 bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-xl text-[10px] font-bold text-[var(--admin-text-muted)] uppercase tracking-wider hover:border-[var(--admin-primary)]/40 transition-colors cursor-default">
                                        <span>{leaf.name}</span>
                                        {leaf.attributes?.length > 0 && (
                                          <span className="text-[var(--admin-primary)] font-black">·{leaf.attributes.length}</span>
                                        )}
                                        <button
                                          onClick={() => { setEditingId(leaf.id); setNewCat({ id: leaf.id, name: leaf.name, icon: leaf.icon, parentId: sub.id, attributes: leaf.attributes?.map((a: any) => ({ ...a })) || [] }); setShowAddModal(true) }}
                                          className="opacity-0 group-hover:opacity-100 ml-1 text-[var(--admin-primary)] transition-opacity"
                                          title="Edit"
                                        >
                                          <Settings2 size={11} />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </motion.div>
                  )
                })}
              </div>
            )
          })()}
        </div>

        {/* Sidebar: States (Provinces) */}
        <div className="space-y-6">
          <Card className="rounded-[2rem] overflow-hidden">
            <CardHeader className="bg-[var(--admin-primary)]/5 border-b border-[var(--admin-border)]">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <MapPin size={16} className="text-[var(--admin-primary)]" />
                  <span>States/Provinces</span>
                </CardTitle>
                <button className="p-1.5 hover:bg-white rounded-lg transition-colors">
                  <Plus size={14} className="text-[var(--admin-primary)]" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-1">
              {provsLoading ? (
                [1,2,3,4,5].map(i => <div key={i} className="h-10 rounded-xl bg-[var(--admin-bg)] animate-pulse" />)
              ) : (
                provinces?.map((prov: any) => (
                  <div key={prov.id} className="group flex items-center justify-between p-3 rounded-xl hover:bg-[var(--admin-bg)] transition-all cursor-pointer">
                    <span className="text-sm font-bold text-[var(--admin-text)]">{prov.name}</span>
                    <Badge variant={prov.isActive ? "success" : "outline"} className="scale-75 origin-right">
                      {prov.isActive ? "LIVE" : "PAUSED"}
                    </Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <div className="p-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[2rem] text-white shadow-xl shadow-indigo-500/20">
             <Settings2 className="mb-4 opacity-50" size={32} />
             <h4 className="font-black uppercase tracking-tighter text-lg leading-tight">Taxonomy <br />Automation</h4>
             <p className="text-xs font-medium mt-2 opacity-80 leading-relaxed">System automatically suggests attributes based on category keywords using AI.</p>
             <button className="mt-4 w-full py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                Learn More
             </button>
          </div>
        </div>
      </div>

      {/* Add Category Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddModal(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 40 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="relative w-full max-w-2xl bg-[var(--admin-surface)] rounded-[2.5rem] shadow-2xl border border-[var(--admin-border)] overflow-hidden"
            >
              <div className="h-full flex flex-col max-h-[90vh]">
                <div className="p-8 border-b border-[var(--admin-border)] flex justify-between items-center bg-[var(--admin-bg)]/50">
                  <div>
                    <h2 className="text-2xl font-black text-[var(--admin-text)] uppercase tracking-tighter">Define New Category</h2>
                    <p className="text-xs text-[var(--admin-text-muted)] font-medium mt-1">Structure how items are listed in this category.</p>
                  </div>
                  <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-[var(--admin-bg)] rounded-full transition-colors">
                    <X size={24} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-[var(--admin-text-muted)] tracking-[0.2em]">Category Name</label>
                      <input 
                        type="text" 
                        value={newCat.name}
                        onChange={(e) => setNewCat({...newCat, name: e.target.value})}
                        placeholder="e.g. Luxury Watches" 
                        className="admin-input h-12" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-[var(--admin-text-muted)] tracking-[0.2em]">Select Icon</label>
                      <select 
                        value={newCat.icon}
                        onChange={(e) => setNewCat({...newCat, icon: e.target.value})}
                        className="admin-input h-12"
                      >
                        <option value="Smartphone">Smartphone</option>
                        <option value="Car">Car</option>
                        <option value="Home">Home</option>
                        <option value="Shirt">Shirt</option>
                        <option value="Trophy">Trophy</option>
                        <option value="Bike">Bike</option>
                        <option value="Settings">Settings</option>
                        <option value="Smile">Smile</option>
                        <option value="BookOpen">BookOpen</option>
                        <option value="Palette">Palette</option>
                        <option value="Wrench">Wrench</option>
                        <option value="Microwave">Microwave</option>
                        <option value="Laptop">Laptop</option>
                        <option value="Zap">Zap</option>
                        <option value="Sparkles">Sparkles</option>
                        <option value="Layers">Miscellaneous</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-[var(--admin-text-muted)] tracking-[0.2em]">Parent Category</label>
                      <select 
                        value={newCat.parentId || ""}
                        onChange={(e) => setNewCat({...newCat, parentId: e.target.value || null})}
                        className="admin-input h-12"
                      >
                        <option value="">None (Root Category)</option>
                        {categories?.filter((c: any) => c.id !== editingId).map((c: any) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Attributes Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-black text-[var(--admin-text)] uppercase tracking-widest">Smart Attributes</h4>
                      <button 
                        onClick={addAttribute}
                        className="text-[10px] font-black uppercase text-[var(--admin-primary)] flex items-center gap-1 hover:underline"
                      >
                        <Plus size={14} /> Add Attribute
                      </button>
                    </div>

                    <div className="space-y-3">
                      {newCat.attributes.map((attr, idx) => (
                        <motion.div 
                          initial={{ opacity: 0, x: -10 }} 
                          animate={{ opacity: 1, x: 0 }}
                          key={idx} 
                          className="p-4 bg-[var(--admin-bg)] rounded-2xl border border-[var(--admin-border)] grid grid-cols-1 md:grid-cols-12 gap-4 items-end"
                        >
                          <div className="md:col-span-4 space-y-1">
                            <label className="text-[9px] font-bold uppercase text-[var(--admin-text-muted)]">Attribute Name</label>
                            <input 
                              type="text" 
                              value={attr.name}
                              onChange={(e) => updateAttribute(idx, "name", e.target.value)}
                              placeholder="e.g. RAM Size" 
                              className="admin-input h-10 bg-white" 
                            />
                          </div>
                          <div className="md:col-span-3 space-y-1">
                            <label className="text-[9px] font-bold uppercase text-[var(--admin-text-muted)]">Data Type</label>
                            <select 
                              value={attr.type}
                              onChange={(e) => updateAttribute(idx, "type", e.target.value)}
                              className="admin-input h-10 bg-white"
                            >
                              <option value="text">Text</option>
                              <option value="number">Number</option>
                              <option value="selection">Selection</option>
                            </select>
                          </div>
                          <div className="md:col-span-3 flex items-center gap-2 mb-2">
                            <input 
                              type="checkbox" 
                              checked={attr.isRequired}
                              onChange={(e) => updateAttribute(idx, "isRequired", e.target.checked)}
                              className="w-4 h-4 rounded border-[var(--admin-border)] text-[var(--admin-primary)] focus:ring-[var(--admin-primary)]" 
                            />
                            <span className="text-[10px] font-bold text-[var(--admin-text)] uppercase">Required</span>
                          </div>
                          <div className="md:col-span-2 flex justify-end mb-1">
                            <button onClick={() => removeAttribute(idx)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                              <X size={16} />
                            </button>
                          </div>
                          
                          {attr.type === 'selection' && (
                            <div className="md:col-span-12 space-y-1 mt-2">
                               <label className="text-[9px] font-bold uppercase text-[var(--admin-text-muted)]">Options (JSON or Comma separated)</label>
                               <input 
                                  type="text" 
                                  value={attr.options}
                                  onChange={(e) => updateAttribute(idx, "options", e.target.value)}
                                  placeholder='["8GB", "16GB", "32GB"]' 
                                  className="admin-input h-10 bg-white" 
                               />
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-8 border-t border-[var(--admin-border)] bg-[var(--admin-bg)]/50 flex justify-end gap-4">
                  <button 
                    onClick={() => {
                      setShowAddModal(false)
                      setEditingId(null)
                      setNewCat({ id: "", name: "", icon: "Smartphone", parentId: null, attributes: [] })
                    }} 
                    className="px-6 py-3 text-xs font-black uppercase tracking-widest text-[var(--admin-text-muted)]"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => editingId ? updateMutation.mutate(newCat) : createMutation.mutate(newCat)}
                    disabled={createMutation.isPending || updateMutation.isPending || !newCat.name}
                    className="admin-button-primary px-10 h-12 flex items-center gap-2"
                  >
                    {(createMutation.isPending || updateMutation.isPending) ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
                    <span>{editingId ? 'Update' : 'Deploy'} Category</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
