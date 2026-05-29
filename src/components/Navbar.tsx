import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SubMenuItem {
  to: string;
  label: string;
}

interface NavItem {
  to: string;
  label: string;
  children?: SubMenuItem[];
}

const navLinks: NavItem[] = [
  { to: "/", label: "Home" },
  {
    to: "/news",
    label: "News",
    children: [
      { to: "/news", label: "Announcements" },
      { to: "/news#events", label: "Events" },
      { to: "/news#updates", label: "Updates" },
    ],
  },
  {
    to: "/",
    label: "SWS Activities",
    children: [
      { to: "/what-is-akrho", label: "What is AKRho?" },
      { to: "/activities#upcoming", label: "SWS Upcoming Events" },
      { to: "/activities#previous", label: "Previous Events" },
      { to: "/about", label: "More Info About Us" },
    ],
  },
  { to: "/members", label: "Members" },
  {
    to: "/member-verifier",
    label: "Member Verifier",
    children: [
      { to: "/member-verifier", label: "Verify a Member" },
      { to: "/member-verifier#records", label: "Member Records" },
    ],
  },
  { to: "/register", label: "Register" },
];

const DropdownItem = ({ item, onClose }: { item: NavItem; onClose: () => void }) => {
  const location = useLocation();
  const isActive = location.pathname === item.to || item.children?.some(c => location.pathname === c.to);

  if (!item.children) {
    return (
      <Link
        to={item.to}
        className={`relative px-4 py-3 text-xs font-heading font-bold tracking-[0.15em] uppercase transition-all duration-200 hover:text-primary ${
          isActive ? "text-primary" : "text-foreground/80"
        }`}
        onClick={onClose}
      >
        {item.label}
        {isActive && (
          <div className="absolute bottom-0 left-1/4 right-1/4 h-[2px] bg-primary rounded-full" />
        )}
      </Link>
    );
  }

  return (
    <div className="relative group h-full flex items-center">
      <Link
        to={item.to}
        className={`flex items-center gap-1 px-4 text-xs font-heading font-bold tracking-[0.15em] uppercase transition-all duration-200 hover:text-primary ${
          isActive ? "text-primary" : "text-foreground/80"
        }`}
        onClick={onClose}
      >
        {item.label}
        <ChevronDown size={10} className="transition-transform duration-200 group-hover:rotate-180" />
      </Link>
      
      <div className="absolute top-[100%] left-0 pt-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 z-50">
        <div className="min-w-[200px] dropdown-menu rounded-sm py-1 overflow-hidden">
          {item.children.map((child) => (
            <Link
              key={child.to}
              to={child.to}
              onClick={onClose}
              className="flex items-center px-4 py-2.5 text-xs font-heading tracking-wider text-foreground/70 hover:text-primary hover:bg-primary/10 transition-all duration-150"
            >
              <span className="text-primary/40 mr-2 text-[8px]">◆</span>
              {child.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      {/* Top utility bar */}
      <div className="bg-background/95 backdrop-blur-md border-b border-primary/15 relative z-50">
        <div className="container mx-auto px-4 flex items-center justify-between h-8">
          <div className="flex items-center gap-2 md:gap-3">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse-glow" />
            <span className="text-[9px] md:text-[10px] font-mono text-success tracking-wider">CHAPTER ACTIVE</span>
            <span className="hidden sm:inline-block text-[10px] font-mono text-muted-foreground">• Est. 2021 • Region VII</span>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[9px] md:text-[10px] font-heading font-bold uppercase tracking-wider text-[hsl(235,86%,70%)] hover:text-[hsl(235,86%,80%)] transition-colors"
            >
              Facebook
            </a>
            <span className="text-border">|</span>
            <Link to="/login" className="text-[9px] md:text-[10px] font-heading font-bold uppercase tracking-wider text-foreground/70 hover:text-primary transition-colors">
              Sign In
            </Link>
            <span className="text-border">|</span>
            <Link to="/register" className="text-[9px] md:text-[10px] font-heading font-bold uppercase tracking-wider text-primary hover:text-primary/80 transition-colors">
              Sign Up
            </Link>
          </div>
        </div>
      </div>

      {/* Main navigation with centered logo */}
      <div className={`nav-banner transition-all duration-300 relative z-40 ${scrolled ? "py-0" : "py-1"}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            {/* Left nav items */}
            <div className="hidden lg:flex items-center gap-0">
              {navLinks.slice(0, 3).map((link) => (
                <DropdownItem key={link.to + link.label} item={link} onClose={() => {}} />
              ))}
            </div>

            {/* Center spacer (logo removed) */}
            <div className="w-12" />

            {/* Right nav items */}
            <div className="hidden lg:flex items-center gap-0">
              {navLinks.slice(3).map((link) => (
                <DropdownItem key={link.to + link.label} item={link} onClose={() => {}} />
              ))}
            </div>

            {/* Mobile toggle */}
            <button className="lg:hidden text-foreground relative z-50" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-card/98 backdrop-blur-xl border-b border-primary/20 overflow-hidden relative z-30"
          >
            <div className="px-4 py-4 flex flex-col gap-0.5">
              {navLinks.map((link) => (
                <div key={link.to + link.label}>
                  <Link
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between px-3 py-2.5 text-sm font-heading font-semibold tracking-wide uppercase text-foreground/80 hover:text-primary transition-all"
                  >
                    {link.label}
                    {link.children && <ChevronDown size={12} className="text-primary/50" />}
                  </Link>
                  {link.children && (
                    <div className="pl-6 pb-1">
                      {link.children.map((child) => (
                        <Link
                          key={child.to}
                          to={child.to}
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs font-heading tracking-wider text-muted-foreground hover:text-primary transition-all"
                        >
                          <span className="text-primary/30 text-[8px]">◆</span>
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 px-3 py-2.5 text-sm font-heading font-bold tracking-wide uppercase text-center bg-[hsl(235,86%,65%)] text-accent-foreground rounded-sm"
              >
                Visit Facebook Page
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
