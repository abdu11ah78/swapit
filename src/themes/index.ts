import * as Classic from "./classic";
import * as Modern from "./modern";
export type TemplateId = "classic" | "modern";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const themeRegistry: Record<TemplateId, any> = {
    "classic": Classic,
    "modern": Modern
};