"use client"

import { useEffect, useState, useCallback } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { Work } from "../../../../data/classic/user/types/types"

export function ShowcaseSection() {
  const [works, setWorks] = useState<Work[]>([])
  const [open, setOpen] = useState(false)
  const [currentWorkIndex, setCurrentWorkIndex] = useState(0)

  useEffect(() => {
    fetch("/api/portfolio/works")
      .then((res) => res.json())
      .then((data: Work[]) => setWorks(data))
      .catch(() => {
        setWorks([
          {
            id: "1",
            title: "Modern Living Room Setup",
            description: "A contemporary living room design project.",
            images: [
              "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80",
              "https://images.unsplash.com/photo-1616627986315-4b77ec2a3f8e?auto=format&fit=crop&w=1200&q=80",
            ],
          },
          {
            id: "2",
            title: "Minimalist Workspace",
            description: "Custom workspace with ergonomic furniture.",
            images: [
              "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1200&q=80",
            ],
          },
          {
            id: "3",
            title: "Luxury Bedroom",
            description: "Premium furniture and soft lighting.",
            images: [
              "https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=1200&q=80",
              "https://images.unsplash.com/photo-1505691723518-36a9b6d802e6?auto=format&fit=crop&w=1200&q=80",
            ],
          },
        ])
      })
  }, [])

  const handleNext = useCallback(() => {
    setCurrentWorkIndex((prev) => (prev + 1) % works.length)
  }, [works])

  const handlePrev = useCallback(() => {
    setCurrentWorkIndex((prev) => (prev - 1 + works.length) % works.length)
  }, [works])

  // keyboard navigation
  useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNext()
      if (e.key === "ArrowLeft") handlePrev()
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [open, handleNext, handlePrev])

  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-black mb-10">
          Our Best Work
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {works.map((work, index) => (
            <div
              key={work.id}
              className="group relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition cursor-pointer"
              onClick={() => {
                setCurrentWorkIndex(index)
                setOpen(true)
              }}
            >
              <Image
                src={Array.isArray(work.images) ? work.images[0] : work.images}
                alt={work.title}
                width={600}
                height={400}
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col justify-end p-4 transition">
                <h3 className="text-white text-lg font-semibold">{work.title}</h3>
                {work.description && <p className="text-gray-200 text-sm">{work.description}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton={false}
          className="
            fixed top-1/2 left-1/2 
            -translate-x-1/2 -translate-y-1/2 
            w-[95vw] h-[90vh] max-w-6xl 
            bg-black/95 text-white rounded-xl 
            flex items-center justify-center 
            p-0 overflow-hidden 
            animate-in fade-in-50 zoom-in-95
          "
        >
          <VisuallyHidden>
            <DialogTitle>
              {works[currentWorkIndex]?.title || "Project Showcase"}
            </DialogTitle>
          </VisuallyHidden>

          {/* Close button */}
          <button
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 rounded-full p-2 transition z-50"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Image */}
          <div className="relative w-full h-full flex items-center justify-center">
            <Image
              src={
                Array.isArray(works[currentWorkIndex]?.images)
                  ? works[currentWorkIndex].images[0]
                  : (works[currentWorkIndex]?.images as string)
              }
              alt={works[currentWorkIndex]?.title || "work"}
              fill
              className="object-contain"
            />
          </div>

          {/* Navigation arrows */}
          <button
            onClick={handlePrev}
            className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 rounded-full p-3 z-50"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 rounded-full p-3 z-50"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Caption */}
          <div className="absolute bottom-6 text-center px-4">
            <h3 className="text-lg font-semibold">{works[currentWorkIndex]?.title}</h3>
            <p className="text-sm text-gray-300">{works[currentWorkIndex]?.description}</p>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}