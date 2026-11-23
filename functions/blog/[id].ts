import { serveBlogPost } from "../_lib/blog";
import type { PagesContext } from "../_lib/record";

/** A single blog post ("/blog/:id"). */
export const onRequest = (ctx: PagesContext & { params: Record<string, string | string[]> }) => {
  const id = ctx.params.id;
  return serveBlogPost(ctx, typeof id === "string" ? id : "");
};
