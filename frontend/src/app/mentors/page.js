"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { mentorsAPI } from "../../services/api"
import { FadeIn, ScaleIn } from "../../components/LightweightAnimations"
import { ComponentLoading } from "../../components/LoadingSpinner"
import { Star, MapPin, Users, Clock } from "lucide-react"

function MentorCard({ mentor, index }) {
  // Handle API data structure
  const mentorName = mentor.user ? `${mentor.user.first_name} ${mentor.user.last_name}` : "Unknown Mentor"
  const mentorEmail = mentor.user?.email || ""
  const mentorBio = mentor.bio || "No bio available"
  const mentorExpertise = mentor.expertise || []
  const mentorPrice = mentor.hourly_rate || 0
  const mentorRating = mentor.rating || 0
  const mentorReviews = mentor.review_count || 0
  const mentorLocation = mentor.location || "Remote"
  const mentorAvailability = mentor.availability || "Flexible"
  const mentorSessions = mentor.sessions_completed || 0

  return (
    <FadeIn
      delay={index * 0.1}
      className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-0.5 shadow-lg border border-purple-500/20 group relative overflow-hidden transition-all duration-300 hover:border-purple-400/60"
    >
      <div className="absolute -z-10 top-0 left-0 w-full h-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="bg-slate-900 rounded-2xl p-6 h-full">
        <div className="flex items-start gap-4 mb-4">
          <div className="relative">
            <Image
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                mentorName
              )}&background=f59e0b&color=fff&size=64`}
              alt={mentorName}
              width={64}
              height={64}
              className="w-16 h-16 rounded-full object-cover ring-2 ring-gold/20 group-hover:ring-gold/40 transition-all"
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-slate-900"></div>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg text-white mb-1">{mentorName}</h3>
            <p className="text-slate-400 text-sm mb-1">
              {mentorExpertise.length > 0 ? mentorExpertise[0].name : "Expert"}
            </p>
            <p className="text-purple-400 font-semibold text-sm">{mentorLocation}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="flex items-center gap-1 mb-1 justify-end">
              <Star className="w-4 h-4 text-gold fill-current" />
              <span className="font-semibold text-sm text-white">
                {typeof mentorRating === "number" ? mentorRating.toFixed(1) : "0.0"}
              </span>
              <span className="text-slate-400 text-xs">({mentorReviews})</span>
            </div>
            <p className="text-lg font-bold text-white">${mentorPrice}/hr</p>
          </div>
        </div>

        <p className="text-slate-400 text-sm mb-4 line-clamp-2 min-h-[40px]">
          {mentorBio}
        </p>

        <div className="flex flex-wrap gap-2 mb-4 min-h-[32px]">
          {mentorExpertise.slice(0, 3).map((exp) => (
            <span key={exp.id} className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full font-medium">
              {exp.name}
            </span>
          ))}
          {mentorExpertise.length > 3 && (
            <span className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded-full font-medium">
              +{mentorExpertise.length - 3} more
            </span>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 mb-6 border-t border-slate-800 pt-4">
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>{mentorSessions} sessions</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{mentorAvailability}</span>
          </div>
        </div>

        <div className="flex gap-4">
          <Link
            href={`/book/${mentor.id}`}
            className="flex-1 text-center bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2.5 px-4 rounded-lg font-semibold text-sm shadow-lg hover:shadow-purple-500/50 transition-all transform hover:scale-105"
          >
            Book Session
          </Link>
          <Link
            href={`/mentors/${mentor.id}`}
            className="flex-1 text-center py-2.5 px-4 border border-slate-600 text-slate-300 rounded-lg font-semibold text-sm hover:border-slate-400 hover:bg-slate-800/50 transition-all"
          >
            View Profile
          </Link>
        </div>
      </div>
    </FadeIn>
  )
}

export default function MentorsPage() {
  const [mentors, setMentors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedExpertise, setSelectedExpertise] = useState("")
  const [expertiseList, setExpertiseList] = useState([])
  const [sortBy, setSortBy] = useState("rating")

  // Fetch mentors and expertise on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [mentorsData, expertiseData] = await Promise.all([
          mentorsAPI.getAll(),
          mentorsAPI.getExpertise()
        ])
        
        setMentors(mentorsData.results || mentorsData)
        setExpertiseList(expertiseData.results || expertiseData)
      } catch (err) {
        console.error('Failed to fetch mentors:', err)
        setError('Failed to load mentors. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filter and sort mentors
  const filteredMentors = mentors.filter(mentor => {
    const mentorName = mentor.user ? `${mentor.user.first_name} ${mentor.user.last_name}` : ""
    const mentorBio = mentor.bio || ""
    const mentorExpertise = mentor.expertise || []
    
    const matchesSearch = 
      mentorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentorBio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentorExpertise.some(exp => exp.name?.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesExpertise = !selectedExpertise || 
                           mentorExpertise.some(exp => exp.id === parseInt(selectedExpertise))
    
    return matchesSearch && matchesExpertise
  })

  const sortedMentors = [...filteredMentors].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return (b.rating || 0) - (a.rating || 0)
      case "price-low":
        return (a.hourly_rate || 0) - (b.hourly_rate || 0)
      case "price-high":
        return (b.hourly_rate || 0) - (a.hourly_rate || 0)
      case "reviews":
        return (b.review_count || 0) - (a.review_count || 0)
      default:
        return 0
    }
  })

  if (loading) {
    return <ComponentLoading message="Finding amazing mentors..." size="large" />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 flex items-center justify-center text-center">
        <div className="text-red-400 text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-white mb-2">Oops!</h2>
        <p className="text-slate-400 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-gold text-primary px-6 py-2 rounded-lg font-bold hover:bg-amber-400 transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950">
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950" />

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <FadeIn className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-4">
            Find Your Perfect Mentor
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Connect with experienced professionals who can guide you on your career journey
          </p>
        </FadeIn>

        {/* Search and Filters */}
        <FadeIn className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-2xl rounded-3xl p-6 mb-8 border border-purple-500/20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search mentors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
              />
            </div>

            {/* Expertise Filter */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Expertise</label>
              <select
                value={selectedExpertise}
                onChange={(e) => setSelectedExpertise(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: "right 0.5rem center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "1.5em 1.5em",
                }}
              >
                <option value="" className="bg-slate-900 text-white">All Expertise</option>
                {expertiseList.map((expertise) => (
                  <option key={expertise.id} value={expertise.id} className="bg-slate-900 text-white">
                    {expertise.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: "right 0.5rem center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "1.5em 1.5em",
                }}
              >
                <option value="rating" className="bg-slate-900 text-white">Highest Rated</option>
                <option value="price-low" className="bg-slate-900 text-white">Price: Low to High</option>
                <option value="price-high" className="bg-slate-900 text-white">Price: High to Low</option>
                <option value="reviews" className="bg-slate-900 text-white">Most Reviews</option>
              </select>
            </div>

            {/* Results Count */}
            <div className="flex items-end">
              <div className="text-slate-400">
                <span className="text-2xl font-bold text-gold">{sortedMentors.length}</span> mentors found
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Mentors Grid */}
        {sortedMentors.length === 0 ? (
          <FadeIn className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-white mb-2">No mentors found</h3>
            <p className="text-slate-400 mb-6">
              Try adjusting your search criteria or browse all mentors
            </p>
            <button
              onClick={() => {
                setSearchTerm("")
                setSelectedExpertise("")
              }}
              className="bg-gold text-primary px-6 py-2 rounded-lg font-bold hover:bg-amber-400 transition-colors"
            >
              Clear Filters
            </button>
          </FadeIn>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedMentors.map((mentor, index) => (
              <MentorCard key={mentor.id} mentor={mentor} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
