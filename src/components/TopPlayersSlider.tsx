import { motion } from "framer-motion";
import { Crown, Shield, Star, Users } from "lucide-react";
import { Link } from "react-router-dom";

const officers = [
  { rank: 1, title: "Grand Skeptron", name: "Chapter President", badge: "GS", icon: Crown },
  { rank: 2, title: "Vice Skeptron", name: "Chapter VP", badge: "VS", icon: Star },
  { rank: 3, title: "Secretary", name: "Chapter Secretary", badge: "SC", icon: Shield },
  { rank: 4, title: "Treasurer", name: "Chapter Treasurer", badge: "TR", icon: Shield },
  { rank: 5, title: "PRO", name: "Public Relations Officer", badge: "PR", icon: Users },
];

const ChapterOfficers = () => {
  return (
    <motion.div
      className="scroll-panel rounded-lg p-4 ornate-border"
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-heading text-xs font-bold uppercase tracking-[0.15em] text-primary text-glow-gold">
          ⚔ Chapter Officers
        </h3>
        <Link to="/members" className="text-[10px] font-heading text-primary/60 hover:text-primary transition-colors">
          See all
        </Link>
      </div>

      <div className="space-y-0">
        {officers.map((officer, i) => {
          const Icon = officer.icon;
          return (
            <div
              key={officer.rank}
              className={`flex items-center gap-3 py-2 px-2 -mx-2 rounded transition-colors duration-200 hover:bg-primary/5 ${
                i < officers.length - 1 ? "border-b border-border/20" : ""
              }`}
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                i === 0 ? "bg-primary/20 text-primary" :
                i === 1 ? "bg-foreground/10 text-foreground/50" :
                i === 2 ? "bg-amber-800/20 text-amber-600" :
                "bg-border/50 text-muted-foreground"
              }`}>
                {officer.badge}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-heading text-xs font-bold text-foreground truncate">{officer.title}</p>
                <p className="text-[10px] text-primary/70">{officer.name}</p>
              </div>
              <Icon size={12} className="text-primary/40 flex-shrink-0" />
            </div>
          );
        })}
      </div>

      <div className="flex gap-2 mt-3 pt-2 border-t border-border/20">
        <Link to="/members" className="flex-1 text-center py-1.5 text-[10px] font-heading font-bold uppercase tracking-wider text-primary/70 hover:text-primary scroll-panel rounded-sm transition-colors">
          Member List
        </Link>
        <Link to="/member-verifier" className="flex-1 text-center py-1.5 text-[10px] font-heading font-bold uppercase tracking-wider text-primary/70 hover:text-primary scroll-panel rounded-sm transition-colors">
          Verify Member
        </Link>
      </div>
    </motion.div>
  );
};

export default ChapterOfficers;
