"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Clock, Star, CheckCircle, XCircle, AlertCircle, Video, Phone, MessageSquare, MapPin, DollarSign, User } from "lucide-react";
import ProtectedRoute from "../../components/ProtectedRoute";
import { bookingsAPI } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import { FadeIn, ScaleIn } from "../../components/LightweightAnimations";
import { ComponentLoading, PageLoading } from "../../components/LoadingSpinner";

// Re-styled BookingCard to match the dashboard theme
const BookingCard = ({ booking, isMentor, onAction, isProcessing }) => {
  const { user } = useAuth();
  
  const getStatusInfo = (status) => {
    switch (status) {
      case 'pending':
        return { color: 'text-yellow-400', icon: AlertCircle, label: 'Pending' };
      case 'confirmed':
        return { color: 'text-green-400', icon: CheckCircle, label: 'Confirmed' };
      case 'completed':
        return { color: 'text-blue-400', icon: CheckCircle, label: 'Completed' };
      case 'cancelled':
        return { color: 'text-red-400', icon: XCircle, label: 'Cancelled' };
      default:
        return { color: 'text-secondary', icon: AlertCircle, label: 'Unknown' };
    }
  };

  const getSessionTypeIcon = (sessionType) => {
    switch (sessionType) {
      case 'video_call': return Video;
      case 'audio_call': return Phone;
      case 'chat': return MessageSquare;
      case 'in_person': return MapPin;
      default: return Video;
    }
  };

  const canPerformAction = (booking, action) => {
    if (action === 'cancel' && ['pending', 'confirmed'].includes(booking.status)) {
      return true;
    }
    if (isMentor) {
      if (booking.mentor?.user?.id !== user?.id) return false;
      switch (action) {
        case 'accept':
        case 'decline':
          return booking.status === 'pending';
        case 'complete':
          return booking.status === 'confirmed';
        default:
          return false;
      }
    } else {
      // For mentee, fallback to booking.user if booking.mentee is missing
      const menteeId = booking.mentee?.id ?? booking.user;
      if (menteeId !== user?.id) return false;
      return action === 'cancel' && ['pending', 'confirmed'].includes(booking.status);
    }
  };
  
  const StatusIcon = getStatusInfo(booking.status).icon;
  const SessionTypeIcon = getSessionTypeIcon(booking.session_type);
  const otherParty = isMentor ? booking.mentee : booking.mentor;

  return (
    <ScaleIn
      key={booking.id}
      className="relative group bg-slate-900/50 p-6 rounded-2xl border border-slate-800 overflow-hidden transition-all hover:border-gold/50"
    >
      {/* Animated Gradient Border */}
      <div className="absolute top-0 left-0 w-full h-full rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'radial-gradient(circle at center, rgba(184, 134, 11, 0.15) 0%, rgba(184, 134, 11, 0) 60%)' }} aria-hidden="true" />
      <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] opacity-0 group-hover:opacity-20 animate-spin-slow" style={{ background: 'conic-gradient(from 0deg, transparent 0%, #B8860B 50%, transparent 100%)' }} aria-hidden="true" />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-gold" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-lg">
                {isMentor ? `${otherParty?.user?.first_name || 'Mentee'} ${otherParty?.user?.last_name || ''}` : `${otherParty?.user?.first_name || 'Mentor'} ${otherParty?.user?.last_name || ''}`}
              </h3>
              <p className="text-secondary text-sm">{booking.topic}</p>
            </div>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 ${getStatusInfo(booking.status).color}`}>
            <StatusIcon className="w-4 h-4" />
            <span className="text-sm font-semibold">{getStatusInfo(booking.status).label}</span>
          </div>
        </div>
        
        <div className="border-y border-slate-800 py-4 my-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2 text-secondary"><Calendar className="w-4 h-4 text-gold/70" /> {new Date(booking.session_date).toLocaleDateString()}</div>
            <div className="flex items-center gap-2 text-secondary"><Clock className="w-4 h-4 text-gold/70" /> {booking.session_time}</div>
            <div className="flex items-center gap-2 text-secondary"><SessionTypeIcon className="w-4 h-4 text-gold/70" /> {booking.session_type.replace(/_/g, ' ')}</div>
            <div className="flex items-center gap-2 text-secondary font-bold"><DollarSign className="w-4 h-4 text-gold/70" /> ${booking.total_amount}</div>
        </div>

        {booking.description && <p className="text-secondary text-sm mb-4 italic">&quot;{booking.description}&quot;</p>}

        <div className="flex gap-3 mt-4">
          {canPerformAction(booking, 'accept') && <button onClick={() => onAction(booking.id, 'accept')} disabled={isProcessing} className="flex-1 bg-green-500/20 text-green-300 border border-green-500/30 hover:bg-green-500/30 px-4 py-2 rounded-lg font-semibold transition disabled:opacity-50">Accept</button>}
          {canPerformAction(booking, 'decline') && <button onClick={() => onAction(booking.id, 'decline')} disabled={isProcessing} className="flex-1 bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30 px-4 py-2 rounded-lg font-semibold transition disabled:opacity-50">Decline</button>}
          {canPerformAction(booking, 'complete') && <button onClick={() => onAction(booking.id, 'complete')} disabled={isProcessing} className="flex-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 hover:bg-blue-500/30 px-4 py-2 rounded-lg font-semibold transition disabled:opacity-50">Complete</button>}
          {canPerformAction(booking, 'cancel') && <button onClick={() => onAction(booking.id, 'cancel')} disabled={isProcessing} className="flex-1 bg-slate-600/20 text-slate-300 border border-slate-600/30 hover:bg-slate-500/30 px-4 py-2 rounded-lg font-semibold transition disabled:opacity-50">Cancel</button>}
          {/* Reschedule button for confirmed bookings */}
          {booking.status === 'confirmed' && (
            <button onClick={() => alert('Reschedule functionality coming soon!')} className="flex-1 bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 hover:bg-yellow-500/30 px-4 py-2 rounded-lg font-semibold transition disabled:opacity-50">Reschedule</button>
          )}
        </div>
      </div>
    </ScaleIn>
  );
};


export default function BookingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [pastBookings, setPastBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [processingAction, setProcessingAction] = useState(null);

  const isMentor = user?.user_type === 'mentor';

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const [upcomingData, pastData] = await Promise.all([
          bookingsAPI.getUpcoming(),
          bookingsAPI.getPast()
        ]);
        
        setUpcomingBookings(Array.isArray(upcomingData) ? upcomingData : (upcomingData.results || []));
        setPastBookings(Array.isArray(pastData) ? pastData : (pastData.results || []));
      } catch (err) {
        console.error('Failed to fetch bookings:', err);
        setError('Failed to load your sessions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchBookings();
  }, [user]);

  const handleBookingAction = async (bookingId, action) => {
    setProcessingAction(bookingId);
    try {
      const apiAction = bookingsAPI[action];
      if (typeof apiAction !== 'function') throw new Error('Invalid action');
      
      const updatedBooking = await apiAction(bookingId);

      const updateState = (prev) => prev.map(b => b.id === bookingId ? updatedBooking : b).filter(Boolean);
      setUpcomingBookings(updateState);
      setPastBookings(updateState);

    } catch (error) {
      console.error(`Failed to ${action} booking:`, error);
      alert(`Could not perform action. ${error.message}`);
    } finally {
      setProcessingAction(null);
    }
  };

  const renderLoading = () => (
    <ComponentLoading message="Loading your sessions..." size="large" />
  );

  const renderError = () => (
     <div className="flex flex-col items-center justify-center min-h-[50vh] text-center bg-slate-900/50 p-8 rounded-2xl border border-slate-800">
        <div className="text-red-400 text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-white mb-2">Oops! Something went wrong.</h2>
        <p className="text-secondary mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-gold text-primary px-6 py-2 rounded-lg font-bold hover:bg-accent transition-colors"
        >
          Try Again
        </button>
      </div>
  );
  
  const renderEmptyState = () => (
    <div className="text-center py-16 bg-slate-900/50 p-8 rounded-2xl border border-slate-800">
      <Calendar className="w-16 h-16 text-slate-600 mx-auto mb-4" />
      <h3 className="text-2xl font-bold text-white mb-2">No {activeTab} sessions found</h3>
      <p className="text-slate-500 mb-6">
        {activeTab === 'upcoming' && !isMentor ? 'Ready to learn something new? Book a session with a mentor!' : 'There is nothing to show here.'}
      </p>
      {activeTab === 'upcoming' && !isMentor && (
        <button
          onClick={() => router.push('/mentors')}
          className="bg-gold text-primary px-6 py-3 rounded-xl font-bold hover:bg-accent transition-colors shadow-lg hover:shadow-gold/20"
        >
          Find a Mentor
        </button>
      )}
    </div>
  );

  const currentBookings = activeTab === 'upcoming' ? upcomingBookings : pastBookings;

  if (loading) {
    return <PageLoading message="Loading your bookings..." />;
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-slate-950 text-white">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <FadeIn>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-accent">
                {isMentor ? 'My Sessions' : 'My Bookings'}
              </span>
            </h1>
            <p className="text-xl text-slate-400 mt-2">
              {isMentor ? 'Manage your mentoring sessions and requests.' : 'Track your mentorship journey, one session at a time.'}
            </p>
          </FadeIn>

          <FadeIn className="flex gap-2 my-8 p-1 bg-slate-900 rounded-xl max-w-sm">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`w-full text-center px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${activeTab === 'upcoming' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800/50'}`}
            >
              Upcoming ({upcomingBookings.length})
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`w-full text-center px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${activeTab === 'past' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800/50'}`}
            >
              Past ({pastBookings.length})
            </button>
          </FadeIn>
          
          {loading ? renderLoading() : error ? renderError() : (
            <div className="space-y-6">
              {currentBookings.length > 0 ? (
                currentBookings.map(booking => (
                  <BookingCard 
                    key={booking.id}
                    booking={booking}
                    isMentor={isMentor}
                    onAction={handleBookingAction}
                    isProcessing={processingAction === booking.id}
                  />
                ))
              ) : renderEmptyState()}
            </div>
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
}