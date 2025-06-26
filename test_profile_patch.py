#!/usr/bin/env python3
"""
Test script to verify profile update with PATCH method.
"""

import requests
import json

def test_profile_patch():
    """Test profile update with PATCH method"""
    print("👤 Testing Profile Update with PATCH...")
    
    base_url = "http://localhost:8000"
    
    try:
        # Step 1: Login as existing user
        print("\n🔐 Step 1: Logging in...")
        login_data = {
            "username": "profile_test_user_1750517167",
            "password": "testpass123"
        }
        
        login_response = requests.post(
            f"{base_url}/api/token/",
            json=login_data,
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        
        if login_response.status_code != 200:
            print(f"❌ Login failed: {login_response.status_code}")
            return
        
        token_data = login_response.json()
        access_token = token_data.get('access')
        print("✅ Login successful!")
        
        # Step 2: Get current profile
        print("\n📋 Step 2: Getting current profile...")
        profile_response = requests.get(
            f"{base_url}/api/users/profiles/",
            headers={
                'Authorization': f"Bearer {access_token}",
                'Content-Type': 'application/json'
            },
            timeout=10
        )
        
        if profile_response.status_code != 200:
            print(f"❌ Failed to get profile: {profile_response.status_code}")
            return
        
        profile_data = profile_response.json()
        profile_id = profile_data[0]['id']
        print(f"✅ Profile retrieved! ID: {profile_id}")
        
        # Step 3: Update profile with PATCH
        print("\n✏️ Step 3: Updating profile with PATCH...")
        update_data = {
            "phone_number": "+1234567890",
            "location": "San Francisco, CA",
            "bio": "Software developer passionate about learning and growth"
        }
        
        patch_response = requests.patch(
            f"{base_url}/api/users/profiles/{profile_id}/",
            json=update_data,
            headers={
                'Authorization': f"Bearer {access_token}",
                'Content-Type': 'application/json'
            },
            timeout=10
        )
        
        print(f"PATCH Response Status: {patch_response.status_code}")
        
        if patch_response.status_code == 200:
            updated_profile = patch_response.json()
            print("✅ Profile updated successfully with PATCH!")
            print(f"   Phone: {updated_profile.get('phone_number', 'N/A')}")
            print(f"   Location: {updated_profile.get('location', 'N/A')}")
            print(f"   Bio: {updated_profile.get('bio', 'N/A')[:50]}...")
        else:
            print(f"❌ Profile PATCH failed: {patch_response.text}")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Profile PATCH test failed: {e}")

if __name__ == "__main__":
    test_profile_patch() 