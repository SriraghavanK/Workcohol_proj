#!/usr/bin/env python3
"""
Test script to verify profile management functionality.
"""

import requests
import json

def test_profile_management():
    """Test profile management functionality"""
    print("👤 Testing Profile Management...")
    
    base_url = "http://localhost:8000"
    
    try:
        # Step 1: Register a new user
        print("\n📝 Step 1: Registering new user...")
        register_data = {
            "username": f"profile_test_user_{int(requests.get('http://httpbin.org/delay/0').elapsed.total_seconds() * 1000)}",
            "email": f"profile_test_{int(requests.get('http://httpbin.org/delay/0').elapsed.total_seconds() * 1000)}@example.com",
            "password": "testpass123",
            "first_name": "Profile",
            "last_name": "Test",
            "user_type": "mentee"
        }
        
        register_response = requests.post(
            f"{base_url}/api/users/register/",
            json=register_data,
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        
        if register_response.status_code != 201:
            print(f"❌ Registration failed: {register_response.status_code}")
            return
        
        print("✅ Registration successful!")
        
        # Step 2: Login
        print("\n🔐 Step 2: Logging in...")
        login_data = {
            "username": register_data["username"],
            "password": register_data["password"]
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
        
        # Step 3: Get current profile
        print("\n📋 Step 3: Getting current profile...")
        profile_response = requests.get(
            f"{base_url}/api/users/profiles/",
            headers={
                'Authorization': f"Bearer {access_token}",
                'Content-Type': 'application/json'
            },
            timeout=10
        )
        
        if profile_response.status_code == 200:
            profile_data = profile_response.json()
            print("✅ Profile retrieved successfully!")
            print(f"   User Type: {profile_data[0].get('user_type', 'N/A')}")
            print(f"   Name: {profile_data[0].get('user', {}).get('first_name', '')} {profile_data[0].get('user', {}).get('last_name', '')}")
        else:
            print(f"❌ Failed to get profile: {profile_response.status_code}")
            return
        
        # Step 4: Update profile
        print("\n✏️ Step 4: Updating profile...")
        update_data = {
            "phone_number": "+1234567890",
            "location": "San Francisco, CA",
            "bio": "Software developer passionate about learning and growth",
            "linkedin": "https://linkedin.com/in/profiletest",
            "github": "https://github.com/profiletest"
        }
        
        update_response = requests.put(
            f"{base_url}/api/users/profiles/",
            json=update_data,
            headers={
                'Authorization': f"Bearer {access_token}",
                'Content-Type': 'application/json'
            },
            timeout=10
        )
        
        print(f"Update Response Status: {update_response.status_code}")
        
        if update_response.status_code == 200:
            updated_profile = update_response.json()
            print("✅ Profile updated successfully!")
            print(f"   Phone: {updated_profile.get('phone_number', 'N/A')}")
            print(f"   Location: {updated_profile.get('location', 'N/A')}")
            print(f"   Bio: {updated_profile.get('bio', 'N/A')[:50]}...")
        else:
            print(f"❌ Profile update failed: {update_response.text}")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Profile test failed: {e}")

def test_mentor_profile():
    """Test mentor profile management"""
    print("\n👨‍🏫 Testing Mentor Profile Management...")
    
    base_url = "http://localhost:8000"
    
    try:
        # Step 1: Login as existing mentor
        print("\n🔐 Step 1: Logging in as mentor...")
        login_data = {
            "username": "john_developer",
            "password": "testpass123"
        }
        
        login_response = requests.post(
            f"{base_url}/api/token/",
            json=login_data,
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        
        if login_response.status_code != 200:
            print(f"❌ Mentor login failed: {login_response.status_code}")
            return
        
        token_data = login_response.json()
        access_token = token_data.get('access')
        print("✅ Mentor login successful!")
        
        # Step 2: Get mentor profile
        print("\n📋 Step 2: Getting mentor profile...")
        profile_response = requests.get(
            f"{base_url}/api/users/profiles/",
            headers={
                'Authorization': f"Bearer {access_token}",
                'Content-Type': 'application/json'
            },
            timeout=10
        )
        
        if profile_response.status_code == 200:
            profile_data = profile_response.json()
            print("✅ Mentor profile retrieved!")
            print(f"   User Type: {profile_data[0].get('user_type', 'N/A')}")
            print(f"   Name: {profile_data[0].get('user', {}).get('first_name', '')} {profile_data[0].get('user', {}).get('last_name', '')}")
            
            # Step 3: Get mentor details
            print("\n👨‍🏫 Step 3: Getting mentor details...")
            mentor_response = requests.get(
                f"{base_url}/api/mentors/mentors/",
                headers={
                    'Authorization': f"Bearer {access_token}",
                    'Content-Type': 'application/json'
                },
                timeout=10
            )
            
            if mentor_response.status_code == 200:
                mentors_data = mentor_response.json()
                # Find this mentor
                this_mentor = next((m for m in mentors_data if m.get('user', {}).get('username') == 'john_developer'), None)
                if this_mentor:
                    print("✅ Mentor details retrieved!")
                    print(f"   Hourly Rate: ${this_mentor.get('hourly_rate', 0)}")
                    print(f"   Experience Level: {this_mentor.get('experience_level', 'N/A')}")
                    print(f"   Company: {this_mentor.get('company', 'N/A')}")
                    print(f"   Expertise Areas: {len(this_mentor.get('expertise', []))}")
                else:
                    print("❌ Mentor not found in mentors list")
            else:
                print(f"❌ Failed to get mentor details: {mentor_response.status_code}")
        else:
            print(f"❌ Failed to get mentor profile: {profile_response.status_code}")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Mentor profile test failed: {e}")

def main():
    """Main test function"""
    print("🚀 Profile Management Test")
    print("=" * 60)
    
    # Test regular user profile management
    test_profile_management()
    
    # Test mentor profile management
    test_mentor_profile()
    
    print("\n" + "=" * 60)
    print("📊 Profile Management Test Complete!")
    print("\n🌐 You can now test the profile management at:")
    print("   http://localhost:3000/profile")

if __name__ == "__main__":
    main() 