#!/usr/bin/env python
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mentorship.settings')
django.setup()

from mentors.models import Expertise

# Sample expertise data
expertise_list = [
    "Python Development",
    "JavaScript/React",
    "Data Science",
    "Machine Learning",
    "Web Development",
    "Mobile Development",
    "DevOps",
    "Cloud Computing",
    "Database Design",
    "UI/UX Design",
    "Product Management",
    "Marketing",
    "Sales",
    "Leadership",
    "Career Development",
    "Interview Preparation",
    "Resume Writing",
    "Networking",
    "Public Speaking",
    "Project Management"
]

# Create expertise records
for expertise_name in expertise_list:
    expertise, created = Expertise.objects.get_or_create(name=expertise_name)
    if created:
        print(f"Created expertise: {expertise_name}")
    else:
        print(f"Expertise already exists: {expertise_name}")

print(f"\nTotal expertise records: {Expertise.objects.count()}") 