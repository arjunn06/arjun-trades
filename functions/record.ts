import { servePage } from "./_lib/page";
import type { PagesContext } from "./_lib/record";

/** The /record page. The app is a single-page app, so index.html is served and rewritten with the record. */
export const onRequest = (ctx: PagesContext) => servePage(ctx, "record");
