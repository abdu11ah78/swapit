"use client"

import React, { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Settings, Shield, Bell, Lock, Smartphone, Globe, Loader2, UserCircle, Save, MapPin, Camera } from "lucide-react"
import { useProfileQuery, useUpdateProfileMutation } from "@/features/profile/profile.hooks"
import { useAppContext } from "@/context/AppContext"
import { toast } from "sonner"

export default function SettingsPage() {
    const { data: user, isLoading } = useProfileQuery()
    const { updateUser } = useAppContext()
    const updateMutation = useUpdateProfileMutation()
    
    const [name, setName] = useState("")
    const [isLocationPublic, setIsLocationPublic] = useState(false)
    const [city, setCity] = useState("")
    const [latitude, setLatitude] = useState<number | undefined>(undefined)
    const [longitude, setLongitude] = useState<number | undefined>(undefined)
    const [image, setImage] = useState<string | undefined>(undefined)
    
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (user) {
            setName(user.name || "")
            setIsLocationPublic(user.isLocationPublic)
            setCity(user.city || "")
            setLatitude(user.latitude)
            setLongitude(user.longitude)
            setImage(user.image)
        }
    }, [user])

    const handleLocationToggle = async () => {
        const nextState = !isLocationPublic
        setIsLocationPublic(nextState)

        if (nextState) {
            toast.info("Requesting location access...", { duration: 2000 })
            
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        const { latitude: lat, longitude: lng } = position.coords
                        setLatitude(lat)
                        setLongitude(lng)
                        
                        try {
                            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
                            const data = await res.json()
                            const cityName = data.address.city || data.address.town || data.address.village || "Unknown City"
                            setCity(cityName)
                            toast.success(`Location detected: ${cityName}`)
                        } catch (err) {
                            console.error("Geocoding failed", err)
                            setCity("Detected Location")
                        }
                    },
                    (error) => {
                        console.error("Location access denied", error)
                        toast.error("Location access denied by browser.")
                        setIsLocationPublic(false)
                    }
                )
            } else {
                toast.error("Geolocation is not supported by your browser.")
                setIsLocationPublic(false)
            }
        }
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (file.size > 1024 * 1024) {
                toast.error("Image size must be less than 1MB")
                return
            }
            
            const reader = new FileReader()
            reader.onloadend = () => {
                setImage(reader.result as string)
                toast.success("Avatar updated preview")
            }
            reader.readAsDataURL(file)
        }
    }

    const handleUpdate = () => {
        // Only trigger update if something actually changed
        const hasNameChanged = name !== (user?.name || "")
        const hasLocationPrefsChanged = isLocationPublic !== user?.isLocationPublic
        const hasCityChanged = city !== (user?.city || "")
        const hasImageChanged = image !== user?.image

        if (!hasNameChanged && !hasLocationPrefsChanged && !hasCityChanged && !hasImageChanged) {
            toast.info("No changes detected.")
            return
        }

        updateMutation.mutate({
            name,
            isLocationPublic,
            city,
            latitude,
            longitude,
            image
        }, {
            onSuccess: () => {
                updateUser({ 
                    name, 
                    location: isLocationPublic ? city : undefined,
                    image,
                    isLocationPublic,
                    latitude,
                    longitude
                })
            }
        })
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fcfcfc]">
                <Loader2 className="w-10 h-10 text-[#115e59] animate-spin" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#fcfcfc] text-[#115e59]">
            <main className="max-w-5xl mx-auto pt-32 pb-20 px-4">
                <div className="mb-12">
                    <h1 className="text-5xl font-black tracking-tighter mb-2 italic uppercase">Account <span className="text-[#4d7c0f] not-italic">Settings</span></h1>
                    <p className="text-slate-400 text-xs font-black uppercase tracking-[0.3em]">Configure your marketplace preferences</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                    <div className="lg:col-span-1 space-y-3">
                        <SettingsTab icon={<UserCircle size={16} />} label="General" active />
                    </div>

                    <div className="lg:col-span-3">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-[#115e59]/5 border border-slate-100"
                        >
                            <div className="flex items-center gap-6 mb-12 pb-12 border-b border-slate-50">
                                <div className="relative group">
                                    <div className="w-24 h-24 bg-slate-50 rounded-3xl flex items-center justify-center overflow-hidden border-2 border-slate-100 shadow-inner">
                                        {image ? (
                                            <img src={image} alt={name || 'User'} className="w-full h-full object-cover" />
                                        ) : (
                                            <UserCircle size={48} className="text-slate-200" />
                                        )}
                                    </div>
                                    <button 
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute -bottom-2 -right-2 p-2.5 bg-[#115e59] text-white rounded-xl shadow-lg hover:bg-[#4d7c0f] transition-all group-hover:scale-110"
                                    >
                                        <Camera size={14} />
                                    </button>
                                    <input 
                                        type="file" 
                                        ref={fileInputRef} 
                                        onChange={handleImageChange} 
                                        className="hidden" 
                                        accept="image/*"
                                    />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-[#115e59] uppercase tracking-tighter italic leading-none mb-1">{name || 'Premium Member'}</h2>
                                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-3">{user?.email}</p>
                                    <button 
                                        onClick={() => fileInputRef.current?.click()}
                                        className="text-[10px] font-black text-[#4d7c0f] uppercase tracking-widest hover:underline"
                                    >
                                        Update Avatar
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-10">
                                <section>
                                    <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-8">Personal Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Full Name</label>
                                            <input 
                                                type="text" 
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#115e59]/10"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Email Address</label>
                                            <input 
                                                type="email" 
                                                value={user?.email || ''} 
                                                readOnly
                                                className="w-full px-6 py-4 bg-slate-100 border border-slate-100 rounded-2xl text-sm font-bold text-slate-400 cursor-not-allowed"
                                            />
                                        </div>
                                    </div>
                                </section>

                                <section className="pt-10 border-t border-slate-50">
                                    <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-8">Marketplace Preferences</h3>
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between group">
                                            <div>
                                                <h4 className="text-sm font-black text-[#115e59] uppercase tracking-tighter mb-1 italic">Location Services</h4>
                                                <p className="text-[10px] font-bold text-slate-400 tracking-wide">Show your city based on your GPS coordinates.</p>
                                                {isLocationPublic && (
                                                    <div className="mt-2 flex items-center gap-1.5 text-[10px] font-black text-[#4d7c0f] uppercase tracking-widest">
                                                        <MapPin size={10} /> {city || "Detecting..."}
                                                    </div>
                                                )}
                                            </div>
                                            <div 
                                                onClick={handleLocationToggle}
                                                className={`w-12 h-6 rounded-full p-1 transition-colors relative cursor-pointer ${isLocationPublic ? 'bg-[#4d7c0f]' : 'bg-slate-200'}`}
                                            >
                                                <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${isLocationPublic ? 'translate-x-6' : 'translate-x-0'}`} />
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>

                            <div className="mt-12 flex gap-4">
                                <button 
                                    onClick={handleUpdate}
                                    disabled={updateMutation.isPending}
                                    className="flex-1 py-5 bg-[#115e59] text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl hover:bg-[#0f524e] transition-all shadow-xl shadow-[#115e59]/10 flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                    {updateMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                    Update Profile
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>
        </div>
    )
}

function SettingsTab({ icon, label, active }: { icon: React.ReactNode, label: string, active?: boolean }) {
    return (
        <button className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all ${active ? 'bg-[#115e59] text-white shadow-xl shadow-[#115e59]/20 translate-x-2' : 'bg-white border border-slate-50 text-slate-400 hover:text-[#115e59] hover:bg-slate-50'}`}>
            <span className={active ? 'text-[#4d7c0f]' : ''}>{icon}</span>
            {label}
        </button>
    )
}
