"use client";

import { Award, Users, Target, Sparkles, Shield, Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function AboutPage() {
  const stats = [
    { label: "Active Designs", value: "500+", icon: Sparkles },
    { label: "Happy Customers", value: "10K+", icon: Users },
    { label: "Years Experience", value: "5+", icon: Award },
    { label: "Success Rate", value: "98%", icon: Target },
  ];

  const values = [
    {
      icon: Award,
      title: "Quality First",
      description:
        "Every design in our collection is carefully curated and meets our strict quality standards. We believe in delivering excellence.",
    },
    {
      icon: Users,
      title: "Customer-Centric",
      description:
        "Our customers are at the heart of everything we do. We're committed to providing exceptional service and support.",
    },
    {
      icon: Shield,
      title: "Trust & Security",
      description:
        "Your data and transactions are protected with industry-standard security. We take your privacy seriously.",
    },
    {
      icon: Heart,
      title: "Community Driven",
      description:
        "We foster a vibrant community of designers and creators. Together, we grow and inspire each other.",
    },
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "Founder & CEO",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      bio: "Passionate about design and innovation",
    },
    {
      name: "Michael Chen",
      role: "Lead Designer",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
      bio: "Creating beautiful experiences since 2015",
    },
    {
      name: "Emily Rodriguez",
      role: "Creative Director",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
      bio: "Bringing visions to life through design",
    },
    {
      name: "David Park",
      role: "Head of Customer Success",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
      bio: "Ensuring every customer has a great experience",
    },
  ];

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
              About DesignHub
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 leading-relaxed font-medium">
              We&apos;re on a mission to empower creators with stunning,
              professional designs that bring their visions to life.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/designs"
                className="px-8 py-4 bg-primary text-secondary font-black rounded-2xl hover:bg-primary/90 transition-all duration-300 hover:scale-105 shadow-2xl"
              >
                Explore Designs
              </Link>
              <Link
                href="/contact"
                className="px-8 py-4 bg-card text-foreground font-black rounded-2xl hover:bg-muted transition-all duration-300 border-2 border-border shadow-2xl"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 -mt-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="group bg-card rounded-3xl shadow-2xl p-8 text-center hover:shadow-primary/20 border-2 border-border hover:border-primary hover:scale-105 transition-all duration-500"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-4xl font-black text-primary mb-2 drop-shadow-lg">
                    {stat.value}
                  </p>
                  <p className="text-muted-foreground text-sm font-bold uppercase tracking-wider">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-5xl font-black text-foreground mb-6">
                Our Story
              </h2>
              <div className="w-24 h-2 bg-primary mx-auto rounded-full shadow-lg shadow-primary/30"></div>
            </div>
            <div className="space-y-6">
              <p className="text-foreground/80 leading-relaxed text-lg font-medium">
                DesignHub was born from a simple belief: great design should
                be accessible to everyone. What started as a small collection of
                handcrafted designs has grown into a thriving marketplace
                serving thousands of creators worldwide.
              </p>
              <p className="text-foreground/80 leading-relaxed text-lg font-medium">
                Our journey began in 2018 when our founder, inspired by the
                challenges of finding quality design resources, decided to
                create a platform that would bridge the gap between talented
                designers and people who need their work.
              </p>
              <p className="text-foreground/80 leading-relaxed text-lg font-medium">
                Today, we&apos;re proud to be a trusted partner for designers,
                developers, marketers, and entrepreneurs. Every design in our
                collection represents hours of creativity, passion, and
                dedication to excellence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-foreground mb-6">
              Our Core Values
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
              These principles guide everything we do and shape how we serve our
              community.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="group bg-card rounded-3xl shadow-2xl p-10 hover:shadow-primary/20 transition-all duration-500 border-2 border-border hover:border-primary"
                >
                  <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-xl">
                    <Icon className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-3xl font-black text-foreground mb-4 group-hover:text-primary transition-colors duration-300">
                    {value.title}
                  </h3>
                  <p className="text-foreground/70 leading-relaxed font-medium text-lg">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-foreground mb-6">
              Meet Our Team
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
              The talented individuals behind DesignHub who work tirelessly to
              bring you the best design experience.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {team.map((member, index) => (
              <div
                key={index}
                className="group bg-card rounded-3xl shadow-2xl overflow-hidden hover:shadow-primary/20 transition-all duration-500 border-2 border-border hover:border-primary"
              >
                <div className="aspect-square bg-primary/5 overflow-hidden relative">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-black text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                    {member.name}
                  </h3>
                  <p className="text-primary font-black mb-3 text-sm uppercase tracking-wider">
                    {member.role}
                  </p>
                  <p className="text-muted-foreground text-sm font-medium">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-muted/30 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl md:text-6xl font-black mb-6 gradient-text">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-muted-foreground mb-10 font-medium">
              Join thousands of satisfied customers and discover the perfect
              designs for your next project.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/designs"
                className="px-8 py-4 bg-primary text-secondary font-black rounded-2xl hover:bg-primary/90 transition-all duration-300 hover:scale-105 shadow-2xl"
              >
                Browse Designs
              </Link>
              <Link
                href="/pricing"
                className="px-8 py-4 bg-card text-foreground font-black rounded-2xl hover:bg-muted transition-all duration-300 border-2 border-border shadow-2xl"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
