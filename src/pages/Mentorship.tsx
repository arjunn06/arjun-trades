import { motion } from "framer-motion";
import { BookOpen, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";

const Mentorship = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="min-h-[80vh] flex items-center justify-center px-6">
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] rounded-full bg-secondary/5 blur-[120px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-xl mx-auto text-center relative z-10"
        >
          <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-8">
            <BookOpen className="w-8 h-8" />
          </div>

          <h1 className="font-display font-bold text-4xl md:text-6xl text-foreground mb-6">
            Mentorship
          </h1>

          <div className="inline-block px-4 py-1.5 rounded-full border border-accent/30 text-accent text-sm font-medium tracking-wide uppercase mb-8">
            Coming Soon
          </div>

          <p className="text-muted-foreground text-lg leading-relaxed mb-12">
            Personalised 1-on-1 mentorship to fast-track your trading.
            Spots will be limited — join the Discord to be the first to know when booking opens.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://discord.gg/SCHeKKCa6c"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:brightness-110 transition-all duration-300"
            >
              Join Discord for Updates
            </a>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-border text-foreground font-semibold rounded-lg hover:bg-muted transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4" />
              Back Home
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Mentorship;
