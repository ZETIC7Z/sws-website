import { motion } from "framer-motion";
import { Shield, Search, UserCheck, AlertCircle } from "lucide-react";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const MemberVerifier = () => {
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) setSearched(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex-1 pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-2xl md:text-4xl font-bold text-center mb-3 tracking-wider"
          >
            <span className="text-primary text-glow-cyan">MEMBER</span>{" "}
            <span className="text-foreground">VERIFIER</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center text-muted-foreground mb-10"
          >
            Verify the legitimacy of an Alpha Kappa Rho – SWS Skeptrons member
          </motion.p>

          {/* Verifier Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass cyber-border rounded-lg p-6 md:p-10 mb-8"
          >
            <Shield className="mx-auto text-primary mb-4" size={48} />
            <h2 className="font-display text-lg font-bold text-primary text-glow-cyan mb-2 text-center">
              SWS Skeptrons Member Verification
            </h2>
            <p className="text-sm text-muted-foreground mb-6 text-center">
              Enter a member's name or username to verify their AKRho SWS membership status.
            </p>

            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
              <input
                className="flex-1 h-11 px-4 text-sm bg-background/60 border border-border rounded-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50"
                placeholder="Enter member name or username..."
                value={query}
                onChange={(e) => { setQuery(e.target.value); setSearched(false); }}
              />
              <button
                type="submit"
                className="h-11 px-6 flex items-center gap-2 bg-gradient-to-b from-primary to-[hsl(35,70%,40%)] text-primary-foreground font-heading text-sm font-bold tracking-wider rounded-sm hover:brightness-110 transition-all border border-primary/60"
              >
                <Search size={16} />
                VERIFY
              </button>
            </form>

            {searched && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 rounded-lg border border-border/40 bg-background/40 flex items-start gap-3"
              >
                <AlertCircle size={18} className="text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-heading font-bold text-foreground">Verification System</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    The member database is being set up. Please contact the chapter directly or use the official AKRho chapter records to verify member <span className="text-primary font-mono">"{query}"</span>.
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Info Box */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="glass cyber-border rounded-lg p-6"
          >
            <h3 className="font-display text-sm font-bold uppercase tracking-widest text-primary text-glow-cyan mb-4 text-center flex items-center justify-center gap-2">
              <UserCheck size={16} />
              How to Verify
            </h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>• <span className="text-foreground font-semibold">Register</span> on this portal and create your member account</p>
              <p>• Members can be searched by name or username</p>
              <p>• Verified members will show their <span className="text-primary">chapter status</span>, <span className="text-primary">initiation year</span>, and <span className="text-primary">member badge</span></p>
              <p>• For official verification, contact the <span className="text-primary">SWS Skeptrons chapter officers</span> directly</p>
              <p>• Always cross-check with the <span className="text-primary">AKRho Grand Chapter</span> for national-level verification</p>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MemberVerifier;
