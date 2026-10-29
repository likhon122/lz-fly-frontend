"use client";

import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  Clock,
  Globe,
  CheckCircle,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [loading, setLoading] = useState(false);

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Support",
      content: "support@lzfly.com",
      link: "mailto:support@lzfly.com",
    },
    {
      icon: Phone,
      title: "Direct Phone",
      content: "+1 (555) 123-4567",
      link: "tel:+15551234567",
    },
    {
      icon: MapPin,
      title: "Headquarters",
      content: "123 Creative Studio Way, San Francisco, CA",
      link: "https://maps.google.com",
    },
    {
      icon: Clock,
      title: "Support Hours",
      content: "Mon - Fri: 9:00 AM - 6:00 PM EST",
      link: null,
    },
  ];

  const faqCategories = [
    {
      category: "Licensing & Purchases",
      icon: MessageSquare,
      questions: [
        {
          q: "How does the commercial license work?",
          a: "Every design template and asset download from LZ Fly includes full commercial rights for client and personal projects. You are permitted to modify, deploy, and ship unlimited end-products.",
        },
        {
          q: "What payment methods do you support?",
          a: "We accept all major credit and debit cards, Stripe checkout, and corporate invoicing for annual enterprise tiers.",
        },
      ],
    },
    {
      category: "Vault Downloads & Formats",
      icon: Globe,
      questions: [
        {
          q: "Where do I retrieve purchased design files?",
          a: "Directly from your User Dashboard under the Downloads Vault. Files remain accessible permanently with unlimited re-downloads.",
        },
        {
          q: "What formats are included in downloads?",
          a: "Assets typically include Figma files, vector SVGs, component specs, code-ready CSS tokens, and raw raster previews.",
        },
      ],
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("idle");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

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
            <span className="text-foreground">Contact</span>
          </div>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 border-b border-border">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded border border-border bg-muted/40 text-foreground text-xs sm:text-sm font-semibold uppercase tracking-wider mb-3">
              Support Desk
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight">
              Contact Us
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground mt-2 max-w-2xl leading-relaxed">
              Have questions regarding subscriptions, custom licenses, or enterprise
              integrations? Our support team is ready to assist.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/pricing">
              <Button
                variant="outline"
                className="border-border hover:border-foreground/40 bg-card text-foreground font-semibold rounded-lg text-sm px-5 py-2.5 transition-colors"
              >
                View Plans & Pricing
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Minimalist Metrics Strip (0 gradients, 0 box shadow, 0 blur) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-8 border-b border-border">
          <div className="border-r border-border/50 pr-4">
            <div className="text-3xl sm:text-4xl font-extrabold text-foreground">
              &lt; 24h
            </div>
            <div className="text-sm text-muted-foreground font-semibold uppercase tracking-wider mt-1.5">
              Response Time
            </div>
          </div>
          <div className="border-r border-border/50 pr-4">
            <div className="text-3xl sm:text-4xl font-extrabold text-primary">
              100%
            </div>
            <div className="text-sm text-muted-foreground font-semibold uppercase tracking-wider mt-1.5">
              Resolution Guarantee
            </div>
          </div>
          <div className="border-r border-border/50 pr-4">
            <div className="text-3xl sm:text-4xl font-extrabold text-foreground">
              24/7
            </div>
            <div className="text-sm text-muted-foreground font-semibold uppercase tracking-wider mt-1.5">
              Catalog Access
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-foreground">
              Direct
            </div>
            <div className="text-sm text-muted-foreground font-semibold uppercase tracking-wider mt-1.5">
              Engineering Support
            </div>
          </div>
        </div>

        {/* Contact Information Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 py-8 border-b border-border">
          {contactInfo.map((info) => {
            const Icon = info.icon;
            return (
              <div
                key={info.title}
                className="border border-border rounded-xl bg-card p-6 hover:border-foreground/40 transition-colors"
              >
                <div className="w-11 h-11 rounded-lg border border-border bg-muted/40 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                  {info.title}
                </div>
                {info.link ? (
                  <a
                    href={info.link}
                    target={info.link.startsWith("http") ? "_blank" : undefined}
                    rel={info.link.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="text-sm sm:text-base font-semibold text-foreground hover:text-primary transition-colors block break-words"
                  >
                    {info.content}
                  </a>
                ) : (
                  <p className="text-sm sm:text-base font-semibold text-foreground break-words">
                    {info.content}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Contact Form and Details Layout */}
        <div className="py-14 border-b border-border grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form */}
          <div className="lg:col-span-7">
            <div className="border border-border rounded-xl bg-card p-6 sm:p-9">
              <div className="mb-6">
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Online Inquiry
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                  Send Us a Direct Message
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Fill in your requirements below and our technical desk will respond promptly.
                </p>
              </div>

              {status === "success" && (
                <div className="mb-6 p-4 border border-primary/40 bg-muted/40 rounded-lg flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-foreground">
                      Message submitted successfully
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                      Thank you for contacting us. Our operations team will respond to {formData.email || "your email"} within 24 hours.
                    </p>
                  </div>
                </div>
              )}

              {status === "error" && (
                <div className="mb-6 p-4 border border-destructive/40 bg-muted/40 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-destructive">
                      Unable to deliver message
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                      Please check your network connection or email us directly at support@lzfly.com.
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2"
                    >
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 text-sm bg-background border border-border rounded-lg text-foreground focus:border-primary focus:outline-none transition-colors"
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 text-sm bg-background border border-border rounded-lg text-foreground focus:border-primary focus:outline-none transition-colors"
                      placeholder="jane@company.com"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2"
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 text-sm bg-background border border-border rounded-lg text-foreground focus:border-primary focus:outline-none transition-colors"
                    placeholder="Inquiry regarding design licenses or system specs..."
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-3.5 py-2.5 text-sm bg-background border border-border rounded-lg text-foreground focus:border-primary focus:outline-none transition-colors resize-none"
                    placeholder="Provide details about your project or questions..."
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-secondary hover:bg-primary/90 font-bold rounded-lg text-sm py-3 transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
                      <span>Sending inquiry...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Send className="w-4 h-4" />
                      <span>Transmit Message</span>
                    </div>
                  )}
                </Button>
              </form>
            </div>
          </div>

          {/* Quick Shortcuts & FAQ Column */}
          <div className="lg:col-span-5 space-y-5">
            {/* Quick Links Card */}
            <div className="border border-border rounded-xl bg-card p-6 sm:p-7">
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                Helpful Resources
              </div>
              <h3 className="text-lg font-bold text-foreground mb-4">
                Self-Service Options
              </h3>

              <div className="space-y-2.5">
                <Link
                  href="/designs"
                  className="flex items-center justify-between p-3.5 rounded-lg border border-border hover:border-foreground/40 bg-muted/20 hover:bg-muted/40 transition-colors"
                >
                  <div>
                    <div className="text-sm font-bold text-foreground">
                      Asset Directory
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      Browse all production-ready design packs
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </Link>

                <Link
                  href="/pricing"
                  className="flex items-center justify-between p-3.5 rounded-lg border border-border hover:border-foreground/40 bg-muted/20 hover:bg-muted/40 transition-colors"
                >
                  <div>
                    <div className="text-sm font-bold text-foreground">
                      Subscription Tiers
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      Compare personal and studio memberships
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </Link>

                <Link
                  href="/about"
                  className="flex items-center justify-between p-3.5 rounded-lg border border-border hover:border-foreground/40 bg-muted/20 hover:bg-muted/40 transition-colors"
                >
                  <div>
                    <div className="text-sm font-bold text-foreground">
                      About Organization
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      Learn about our standards and architecture
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </Link>
              </div>
            </div>

            {/* SLA Commitment Card */}
            <div className="border border-border rounded-xl bg-card p-6 sm:p-7">
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                Support Commitment
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                Priority Turnaround
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                All inquiries submitted during standard business hours are acknowledged
                within 4 hours. Critical download or billing issues receive immediate priority.
              </p>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="pt-14">
          <div className="mb-8">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
              Knowledge Base
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqCategories.map((cat) => (
              <div key={cat.category} className="space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-primary">
                  {cat.category}
                </div>
                <div className="space-y-3.5">
                  {cat.questions.map((faq) => (
                    <div
                      key={faq.q}
                      className="border border-border rounded-xl bg-card p-6 hover:border-foreground/40 transition-colors"
                    >
                      <h4 className="text-sm sm:text-base font-bold text-foreground mb-2">
                        {faq.q}
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
