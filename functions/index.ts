import { serveHome } from "./_lib/page";
import type { PagesContext } from "./_lib/record";

/** The home page ("/"). */
export const onRequest = (ctx: PagesContext) => serveHome(ctx);
