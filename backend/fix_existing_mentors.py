#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mentorship.settings')
django.setup()

from users.models import UserProfile
from mentors.models import MentorProfile

print("Fixing existing mentors...")

# Find all users with user_type='mentor' or 'mentoro' (typo)
profiles_to_fix = UserProfile.objects.filter(user_type__in=['mentor', 'mentoro'])

for profile in profiles_to_fix:
    user = profile.user
    
    # Fix typo
    if profile.user_type == 'mentoro':
        profile.user_type = 'mentor'
        profile.save()
        print(f"Fixed typo for {user.username}")
    
    # Create MentorProfile if missing
    if not MentorProfile.objects.filter(user=user).exists():
        MentorProfile.objects.create(
            user=user,
            hourly_rate=50.00,
            experience_level='junior',
            availability='Flexible',
            is_active=True
        )
        print(f"Created MentorProfile for {user.username}")
    else:
        print(f"MentorProfile already exists for {user.username}")

print("Done!") 