import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { MotionConfig } from "framer-motion";
import { IconContext } from "@phosphor-icons/react";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";
import Workshop from "./pages/Mentorship";
import Contact from "./pages/Contact";
import Blogs from "./pages/Blogs";
import BlogPost from "./pages/BlogPost";
import RedPill from "./pages/RedPill";
import RedPillInfo from "./pages/RedPillInfo";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Blueprint from "./pages/Blueprint";
import RedPillReview from "./pages/RedPillReview";


// The Arena page carries its own QR and form code, so it ships as its own chunk.
const Arena = lazy(() => import("./pages/Arena"));

// Admin, brand and password-reset screens are rarely visited; keep them out of the main bundle.
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminBlogs = lazy(() => import("./pages/AdminBlogs"));
const AdminBlogEditor = lazy(() => import("./pages/AdminBlogEditor"));
const AdminBlogMetrics = lazy(() => import("./pages/AdminBlogMetrics"));
const AdminContacts = lazy(() => import("./pages/AdminContacts"));
const AdminFeedback = lazy(() => import("./pages/AdminFeedback"));
const AdminBookings = lazy(() => import("./pages/AdminBookings"));
const AdminWorkshopInterest = lazy(() => import("./pages/AdminWorkshopInterest"));
const AdminRedPillInfo = lazy(() => import("./pages/AdminRedPillInfo"));
const AdminArena = lazy(() => import("./pages/AdminArena"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const BrandGuidelines = lazy(() => import("./pages/BrandGuidelines"));

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
  <MotionConfig reducedMotion="user">
  <IconContext.Provider value={{ weight: "regular" }}>
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/workshop" element={<Workshop />} />
          <Route path="/free-workshop" element={<Workshop />} />
          <Route path="/arena" element={<Arena />} />
          <Route path="/blueprint" element={<Blueprint />} />
          <Route path="/red-pill" element={<RedPill />} />
          <Route path="/red-pill/reviews" element={<RedPillReview />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/blogs" element={<AdminBlogs />} />
          <Route path="/admin/blogs/new" element={<AdminBlogEditor />} />
          <Route path="/admin/blogs/edit/:id" element={<AdminBlogEditor />} />
          <Route path="/admin/blogs/metrics/:id" element={<AdminBlogMetrics />} />
          <Route path="/admin/contacts" element={<AdminContacts />} />
          <Route path="/admin/feedback" element={<AdminFeedback />} />
          <Route path="/admin/bookings" element={<AdminBookings />} />
          <Route path="/admin/workshop-interest" element={<AdminWorkshopInterest />} />
          <Route path="/red-pill/info" element={<RedPillInfo />} />
          <Route path="/admin/red-pill-info" element={<AdminRedPillInfo />} />
          <Route path="/admin/arena" element={<AdminArena />} />
          <Route path="/brand" element={<BrandGuidelines />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  </IconContext.Provider>
  </MotionConfig>
  </ThemeProvider>
);

export default App;
