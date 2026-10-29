import { Button } from "@/components/ui/button";
import Link from "next/link";
import CategoriesSection from "@/components/CategoriesSection";
import FeaturedDesigns from "@/components/FeaturedDesigns";
import { VideoCarousel } from "@/components/VideoCarousel";
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Star,
  Download,
  Users,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* ═══════════ HERO ═══════════ */}
      <section className="relative overflow-hidden flex items-center justify-center min-h-[85vh] md:min-h-[90vh] bg-neutral-950 text-white">
        {/* Video background — sits behind everything */}
        <VideoCarousel />

        {/* Content — this h1 IS the LCP element (pure text = instant paint) */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-3xl">
            {/* Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/20 bg-white/10 text-white text-xs font-semibold tracking-wide uppercase mb-6">
              <span className="w-2 h-2 rounded-full bg-primary" />
              LZ FLY ARCHITECTURE • VERIFIED ASSET CATALOG
            </div>

            {/* H1 — large text is the LCP candidate, renders in <100ms */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] tracking-tight mb-6">
              Design templates
              <br />
              <span className="text-primary">built to ship.</span>
            </h1>

            <p className="text-base sm:text-lg text-white/90 max-w-xl mb-8 leading-relaxed font-medium">
              Production-ready UI kits, templates & creative assets.
              Curated by senior designers. Instantly downloadable with commercial license.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 mb-14">
              <Link href="/designs">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-lg px-7 py-3.5 text-sm sm:text-base transition-colors group"
                >
                  Browse Collection
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button
                  size="lg"
                  className="border-2 border-white/60 bg-white/10 hover:bg-white hover:text-neutral-950 text-white font-bold rounded-lg px-7 py-3.5 text-sm sm:text-base transition-colors"
                >
                  View Pricing
                </Button>
              </Link>
            </div>

            {/* Stat row */}
            <div className="flex flex-wrap gap-8 sm:gap-12 text-white/70 text-sm">
              <div>
                <span className="block text-2xl sm:text-3xl font-extrabold text-white">5K+</span>
                Curated Assets
              </div>
              <div>
                <span className="block text-2xl sm:text-3xl font-extrabold text-white">100+</span>
                Design Disciplines
              </div>
              <div>
                <span className="block text-2xl sm:text-3xl font-extrabold text-white">10K+</span>
                Active Creators
              </div>
            </div>
          </div>
        </div>

        {/* Crisp border separator */}
        <div className="absolute bottom-0 left-0 right-0 border-b border-border z-10 pointer-events-none" />
      </section>

      {/* ═══════════ TRUST METRICS STRIP ═══════════ */}
      <section className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-5 rounded-xl border border-border bg-background">
              <div className="text-2xl sm:text-3xl font-black text-foreground">5,000+</div>
              <div className="text-xs sm:text-sm text-muted-foreground font-medium mt-1">Production Assets</div>
            </div>
            <div className="p-5 rounded-xl border border-border bg-background">
              <div className="text-2xl sm:text-3xl font-black text-foreground">100+</div>
              <div className="text-xs sm:text-sm text-muted-foreground font-medium mt-1">Curated Disciplines</div>
            </div>
            <div className="p-5 rounded-xl border border-border bg-background">
              <div className="text-2xl sm:text-3xl font-black text-foreground">10,000+</div>
              <div className="text-xs sm:text-sm text-muted-foreground font-medium mt-1">Global Creators</div>
            </div>
            <div className="p-5 rounded-xl border border-border bg-background">
              <div className="text-2xl sm:text-3xl font-black text-foreground">100%</div>
              <div className="text-xs sm:text-sm text-muted-foreground font-medium mt-1">Commercial License</div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ CATEGORIES ═══════════ */}
      <section className="py-16 sm:py-20 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CategoriesSection />
        </div>
      </section>

      {/* ═══════════ FEATURED DESIGNS ═══════════ */}
      <section className="py-16 sm:py-20 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FeaturedDesigns />
        </div>
      </section>

      {/* ═══════════ CTA ═══════════ */}
      <section className="py-20 sm:py-28 border-t border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-card rounded-2xl border border-border p-8 sm:p-14 text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-border bg-muted/40 text-foreground text-xs font-bold tracking-wider uppercase mb-6">
              <Star className="w-3.5 h-3.5 text-primary fill-primary" />
              <span>Enterprise Ready Architecture</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground mb-4 tracking-tight leading-tight">
              Ready to accelerate your creative workflow?
            </h2>

            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
              Instant access to thousands of production-ready templates and assets
              designed for teams and independent creators who ship fast.
            </p>

            <div className="flex flex-wrap gap-4 justify-center mb-12">
              <Link href="/register">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-lg px-8 py-3 text-sm sm:text-base transition-colors group"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Start Free Trial
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </Link>
              <Link href="/designs">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-border hover:border-foreground/40 bg-background text-foreground font-semibold rounded-lg px-8 py-3 text-sm sm:text-base transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Browse Catalog
                </Button>
              </Link>
            </div>

            {/* Trust row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto pt-8 border-t border-border">
              {[
                { icon: ShieldCheck, title: "256-Bit SSL Checkout", desc: "Stripe encrypted payments" },
                { icon: Zap, title: "Instant ZIP Delivery", desc: "Immediate download access" },
                { icon: Star, title: "Commercial License", desc: "Perpetual worldwide rights" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3.5 rounded-xl border border-border bg-background"
                >
                  <div className="w-10 h-10 rounded-lg bg-muted/40 border border-border flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-foreground">{item.title}</div>
                    <div className="text-xs text-muted-foreground">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
