import * as Modern from "./modern";

export type TemplateId = "modern";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const themeRegistry: Record<TemplateId, any> = {
    modern: Modern,
};

