import { themeRegistry } from "@/themes";

async function fetchTenant() {
  return {
    tenantId: "tenant123",
    name: "Ecommerce",
    templateId: "modern", 
  };
}

export default async function HomePage() {
  const tenant = await fetchTenant();
  const theme = themeRegistry[tenant.templateId as keyof typeof themeRegistry];

  return (
    <div>
      <theme.Product.ProductDetailPage />
    </div>
  );
}