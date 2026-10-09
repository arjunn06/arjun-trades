import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { PaperPlaneTilt } from "@phosphor-icons/react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TextLink from "@/components/TextLink";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const ease = [0.16, 1, 0.3, 1] as const;

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
      toast({ title: "Message sent", description: "I'll get back to you soon." });
      setFormData({ email: "", name: "", subject: "", message: "" });
    }
    setSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <Helmet>
        <title>Contact Arjun IFVG — Get in Touch</title>
        <meta
          name="description"
          content="Reach out to Arjun IFVG for questions about the workshop, The Red Pill mentorship, or anything trading related."
        />
        <link rel="canonical" href="https://ifvg.in/contact" />
        <meta property="og:title" content="Contact Arjun IFVG" />
        <meta property="og:description" content="Get in touch with Arjun IFVG." />
        <meta property="og:url" content="https://ifvg.in/contact" />
        <meta property="og:type" content="website" />
      </Helmet>
      <Header />

      <main id="main" className="flex-grow">
        <div className="shell grid gap-14 pb-8 pt-10 sm:pt-16 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease }}
              className="type-display text-[clamp(3.5rem,10vw,7.5rem)]"
            >
              Get in touch
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease }}
            >
              <p className="type-lead mt-8 max-w-sm text-muted-foreground">
                Questions about the workshop, The Red Pill mentorship, or anything trading related.
              </p>
              <div className="mt-10 flex flex-col items-start gap-3">
                <TextLink href="https://discord.gg/SCHeKKCa6c">Message on Discord</TextLink>
                <TextLink href="https://www.instagram.com/arjun_ifvg">Instagram @arjun_ifvg</TextLink>
              </div>
            </motion.div>
          </div>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease }}
            className="space-y-6 lg:col-span-7"
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="field-label">
                  Your name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  autoComplete="name"
                  className="field"
                />
              </div>
              <div>
                <label htmlFor="email" className="field-label">
                  Your email address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  className="field"
                />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="field-label">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="field"
              />
            </div>

            <div>
              <label htmlFor="message" className="field-label">
                Your message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={8}
                className="field resize-y"
              />
            </div>

            <Button type="submit" size="lg" disabled={submitting}>
              <PaperPlaneTilt weight="bold" />
              {submitting ? "Sending..." : "Send message"}
            </Button>
          </motion.form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
