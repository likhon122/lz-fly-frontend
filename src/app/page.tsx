import { Button } from "@/components/ui/button";
import Link from "next/link";
import CategoriesSection from "@/components/CategoriesSection";
import FeaturedDesigns from "@/components/FeaturedDesigns";
import { VideoCarousel } from "@/components/VideoCarousel";
import {
  ArrowRight,
  Sparkles,
  TrendingUp,
  Shield,
  Zap,
  Star,
  Download,
  Users
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Ultra-Modern Hero Section with Video Background */}
      <section className="relative overflow-hidden h-screen flex items-center justify-center">
        {/* Video Background Carousel */}
        <VideoCarousel />

        {/* Minimal Animated Pattern Overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none z-10">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(var(--primary)/0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgb(var(--primary)/0.1)_1px,transparent_1px)] bg-[size:6rem_6rem]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-20 w-full">
          {/* Hero Content - Perfectly Centered */}
          <div className="text-center max-w-6xl mx-auto">
            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 tracking-tight leading-tight">
              <span className="text-white drop-shadow-[0_4px_25px_rgba(0,0,0,0.95)]">
                Premium Design Templates
              </span>
              <br />
              <span className="gradient-text inline-block mt-4 drop-shadow-[0_4px_30px_rgba(135,230,75,0.7)]">
                For Creative Professionals
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-base md:text-lg lg:text-xl text-white/90 drop-shadow-[0_3px_15px_rgba(0,0,0,0.95)] mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
              Elevate your projects with our curated collection of world-class
              design assets.
              <br className="hidden md:block" />
              Professional quality, instant access, unlimited creativity.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-20">
              <Link href="/designs">
                <Button
                  size="lg"
                  className="text-lg px-12 py-7 bg-primary hover:bg-primary/90 text-secondary shadow-[0_0_50px_rgba(135,230,75,0.6)] hover:shadow-[0_0_70px_rgba(135,230,75,0.9)] hover:scale-110 transition-all duration-300 group font-black rounded-2xl"
                >
                  Browse Collection
                  <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-12 py-7 border-2 border-white/70 bg-white/5 backdrop-blur-2xl text-white hover:border-primary hover:bg-primary/10 hover:text-white font-black rounded-2xl transition-all duration-300 hover:scale-110"
                >
                  View Pricing
                </Button>
              </Link>
            </div>

            {/* Trust Indicators - Minimal & Clean */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center group">
                <div className="text-5xl font-black text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.95)] mb-2 group-hover:scale-110 transition-transform">
                  5K+
                </div>
                <div className="text-xs text-white/80 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] font-bold uppercase tracking-widest">
                  Designs
                </div>
              </div>
              <div className="text-center group">
                <div className="text-5xl font-black text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.95)] mb-2 group-hover:scale-110 transition-transform">
                  100+
                </div>
                <div className="text-xs text-white/80 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] font-bold uppercase tracking-widest">
                  Categories
                </div>
              </div>
              <div className="text-center group">
                <div className="text-5xl font-black text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.95)] mb-2 group-hover:scale-110 transition-transform">
                  500+
                </div>
                <div className="text-xs text-white/80 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] font-bold uppercase tracking-widest">
                  Designers
                </div>
              </div>
              <div className="text-center group">
                <div className="text-5xl font-black text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.95)] mb-2 group-hover:scale-110 transition-transform">
                  24/7
                </div>
                <div className="text-xs text-white/80 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] font-bold uppercase tracking-widest">
                  Support
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-background dark:bg-card/30 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(var(--primary))_1px,transparent_1px),linear-gradient(to_bottom,rgb(var(--primary))_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-black text-primary uppercase tracking-wider">
                Why Choose Us
              </span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-foreground mb-6">
              Built for <span className="gradient-text">Creators</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-medium leading-relaxed">
              Everything you need to bring your creative vision to life, backed
              by our commitment to quality and innovation
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <div className="group relative bg-card p-10 rounded-3xl border-2 border-border hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="w-16 h-16 bg-primary/10 dark:bg-primary/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-lg">
                  <Zap className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-black text-foreground mb-4 group-hover:text-foreground transition-colors">
                  Lightning Fast
                </h3>
                <p className="text-muted-foreground leading-relaxed font-medium">
                  Download immediately after purchase. No waiting, no delays.
                  Start creating instantly with full access to all files and
                  assets.
                </p>
                <div className="mt-6 pt-6 border-t border-border">
                  <div className="flex items-center gap-2 text-sm font-bold text-primary">
                    <span>Instant Access</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Card 2 */}
            <div className="group relative bg-card p-10 rounded-3xl border-2 border-border hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="w-16 h-16 bg-primary/10 dark:bg-primary/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-lg">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-black text-foreground mb-4 group-hover:text-foreground transition-colors">
                  Premium Quality
                </h3>
                <p className="text-muted-foreground leading-relaxed font-medium">
                  Every design reviewed by expert curators. Professional quality
                  guaranteed in every template. Your success is our top
                  priority.
                </p>
                <div className="mt-6 pt-6 border-t border-border">
                  <div className="flex items-center gap-2 text-sm font-bold text-primary">
                    <span>Expert Verified</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Card 3 */}
            <div className="group relative bg-card p-10 rounded-3xl border-2 border-border hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="w-16 h-16 bg-primary/10 dark:bg-primary/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-lg">
                  <TrendingUp className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-black text-foreground mb-4 group-hover:text-foreground transition-colors">
                  Always Fresh
                </h3>
                <p className="text-muted-foreground leading-relaxed font-medium">
                  New designs every week. Stay ahead with trending styles and
                  cutting-edge designs from top creators worldwide.
                </p>
                <div className="mt-6 pt-6 border-t border-border">
                  <div className="flex items-center gap-2 text-sm font-bold text-primary">
                    <span>Weekly Updates</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-card rounded-2xl border border-border">
              <div className="text-4xl font-black text-primary mb-2">99%</div>
              <div className="text-sm text-muted-foreground font-bold uppercase tracking-wider">
                Satisfaction
              </div>
            </div>
            <div className="text-center p-6 bg-card rounded-2xl border border-border">
              <div className="text-4xl font-black text-primary mb-2">10K+</div>
              <div className="text-sm text-muted-foreground font-bold uppercase tracking-wider">
                Happy Clients
              </div>
            </div>
            <div className="text-center p-6 bg-card rounded-2xl border border-border">
              <div className="text-4xl font-black text-primary mb-2">50+</div>
              <div className="text-sm text-muted-foreground font-bold uppercase tracking-wider">
                Countries
              </div>
            </div>
            <div className="text-center p-6 bg-card rounded-2xl border border-border">
              <div className="text-4xl font-black text-primary mb-2">24/7</div>
              <div className="text-sm text-muted-foreground font-bold uppercase tracking-wider">
                Support
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-32 bg-muted/30 dark:bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CategoriesSection />
        </div>
      </section>

      {/* Featured Designs Section */}
      <section className="py-32 bg-background dark:bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FeaturedDesigns />
        </div>
      </section>

      {/* CTA Section - Ultra Modern */}
      <section className="relative py-40 overflow-hidden bg-gradient-to-br from-primary/10 via-background to-primary/5 dark:from-primary/5 dark:via-card dark:to-primary/10">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Premium Badge */}
          <div className="inline-flex items-center gap-3 bg-card backdrop-blur-sm rounded-full px-6 py-3 mb-10 border-2 border-primary/40 shadow-2xl">
            <Star className="w-5 h-5 text-primary animate-pulse" />
            <span className="text-sm font-black text-foreground tracking-wide">
              🎉 LIMITED TIME OFFER - JOIN 10,000+ CREATORS
            </span>
          </div>

          <h2 className="text-5xl md:text-7xl font-black text-foreground mb-8 leading-tight">
            Ready to Elevate
            <br />
            <span className="gradient-text">Your Design Game?</span>
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground mb-14 max-w-4xl mx-auto leading-relaxed font-medium">
            Join thousands of successful designers and unlock unlimited access
            to premium templates. Start creating professional designs in
            minutes, not hours.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Link href="/register">
              <Button
                size="lg"
                className="text-xl px-14 py-8 bg-primary hover:bg-primary/90 text-secondary shadow-2xl hover:shadow-primary/50 hover:scale-110 transition-all duration-300 font-black rounded-2xl group"
              >
                <Users className="w-6 h-6 mr-3" />
                Start Free Trial
                <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
              </Button>
            </Link>
            <Link href="/designs">
              <Button
                variant="outline"
                size="lg"
                className="text-xl px-14 py-8 border-2 border-border bg-card hover:bg-muted hover:border-primary font-black rounded-2xl transition-all duration-300 hover:scale-110"
              >
                <Download className="w-6 h-6 mr-3" />
                Browse Designs
              </Button>
            </Link>
          </div>

          {/* Trust Badges - Enhanced */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center gap-3 p-6 bg-card rounded-2xl border-2 border-border group hover:border-primary/50 transition-all">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Shield className="w-7 h-7 text-primary" />
              </div>
              <span className="text-base font-black text-foreground">
                Secure Payment
              </span>
              <span className="text-sm text-muted-foreground text-center">
                256-bit SSL encryption
              </span>
            </div>
            <div className="flex flex-col items-center gap-3 p-6 bg-card rounded-2xl border-2 border-border group hover:border-primary/50 transition-all">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Download className="w-7 h-7 text-primary" />
              </div>
              <span className="text-base font-black text-foreground">
                Instant Download
              </span>
              <span className="text-sm text-muted-foreground text-center">
                No waiting, start now
              </span>
            </div>
            <div className="flex flex-col items-center gap-3 p-6 bg-card rounded-2xl border-2 border-border group hover:border-primary/50 transition-all">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Star className="w-7 h-7 text-primary" />
              </div>
              <span className="text-base font-black text-foreground">
                Premium Quality
              </span>
              <span className="text-sm text-muted-foreground text-center">
                Expert-verified designs
              </span>
            </div>
          </div>

          {/* Money Back Guarantee */}
          <div className="mt-12 inline-flex items-center gap-2 text-muted-foreground">
            <Shield className="w-5 h-5" />
            <span className="text-sm font-bold">
              30-Day Money Back Guarantee • No Questions Asked
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
