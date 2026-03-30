"use client"

import { useState } from "react"
import { ContactFormData, ContactInfo } from "../../../data/classic/user/types/types"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Phone, MapPin } from "lucide-react"

export function Contact() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    message: "",
  })

  const [contactInfo] = useState<ContactInfo>({
    email: "support@instabizshop.com",
    phone: "+1 234 567 890",
    address: "123 Business Street, NY, USA",
    locationEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3021.8862172565726!2d-73.98513068459362!3d40.75889607932688!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x3c9d1b39e1a3ad8!2sTimes%20Square!5e0!3m2!1sen!2sus!4v1696514164711!5m2!1sen!2sus",
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Submitted:", formData)
    // TODO: send to API
  }

  return (
    <div className="container mx-auto px-6 py-20">
      {/* Title Section */}
      <div className="text-center mb-14">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
          Contact <span className="text-primary">Us</span>
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          We’d love to hear from you! Whether it’s a project inquiry, feedback, or just to say hello.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-2 gap-12 items-start">
        {/* Contact Form */}
        <Card className="shadow-xl border border-gray-200 hover:shadow-2xl transition rounded-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-900">
              Send us a Message
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                name="name"
                placeholder="Your Full Name"
                value={formData.name}
                onChange={handleChange}
                className="bg-white text-black"
                required
              />
              <Input
                name="email"
                type="email"
                placeholder="Your Email Address"
                value={formData.email}
                onChange={handleChange}
                className="bg-white text-black"
                required
              />
              <Textarea
                name="message"
                placeholder="Your Message..."
                rows={6}
                value={formData.message}
                onChange={handleChange}
                className="bg-white text-black"
                required
              />
              <Button
                type="submit"
                className="w-full bg-primary text-white font-semibold py-3 rounded-lg hover:bg-primary/90 transition"
              >
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Contact Info + Map */}
        <div className="space-y-8">
          {/* Info Card */}
          <Card className="shadow-xl border border-gray-200 rounded-2xl bg-gradient-to-br from-white to-gray-50">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-gray-900">
                Get in Touch
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-3 text-gray-700">
                <Mail className="text-primary h-5 w-5" />
                <span>{contactInfo.email}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Phone className="text-primary h-5 w-5" />
                <span>{contactInfo.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <MapPin className="text-primary h-5 w-5" />
                <span>{contactInfo.address}</span>
              </div>
            </CardContent>
          </Card>

          {/* Map */}
          <div className="overflow-hidden rounded-2xl shadow-xl border border-gray-200">
            <iframe
              src={contactInfo.locationEmbedUrl}
              width="100%"
              height="380"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              className="rounded-2xl"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  )
}