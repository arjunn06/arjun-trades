import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";
import Workshop from "./pages/Mentorship";
import Contact from "./pages/Contact";
import Blogs from "./pages/Blogs";
import BlogPost from "./pages/BlogPost";
import AdminLogin from "./pages/AdminLogin";
import AdminBlogs from "./pages/AdminBlogs";
import AdminBlogEditor from "./pages/AdminBlogEditor";
import AdminBlogMetrics from "./pages/AdminBlogMetrics";
import AdminContacts from "./pages/AdminContacts";
import AdminFeedback from "./pages/AdminFeedback";
import RedPill from "./pages/RedPill";
import AdminBookings from "./pages/AdminBookings";
import AdminWorkshopInterest from "./pages/AdminWorkshopInterest";
import RedPillInfo from "./pages/RedPillInfo";
import AdminRedPillInfo from "./pages/AdminRedPillInfo";
import ResetPassword from "./pages/ResetPassword";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Blueprint from "./pages/Blueprint";
import RedPillReview from "./pages/RedPillReview";
import BrandGuidelines from "./pages/BrandGuidelines";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/workshop" element={<Workshop />} />
          <Route path="/free-workshop" element={<Workshop />} />
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
          <Route path="/brand" element={<BrandGuidelines />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
