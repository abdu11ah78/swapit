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
  <section id="hero">
    <theme.About.HeroSection />
  </section>

  <section id="team">
    <theme.About.TeamSection />
  </section>

  <section id="milestones">
    <theme.About.MilestonesSection />
  </section>

  <section id="faq">
    <theme.About.FaqSection />
  </section>
</div>
  );
}