"use client";
import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { User, Mail, Phone, MapPin, Edit, Save, X, Upload, Trash2 } from "lucide-react";
import ProtectedRoute from "../../components/ProtectedRoute";
import { userAPI } from "../../services/api";
import { FadeIn, ScaleIn, FloatingBlob } from "../../components/LightweightAnimations";
import { PageLoading } from '../../components/LoadingSpinner';
import { useAuth } from "../../contexts/AuthContext";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profilePic, setProfilePic] = useState(null); // for preview
  const [profilePicFile, setProfilePicFile] = useState(null); // for upload
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    location: "",
    bio: "",
    linkedin: "",
    github: "",
    username: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const successRef = useRef(null);
  const errorRef = useRef(null);
  const { setUser } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const profileData = await userAPI.getProfile();
        const userProfile = profileData.results?.[0] || profileData;
        setProfile(userProfile);
        setFormData({
          first_name: userProfile?.user?.first_name || "",
          last_name: userProfile?.user?.last_name || "",
          email: userProfile?.user?.email || "",
          phone_number: userProfile?.phone_number || "",
          location: userProfile?.location || "",
          bio: userProfile?.bio || "",
          linkedin: userProfile?.linkedin || "",
          github: userProfile?.github || "",
          username: userProfile?.user?.username || "",
        });
        setProfilePic(
          userProfile?.profile_picture
            ? userProfile.profile_picture + '?t=' + new Date().getTime()
            : null
        );
      } catch (err) {
        setError("Failed to load profile. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    if (success && successRef.current) {
      successRef.current.focus();
    }
    if (error && errorRef.current) {
      errorRef.current.focus();
    }
  }, [success, error]);

  // Show validation errors live as user types
  useEffect(() => {
    if (isEditing) {
      setFormErrors(validateForm());
    }
    // eslint-disable-next-line
  }, [formData, profilePicFile, isEditing]);

  const validateForm = () => {
    const errors = {};
    // First Name
    if (!formData.first_name.trim()) {
      errors.first_name = "First name is required.";
    }  if (!/^[a-zA-Z\s]{2,30}$/.test(formData.first_name.trim())) {
      errors.first_name = "First name must be 2-30 letters.";
    }
    // Last Name
    if (!formData.last_name.trim()) {
      errors.last_name = "Last name is required.";
    } else if (!/^[a-zA-Z\s]{1,30}$/.test(formData.last_name.trim())) {
      errors.last_name = "Last name must be 1-30 letters.";
    }
    // Username
    if (!formData.username.trim()) {
      errors.username = "Username is required.";
    } else if (!/^[a-zA-Z0-9_]{3,30}$/.test(formData.username.trim())) {
      errors.username = "Username must be 3-30 letters, numbers, or underscores.";
    }
    // Email
    if (!formData.email.trim()) {
      errors.email = "Email is required.";
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email.trim())) {
      errors.email = "Enter a valid email address.";
    }
    // Phone Number (optional)
    if (formData.phone_number && !/^\+?[0-9\-\s]{7,20}$/.test(formData.phone_number.trim())) {
      errors.phone_number = "Enter a valid phone number.";
    }
    // Location (optional)
    if (formData.location && formData.location.length > 100) {
      errors.location = "Location must be under 100 characters.";
    }
    // Bio (optional)
    if (formData.bio && formData.bio.length > 500) {
      errors.bio = "Bio must be under 500 characters.";
    }
    // LinkedIn (optional)
    if (formData.linkedin && !/^https?:\/\/.+\..+/.test(formData.linkedin.trim())) {
      errors.linkedin = "Enter a valid LinkedIn URL (must start with http:// or https://).";
    }
    // GitHub (optional)
    if (formData.github && !/^https?:\/\/.+\..+/.test(formData.github.trim())) {
      errors.github = "Enter a valid GitHub URL (must start with http:// or https://).";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    const errors = validateForm();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      setSaving(false);
      // Focus the first invalid field
      const firstErrorField = Object.keys(errors)[0];
      const el = document.getElementById(firstErrorField);
      if (el) el.focus();
      return;
    }
    try {
      // Only use URL.createObjectURL for preview, send File object to backend
      let profile_picture = profilePicFile ? profilePicFile : profilePic;
      await userAPI.updateProfile({ ...formData, profile_picture });
      setSuccess("Profile updated successfully!");
      setIsEditing(false);
      setProfilePicFile(null);
      // Refresh profile data
      const profileData = await userAPI.getProfile();
      const userProfile = profileData.results?.[0] || profileData;
      setProfile(userProfile);
      setProfilePic(
        userProfile?.profile_picture
          ? userProfile.profile_picture + '?t=' + new Date().getTime()
          : null
      );
      setUser({ isAuthenticated: true, ...userProfile }); // Update global user for navbar
    } catch (err) {
      setError("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      first_name: profile?.user?.first_name || "",
      last_name: profile?.user?.last_name || "",
      email: profile?.user?.email || "",
      phone_number: profile?.phone_number || "",
      location: profile?.location || "",
      bio: profile?.bio || "",
      linkedin: profile?.linkedin || "",
      github: profile?.github || "",
      username: profile?.user?.username || "",
    });
    setProfilePic(profile?.profile_picture || null); // Reset preview to backend value
    setProfilePicFile(null);
    setIsEditing(false);
    setError(null);
  };

  const handlePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicFile(file);
      setProfilePic(URL.createObjectURL(file)); // Show preview immediately
    }
  };

  const handlePicRemove = () => {
    setProfilePic(null);
    setProfilePicFile(null);
  };

  // Debug log for profilePic value
  console.log('profilePic value:', profilePic);

  if (loading) {
    return (
      <ProtectedRoute>
        <PageLoading message="Loading your profile..." />
      </ProtectedRoute>
    );
  }

  if (error && !profile) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950">
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
      <Head>
        <title>Profile | MentorConnect</title>
        <meta name="description" content="View and edit your MentorConnect profile. Update your info, bio, and social links." />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950">
        {/* Animated Background Blobs */}
        <FloatingBlob className="w-96 h-96 bg-accent/20 top-[-10%] left-[-10%]" />
        <FloatingBlob className="w-80 h-80 bg-gold/15 bottom-[-10%] right-[-10%]" />
        <FloatingBlob className="w-72 h-72 bg-secondary/20 top-[60%] right-[20%]" />

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
            <FadeIn>
              <div ref={successRef} tabIndex={-1} aria-live="polite" className="bg-green-500/20 border border-green-500/30 text-green-400 px-4 py-3 rounded-xl mb-6 focus:outline-none">
                {success}
              </div>
            </FadeIn>
          )}
          {error && (
            <FadeIn>
              <div ref={errorRef} tabIndex={-1} aria-live="assertive" className="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-6 focus:outline-none">
                {error}
              </div>
            </FadeIn>
          )}

          {/* Profile Form */}
          <FadeIn className="bg-slate-900/80 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-slate-700">
            {/* Profile Picture Section */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative group">
                {profilePic &&
                 typeof profilePic === 'string' &&
                 profilePic.trim() !== '' &&
                 profilePic !== 'null' &&
                 profilePic !== 'undefined' &&
                 !profilePic.startsWith('blob:') ? (
                  <Image
                    src={profilePic.startsWith('http') ? profilePic : `http://localhost:8000${profilePic}`}
                    alt="Profile picture"
                    width={250}
                    height={250}
                    className="object-cover border-4 border-gold/40 shadow-lg"
                    style={{borderRadius: '50%' , height:'180px',width:'180px'}}
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-slate-700 border-4 border-gold/40 flex items-center justify-center text-gold text-4xl font-bold shadow-lg">
                    {formData.username?.[0]?.toUpperCase() || '?'}
                  </div>
                )}
                {isEditing && profilePic && (
                  <button
                    type="button"
                    onClick={handlePicRemove}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600 transition-colors"
                    title="Remove picture"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
              {isEditing && (
                <div className="mt-3 flex flex-col items-center gap-2">
                  <label htmlFor="profilePicUpload" className="flex items-center gap-2 cursor-pointer bg-gold/90 hover:bg-gold text-primary px-4 py-2 rounded-lg font-medium shadow transition-colors">
                    <Upload size={18} />
                    <span>Upload New</span>
                    <input
                      id="profilePicUpload"
                      type="file"
                      accept="image/*"
                      onChange={handlePicChange}
                      className="hidden"
                    />
                  </label>
                  {profilePicFile && (
                    <span className="text-xs text-secondary">Selected: {profilePicFile.name}</span>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white">Personal Information</h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 bg-gold text-primary px-4 py-2 rounded-lg font-semibold hover:bg-accent transition-colors focus:outline-none focus:ring-2 focus:ring-gold"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSubmit}
                    disabled={saving}
                    className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <Save className="w-4 h-4" />
                    <span>{saving ? "Saving..." : "Save Changes"}</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Box 1: Personal Info */}
              <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 mb-6">
                <h3 className="text-lg font-bold text-gold mb-4">Personal Info</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="first_name" className="block text-sm font-semibold text-secondary mb-2">
                      First Name
                    </label>
                    <input
                      id="first_name"
                      type="text"
                      value={formData.first_name}
                      onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all disabled:opacity-50 ${formErrors.first_name ? 'border-red-500' : ''}`}
                      placeholder="First name"
                      aria-invalid={!!formErrors.first_name}
                      aria-describedby={formErrors.first_name ? 'first_name-error' : undefined}
                    />
                    {formErrors.first_name && (
                      <p id="first_name-error" className="text-red-400 text-xs mt-1">{formErrors.first_name}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="last_name" className="block text-sm font-semibold text-secondary mb-2">
                      Last Name
                    </label>
                    <input
                      id="last_name"
                      type="text"
                      value={formData.last_name}
                      onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all disabled:opacity-50 ${formErrors.last_name ? 'border-red-500' : ''}`}
                      placeholder="Last name"
                      aria-invalid={!!formErrors.last_name}
                      aria-describedby={formErrors.last_name ? 'last_name-error' : undefined}
                    />
                    {formErrors.last_name && (
                      <p id="last_name-error" className="text-red-400 text-xs mt-1">{formErrors.last_name}</p>
                    )}
                  </div>
                </div>
                <div className="mt-6">
                  <label htmlFor="username" className="block text-sm font-semibold text-secondary mb-2">
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    value={formData.username || ''}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all disabled:opacity-50 ${formErrors.username ? 'border-red-500' : ''}`}
                    placeholder="Username"
                    aria-invalid={!!formErrors.username}
                    aria-describedby={formErrors.username ? 'username-error' : undefined}
                  />
                  {formErrors.username && (
                    <p id="username-error" className="text-red-400 text-xs mt-1">{formErrors.username}</p>
                  )}
                </div>
                <div className="mt-6">
                  <label htmlFor="email" className="block text-sm font-semibold text-secondary mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all disabled:opacity-50 ${formErrors.email ? 'border-red-500' : ''}`}
                    placeholder="Email address"
                    aria-invalid={!!formErrors.email}
                    aria-describedby={formErrors.email ? 'email-error' : undefined}
                  />
                  {formErrors.email && (
                    <p id="email-error" className="text-red-400 text-xs mt-1">{formErrors.email}</p>
                  )}
                </div>
              </div>

              {/* Box 2: Contact & Location */}
              <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 mb-6">
                <h3 className="text-lg font-bold text-gold mb-4">Contact & Location</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone_number" className="block text-sm font-semibold text-secondary mb-2">
                      Phone
                    </label>
                    <input
                      id="phone_number"
                      type="tel"
                      value={formData.phone_number}
                      onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all disabled:opacity-50 ${formErrors.phone_number ? 'border-red-500' : ''}`}
                      placeholder="Phone number"
                      aria-invalid={!!formErrors.phone_number}
                      aria-describedby={formErrors.phone_number ? 'phone_number-error' : undefined}
                    />
                    {formErrors.phone_number && (
                      <p id="phone_number-error" className="text-red-400 text-xs mt-1">{formErrors.phone_number}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="location" className="block text-sm font-semibold text-secondary mb-2">
                      Location
                    </label>
                    <input
                      id="location"
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all disabled:opacity-50 ${formErrors.location ? 'border-red-500' : ''}`}
                      placeholder="Location"
                      aria-invalid={!!formErrors.location}
                      aria-describedby={formErrors.location ? 'location-error' : undefined}
                    />
                    {formErrors.location && (
                      <p id="location-error" className="text-red-400 text-xs mt-1">{formErrors.location}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Box 3: Bio & Social */}
              <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700">
                <h3 className="text-lg font-bold text-gold mb-4">Bio & Social</h3>
                <div className="mb-6">
                  <label htmlFor="bio" className="block text-sm font-semibold text-secondary mb-2">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all disabled:opacity-50 ${formErrors.bio ? 'border-red-500' : ''}`}
                    placeholder="Tell us about yourself"
                    rows={4}
                    aria-invalid={!!formErrors.bio}
                    aria-describedby={formErrors.bio ? 'bio-error' : undefined}
                  />
                  {formErrors.bio && (
                    <p id="bio-error" className="text-red-400 text-xs mt-1">{formErrors.bio}</p>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="linkedin" className="block text-sm font-semibold text-secondary mb-2">
                      LinkedIn
                    </label>
                    <input
                      id="linkedin"
                      type="url"
                      value={formData.linkedin}
                      onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all disabled:opacity-50 ${formErrors.linkedin ? 'border-red-500' : ''}`}
                      placeholder="LinkedIn profile URL"
                      aria-invalid={!!formErrors.linkedin}
                      aria-describedby={formErrors.linkedin ? 'linkedin-error' : undefined}
                    />
                    {formErrors.linkedin && (
                      <p id="linkedin-error" className="text-red-400 text-xs mt-1">{formErrors.linkedin}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="github" className="block text-sm font-semibold text-secondary mb-2">
                      GitHub
                    </label>
                    <input
                      id="github"
                      type="url"
                      value={formData.github}
                      onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all disabled:opacity-50 ${formErrors.github ? 'border-red-500' : ''}`}
                      placeholder="GitHub profile URL"
                      aria-invalid={!!formErrors.github}
                      aria-describedby={formErrors.github ? 'github-error' : undefined}
                    />
                    {formErrors.github && (
                      <p id="github-error" className="text-red-400 text-xs mt-1">{formErrors.github}</p>
                    )}
                  </div>
                </div>
                {formErrors.profile_picture && (
                  <p className="text-red-400 text-xs mt-2">{formErrors.profile_picture}</p>
                )}
              </div>
            </form>
          </FadeIn>
        </div>
      </div>
    </ProtectedRoute>
  );
} 