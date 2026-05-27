import Header from "@/components/Header";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Contact = () => {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      toast({ title: "Please fill in all fields", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("contact_submissions").insert({
      name: formData.name.trim(),
      email: formData.email.trim(),
      subject: formData.subject.trim(),
      message: formData.message.trim(),
    });

    if (error) {
      toast({ title: "Failed to send message", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Message sent!", description: "I'll get back to you soon." });
      setFormData({ email: "", name: "", subject: "", message: "" });
    }
    setSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-grow">
        <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
          <h1 className="font-display text-4xl md:text-6xl font-semibold leading-tight mb-6">
            Get in Touch
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-12">
            Have a project in mind? Let's create something beautiful together.
          </p>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="mb-20">
            <div className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  Your Email Address
                </label>
                <input
                  type="email" id="email" name="email" value={formData.email} onChange={handleChange} required
                  className="w-full px-4 py-3 text-base border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                  Your Name
                </label>
                <input
                  type="text" id="name" name="name" value={formData.name} onChange={handleChange} required
                  className="w-full px-4 py-3 text-base border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                  Subject
                </label>
                <input
                  type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} required
                  className="w-full px-4 py-3 text-base border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                  Your Message
                </label>
                <textarea
                  id="message" name="message" value={formData.message} onChange={handleChange} required rows={8}
                  className="w-full px-4 py-3 text-base border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-y"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit" disabled={submitting}
                  className="px-8 py-3 text-sm font-medium bg-primary text-primary-foreground hover:brightness-110 transition-all rounded-lg disabled:opacity-50"
                >
                  {submitting ? "Sending..." : "Send Message"}
                </button>
              </div>
            </div>
          </form>
    </div>  {/* Close the max-w-3xl div */}
    </main>   {/* Close the main element */}


      <footer className="border-t border-border">
        <div className="max-w-3xl mx-auto px-6 py-8 text-center text-sm text-muted-foreground">
          <p>© 2026 All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Contact;
