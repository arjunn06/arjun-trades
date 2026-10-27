import { serveTestimonials } from "./_lib/testimonials";
import type { PagesContext } from "./_lib/record";

/** The testimonials page ("/testimonials"). */
export const onRequest = (ctx: PagesContext) => serveTestimonials(ctx);
