#!/usr/bin/env python
import os
print('Script started')
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mentorship.settings')
django.setup()
print('Django setup complete') 