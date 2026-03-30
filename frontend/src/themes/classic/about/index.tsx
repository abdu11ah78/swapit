"use client"

import { AboutPageData } from "../../../data/classic/user/types/types"
import Image from "next/image"

export function About() {
  const aboutData: AboutPageData = {
    heroImageUrl:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
    sections: [
      {
        id: "who-we-are",
        title: "Who We Are",
        content:
          "InstaBizShop is a customer-first platform built to provide seamless digital solutions, premium services, and innovative designs.",
      },
      {
        id: "our-mission",
        title: "Our Mission",
        content:
          "Our mission is to empower businesses and individuals with tools, services, and designs that inspire growth and success.",
      },
      {
        id: "why-choose-us",
        title: "Why Choose Us?",
        content: "We are committed to providing excellence.",
        listItems: [
          "Experienced team of professionals",
          "Customer-first approach",
          "High-quality and innovative solutions",
          "Proven track record of success",
        ],
      },
    ],
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <div className="relative w-full h-[60vh]">
        <Image
          src={aboutData.heroImageUrl}
          alt="About Us"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <h1 className="text-5xl font-bold text-white drop-shadow-lg">
            About Us
          </h1>
        </div>
      </div>

      {/* Content Sections */}
      <div className="container mx-auto px-6 py-16 space-y-12">
        {aboutData.sections.map((section) => (
          <div key={section.id} className="space-y-4">
            <h2 className="text-3xl font-semibold text-gray-900">
              {section.title}
            </h2>
            <p className="text-gray-700">{section.content}</p>
            {section.listItems && (
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                {section.listItems.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}