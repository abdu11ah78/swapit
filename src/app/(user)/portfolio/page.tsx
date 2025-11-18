import { themeRegistry } from "@/themes";

async function fetchTenant() {
  return {
    tenantId: "tenant123",
    name: "Ecommerce",
    templateId: "modern", 
  };
}

export default async function PortfolioPage() {
  const tenant = await fetchTenant();
  const theme = themeRegistry[tenant.templateId as keyof typeof themeRegistry];

  return (
    <div>
     <section id="hero">
    <theme.Portfolio.HeroSection />
  </section>

  <section id="services">
    <theme.Portfolio.ServiceSection/>
  </section>

  <section id="gallery">
    <theme.Portfolio.OurGallery />
  </section>


    </div>
  );
}