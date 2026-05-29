import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const About = () => (
  <div className="min-h-screen flex flex-col bg-background">
    <Navbar />
    <div className="flex-1 pt-24 pb-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-display text-2xl md:text-4xl font-black tracking-wider mb-3">
            <span className="text-primary text-glow-gold">MORE INFO</span>{" "}
            <span className="text-foreground">ABOUT US</span>
          </h1>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto">
            Learn more about the Social Welfare Skeptrons chapter of Alpha Kappa Rho, Region VII.
          </p>
        </motion.div>

        {/* About SWS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass cyber-border rounded-lg p-6 md:p-10 mb-8"
        >
          <h2 className="font-heading text-lg font-bold text-primary text-glow-gold mb-5 uppercase tracking-wider text-center">
            Social Welfare Skeptrons (SWS)
          </h2>
          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p>
              The <span className="text-foreground font-semibold">Social Welfare Skeptrons</span> is a proud chapter of{" "}
              <span className="text-primary font-bold">Alpha Kappa Rho</span> — one of the Philippines' most respected International Humanitarian Service Fraternities. The SWS chapter was established in <span className="text-primary font-bold">2021</span>, bringing together a new generation of brothers committed to upholding the values, traditions, and brotherhood of AKRho in <span className="text-foreground font-semibold">Region VII</span>.
            </p>
            <p>
              Under the banner of <span className="text-primary font-bold">"Truth Conquers All"</span>, SWS brothers are united in their dedication to brotherhood, community service, and personal integrity — carrying on the legacy of the 16 Founding Fathers who established Alpha Kappa Rho on August 8, 1973.
            </p>
            <p>
              Whether in times of celebration or challenge, the bond between SWS brothers remains unbreakable. The chapter continues to grow, welcoming new brothers who share the same passion for service and brotherhood.
            </p>
          </div>
        </motion.div>

        {/* Chapter Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {[
            {
              title: "Our Mission",
              icon: "🎯",
              content: "To foster brotherhood, promote humanitarian service, and uphold the values of truth and integrity as inspired by the founding principles of Alpha Kappa Rho.",
            },
            {
              title: "Our Vision",
              icon: "🌟",
              content: "A chapter where every brother grows as a leader, a servant, and a beacon of truth — contributing positively to their community, their nation, and their fraternity.",
            },
            {
              title: "Core Values",
              icon: "⚖️",
              content: "Truth • Brotherhood • Service • Integrity • Loyalty • Unity — the pillars upon which every SWS Skeptron stands.",
            },
            {
              title: "Contact Us",
              icon: "📩",
              content: "Connect with the Social Welfare Skeptrons through our official Facebook page. For membership inquiries or verifications, reach out to the chapter officers directly.",
            },
          ].map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="glass cyber-border rounded-lg p-5"
            >
              <div className="text-3xl mb-3">{card.icon}</div>
              <h3 className="font-heading text-sm font-bold text-primary mb-2 uppercase tracking-wider">{card.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{card.content}</p>
            </motion.div>
          ))}
        </div>

        {/* Photos */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {["/sws-activity-4.jpg", "/sws-activity-5.jpg"].map((src, i) => (
            <div key={i} className="rounded-xl overflow-hidden border border-primary/20 shadow-[0_0_20px_rgba(255,215,0,0.1)]">
              <img src={src} alt={`SWS Activity ${i + 1}`} className="w-full h-56 object-cover object-center hover:scale-105 transition-transform duration-700" />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
    <Footer />
  </div>
);

export default About;
