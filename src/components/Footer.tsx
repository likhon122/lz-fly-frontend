import Link from "next/link";
import { Mail, Phone, MapPin, ShieldCheck, ArrowRight, Check } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card text-foreground py-14 sm:py-16 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand & Overview */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4 group">
              <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-black text-xs tracking-tight">
                LZ
              </div>
              <span className="text-xl font-extrabold text-foreground tracking-tight">
                LZ Fly
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Production-grade UI components, verified design templates, and vector systems engineered for high-velocity teams.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span>Catalog Version 2.4.0 Online</span>
            </div>
          </div>

          {/* Directory & Catalog */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-foreground mb-4">
              Asset Directory
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/designs"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Browse Designs
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  All Categories
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Subscription Plans
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Company Overview
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Governance */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-foreground mb-4">
              Governance & Legal
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/terms"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Commercial Rights
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Support Desk
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Direct */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-foreground mb-4">
              Direct Contact
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5 text-muted-foreground">
                <Mail className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                <a
                  href="mailto:support@lzfly.com"
                  className="hover:text-foreground transition-colors"
                >
                  support@lzfly.com
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-muted-foreground">
                <Phone className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start gap-2.5 text-muted-foreground">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                <span>San Francisco, CA • Global Distribution</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} LZ Fly Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-semibold text-foreground">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              256-Bit SSL Encrypted
            </span>
            <span>•</span>
            <span>Zero-Gradients Architectural Design</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
