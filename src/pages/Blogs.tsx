import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { ArrowRight } from "@phosphor-icons/react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import TextLink from "@/components/TextLink";

interface Blog {
  id: string;
  title: string;
  content: string;
  cover_image_url: string | null;
  created_at: string;
}

const ease = [0.16, 1, 0.3, 1] as const;

const excerpt = (html: string, n: number) => `${html.replace(/<[^>]*>/g, "").substring(0, n).trim()}...`;
const fmt = (d: string) =>
  new Date(d).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

const Blogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      const { data } = await supabase
        .from("blogs")
        .select("id, title, content, cover_image_url, created_at")
        .eq("published", true)
        .order("created_at", { ascending: false });

      setBlogs(data || []);
      setLoading(false);
    };
    fetchBlogs();
  }, []);

  const [featured, ...rest] = blogs;

  return (
    <div className="min-h-[100dvh]">
      <Helmet>
        <title>Trading Blog — Arjun IFVG</title>
        <meta
          name="description"
          content="Trading insights, ICT and SMC breakdowns, and lessons from the iFVG strategy by Arjun IFVG."
        />
        <link rel="canonical" href="https://ifvg.in/blogs" />
        <meta property="og:title" content="Trading Blog — Arjun IFVG" />
        <meta property="og:description" content="ICT, SMC and iFVG insights from Arjun IFVG." />
        <meta property="og:url" content="https://ifvg.in/blogs" />
        <meta property="og:type" content="website" />
      </Helmet>
      <Header />
      <main id="main">
        <section className="shell pb-6 pt-10 sm:pt-16">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease }}
            className="type-display text-[clamp(4rem,14vw,11.5rem)]"
          >
            Blog
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease }}
            className="type-lead mt-6 max-w-xl text-muted-foreground"
          >
            Trading insights, market analysis, and lessons from the journey.
          </motion.p>
        </section>

        <section className="shell py-12 sm:py-16">
          {loading ? (
            <div aria-busy="true" aria-label="Loading posts">
              <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
                <div className="aspect-[16/10] animate-pulse bg-muted lg:col-span-7" />
                <div className="space-y-4 self-end lg:col-span-5">
                  <div className="h-4 w-32 animate-pulse bg-muted" />
                  <div className="h-12 w-full animate-pulse bg-muted" />
                  <div className="h-12 w-2/3 animate-pulse bg-muted" />
                  <div className="h-20 w-full animate-pulse bg-muted" />
                </div>
              </div>
              <div className="mt-16 space-y-0 border-t border-foreground">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-32 animate-pulse border-b border-border bg-muted/40" />
                ))}
              </div>
            </div>
          ) : blogs.length === 0 ? (
            <div className="border-t border-foreground pt-10">
              <p className="type-title text-[clamp(2rem,4vw,3.25rem)]">No posts yet.</p>
              <p className="mt-4 max-w-md text-[1.0625rem] text-muted-foreground">
                New breakdowns land here first. In the meantime, the YouTube channel has everything published so far.
              </p>
              <div className="mt-8">
                <TextLink href="https://youtube.com/@arjun_ifvg">Watch on YouTube</TextLink>
              </div>
            </div>
          ) : (
            <>
              {/* Featured post */}
              <Reveal>
                <Link to={`/blog/${featured.id}`} className="group grid items-end gap-8 lg:grid-cols-12 lg:gap-12">
                  {featured.cover_image_url && (
                    <div className="aspect-[16/10] overflow-hidden bg-muted lg:col-span-7">
                      <img
                        src={featured.cover_image_url}
                        alt={featured.title}
                        className="h-full w-full object-cover transition-transform duration-1000 ease-out-expo group-hover:scale-[1.03]"
                      />
                    </div>
                  )}
                  <div className={featured.cover_image_url ? "lg:col-span-5" : "lg:col-span-10"}>
                    <p className="type-label text-muted-foreground">{fmt(featured.created_at)}</p>
                    <h2
                      className={`type-title mt-4 group-hover:text-primary ${
                        featured.cover_image_url
                          ? "text-[clamp(2rem,4vw,3.5rem)]"
                          : "text-[clamp(2.75rem,8vw,6.5rem)]"
                      }`}
                    >
                      {featured.title}
                    </h2>
                    <p
                      className={`mt-5 line-clamp-4 text-muted-foreground ${
                        featured.cover_image_url ? "max-w-md text-[1.0625rem]" : "max-w-2xl type-lead"
                      }`}
                    >
                      {excerpt(featured.content, 220)}
                    </p>
                    <span className="mt-6 inline-flex items-center gap-2 font-semibold">
                      Read post
                      <ArrowRight
                        className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                        weight="bold"
                      />
                    </span>
                  </div>
                </Link>
              </Reveal>

              {/* The rest */}
              {rest.length > 0 && (
                <ul className="mt-20 border-b border-foreground sm:mt-28">
                  {rest.map((blog, i) => (
                    <li key={blog.id}>
                      <Reveal delay={(i % 4) * 0.04}>
                        <Link
                          to={`/blog/${blog.id}`}
                          className="group grid gap-5 border-t border-foreground py-8 transition-colors duration-300 hover:bg-foreground hover:text-background md:grid-cols-12 md:items-center md:gap-8"
                        >
                          <p className="type-label text-muted-foreground group-hover:text-background/70 md:col-span-2">
                            {fmt(blog.created_at)}
                          </p>
                          <div className="transition-transform duration-500 ease-out-expo group-hover:translate-x-3 md:col-span-7">
                            <h3 className="type-heading text-2xl sm:text-3xl">{blog.title}</h3>
                            <p className="mt-3 line-clamp-2 max-w-xl text-muted-foreground group-hover:text-background/75">
                              {excerpt(blog.content, 150)}
                            </p>
                          </div>
                          {blog.cover_image_url ? (
                            <div className="aspect-[16/10] overflow-hidden bg-muted md:col-span-3">
                              <img
                                src={blog.cover_image_url}
                                alt=""
                                loading="lazy"
                                className="h-full w-full object-cover"
                              />
                            </div>
                          ) : (
                            <span className="hidden items-center justify-end gap-2 font-semibold md:col-span-3 md:flex">
                              Read post
                              <ArrowRight className="h-4 w-4" weight="bold" />
                            </span>
                          )}
                        </Link>
                      </Reveal>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Blogs;
