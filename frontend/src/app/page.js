"use client"

import { useRef, useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { FadeIn, ScaleIn, FloatingBlob, HoverCard, SlideIn, AnimatedCounter } from "../components/LightweightAnimations"

// Animated SVG Background Component
function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <svg
        className="absolute inset-0 w-full h-full opacity-20"
        viewBox="0 0 1000 1000"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="grad1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#ec4899" stopOpacity="0.1" />
          </radialGradient>
          <radialGradient id="grad2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.05" />
          </radialGradient>
        </defs>
        <circle cx="200" cy="200" r="150" fill="url(#grad1)" className="animate-pulse">
          <animate attributeName="r" values="150;180;150" dur="8s" repeatCount="indefinite" />
        </circle>
        <circle cx="800" cy="300" r="120" fill="url(#grad2)" className="animate-pulse">
          <animate attributeName="r" values="120;150;120" dur="10s" repeatCount="indefinite" />
        </circle>
        <circle cx="600" cy="700" r="100" fill="url(#grad1)" className="animate-pulse">
          <animate attributeName="r" values="100;130;100" dur="12s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  )
}

function FeatureCard({ icon, title, description, delay = 0 }) {
  return (
    <FadeIn delay={delay}>
      <HoverCard className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-8 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative z-10">
          <div className="text-6xl mb-6 filter drop-shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
            {icon}
          </div>
          <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            {title}
          </h3>
          <p className="text-slate-400 leading-relaxed text-lg">{description}</p>
        </div>
      </HoverCard>
    </FadeIn>
  )
}

function StatsCard({ number, label, delay = 0 }) {
  return (
    <FadeIn delay={delay}>
      <div className="text-center group">
        <ScaleIn delay={delay + 0.2}>
          <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
            <AnimatedCounter end={number} suffix={label.includes("%") ? "%" : label.includes("+") ? "+" : ""} />
          </div>
        </ScaleIn>
        <div className="text-slate-400 text-lg font-medium">{label.replace(/[0-9+%]/g, "")}</div>
      </div>
    </FadeIn>
  )
}

// Enhanced CTA Button Component
function CTAButton({ href, children, variant = "primary", className = "" }) {
  return (
    <HoverCard>
      <Link
        href={href}
        className={`group relative inline-flex items-center justify-center px-8 py-4 text-xl font-bold rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-500/50 ${className} ${
          variant === "primary"
            ? "text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-purple-500/50"
            : "text-purple-300 border-2 border-purple-500/50 hover:border-purple-400 hover:bg-purple-500/10"
        }`}
      >
        <span className="relative z-10 flex items-center gap-2">
          {children}
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </span>
        {variant === "primary" && (
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        )}
      </Link>
    </HoverCard>
  )
}

export default function Home() {
  const containerRef = useRef(null)

  return (
    <div ref={containerRef} className="relative overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-6xl mx-auto text-center">
          <FadeIn delay={0}>
            <div className="mb-8">
              <span className="inline-block px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full text-purple-300 text-sm font-semibold border border-purple-500/30 backdrop-blur-sm animate-pulse">
                🚀 Transform Your Career Today
              </span>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
                Unlock Your
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent animate-gradient">
                Potential
              </span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.4}>
            <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Connect with world-class mentors and accelerate your growth. Get personalized guidance from industry experts
              who&apos;ve been where you want to go.
            </p>
          </FadeIn>

          <FadeIn delay={0.6}>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <CTAButton href="/mentors" variant="primary">
                Find Your Mentor
              </CTAButton>
              <CTAButton href="/how-it-works" variant="secondary">
                How It Works
              </CTAButton>
            </div>
          </FadeIn>

          {/* Stats */}
          <FadeIn delay={0.8}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <StatsCard number={10000} label="Active Mentors+" delay={0} />
              <StatsCard number={50000} label="Success Stories+" delay={0.1} />
              <StatsCard number={95} label="Satisfaction Rate%" delay={0.2} />
              <StatsCard number={24} label="7 Support" delay={0.3} />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">Why Choose</span>
                <br />
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  MentorConnect?
                </span>
              </h2>
              <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                We&apos;ve built the most comprehensive mentorship platform to help you achieve your goals faster than ever
                before.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon="🎯"
              title="Personalized Matching"
              description="Our AI-powered algorithm connects you with mentors who perfectly align with your goals, experience level, and learning style."
              delay={0}
            />
            <FeatureCard
              icon="⚡"
              title="Instant Booking"
              description="Schedule sessions in seconds with our streamlined booking system. No back-and-forth emails or scheduling conflicts."
              delay={0.1}
            />
            <FeatureCard
              icon="🏆"
              title="Proven Results"
              description="Join thousands of professionals who&apos;ve accelerated their careers with guidance from industry-leading experts."
              delay={0.2}
            />
            <FeatureCard
              icon="💎"
              title="Premium Experience"
              description="Enjoy crystal-clear video calls, session recordings, progress tracking, and premium support throughout your journey."
              delay={0.3}
            />
            <FeatureCard
              icon="🌍"
              title="Global Network"
              description="Access mentors from top companies worldwide - Google, Apple, Microsoft, and hundreds of innovative startups."
              delay={0.4}
            />
            <FeatureCard
              icon="🔒"
              title="Secure & Private"
              description="Your conversations and data are protected with enterprise-grade security. Focus on growth, not privacy concerns."
              delay={0.5}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-32 px-4">
        <ScaleIn>
          <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl p-12 border border-purple-500/20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Ready to Transform Your Career?
            </h2>
            <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
              Join thousands of ambitious professionals who are already accelerating their growth with world-class
              mentorship.
            </p>
            <CTAButton href="/register" variant="primary" className="text-2xl px-10 py-5">
              Get Started Today
            </CTAButton>
          </div>
        </ScaleIn>
      </section>
    </div>
  )
}
