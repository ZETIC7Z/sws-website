import { motion } from "framer-motion";
import { Crown, Shield, Star, Users, UserCheck } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const members = [
  { rank: 1, name: "Grand Skeptron", role: "Chapter President", badge: "GS", status: "Active", icon: Crown },
  { rank: 2, name: "Vice Skeptron", role: "Chapter Vice President", badge: "VS", status: "Active", icon: Star },
  { rank: 3, name: "Recording Secretary", role: "Chapter Secretary", badge: "RS", status: "Active", icon: Shield },
  { rank: 4, name: "Corresponding Sec.", role: "Correspondence Officer", badge: "CS", status: "Active", icon: Shield },
  { rank: 5, name: "Treasurer", role: "Chapter Treasurer", badge: "TR", status: "Active", icon: Shield },
  { rank: 6, name: "Auditor", role: "Chapter Auditor", badge: "AU", status: "Active", icon: UserCheck },
  { rank: 7, name: "PRO", role: "Public Relations Officer", badge: "PR", status: "Active", icon: Users },
  { rank: 8, name: "Sgt. at Arms", role: "Sergeant at Arms", badge: "SA", status: "Active", icon: Shield },
  { rank: 9, name: "Chapter Member", role: "General Member", badge: "MB", status: "Active", icon: Users },
  { rank: 10, name: "Chapter Member", role: "General Member", badge: "MB", status: "Active", icon: Users },
];

const getRankColor = (rank: number) => {
  if (rank === 1) return "text-yellow-400";
  if (rank === 2) return "text-gray-300";
  if (rank === 3) return "text-amber-600";
  return "text-muted-foreground";
};

const Members = () => (
  <div className="min-h-screen flex flex-col bg-background">
    <Navbar />
    <div className="flex-1 pt-24 pb-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-2xl md:text-4xl font-bold text-center mb-3 tracking-wider"
        >
          <span className="text-primary text-glow-cyan">SWS</span>{" "}
          <span className="text-foreground">MEMBERS</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="text-center text-muted-foreground text-sm mb-10"
        >
          Social Welfare Skeptrons — Alpha Kappa Rho, Region VII Chapter • Est. 2021
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass cyber-border rounded-lg overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="px-4 py-3 text-left text-[10px] font-mono uppercase tracking-widest text-muted-foreground">#</th>
                  <th className="px-4 py-3 text-left text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Position</th>
                  <th className="px-4 py-3 text-left text-[10px] font-mono uppercase tracking-widest text-muted-foreground hidden sm:table-cell">Role</th>
                  <th className="px-4 py-3 text-center text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Badge</th>
                  <th className="px-4 py-3 text-right text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {members.map((m, i) => {
                  const Icon = m.icon;
                  return (
                    <motion.tr
                      key={m.rank + m.name + i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.05 }}
                      className="border-b border-border/30 hover:bg-primary/5 transition-colors"
                    >
                      <td className={`px-4 py-3 font-mono font-bold ${getRankColor(m.rank)}`}>#{m.rank}</td>
                      <td className="px-4 py-3 font-semibold text-foreground flex items-center gap-2">
                        <Icon size={13} className="text-primary/60 flex-shrink-0" />
                        {m.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground hidden sm:table-cell">{m.role}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-primary/10 text-primary">{m.badge}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-[10px] font-mono text-emerald-400">● {m.status}</span>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-xs text-muted-foreground mt-8"
        >
          To verify a member's legitimacy, use the{" "}
          <a href="/member-verifier" className="text-primary hover:underline">Member Verifier</a>.
        </motion.p>
      </div>
    </div>
    <Footer />
  </div>
);

export default Members;
