"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react"

type FooterData = {
  email?: string
  phone?: string
  address?: string
  socials?: {
    facebook?: string
    twitter?: string
    instagram?: string
  }
}

const DefaultFooter : FooterData = {
  "email": "support@instabizshop.com",
  "phone": "+1 (555) 123-4567",
  "address": "123 Market Street, San Francisco, CA",
  "socials": {
    "facebook": "https://facebook.com/instabizshop",
    "twitter": "https://twitter.com/instabizshop",
    "instagram": "https://instagram.com/instabizshop"
  }
}

export function Footer() {
  const [footerData, setFooterData] = useState<FooterData | null>(DefaultFooter)

  useEffect(() => {
    fetch("/api/settings/footer")
      .then((res) => res.json())
      .then((data) => setFooterData(data))
      .catch(() => setFooterData(DefaultFooter))
  }, [])

  return (
    <footer className="bg-gray-100 border-t">
      <div className="container mx-auto px-8 py-18 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand / About */}
        <div>
          <h3 className="text-2xl font-extrabold tracking-wide text-black mb-4">
            InstaBizShop
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            Empowering small businesses to sell online and offline with ease.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold text-black mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about" className="text-gray-600 hover:text-black">About Us</Link></li>
            <li><Link href="/shop" className="text-gray-600 hover:text-black">Shop</Link></li>
            <li><Link href="/categories" className="text-gray-600 hover:text-black">Categories</Link></li>
            <li><Link href="/contact" className="text-gray-600 hover:text-black">Contact</Link></li>
          </ul>
        </div>

        {/* Customer Support */}
        <div>
          <h4 className="text-lg font-semibold text-black mb-3">Customer Support</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/faq" className="text-gray-600 hover:text-black">FAQs</Link></li>
            <li><Link href="/returns" className="text-gray-600 hover:text-black">Returns & Refunds</Link></li>
            <li><Link href="/shipping" className="text-gray-600 hover:text-black">Shipping Info</Link></li>
            <li><Link href="/terms" className="text-gray-600 hover:text-black">Terms & Conditions</Link></li>
          </ul>
        </div>

        {/* Contact / Social */}
        <div>
          <h4 className="text-lg font-semibold text-black mb-3">Get in Touch</h4>
          {footerData?.address && (
            <p className="text-sm text-gray-600 flex items-center gap-2 mb-2">
              <MapPin className="h-4 w-4" /> {footerData.address}
            </p>
          )}
          {footerData?.email && (
            <p className="text-sm text-gray-600 flex items-center gap-2 mb-2">
              <Mail className="h-4 w-4" /> {footerData.email}
            </p>
          )}
          {footerData?.phone && (
            <p className="text-sm text-gray-600 flex items-center gap-2 mb-4">
              <Phone className="h-4 w-4" /> {footerData.phone}
            </p>
          )}
          <div className="flex gap-4">
            {footerData?.socials?.facebook && (
              <Link href={footerData.socials.facebook} className="text-gray-600 hover:text-black">
                <Facebook className="h-5 w-5" />
              </Link>
            )}
            {footerData?.socials?.twitter && (
              <Link href={footerData.socials.twitter} className="text-gray-600 hover:text-black">
                <Twitter className="h-5 w-5" />
              </Link>
            )}
            {footerData?.socials?.instagram && (
              <Link href={footerData.socials.instagram} className="text-gray-600 hover:text-black">
                <Instagram className="h-5 w-5" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t bg-white">
        <div className="container mx-auto px-8 py-4 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
          <p>© {new Date().getFullYear()} InstaBizShop. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Built for small businesses ❤️</p>
        </div>
      </div>
    </footer>
  )
}