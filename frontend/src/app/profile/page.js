"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { User, Mail, Phone, MapPin, Edit, Save, X } from "lucide-react";
import ProtectedRoute from "../../components/ProtectedRoute";
import { userAPI } from "../../services/api";
import { FadeIn, ScaleIn } from "../../components/LightweightAnimations";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    linkedin_url: "",
    github_url: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const profileData = await userAPI.getProfile();
        const userProfile = profileData.results?.[0] || profileData;
        setProfile(userProfile);
        
        // Initialize form data
        setFormData({
          first_name: userProfile?.user?.first_name || "",
          last_name: userProfile?.user?.last_name || "",
          email: userProfile?.user?.email || "",
          phone: userProfile?.phone || "",
          location: userProfile?.location || "",
          bio: userProfile?.bio || "",
          linkedin_url: userProfile?.linkedin_url || "",
          github_url: userProfile?.github_url || "",
        });
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        setError('Failed to load profile. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      await userAPI.updateProfile(formData);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      
      // Refresh profile data
      const profileData = await userAPI.getProfile();
      const userProfile = profileData.results?.[0] || profileData;
      setProfile(userProfile);
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original values
    setFormData({
      first_name: profile?.user?.first_name || "",
      last_name: profile?.user?.last_name || "",
      email: profile?.user?.email || "",
      phone: profile?.phone || "",
      location: profile?.location || "",
      bio: profile?.bio || "",
      linkedin_url: profile?.linkedin_url || "",
      github_url: profile?.github_url || "",
    });
    setIsEditing(false);
    setError(null);
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-primary via-background to-secondary flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gold mx-auto mb-4"></div>
            <p className="text-secondary text-lg">Loading profile...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error && !profile) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-primary via-background to-secondary flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-400 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-white mb-2">Oops!</h2>
            <p className="text-secondary mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-gold text-primary px-6 py-2 rounded-lg font-bold hover:bg-accent transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-primary via-background to-secondary">
        {/* Animated Background Blobs */}
        <FadeIn className="w-96 h-96 bg-accent/20 top-[-10%] left-[-10%]" style={{ zIndex: 0 }} />
        <FadeIn className="w-80 h-80 bg-gold/15 bottom-[-10%] right-[-10%]" style={{ zIndex: 0 }} />
        <FadeIn className="w-72 h-72 bg-secondary/20 top-[60%] right-[20%]" style={{ zIndex: 0 }} />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <FadeIn className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gold mb-4">
              Your Profile
            </h1>
            <p className="text-xl text-secondary">
              Manage your personal information and preferences
            </p>
          </FadeIn>

          {/* Success/Error Messages */}
          {success && (
            <FadeIn className="bg-green-500/20 border border-green-500/30 text-green-400 px-4 py-3 rounded-xl mb-6">
              {success}
            </FadeIn>
          )}

          {error && (
            <FadeIn className="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-6">
              {error}
            </FadeIn>
          )}

          {/* Profile Form */}
          <FadeIn className="bg-white/10 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-white/20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white">Personal Information</h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 bg-gold text-primary px-4 py-2 rounded-lg font-semibold hover:bg-accent transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSubmit}
                    disabled={saving}
                    className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{saving ? "Saving..." : "Save Changes"}</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Picture */}
              <div className="text-center mb-8">
                <div className="relative inline-block">
                  <Image
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(formData.first_name + ' ' + formData.last_name)}&background=f59e0b&color=fff&size=120`}
                    alt="Profile"
                    width={120}
                    height={120}
                    className="w-30 h-30 rounded-full border-4 border-gold/20"
                  />
                  {isEditing && (
                    <button
                      type="button"
                      className="absolute bottom-0 right-0 bg-gold text-primary p-2 rounded-full hover:bg-accent transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-secondary mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-transparent transition-all disabled:opacity-50"
                    placeholder="First name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-secondary mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-transparent transition-all disabled:opacity-50"
                    placeholder="Last name"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-secondary mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-transparent transition-all disabled:opacity-50"
                  placeholder="Email address"
                />
              </div>

              {/* Phone and Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-secondary mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-transparent transition-all disabled:opacity-50"
                    placeholder="Phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-secondary mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-transparent transition-all disabled:opacity-50"
                    placeholder="City, Country"
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-semibold text-secondary mb-2">
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  disabled={!isEditing}
                  rows={4}
                  className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-transparent transition-all disabled:opacity-50 resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>

              {/* Social Links */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-secondary mb-2">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    value={formData.linkedin_url}
                    onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-transparent transition-all disabled:opacity-50"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-secondary mb-2">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={formData.github_url}
                    onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-transparent transition-all disabled:opacity-50"
                    placeholder="https://github.com/yourusername"
                  />
                </div>
              </div>
            </form>
          </FadeIn>

          {/* Back to Dashboard */}
          <ScaleIn className="text-center mt-8">
            <Link 
              href="/dashboard"
              className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/30 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/20 transition-all"
            >
              <span>← Back to Dashboard</span>
            </Link>
          </ScaleIn>
        </div>
      </div>
    </ProtectedRoute>
  );
} 