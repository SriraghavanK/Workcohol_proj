"use client";
import { useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, Star, Users, TrendingUp, BookOpen, Award, Target, DollarSign, MessageSquare } from "lucide-react";
import ProtectedRoute from "../../components/ProtectedRoute";
import { userAPI, bookingsAPI } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import { FadeIn, ScaleIn, AnimatedCounter } from "../../components/LightweightAnimations";
import { PageLoading } from '../../components/LoadingSpinner';

// Stat Card Component
function StatCard({ icon: Icon, label, value, color }) {
  const colorClasses = {
    gold: "text-gold",
    purple: "text-purple-400",
    pink: "text-pink-400",
    slate: "text-slate-400",
  };

  return (
    <div className="bg-slate-900/50 backdrop-blur-2xl rounded-2xl p-6 border border-purple-500/20 group hover:border-purple-400/30 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-sm">{label}</p>
          <p className={`text-3xl font-bold ${colorClasses[color]}`}>
            <AnimatedCounter end={value} />
          </p>
        </div>
        <Icon className={`w-8 h-8 ${colorClasses[color]} opacity-70 group-hover:opacity-100 transition-opacity`} />
      </div>
    </div>
  );
}

// Booking Card Component
function BookingCard({ booking, isMentor }) {
  console.log('BookingCard booking:', booking);
  // Get the other party details (mentor or mentee)
  let otherParty = null;
  let otherPartyName = "User";
  if (isMentor) {
    otherParty = booking.mentee_details || booking.mentee;
  } else {
    otherParty = booking.mentor_details || booking.mentor;
  }
  if (otherParty) {
    otherPartyName =
      [otherParty.first_name, otherParty.last_name].filter(Boolean).join(' ') ||
      otherParty.name ||
      otherParty.username ||
      otherParty.email ||
      'User';
  }
  
  const sessionDate = new Date(booking.session_date);
  
  // Calculate session time range
  let sessionTimeRange = '';
  if (booking?.duration) {
    const endDate = new Date(sessionDate.getTime() + (booking.duration * 60000));
    sessionTimeRange = `${sessionDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} - ${endDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
  } else {
    sessionTimeRange = sessionDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }

  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 hover:bg-slate-800/70 transition-colors duration-300">
      <div className="flex items-center gap-4">
        <Image
          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
            otherPartyName
          )}&background=f59e0b&color=fff&size=48`}
          alt={otherPartyName}
          width={48}
          height={48}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <p className="font-bold text-white">
            Session with {otherPartyName}
          </p>
          <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {sessionDate.toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {sessionTimeRange}
            </span>
            {booking.status && (
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                booking.status === 'confirmed' ? 'bg-green-500/20 text-green-400' :
                booking.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                booking.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                'bg-slate-500/20 text-slate-400'
              }`}>
                {booking.status}
              </span>
            )}
          </div>
        </div>
      </div>
      <Link
        href={`/bookings/${booking.id}`}
        className="px-4 py-2 border border-slate-600 text-slate-300 rounded-lg font-semibold text-sm hover:border-slate-400 hover:bg-slate-800/50 transition-all"
      >
        Details
      </Link>
    </div>
  );
}

const fetchProfile = async () => {
  const profileData = await userAPI.getProfile();
  return profileData.results?.[0] || profileData;
};
const fetchBookings = async () => {
  const bookingsData = await bookingsAPI.getUserBookings();
  return bookingsData.results || bookingsData;
};
const fetchStats = async () => {
  return await userAPI.getStats();
};

function DashboardSkeleton() {
  // Simple skeleton loader for dashboard
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950">
      <div className="w-full max-w-4xl animate-pulse">
        <div className="h-10 bg-slate-800 rounded mb-6 w-1/2 mx-auto" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-800 rounded-2xl" />
          ))}
        </div>
        <div className="h-8 bg-slate-800 rounded mb-4 w-1/3" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-slate-800 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  // Use SWR for all data fetching
  const { data: userProfile, error: profileError, isLoading: loadingProfile } = useSWR('profile', fetchProfile);
  const { data: bookings, error: bookingsError, isLoading: loadingBookings } = useSWR('bookings', fetchBookings);
  const { data: stats, error: statsError, isLoading: loadingStats } = useSWR('stats', fetchStats);

  const loading = loadingProfile || loadingBookings || loadingStats;
  const error = profileError || bookingsError || statsError;

  // Improved date filtering with better timezone handling and status filtering
  const upcomingBookings = bookings?.filter(booking => {
    if (!booking.session_date) return false;
    const sessionStart = new Date(booking.session_date);
    const duration = booking.duration || 60;
    const sessionEnd = new Date(sessionStart.getTime() + (duration * 60000));
    const now = new Date();
    const validStatus = ['confirmed', 'pending'];
    return (
      sessionEnd > now &&
      validStatus.includes((booking.status || '').toLowerCase())
    );
  }).sort((a, b) => new Date(a.session_date) - new Date(b.session_date)).slice(0, 5) || [];

  const pastBookings = bookings?.filter(booking => {
    if (!booking.session_date) return false;
    const sessionDate = new Date(booking.session_date);
    const now = new Date();
    const bufferTime = new Date(now.getTime() + (60 * 60 * 1000));
    return sessionDate <= bufferTime;
  }).sort((a, b) => new Date(b.session_date) - new Date(a.session_date)).slice(0, 3) || [];

  // Fallback: all future sessions regardless of status/duration
  const allFutureSessions = bookings.filter(booking => {
    if (!booking.session_date) return false;
    const sessionStart = new Date(booking.session_date);
    const now = new Date();
    return sessionStart > now;
  });

  // Determine if user is a mentor
  const isMentor = user?.user_type === 'mentor';

  if (loading) {
    return <DashboardSkeleton />;
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950">
        <div className="text-red-400 text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-white mb-2">Oops!</h2>
        <p className="text-slate-400 mb-4">Failed to load dashboard data. Please try again later.</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-gold text-primary px-6 py-2 rounded-lg font-bold hover:bg-amber-400 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950">
        <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <FadeIn className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-4">
              Welcome back, {userProfile?.user?.first_name || 'User'}! 👋
            </h1>
            <p className="text-xl text-slate-400">
              {isMentor
                ? "Here's your mentoring dashboard and upcoming sessions"
                : "Here's what's happening with your mentorship journey"}
            </p>
            <div className="mt-2">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                  isMentor
                    ? "bg-purple-500/20 text-purple-300 border border-purple-400/30"
                    : "bg-pink-500/20 text-pink-300 border border-pink-400/30"
                }`}
              >
                {isMentor ? "Mentor" : "Mentee"}
              </span>
            </div>
          </FadeIn>

          {/* Stats Grid */}
          <FadeIn className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {isMentor ? (
              // Mentor Stats
              <>
                <StatCard icon={BookOpen} label="Total Sessions" value={stats.total_sessions || bookings.length} color="gold" />
                <StatCard icon={Calendar} label="Upcoming" value={upcomingBookings.length} color="purple" />
                <StatCard icon={DollarSign} label="Earnings ($)" value={stats.total_earnings || 0} color="pink" />
                <StatCard icon={Star} label="Rating" value={stats.average_rating || 0} color="gold" />
              </>
            ) : (
              // Mentee Stats
              <>
                <StatCard icon={BookOpen} label="Total Sessions" value={stats.total_sessions || bookings.length} color="gold" />
                <StatCard icon={Calendar} label="Upcoming" value={upcomingBookings.length} color="purple" />
                <StatCard icon={Clock} label="Hours Learned" value={stats.total_hours || 0} color="pink" />
                <StatCard icon={Users} label="Mentors" value={stats.unique_mentors || 0} color="gold" />
              </>
            )}
          </FadeIn>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Upcoming Sessions */}
            <FadeIn className="lg:col-span-2">
              <div className="bg-slate-900/50 backdrop-blur-2xl rounded-2xl p-6 border border-purple-500/20">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    {isMentor ? "Upcoming Sessions" : "My Upcoming Sessions"}
                  </h2>
                  <Link
                    href="/bookings"
                    className="text-purple-400 hover:text-purple-300 transition-colors font-semibold"
                  >
                    View All
                  </Link>
                </div>

                {upcomingBookings.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400 mb-4">
                      {isMentor ? "No upcoming sessions scheduled" : "No upcoming sessions"}
                    </p>
                    {/* Debug: Show all future sessions if any */}
                    {allFutureSessions.length > 0 && (
                      <div className="mt-4">
                        <p className="text-slate-400 mb-2">Debug: Found future sessions not shown as upcoming:</p>
                        <ul className="text-xs text-slate-500">
                          {allFutureSessions.map(b => (
                            <li key={b.id}>
                              #{b.id} | {b.session_date} | status: {b.status} | duration: {b.duration}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {!isMentor && (
                      <Link
                        href="/mentors"
                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-2 px-6 rounded-xl shadow-lg hover:shadow-purple-500/50 transition-all"
                      >
                        Find a Mentor
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingBookings.map((booking) => (
                      <BookingCard key={booking.id} booking={booking} isMentor={isMentor} />
                    ))}
                  </div>
                )}
              </div>
            </FadeIn>

            {/* Quick Actions / Profile Snippet */}
            <FadeIn>
              <div className="bg-slate-900/50 backdrop-blur-2xl rounded-2xl p-6 border border-purple-500/20">
                <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
                <div className="space-y-3">
                  <Link
                    href="/profile"
                    className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 hover:bg-slate-800/70 transition-colors"
                  >
                    <span className="font-semibold text-white">Edit Your Profile</span>
                    <Award className="w-5 h-5 text-purple-400" />
                  </Link>
                  <Link
                    href={isMentor ? "/availability" : "/mentors"}
                    className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 hover:bg-slate-800/70 transition-colors"
                  >
                    <span className="font-semibold text-white">
                      {isMentor ? "Update Availability" : "Find New Mentors"}
                    </span>
                    <Target className="w-5 h-5 text-purple-400" />
                  </Link>
                  <Link
                    href="/messages"
                    className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 hover:bg-slate-800/70 transition-colors"
                  >
                    <span className="font-semibold text-white">View Messages</span>
                    <MessageSquare className="w-5 h-5 text-purple-400" />
                  </Link>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 