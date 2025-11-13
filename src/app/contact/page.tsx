"use client";

import { useState } from "react";
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
} from "lucide-react";
import Link from "next/link";

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
      title: "Email Us",
      content: "support@designhub.com",
      link: "mailto:support@designhub.com",
    },
    {
      icon: Phone,
      title: "Call Us",
      content: "+1 (555) 123-4567",
      link: "tel:+15551234567",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      content: "123 Design Street, Creative City, DC 12345",
      link: "https://maps.google.com",
    },
    {
      icon: Clock,
      title: "Business Hours",
      content: "Mon - Fri: 9AM - 6PM EST",
      link: null,
    },
  ];

  const faqCategories = [
    {
      category: "General",
      icon: MessageSquare,
      questions: [
        {
          q: "How do I purchase a design?",
          a: "Browse our design collection, click on a design you like, and click the 'Purchase' button. You'll be guided through a secure checkout process.",
        },
        {
          q: "What payment methods do you accept?",
          a: "We accept credit cards, PayPal, Stripe, and bank transfers for your convenience.",
        },
      ],
    },
    {
      category: "Downloads",
      icon: Globe,
      questions: [
        {
          q: "How do I download my purchased designs?",
          a: "After purchase, go to your dashboard and click on 'My Downloads'. You can download your designs anytime from there.",
        },
        {
          q: "Can I re-download designs?",
          a: "Yes! Once purchased, you can download your designs as many times as needed from your account.",
        },
      ],
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("idle");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Contact form submitted:", formData);
      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 border-b border-border">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(var(--primary)/0.2)_1px,transparent_1px),linear-gradient(to_bottom,rgb(var(--primary)/0.2)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
          <div className="absolute top-20 left-20 w-72 h-72 bg-primary rounded-full blur-3xl animate-pulse opacity-20"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary rounded-full blur-3xl animate-pulse delay-700 opacity-20"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-6xl md:text-7xl font-black mb-6 animate-fade-in gradient-text">
              Get in Touch
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 leading-relaxed font-medium">
              Have a question or need assistance? We&apos;re here to help! Reach
              out to us and we&apos;ll get back to you as soon as possible.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <div
                  key={index}
                  className="group bg-card rounded-3xl shadow-2xl p-8 hover:shadow-primary/20 transition-all duration-500 border-2 border-border hover:border-primary hover:scale-105"
                >
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-black text-foreground mb-3">{info.title}</h3>
                  {info.link ? (
                    <a
                      href={info.link}
                      target={info.link.startsWith("http") ? "_blank" : undefined}
                      rel={info.link.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium"
                    >
                      {info.content}
                    </a>
                  ) : (
                    <p className="text-muted-foreground text-sm font-medium">{info.content}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form & Quick Links Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <div>
              <div className="mb-8">
                <h2 className="text-4xl font-black text-foreground mb-4">
                  Send Us a Message
                </h2>
                <p className="text-muted-foreground font-medium">
                  Fill out the form below and we&apos;ll respond within 24 hours.
                </p>
              </div>

              {status === "success" && (
                <div className="mb-6 p-5 bg-primary/10 border-2 border-primary/30 rounded-2xl flex items-start backdrop-blur-sm">
                  <CheckCircle className="w-6 h-6 text-primary mr-3 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-foreground font-black">
                      Message sent successfully!
                    </p>
                    <p className="text-foreground/70 text-sm mt-1 font-medium">
                      We&apos;ll get back to you within 24 hours.
                    </p>
                  </div>
                </div>
              )}

              {status === "error" && (
                <div className="mb-6 p-5 bg-destructive/10 border-2 border-destructive/30 rounded-2xl flex items-start">
                  <AlertCircle className="w-6 h-6 text-destructive mr-3 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-destructive font-black">
                      Failed to send message
                    </p>
                    <p className="text-destructive/80 text-sm mt-1 font-medium">
                      Please try again or contact us directly via email.
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-black text-foreground mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-5 py-4 border-2 border-border rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all bg-card font-medium"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-black text-foreground mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-5 py-4 border-2 border-border rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all bg-card font-medium"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-black text-foreground mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-5 py-4 border-2 border-border rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all bg-card font-medium"
                    placeholder="How can we help you?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-black text-foreground mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full px-5 py-4 border-2 border-border rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all resize-none bg-card font-medium"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/90 text-secondary py-4 px-6 rounded-2xl font-black transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 shadow-2xl"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-secondary border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Quick Links & Info */}
            <div className="space-y-8">
              <div className="bg-card rounded-3xl shadow-2xl p-10 border-2 border-border">
                <h3 className="text-3xl font-black text-foreground mb-8">
                  Quick Links
                </h3>
                <div className="space-y-4">
                  <Link
                    href="/designs"
                    className="group flex items-center p-5 rounded-2xl bg-primary/10 hover:bg-primary/20 transition-all border-2 border-primary/20 hover:border-primary"
                  >
                    <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center mr-4 shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <Globe className="w-7 h-7 text-secondary" />
                    </div>
                    <div>
                      <p className="font-black text-foreground group-hover:text-primary transition-colors">
                        Browse Designs
                      </p>
                      <p className="text-sm text-muted-foreground font-medium">
                        Explore our collection
                      </p>
                    </div>
                  </Link>

                  <Link
                    href="/pricing"
                    className="group flex items-center p-5 rounded-2xl bg-primary/10 hover:bg-primary/20 transition-all border-2 border-primary/20 hover:border-primary"
                  >
                    <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center mr-4 shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <MessageSquare className="w-7 h-7 text-secondary" />
                    </div>
                    <div>
                      <p className="font-black text-foreground group-hover:text-primary transition-colors">
                        View Pricing
                      </p>
                      <p className="text-sm text-muted-foreground font-medium">
                        Check our subscription plans
                      </p>
                    </div>
                  </Link>

                  <Link
                    href="/about"
                    className="group flex items-center p-5 rounded-2xl bg-primary/10 hover:bg-primary/20 transition-all border-2 border-primary/20 hover:border-primary"
                  >
                    <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center mr-4 shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <Mail className="w-7 h-7 text-secondary" />
                    </div>
                    <div>
                      <p className="font-black text-foreground group-hover:text-primary transition-colors">
                        About Us
                      </p>
                      <p className="text-sm text-muted-foreground font-medium">
                        Learn more about our story
                      </p>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Response Time Info */}
              <div className="bg-card rounded-3xl shadow-2xl p-10 border-2 border-border">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <Clock className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-3xl font-black mb-4 text-foreground">Quick Response Time</h3>
                <p className="text-muted-foreground mb-4 font-medium">
                  We typically respond to inquiries within 24 hours during
                  business days.
                </p>
                <p className="text-sm text-muted-foreground font-medium">
                  For urgent matters, please call us directly at{" "}
                  <span className="font-black text-primary">+1 (555) 123-4567</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-foreground mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
              Find quick answers to common questions below.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            {faqCategories.map((category, catIndex) => {
              const Icon = category.icon;
              return (
                <div key={catIndex}>
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mr-4">
                      <Icon className="w-6 h-6 text-secondary" />
                    </div>
                    <h3 className="text-3xl font-black text-foreground">
                      {category.category}
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {category.questions.map((faq, faqIndex) => (
                      <div
                        key={faqIndex}
                        className="bg-card rounded-2xl shadow-lg p-8 border-2 border-border hover:border-primary transition-colors duration-300"
                      >
                        <h4 className="font-black text-foreground mb-3 flex items-start text-lg">
                          <span className="text-primary mr-3 text-2xl">Q:</span>
                          {faq.q}
                        </h4>
                        <p className="text-muted-foreground ml-10 font-medium">{faq.a}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-16">
            <p className="text-muted-foreground mb-6 font-medium text-lg">
              Still have questions? We&apos;re here to help!
            </p>
            <a
              href="mailto:support@designhub.com"
              className="inline-flex items-center px-8 py-4 bg-primary hover:bg-primary/90 text-secondary font-black rounded-2xl transition-all duration-300 hover:scale-105 shadow-2xl"
            >
              <Mail className="w-6 h-6 mr-2" />
              Email Support
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
