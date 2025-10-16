import * as Classic from "./classic";

export type TemplateId = "classic";

export const themeRegistry: Record<TemplateId, any> = {
    "classic": Classic
};