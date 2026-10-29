"use client";

import React from "react";
import { Award, Users, Target, Sparkles, Shield, Heart, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  const stats = [
    { label: "Active Designs", value: "500+" },
    { label: "Global Creators", value: "10K+" },
    { label: "Years in Industry", value: "5+" },
    { label: "Satisfaction Rate", value: "98%" },
  ];

  const values = [
    {
      icon: Award,
      title: "Quality First",
      description:
        "Every design in our catalog is systematically reviewed and verified against strict design system and production standards.",
    },
    {
      icon: Users,
      title: "Customer-Centric",
      description:
        "We build for creators, engineers, and digital founders. Our tools and templates are engineered to accelerate real-world workflows.",
    },
    {
      icon: Shield,
      title: "Trust & Security",
      description:
        "Every transaction, asset download, and account credential is protected with industry-standard encryption and strict access controls.",
    },
    {
      icon: Heart,
      title: "Community Driven",
      description:
        "We foster a collaborative global network of world-class designers and developers who share knowledge and elevate digital craft.",
    },
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "Founder & CEO",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      bio: "10+ years scaling digital design systems and developer platforms.",
    },
    {
      name: "Michael Chen",
      role: "Lead Systems Architect",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
      bio: "Pioneering component libraries and production design frameworks.",
    },
    {
      name: "Emily Rodriguez",
      role: "Creative Director",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
      bio: "Crafting visual identities and accessible UI standards across devices.",
    },
    {
      name: "David Park",
      role: "Head of Community",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
      bio: "Empowering creators with tutorials, guidelines, and prompt support.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Breadcrumb Navigation */}
        <nav className="mb-6">
          <div className="flex items-center space-x-2 text-sm font-semibold">
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Home
            </Link>
            <span className="text-muted-foreground/40">/</span>
            <span className="text-foreground">About</span>
          </div>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 border-b border-border">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded border border-border bg-muted/40 text-foreground text-xs sm:text-sm font-semibold uppercase tracking-wider mb-3">
              Organization
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight">
              About LZ Fly
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground mt-2 max-w-2xl leading-relaxed">
              We empower modern creators, developers, and studios with production-grade
              design components, templates, and UI systems.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/designs">
              <Button
                variant="outline"
                className="border-border hover:border-foreground/40 bg-card text-foreground font-semibold rounded-lg text-sm px-5 py-2.5 transition-colors"
              >
                Browse Designs
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Minimalist Metrics Strip (0 gradients, 0 box shadow, 0 blur) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-8 border-b border-border">
          {stats.map((stat, idx) => (
            <div
              key={stat.label}
              className={`${
                idx < stats.length - 1 ? "border-r border-border/50 pr-4" : ""
              }`}
            >
              <div
                className={`text-3xl sm:text-4xl font-extrabold ${
                  idx === 0 ? "text-primary" : "text-foreground"
                }`}
              >
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground font-semibold uppercase tracking-wider mt-1.5">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Mission & Story Section */}
        <div className="py-14 border-b border-border grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
              Our Vision
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight leading-tight">
              Engineering the standard for modern digital aesthetics.
            </h2>
          </div>
          <div className="lg:col-span-7 space-y-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            <p>
              LZ Fly was founded on a simple premise: professional digital creation
              should not require reinventing common interface patterns from scratch.
              High-growth product teams need reliable, accessible, and clean architectural
              foundations that ship fast.
            </p>
            <p>
              Today, our repository hosts verified assets spanning web dashboards,
              mobile design systems, component specs, and iconography. We ensure every
              download is production-ready, cleanly layered, and commercially licensed.
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div className="py-14 border-b border-border">
          <div className="mb-8">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
              Guiding Principles
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Core Values
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.title}
                  className="border border-border rounded-xl bg-card p-7 hover:border-foreground/40 transition-colors"
                >
                  <div className="w-11 h-11 rounded-lg border border-border bg-muted/40 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    {v.title}
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {v.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Leadership Team */}
        <div className="py-14 border-b border-border">
          <div className="mb-8">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
              Leadership
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Meet the Team
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {team.map((member) => (
              <div
                key={member.name}
                className="border border-border rounded-xl bg-card overflow-hidden hover:border-foreground/40 transition-colors flex flex-col"
              >
                <div className="aspect-square bg-muted relative border-b border-border">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-foreground">
                      {member.name}
                    </h3>
                    <p className="text-sm font-semibold text-primary mt-0.5">
                      {member.role}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2.5 leading-relaxed">
                      {member.bio}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA Strip */}
        <div className="pt-14">
          <div className="border border-border rounded-xl bg-card p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                Ready to accelerate your creative workflow?
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground mt-2 max-w-xl">
                Join thousands of designers and engineering teams who build faster with LZ Fly.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link href="/designs">
                <Button className="bg-primary text-secondary hover:bg-primary/90 font-bold rounded-lg text-sm px-6 py-3 transition-colors">
                  Explore Designs
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  variant="outline"
                  className="border-border hover:border-foreground/40 bg-card text-foreground font-bold rounded-lg text-sm px-6 py-3 transition-colors"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
