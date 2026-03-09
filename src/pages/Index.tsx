import { motion } from "framer-motion";
import { ArrowRight, Youtube, Users, BookOpen, Mail, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import NewsletterSheet from "@/components/NewsletterSheet";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden px-6">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-secondary/5 blur-[120px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0}
            className="mb-6"
          >
            <span className="inline-block px-4 py-1.5 rounded-full border border-primary/30 text-primary text-sm font-medium tracking-wide uppercase">
              Trading Community
            </span>
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
            className="font-display font-bold text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight mb-8"
          >
            <span className="text-foreground">Arjun</span>{" "}
            <span className="neon-text text-primary">Trades</span>
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2}
            className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Master the markets with precision. Join a community of disciplined traders
            learning ICT concepts, smart money, and institutional order flow.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={3}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a
              href="https://discord.gg/SCHeKKCa6c"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:brightness-110 transition-all duration-300 text-base"
            >
              <Users className="w-5 h-5" />
              Join the Community
            </a>
            <a
              href="https://youtube.com/@arjun_ifvg"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-border text-foreground font-semibold rounded-lg hover:bg-muted transition-all duration-300 text-base"
            >
              <Youtube className="w-5 h-5" />
              Watch on YouTube
            </a>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid md:grid-cols-3 gap-6"
          >
            {[
              {
                icon: <Youtube className="w-7 h-7" />,
                title: "YouTube Content",
                desc: "Free trading education — breakdowns, recaps, and ICT concepts explained clearly.",
                link: "https://youtube.com/@arjun_ifvg",
                linkText: "Watch Now",
                external: true,
              },
              {
                icon: <BookOpen className="w-7 h-7" />,
                title: "1-on-1 Mentorship",
                desc: "Personalised guidance to accelerate your trading journey. Limited spots available.",
                link: "/mentorship",
                linkText: "Coming Soon",
                external: false,
              },
              {
                icon: <Users className="w-7 h-7" />,
                title: "Discord Community",
                desc: "Connect with like-minded traders. Daily analysis, alerts, and live discussion.",
                link: "https://discord.gg/SCHeKKCa6c",
                linkText: "Join Discord",
                external: true,
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                custom={i}
                className="group relative p-8 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-500"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                  {item.icon}
                </div>
                <h3 className="font-display font-semibold text-xl text-foreground mb-3">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  {item.desc}
                </p>
                {item.external ? (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-primary text-sm font-medium group-hover:gap-3 transition-all duration-300"
                  >
                    {item.linkText}
                    <ArrowRight className="w-4 h-4" />
                  </a>
                ) : (
                  <Link
                    to={item.link}
                    className="inline-flex items-center gap-1.5 text-muted-foreground text-sm font-medium"
                  >
                    {item.linkText}
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* YouTube Embed Section */}
      <section className="py-24 px-6 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.h2
              variants={fadeUp}
              custom={0}
              className="font-display font-bold text-3xl md:text-5xl text-foreground mb-4 text-center"
            >
              Latest from YouTube
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={1}
              className="text-muted-foreground text-center mb-12 max-w-xl mx-auto"
            >
              Free trading education — new videos every week.
            </motion.p>
            <motion.div
              variants={fadeUp}
              custom={2}
              className="aspect-video rounded-2xl overflow-hidden border border-border bg-card"
            >
              <iframe
                src="https://www.youtube.com/embed?listType=user_uploads&list=arjun_ifvg"
                title="Arjun Trades YouTube"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </motion.div>
            <motion.div variants={fadeUp} custom={3} className="text-center mt-8">
              <a
                href="https://youtube.com/@arjun_ifvg"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all duration-300"
              >
                View all videos on YouTube
                <ArrowRight className="w-4 h-4" />
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 px-6 border-t border-border">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.div variants={fadeUp} custom={0}>
              <Mail className="w-10 h-10 text-primary mx-auto mb-6" />
            </motion.div>
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="font-display font-bold text-3xl md:text-5xl text-foreground mb-4"
            >
              Stay in the Loop
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={2}
              className="text-muted-foreground mb-8 max-w-lg mx-auto"
            >
              Get weekly trade recaps, market insights, and exclusive content delivered to your inbox.
            </motion.p>
            <motion.div variants={fadeUp} custom={3}>
              <NewsletterSheet>
                <button className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:brightness-110 transition-all duration-300 text-base">
                  Subscribe to Newsletter
                  <ArrowRight className="w-4 h-4" />
                </button>
              </NewsletterSheet>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="font-display font-bold text-lg text-foreground">Arjun Trades</p>
          <div className="flex items-center gap-6">
            <a
              href="https://youtube.com/@arjun_ifvg"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              YouTube
            </a>
            <a
              href="https://discord.gg/SCHeKKCa6c"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              Discord
            </a>
            <Link to="/mentorship" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
              Mentorship
            </Link>
            <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
              Contact
            </Link>
          </div>
          <p className="text-muted-foreground text-sm">© 2025 Arjun Trades</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
