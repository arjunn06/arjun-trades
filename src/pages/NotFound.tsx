import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TextLink from "@/components/TextLink";
import { Button } from "@/components/ui/button";
import { BLUEPRINT_URL } from "@/lib/links";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <Header />
      <main id="main" className="shell flex-grow py-16 sm:py-24">
        <p className="type-display text-[clamp(7rem,28vw,22rem)] text-primary">404</p>
        <h1 className="type-title mt-4 text-[clamp(2rem,5vw,3.5rem)]">Page not found</h1>
        <p className="type-lead mt-5 max-w-md text-muted-foreground">
          The page you're looking for doesn't exist or has moved.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
          <Button asChild size="lg">
            <Link to="/">Back to home</Link>
          </Button>
          <TextLink to="/blogs">Read the blog</TextLink>
          <TextLink href={BLUEPRINT_URL} sameTab>See The Blueprint</TextLink>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
