"use client"

import { motion, AnimatePresence } from "framer-motion"
import { AlertCircle, CheckCircle2, Info, X, HelpCircle } from "lucide-react"

export type ModalType = 'success' | 'error' | 'info' | 'confirm' | 'warning'

interface CustomModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm?: () => void
    title: string
    message: string
    type?: ModalType
    confirmText?: string
    cancelText?: string
}

const typeStyles: Record<ModalType, any> = {
    success: {
        icon: CheckCircle2,
        color: "text-[#4d7c0f]",
        bg: "bg-[#4d7c0f]/10",
        border: "border-[#4d7c0f]/20",
        btn: "bg-[#4d7c0f]"
    },
    error: {
        icon: AlertCircle,
        color: "text-red-600",
        bg: "bg-red-50",
        border: "border-red-100",
        btn: "bg-red-600"
    },
    info: {
        icon: Info,
        color: "text-[#115e59]",
        bg: "bg-[#115e59]/10",
        border: "border-[#115e59]/20",
        btn: "bg-[#115e59]"
    },
    warning: {
        icon: AlertCircle,
        color: "text-amber-600",
        bg: "bg-amber-50",
        border: "border-amber-100",
        btn: "bg-amber-600"
    },
    confirm: {
        icon: HelpCircle,
        color: "text-[#115e59]",
        bg: "bg-slate-50",
        border: "border-slate-100",
        btn: "bg-[#115e59]"
    }
}

export const CustomAlert = ({ isOpen, onClose, onConfirm, title, message, type = 'info', confirmText = 'Understood', cancelText = 'Cancel' }: CustomModalProps) => {
    const style = typeStyles[type]
    const Icon = style.icon

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-[#115e59]/20 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="w-full max-w-sm bg-white rounded-[2.5rem] p-8 relative z-10 shadow-2xl overflow-hidden text-center"
                    >
                        <div className={`w-20 h-20 ${style.bg} ${style.color} rounded-3xl flex items-center justify-center mx-auto mb-6`}>
                            <Icon size={40} />
                        </div>
                        
                        <h2 className="text-xl font-black text-[#115e59] uppercase tracking-tighter mb-2">{title}</h2>
                        <p className="text-slate-400 text-xs font-bold leading-relaxed mb-8">{message}</p>

                        <div className="flex gap-3">
                            {type === 'confirm' && (
                                <button
                                    onClick={onClose}
                                    className="flex-1 py-4 bg-slate-50 text-slate-400 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-slate-100 transition-all border border-slate-100"
                                >
                                    {cancelText}
                                </button>
                            )}
                            <button
                                onClick={onConfirm || onClose}
                                className={`flex-1 py-4 ${style.btn} text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-lg transition-all hover:scale-[1.02] active:scale-95`}
                            >
                                {confirmText}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
