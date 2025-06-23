"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Calendar, Clock, DollarSign, Video, Phone, MessageSquare, MapPin, Star } from "lucide-react";
import { mentorsAPI, bookingsAPI } from "../../../services/api";
import { useAuth } from "../../../contexts/AuthContext";
import ProtectedRoute from "../../../components/ProtectedRoute";
import { FadeIn, ScaleIn } from "../../../components/LightweightAnimations";

export default function BookingPage() {
  const { mentorId } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingData, setBookingData] = useState({
    session_type: 'video_call',
    session_date: '',
    session_time: '',
    duration_minutes: 60,
    topic: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchMentor = async () => {
      try {
        setLoading(true);
        const mentorData = await mentorsAPI.getById(mentorId);
        setMentor(mentorData);
      } catch (err) {
        console.error('Failed to fetch mentor:', err);
        setError('Failed to load mentor details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (mentorId) {
      fetchMentor();
    }
  }, [mentorId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!bookingData.session_date || !bookingData.session_time || !bookingData.topic) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const bookingPayload = {
        ...bookingData,
        mentor: mentorId
      };
      
      await bookingsAPI.create(bookingPayload);
      
      // Redirect to dashboard with success message
      router.push('/dashboard?booking=success');
    } catch (error) {
      console.error('Booking failed:', error);
      alert('Failed to create booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value
    });
  };

  const sessionTypes = [
    { value: 'video_call', label: 'Video Call', icon: Video, description: 'Face-to-face video meeting' },
    { value: 'audio_call', label: 'Audio Call', icon: Phone, description: 'Voice-only conversation' },
    { value: 'chat', label: 'Chat', icon: MessageSquare, description: 'Text-based messaging' },
    { value: 'in_person', label: 'In Person', icon: MapPin, description: 'Physical meeting' }
  ];

  const durationOptions = [
    { value: 30, label: '30 minutes' },
    { value: 60, label: '1 hour' },
    { value: 90, label: '1.5 hours' },
    { value: 120, label: '2 hours' }
  ];

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-primary via-background to-secondary flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gold mx-auto mb-4"></div>
            <p className="text-secondary text-lg">Loading mentor details...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !mentor) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-primary via-background to-secondary flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-400 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-white mb-2">Oops!</h2>
            <p className="text-secondary mb-4">{error || 'Mentor not found'}</p>
            <button 
              onClick={() => router.push('/mentors')} 
              className="bg-gold text-primary px-6 py-2 rounded-lg font-bold hover:bg-accent transition-colors"
            >
              Back to Mentors
            </button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  // Calculate total amount
  const durationHours = bookingData.duration_minutes / 60;
  const totalAmount = mentor.hourly_rate * durationHours;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-primary via-background to-secondary">
        <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
          {/* Header */}
          <FadeIn className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gold mb-4">
              Book a Session
            </h1>
            <p className="text-xl text-secondary">
              Schedule your mentorship session with {mentor.user?.first_name} {mentor.user?.last_name}
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Mentor Info Card */}
            <FadeIn className="lg:col-span-1">
              <div className="bg-white/10 backdrop-blur-2xl rounded-2xl p-6 border border-white/20 sticky top-8">
                <div className="text-center mb-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-gold to-accent rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold text-primary">
                    {mentor.user?.first_name?.[0]}{mentor.user?.last_name?.[0]}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {mentor.user?.first_name} {mentor.user?.last_name}
                  </h3>
                  <p className="text-secondary mb-4">{mentor.bio || 'Experienced mentor'}</p>
                  
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Star className="w-5 h-5 text-gold fill-current" />
                    <span className="font-semibold text-white">
                      {typeof mentor.rating === "number" ? mentor.rating.toFixed(1) : "0.0"}
                    </span>
                    <span className="text-secondary text-sm">({mentor.review_count || 0} reviews)</span>
                  </div>
                  
                  <div className="text-3xl font-bold text-gold mb-2">
                    ${mentor.hourly_rate}/hr
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-secondary">
                    <MapPin className="w-5 h-5" />
                    <span>{mentor.location || 'Remote'}</span>
                  </div>
                  
                  {mentor.expertise && mentor.expertise.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-secondary mb-2">Expertise:</p>
                      <div className="flex flex-wrap gap-2">
                        {mentor.expertise.slice(0, 3).map((exp) => (
                          <span key={exp.id} className="px-2 py-1 bg-accent/20 text-accent text-xs rounded-full">
                            {exp.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </FadeIn>

            {/* Booking Form */}
            <FadeIn className="lg:col-span-2">
              <div className="bg-white/10 backdrop-blur-2xl rounded-2xl p-8 border border-white/20">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Session Type */}
                  <div>
                    <label className="block text-sm font-semibold text-secondary mb-4">
                      Session Type
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      {sessionTypes.map((type) => {
                        const Icon = type.icon;
                        return (
                          <button
                            key={type.value}
                            type="button"
                            onClick={() => setBookingData({ ...bookingData, session_type: type.value })}
                            className={`p-4 rounded-xl border transition-all text-left ${
                              bookingData.session_type === type.value
                                ? "bg-gold/20 border-gold text-gold"
                                : "bg-white/10 border-white/30 text-white hover:bg-white/20"
                            }`}
                          >
                            <Icon className="w-6 h-6 mb-2" />
                            <div className="font-semibold">{type.label}</div>
                            <div className="text-xs opacity-75">{type.description}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Date and Time */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="session_date" className="block text-sm font-semibold text-secondary mb-2">
                        Date
                      </label>
                      <input
                        type="date"
                        id="session_date"
                        name="session_date"
                        value={bookingData.session_date}
                        onChange={handleChange}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-transparent transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="session_time" className="block text-sm font-semibold text-secondary mb-2">
                        Time
                      </label>
                      <input
                        type="time"
                        id="session_time"
                        name="session_time"
                        value={bookingData.session_time}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-transparent transition-all"
                        required
                      />
                    </div>
                  </div>

                  {/* Duration */}
                  <div>
                    <label htmlFor="duration_minutes" className="block text-sm font-semibold text-secondary mb-2">
                      Duration
                    </label>
                    <select
                      id="duration_minutes"
                      name="duration_minutes"
                      value={bookingData.duration_minutes}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-transparent transition-all"
                    >
                      {durationOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Topic */}
                  <div>
                    <label htmlFor="topic" className="block text-sm font-semibold text-secondary mb-2">
                      What would you like to discuss? *
                    </label>
                    <input
                      type="text"
                      id="topic"
                      name="topic"
                      value={bookingData.topic}
                      onChange={handleChange}
                      placeholder="e.g., Career advice, Technical interview prep, Project guidance"
                      className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-semibold text-secondary mb-2">
                      Additional Details (Optional)
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={bookingData.description}
                      onChange={handleChange}
                      placeholder="Provide more context about what you'd like to cover in this session..."
                      rows={4}
                      className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-transparent transition-all resize-none"
                    />
                  </div>

                  {/* Total Amount */}
                  <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                    <div className="flex items-center justify-between">
                      <span className="text-secondary">Total Amount:</span>
                      <span className="text-2xl font-bold text-gold">${totalAmount.toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-secondary mt-1">
                      {bookingData.duration_minutes} minutes × ${mentor.hourly_rate}/hour
                    </p>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-gold to-accent text-primary font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Creating Booking..." : "Book Session"}
                  </button>
                </form>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 