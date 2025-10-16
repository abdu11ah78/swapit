import { themeRegistry } from "@/themes";

async function fetchTenant() {
  return {
    tenantId: "tenant123",
    name: "Ecommerce",
    templateId: "classic", 
  };
}

export default async function PortfolioPage() {
  const tenant = await fetchTenant();
  const theme = themeRegistry[tenant.templateId as keyof typeof themeRegistry];

  return (
    <div>
      <theme.Portfolio.PortfolioHero />
      <theme.Portfolio.ServicesSection />
      <theme.Portfolio.ShowcaseSection />
    </div>
  );
}