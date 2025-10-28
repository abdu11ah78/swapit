import { themeRegistry } from "@/themes"


async function fetchTenant() {
  return {
    tenantId: "tenant123",
    name: "Ecommerce",
    templateId: "modern",
  }
}

export default async function BlogPage() {
  const tenant = await fetchTenant()
  const theme = themeRegistry[tenant.templateId as keyof typeof themeRegistry]

  return (
    <div className="pt-10 ">
    <section id="blogPage">
    <theme.Blog.BlogPageClient />
    </section>
     <section id="contact">
    <theme.Blog.NewsletterSignup />
    </section>
    </div>
  )
}