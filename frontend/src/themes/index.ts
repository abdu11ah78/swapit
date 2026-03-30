import * as Classic from "./classic";
import * as Modern from "./modern";
import * as Pro from "./pro"; // <-- import your Pro theme

export type TemplateId = "classic" | "modern" | "pro";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const themeRegistry: Record<TemplateId, any> = {
    classic: Classic,
    modern: Modern,
    pro: Pro, // <-- add Pro here
};
