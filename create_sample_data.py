#!/usr/bin/env python3
"""
Script to create sample data for testing the mentorship platform.
"""

import os
import sys
import django

# Add the backend directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mentorship.settings')
django.setup()

from django.contrib.auth.models import User
from users.models import UserProfile
from mentors.models import MentorProfile, Expertise
from decimal import Decimal

def create_expertise_areas():
    """Create sample expertise areas"""
    print("🔧 Creating expertise areas...")
    
    expertise_areas = [
        "Python Development",
        "JavaScript/React",
        "Data Science",
        "Machine Learning",
        "Web Development",
        "Mobile Development",
        "DevOps",
        "Product Management",
        "UX/UI Design",
        "Digital Marketing",
        "Sales",
        "Leadership",
        "Career Development",
        "Startup Strategy",
        "Finance",
        "Healthcare",
        "Education",
        "Consulting"
    ]
    
    created_expertise = []
    for area in expertise_areas:
        expertise, created = Expertise.objects.get_or_create(name=area)
        if created:
            print(f"✅ Created expertise: {area}")
        else:
            print(f"⚠️ Expertise already exists: {area}")
        created_expertise.append(expertise)
    
    return created_expertise

def create_sample_mentors(expertise_list):
    """Create sample mentor profiles"""
    print("\n👨‍🏫 Creating sample mentors...")
    
    sample_mentors = [
        {
            "username": "john_developer",
            "email": "john@example.com",
            "first_name": "John",
            "last_name": "Smith",
            "password": "testpass123",
            "user_type": "mentor",
            "expertise": ["Python Development", "Web Development"],
            "experience_level": "senior",
            "company": "Google",
            "position": "Senior Software Engineer",
            "hourly_rate": 75.00,
            "availability": "Weekdays 6-9 PM, Weekends flexible",
            "bio": "Experienced Python developer with 8+ years building scalable web applications. Passionate about teaching and mentoring junior developers."
        },
        {
            "username": "sarah_datascientist",
            "email": "sarah@example.com",
            "first_name": "Sarah",
            "last_name": "Johnson",
            "password": "testpass123",
            "user_type": "mentor",
            "expertise": ["Data Science", "Machine Learning"],
            "experience_level": "expert",
            "company": "Microsoft",
            "position": "Lead Data Scientist",
            "hourly_rate": 90.00,
            "availability": "Weekends 10 AM - 6 PM",
            "bio": "PhD in Computer Science with 12+ years in data science. Specialized in machine learning and AI applications."
        },
        {
            "username": "mike_designer",
            "email": "mike@example.com",
            "first_name": "Mike",
            "last_name": "Chen",
            "password": "testpass123",
            "user_type": "mentor",
            "expertise": ["UX/UI Design", "Product Management"],
            "experience_level": "mid",
            "company": "Apple",
            "position": "UX Designer",
            "hourly_rate": 65.00,
            "availability": "Weekdays 7-9 PM",
            "bio": "Creative UX designer with 5 years experience creating user-centered digital products. Love helping others understand design thinking."
        },
        {
            "username": "emma_entrepreneur",
            "email": "emma@example.com",
            "first_name": "Emma",
            "last_name": "Wilson",
            "password": "testpass123",
            "user_type": "mentor",
            "expertise": ["Startup Strategy", "Leadership"],
            "experience_level": "expert",
            "company": "Self-employed",
            "position": "Founder & CEO",
            "hourly_rate": 120.00,
            "availability": "Flexible - message to schedule",
            "bio": "Serial entrepreneur who has built and sold 3 successful startups. Passionate about helping others navigate the startup journey."
        },
        {
            "username": "david_devops",
            "email": "david@example.com",
            "first_name": "David",
            "last_name": "Brown",
            "password": "testpass123",
            "user_type": "mentor",
            "expertise": ["DevOps", "Web Development"],
            "experience_level": "senior",
            "company": "Amazon",
            "position": "DevOps Engineer",
            "hourly_rate": 80.00,
            "availability": "Weekdays 6-8 PM",
            "bio": "DevOps specialist with 10+ years experience in cloud infrastructure and CI/CD pipelines. Love teaching automation and best practices."
        }
    ]
    
    created_mentors = []
    for mentor_data in sample_mentors:
        # Create user
        user, created = User.objects.get_or_create(
            username=mentor_data["username"],
            defaults={
                "email": mentor_data["email"],
                "first_name": mentor_data["first_name"],
                "last_name": mentor_data["last_name"]
            }
        )
        
        if created:
            user.set_password(mentor_data["password"])
            user.save()
            print(f"✅ Created user: {mentor_data['username']}")
        else:
            print(f"⚠️ User already exists: {mentor_data['username']}")
        
        # Update user profile
        profile, _ = UserProfile.objects.get_or_create(user=user)
        profile.user_type = mentor_data["user_type"]
        profile.save()
        
        # Create mentor profile
        mentor_profile, created = MentorProfile.objects.get_or_create(
            user=user,
            defaults={
                "experience_level": mentor_data["experience_level"],
                "company": mentor_data["company"],
                "position": mentor_data["position"],
                "hourly_rate": Decimal(str(mentor_data["hourly_rate"])),
                "availability": mentor_data["availability"],
                "is_verified": True,
                "is_active": True,
                "rating": Decimal("4.8"),
                "total_sessions": 25
            }
        )
        
        if created:
            print(f"✅ Created mentor profile for: {mentor_data['username']}")
        else:
            print(f"⚠️ Mentor profile already exists for: {mentor_data['username']}")
        
        # Add expertise
        for expertise_name in mentor_data["expertise"]:
            try:
                expertise = Expertise.objects.get(name=expertise_name)
                mentor_profile.expertise.add(expertise)
            except Expertise.DoesNotExist:
                print(f"❌ Expertise not found: {expertise_name}")
        
        created_mentors.append(mentor_profile)
    
    return created_mentors

def main():
    """Main function to create sample data"""
    print("🚀 Creating Sample Data for Mentorship Platform")
    print("=" * 60)
    
    # Create expertise areas
    expertise_list = create_expertise_areas()
    
    # Create sample mentors
    mentors = create_sample_mentors(expertise_list)
    
    print("\n" + "=" * 60)
    print("📊 Sample Data Creation Complete!")
    print(f"✅ Created {len(expertise_list)} expertise areas")
    print(f"✅ Created {len(mentors)} mentor profiles")
    print("\n🌐 You can now test the mentors listing at:")
    print("   http://localhost:3000/mentors")
    print("\n🔧 Backend API endpoints:")
    print("   http://localhost:8000/api/mentors/mentors/")
    print("   http://localhost:8000/api/mentors/expertise/")

if __name__ == "__main__":
    main() 