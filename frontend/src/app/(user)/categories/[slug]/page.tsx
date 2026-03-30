// app/categories/[slug]/page.tsx
import { themeRegistry } from "@/themes"

type Props = {
  params: { slug: string } | Promise<{ slug: string }>
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params

  const tenant = {
    tenantId: "tenant123",
    name: "Ecommerce",
    templateId: "modern",
  }

  const theme = themeRegistry[tenant.templateId as keyof typeof themeRegistry]

  return (
    <div>
      <section id="CategoryPage">
      <theme.Shop.CategoryPage slug={slug} />
    </section></div>
  )
}