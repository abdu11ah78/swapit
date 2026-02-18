import { themeRegistry } from "@/themes";

async function fetchTenant() {
    return {
        tenantId: "tenant123",
        name: "SwapIt",
        templateId: "modern",
    };
}

export default async function ConfirmTradePage() {
    const tenant = await fetchTenant();
    const theme = themeRegistry[tenant.templateId as keyof typeof themeRegistry];

    return (
        <div>
            <theme.ConfirmTrade.CheckoutPage />
        </div>
    );
}
