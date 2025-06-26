#!/usr/bin/env python
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mentorship.settings')
django.setup()

from django.contrib.auth.models import User
from mentors.models import MentorProfile
from users.models import UserProfile

print("=== CHECKING ALL USERS ===")
users = User.objects.all()
for user in users:
    print(f"User ID: {user.id}, Username: {user.username}, Email: {user.email}")
    print(f"  First Name: {user.first_name}, Last Name: {user.last_name}")
    
    # Check if user has a profile
    try:
        profile = UserProfile.objects.get(user=user)
        print(f"  User Type: {profile.user_type}")
    except UserProfile.DoesNotExist:
        print(f"  User Type: No profile found")
    
    # Check if user is a mentor
    try:
        mentor_profile = MentorProfile.objects.get(user=user)
        print(f"  Mentor Profile: Yes (ID: {mentor_profile.id})")
        print(f"  Hourly Rate: ${mentor_profile.hourly_rate}")
        print(f"  Position: {mentor_profile.position}")
        print(f"  Company: {mentor_profile.company}")
        print(f"  Experience Level: {mentor_profile.experience_level}")
    except MentorProfile.DoesNotExist:
        print(f"  Mentor Profile: No")
    
    print("-" * 50)

print("\n=== CHECKING MENTOR PROFILES ===")
mentors = MentorProfile.objects.all()
print(f"Total mentors found: {mentors.count()}")
for mentor in mentors:
    print(f"Mentor ID: {mentor.id}")
    print(f"  User: {mentor.user.username} ({mentor.user.email})")
    print(f"  Name: {mentor.user.first_name} {mentor.user.last_name}")
    print(f"  Hourly Rate: ${mentor.hourly_rate}")
    print(f"  Position: {mentor.position}")
    print(f"  Company: {mentor.company}")
    print(f"  Experience Level: {mentor.experience_level}")
    print(f"  Is Active: {mentor.is_active}")
    print("-" * 30) 