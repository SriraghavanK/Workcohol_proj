import Link from "next/link"
import Image from "next/image"
import { FadeIn, ScaleIn } from "../../components/LightweightAnimations"
import { ComponentLoading } from "../../components/LoadingSpinner"
import { Star, MapPin, Users, Clock } from "lucide-react"
import { Suspense } from "react"
import MentorsClient from "./MentorsClient"

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

async function fetchMentorsAndExpertise() {
  // Use server-side fetch for SSG/SSR
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';
  const [mentorsRes, expertiseRes] = await Promise.all([
    fetch(`${API_BASE_URL}/mentors/`, { cache: 'no-store' }),
    fetch(`${API_BASE_URL}/mentors/expertise/`, { cache: 'no-store' })
  ]);
  const mentorsData = await mentorsRes.json();
  const expertiseData = await expertiseRes.json();
  return {
    mentors: mentorsData.results || mentorsData,
    expertiseList: expertiseData.results || expertiseData
  };
}

export default async function MentorsPage() {
  const { mentors, expertiseList } = await fetchMentorsAndExpertise();
  return <MentorsClient mentors={mentors} expertiseList={expertiseList} />;
}
