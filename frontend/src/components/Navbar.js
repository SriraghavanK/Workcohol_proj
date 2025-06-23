"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "../contexts/AuthContext"
import Image from "next/image"

// Progress bar for page transitions
function ProgressBar({ loading }) {
  return (
    <div className="fixed top-0 left-0 w-full h-1 z-[100] pointer-events-none">
      <div
        className={`h-full bg-gradient-to-r from-purple-400 via-pink-400 to-gold transition-all duration-300 ${
          loading ? "w-full" : "w-0"
        }`}
        style={{ transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)" }}
        aria-hidden="true"
      />
    </div>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [loading, setLoading] = useState(false)
  const [avatarOpen, setAvatarOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Progress bar on route change (real loading)
  useEffect(() => {
    const handleStart = () => setLoading(true)
    const handleComplete = () => setLoading(false)
    router.events?.on?.("routeChangeStart", handleStart)
    router.events?.on?.("routeChangeComplete", handleComplete)
    router.events?.on?.("routeChangeError", handleComplete)
    return () => {
      router.events?.off?.("routeChangeStart", handleStart)
      router.events?.off?.("routeChangeComplete", handleComplete)
      router.events?.off?.("routeChangeError", handleComplete)
    }
  }, [router])

  const handleLogout = () => {
    logout()
    setOpen(false)
    setAvatarOpen(false)
  }

  // Determine if user is a mentor
  const isMentor = user?.user_type === "mentor"

  // Navigation links (add Home as first item)
  const navLinks = [
    { href: "/", label: "Home" },
    ...(
      isAuthenticated
        ? isMentor
          ? [
              { href: "/dashboard", label: "Dashboard" },
              { href: "/bookings", label: "My Sessions" },
              { href: "/reviews", label: "Reviews" },
              { href: "/profile", label: "Profile" },
            ]
          : [
              { href: "/mentors", label: "Find Mentors" },
              { href: "/dashboard", label: "Dashboard" },
              { href: "/bookings", label: "My Bookings" },
              { href: "/profile", label: "Profile" },
            ]
        : [
            { href: "/mentors", label: "Find Mentors" },
            { href: "/login", label: "Login" },
            { href: "/register", label: "Get Started", cta: true },
          ]
    )
  ]

  return (
    <>
      <ProgressBar loading={loading} />
      <nav
        className={`sticky top-0 z-50 w-full bg-slate-950 transition-all duration-300 ${
          scrolled ? "border-b border-slate-800" : ""
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group focus:outline-none" tabIndex={0}>
            <span className="text-gold font-bold text-2xl tracking-tight drop-shadow group-hover:scale-105 transition-transform">
              MentorConnect
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-6 items-center relative">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-2 py-1 font-medium transition-colors focus:outline-none ${
                  link.cta
                    ? "bg-gold/90 hover:bg-gold text-primary rounded-full px-5 py-1.5 shadow-md hover:shadow-lg transition-all transform hover:scale-105"
                    : "text-secondary hover:text-gold"
                }`}
                aria-current={pathname === link.href ? "page" : undefined}
                tabIndex={0}
              >
                {link.label}
                {/* Animated active indicator */}
                {pathname === link.href && !link.cta && (
                  <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-gradient-to-r from-purple-400 to-gold rounded-full animate-fade-in" />
                )}
              </Link>
            ))}
            {/* User avatar dropdown or Logout Button */}
            {isAuthenticated && user?.avatar ? (
              <div className="relative ml-4">
                <button
                  onClick={() => setAvatarOpen((v) => !v)}
                  className="focus:outline-none focus:ring-2 focus:ring-gold rounded-full border-2 border-gold/30 hover:border-gold/60 transition-all"
                  aria-label="User menu"
                  tabIndex={0}
                >
                  <Image
                    src={user.avatar}
                    alt="User avatar"
                    width={36}
                    height={36}
                    className="rounded-full object-cover"
                  />
                </button>
                {avatarOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-slate-900/95 rounded-xl shadow-lg border border-gold/10 py-2 z-50 animate-fade-in">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-secondary hover:text-gold transition-colors"
                      onClick={() => setAvatarOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-b-xl transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="ml-4 px-4 py-1.5 font-medium transition-colors text-secondary hover:text-gold focus:outline-none focus:ring-2 focus:ring-gold/50 rounded-lg"
              >
                Logout
              </button>
            ) : null}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setOpen(!open)}
              className="text-gold focus:outline-none p-1 rounded-md hover:bg-slate-800/20 transition-colors"
              aria-label={open ? "Close menu" : "Open menu"}
              tabIndex={0}
            >
              {open ? (
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu with improved transitions */}
        <div
          className={`md:hidden bg-slate-900/95 backdrop-blur-lg shadow-lg transition-all duration-300 ease-in-out overflow-hidden ${
            open ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-4 py-2 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block py-2.5 px-3 font-medium rounded-lg transition-colors focus:outline-none ${
                  link.cta
                    ? "bg-gold/90 hover:bg-gold text-primary"
                    : "text-secondary hover:text-gold"
                } ${pathname === link.href && !link.cta ? "border-l-4 border-gold pl-2" : ""}`}
                onClick={() => setOpen(false)}
                aria-current={pathname === link.href ? "page" : undefined}
                tabIndex={0}
              >
                {link.label}
              </Link>
            ))}
            {/* User info and Logout for mobile */}
            {isAuthenticated && (
              <div className="border-t border-slate-800 mt-3 pt-3 flex items-center justify-between">
                {user?.avatar ? (
                  <div className="flex items-center gap-3">
                    <Image
                      src={user.avatar}
                      alt="User avatar"
                      width={32}
                      height={32}
                      className="rounded-full object-cover border-2 border-gold/30"
                    />
                    <span className="text-secondary font-medium">{user.username || 'User'}</span>
                  </div>
                ) : (
                  <span className="text-secondary font-medium">{user?.username || 'User'}</span>
                )}
                <button
                  onClick={handleLogout}
                  className="text-red-400 hover:bg-red-500/10 px-3 py-2 rounded-lg font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  )
}
