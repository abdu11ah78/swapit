import { themeRegistry } from "@/themes";

async function fetchTenant() {
  return {
    tenantId: "tenant123",
    name: "Ecommerce",
    templateId: "modern", 
  };
}

export default async function CartPage() {
  const tenant = await fetchTenant();
  const theme = themeRegistry[tenant.templateId as keyof typeof themeRegistry];

  return (
    <div>
      <theme.Cart.CartPage />
    </div>
  );
}