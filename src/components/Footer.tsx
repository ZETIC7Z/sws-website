import { Link } from "react-router-dom";

const footerLinks = [
  { to: "/", label: "Home" },
  { to: "/news", label: "News" },
  { to: "/members", label: "Members" },
  { to: "/member-verifier", label: "Member Verifier" },
  { to: "/what-is-akrho", label: "What is AKRho?" },
  { to: "/about", label: "About Us" },
  { to: "/register", label: "Register" },
];

const Footer = () => (
  <footer className="border-t-2 border-primary/30 mt-auto">
    {/* Footer nav */}
    <div className="nav-banner py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-10">
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 order-2 md:order-1">
            {footerLinks.map((link) => (
              <Link
                key={link.to + link.label}
                to={link.to}
                className="text-[10px] md:text-xs font-heading font-bold uppercase tracking-[0.15em] text-foreground/60 hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] md:text-xs font-heading font-bold uppercase tracking-[0.15em] text-[hsl(235,86%,70%)] hover:text-[hsl(235,86%,80%)] transition-colors order-3"
          >
            Facebook
          </a>
        </div>
      </div>
    </div>

    {/* Copyright */}
    <div className="bg-background/80 py-4 border-t border-primary/10">
      <div className="container mx-auto px-4 flex flex-col items-center justify-center gap-4">
        <p className="text-[10px] text-muted-foreground font-heading tracking-widest uppercase">
          All rights reserved by <span className="text-primary">SWS Skeptrons</span> © {new Date().getFullYear()}
        </p>
        <div className="h-px w-24 bg-primary/20" />
        <p className="text-xs font-heading font-bold tracking-[0.3em] text-foreground/80">
          DEVELOPED BY <span className="text-primary text-glow-gold">ZETICUZ</span>
        </p>
        <p className="text-[9px] text-muted-foreground/40 uppercase tracking-widest">
          Social Welfare Skeptrons • Alpha Kappa Rho • Region VII • Est. 2021
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
