import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const newsItems = [
  {
    title: "AKRho Celebrates 52 Years of Brotherhood",
    date: "Aug 8, 2025",
    excerpt: "Alpha Kappa Rho marks another milestone as the fraternity celebrates 52 years since its historic founding on August 8, 1973 at the University of Santo Tomas College of Commerce in Manila, Philippines. Chapters nationwide gather in solidarity.",
    tag: "Anniversary",
  },
  {
    title: "SWS Skeptrons Chapter Gathering – Region VII",
    date: "May 2026",
    excerpt: "The Social Welfare Skeptrons chapter held a successful brotherhood gathering in Region VII, strengthening bonds among members and reaffirming their commitment to the values of Alpha Kappa Rho.",
    tag: "Chapter News",
  },
  {
    title: "AKRho: A Humanitarian Fraternity",
    date: "2024",
    excerpt: "Alpha Kappa Rho is registered with the Philippine Securities and Exchange Commission as a non-profit, non-dividend International Humanitarian Service Fraternity and Sorority. It continues to promote brotherhood and community service throughout the Philippines.",
    tag: "Info",
  },
  {
    title: "AKRho Mergers and Expansion: 1976 Onward",
    date: "Historical",
    excerpt: "In September 1976, Alpha Kappa Rho merged with Omega Fraternity & Sorority International (OFSI) of San Sebastian College and Zeta Upsilon Fraternity of UE, marking a pivotal expansion in the organization's history.",
    tag: "History",
  },
  {
    title: "SWS Chapter Established in 2021",
    date: "2021",
    excerpt: "The Social Welfare Skeptrons (SWS) chapter was proudly established in 2021, bringing together a new generation of AKRho brothers committed to upholding the traditions and ideals of the fraternity in Region VII.",
    tag: "Chapter News",
  },
  {
    title: "Junior AKRho: Expanding the Brotherhood",
    date: "Historical",
    excerpt: "Alpha Kappa Rho expanded its reach through a Junior AKRho division, accepting high school students starting in 1975, beginning at the University of the East (UE), nurturing future brothers from their formative years.",
    tag: "History",
  },
];

const tagColors: Record<string, string> = {
  Anniversary: "bg-primary/20 text-primary",
  "Chapter News": "bg-blue-500/20 text-blue-400",
  Info: "bg-accent/20 text-accent",
  History: "bg-emerald-500/20 text-emerald-400",
};

const News = () => (
  <div className="min-h-screen flex flex-col bg-background">
    <Navbar />
    <div className="flex-1 pt-24 pb-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-2xl md:text-4xl font-bold text-center mb-3 tracking-wider"
        >
          <span className="text-primary text-glow-cyan">NEWS</span>{" "}
          <span className="text-foreground">& UPDATES</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center text-muted-foreground text-sm mb-10"
        >
          Latest announcements, chapter news, and AKRho updates
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {newsItems.map((news, i) => (
            <motion.article
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass cyber-border rounded-lg p-5 hover:bg-primary/5 transition-colors duration-200 cursor-pointer group"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${tagColors[news.tag] || "bg-primary/10 text-primary"}`}>
                  {news.tag}
                </span>
                <span className="text-[10px] font-mono text-muted-foreground">{news.date}</span>
              </div>
              <h2 className="font-display text-sm md:text-base font-bold mb-2 group-hover:text-primary transition-colors">
                {news.title}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{news.excerpt}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

export default News;
