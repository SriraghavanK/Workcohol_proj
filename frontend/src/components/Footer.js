"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Github, Linkedin, Twitter, ArrowUp, Mail, CheckCircle } from "lucide-react"

// Back to Top Button Component
function BackToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener("scroll", toggleVisibility)
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    })
  }

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 z-50 p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-purple-500/50 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
      }`}
      aria-label="Back to top"
    >
      <ArrowUp size={24} />
    </button>
  )
}

// Newsletter Form Component
function NewsletterForm() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState("idle") // idle, loading, success, error
  const [message, setMessage] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !email.includes("@")) {
      setStatus("error")
      setMessage("Please enter a valid email address")
      return
    }

    setStatus("loading")
    
    // Simulate API call
    setTimeout(() => {
      setStatus("success")
      setMessage("Thank you for subscribing!")
      setEmail("")
      setTimeout(() => setStatus("idle"), 3000)
    }, 1000)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xs">
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          className="bg-slate-800/30 text-secondary rounded-lg px-3 py-2 text-sm flex-1 border border-transparent focus:border-gold/50 focus:outline-none transition-colors"
          aria-label="Email for newsletter"
          disabled={status === "loading"}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="bg-gold/90 hover:bg-gold text-primary px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gold/50"
        >
          {status === "loading" ? (
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          ) : status === "success" ? (
            <CheckCircle size={16} />
          ) : (
            <Mail size={16} />
          )}
        </button>
      </div>
      {message && (
        <p className={`text-xs mt-2 ${status === "success" ? "text-green-400" : "text-red-400"}`}>
          {message}
        </p>
      )}
    </form>
  )
}

// Animated Social Icon Component
function SocialIcon({ href, icon: Icon, label, delay = 0 }) {
  return (
    <a
      href={href}
      className="group bg-slate-800/30 p-2 rounded-full hover:bg-gold/20 hover:text-gold transition-all duration-300 transform hover:scale-110 hover:rotate-12 focus:outline-none focus:ring-2 focus:ring-gold/50"
      aria-label={label}
      style={{ animationDelay: `${delay}ms` }}
    >
      <Icon size={20} className="transition-transform duration-300 group-hover:scale-110" />
    </a>
  )
}

export default function Footer() {
  return (
    <>
      <footer className="w-full bg-slate-950 text-secondary relative pt-12 mt-16 pb-12">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500/0 via-purple-500/70 to-purple-500/0" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo and Description */}
            <div className="flex flex-col items-center md:items-start md:col-span-2">
              <div className="text-gold font-bold text-2xl mb-3 hover:scale-105 transition-transform cursor-pointer">
                MentorConnect
              </div>
              <p className="text-sm text-secondary/80 max-w-xs text-center md:text-left leading-relaxed">
                Connecting aspiring professionals with experienced mentors for career growth and development.
              </p>
            </div>

            {/* Quick Links */}
            <div className="flex flex-col items-center md:items-start">
              <h3 className="font-semibold text-lg mb-3 text-white">Quick Links</h3>
              <div className="grid grid-cols-2 gap-x-12 gap-y-2">
                <Link href="/" className="text-sm text-secondary/80 hover:text-gold transition-colors focus:outline-none focus:ring-2 focus:ring-gold/50 rounded">
                  Home
                </Link>
                <Link href="/mentors" className="text-sm text-secondary/80 hover:text-gold transition-colors focus:outline-none focus:ring-2 focus:ring-gold/50 rounded">
                  Find Mentors
                </Link>
                <Link href="/about" className="text-sm text-secondary/80 hover:text-gold transition-colors focus:outline-none focus:ring-2 focus:ring-gold/50 rounded">
                  About Us
                </Link>
                <Link href="/contact" className="text-sm text-secondary/80 hover:text-gold transition-colors focus:outline-none focus:ring-2 focus:ring-gold/50 rounded">
                  Contact
                </Link>
                <Link href="/faq" className="text-sm text-secondary/80 hover:text-gold transition-colors focus:outline-none focus:ring-2 focus:ring-gold/50 rounded">
                  FAQ
                </Link>
                <Link href="/privacy" className="text-sm text-secondary/80 hover:text-gold transition-colors focus:outline-none focus:ring-2 focus:ring-gold/50 rounded">
                  Privacy
                </Link>
              </div>
            </div>

            {/* Social and Newsletter */}
            <div className="flex flex-col items-center md:items-start">
              <h3 className="font-semibold text-lg mb-3 text-white">Connect With Us</h3>
              <div className="flex gap-4 mb-4">
                <SocialIcon href="#" icon={Twitter} label="Twitter" delay={0} />
                <SocialIcon href="#" icon={Github} label="GitHub" delay={100} />
                <SocialIcon href="#" icon={Linkedin} label="LinkedIn" delay={200} />
              </div>
              <div className="w-full">
                <h4 className="text-sm font-medium text-white mb-2">Stay Updated</h4>
                <NewsletterForm />
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-500">
            <p>© {new Date().getFullYear()} MentorConnect. All rights reserved.</p>
            <p className="mt-1">
              Built with ❤️ for the future of mentorship
            </p>
          </div>
        </div>
      </footer>
      <BackToTop />
    </>
  )
}
