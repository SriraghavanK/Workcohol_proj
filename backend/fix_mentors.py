#!/usr/bin/env python
import os
print('Script started')
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mentorship.settings')
django.setup()
print('Django setup complete')

from django.contrib.auth.models import User
from users.models import UserProfile
from mentors.models import MentorProfile, Expertise

# Default values for new MentorProfiles
DEFAULT_HOURLY_RATE = 50.0
DEFAULT_EXPERIENCE_LEVEL = 'junior'
DEFAULT_AVAILABILITY = 'Flexible'

fixed = 0
for profile in UserProfile.objects.filter(user_type__in=['mentor', 'mentoro']):
    user = profile.user
    # Fix typo in user_type
    if profile.user_type == 'mentoro':
        profile.user_type = 'mentor'
        profile.save()
        print(f"Fixed typo in user_type for user {user.username}")
    # Check if MentorProfile exists
    if not MentorProfile.objects.filter(user=user).exists():
        mentor = MentorProfile.objects.create(
            user=user,
            hourly_rate=DEFAULT_HOURLY_RATE,
            experience_level=DEFAULT_EXPERIENCE_LEVEL,
            availability=DEFAULT_AVAILABILITY,
            is_active=True
        )
        print(f"Created MentorProfile for user {user.username}")
        fixed += 1
    else:
        print(f"MentorProfile already exists for user {user.username}")

print(f"\nTotal MentorProfiles created: {fixed}") 