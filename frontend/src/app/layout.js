import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { AuthProvider } from "../contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata = {
  title: "MentorConnect | Premium Mentorship Platform",
  description: "Book mentorship sessions with top experts. Grow your career with MentorConnect.",
  keywords: "mentorship, career growth, professional development, expert guidance",
  authors: [{ name: "MentorConnect Team" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "MentorConnect | Premium Mentorship Platform",
    description: "Book mentorship sessions with top experts. Grow your career with MentorConnect.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "MentorConnect | Premium Mentorship Platform",
    description: "Book mentorship sessions with top experts. Grow your career with MentorConnect.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Preload critical resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//localhost:8000" />
        <link rel="preconnect" href="//localhost:8000" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-text`}>
        <AuthProvider>
          <Navbar />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}