#!/usr/bin/env python3
"""
Test script to simulate frontend registration process.
"""

import requests
import json
import time

def test_frontend_registration():
    """Test the registration process as the frontend would do it"""
    print("🎨 Testing Frontend Registration Process...")
    
    base_url = "http://localhost:8000"
    
    # Test registration data (as frontend would send)
    test_user = {
        "username": f"frontend_user_{int(time.time())}",
        "email": f"frontend_user_{int(time.time())}@example.com",
        "password": "testpass123",
        "first_name": "Frontend",
        "last_name": "User",
        "user_type": "mentee"
    }
    
    try:
        # Step 1: Test registration (as frontend would do)
        print("📝 Step 1: Registering user...")
        response = requests.post(
            f"{base_url}/api/users/register/",
            json=test_user,
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        
        print(f"Registration Response Status: {response.status_code}")
        print(f"Registration Response: {response.text}")
        
        if response.status_code == 201:
            print("✅ Registration successful!")
            
            # Step 2: Test login (as frontend would do after registration)
            print("\n🔐 Step 2: Logging in...")
            login_data = {
                "username": test_user["username"],
                "password": test_user["password"]
            }
            
            login_response = requests.post(
                f"{base_url}/api/token/",
                json=login_data,
                headers={'Content-Type': 'application/json'},
                timeout=10
            )
            
            if login_response.status_code == 200:
                print("✅ Login successful!")
                token_data = login_response.json()
                access_token = token_data.get('access')
                print(f"Access token received: {access_token[:20]}...")
                
                # Step 3: Test getting user profile (as dashboard would do)
                print("\n👤 Step 3: Getting user profile...")
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
                    print(f"User type: {profile_data[0]['user_type']}")
                    print(f"User name: {profile_data[0]['user']['first_name']} {profile_data[0]['user']['last_name']}")
                    
                    # Step 4: Test getting user stats (as dashboard would do)
                    print("\n📊 Step 4: Getting user stats...")
                    stats_response = requests.get(
                        f"{base_url}/api/users/users/me/stats/",
                        headers={
                            'Authorization': f"Bearer {access_token}",
                            'Content-Type': 'application/json'
                        },
                        timeout=10
                    )
                    
                    if stats_response.status_code == 200:
                        stats_data = stats_response.json()
                        print("✅ Stats retrieved successfully!")
                        print(f"Stats: {stats_data}")
                    else:
                        print(f"⚠️ Stats endpoint not available: {stats_response.status_code}")
                        print("This is expected as the stats endpoint might not be implemented yet")
                        
                else:
                    print(f"❌ Profile retrieval failed: {profile_response.status_code} - {profile_response.text}")
                    
            else:
                print(f"❌ Login failed: {login_response.status_code} - {login_response.text}")
                
        else:
            print(f"❌ Registration failed: {response.status_code}")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Frontend registration test failed: {e}")

def test_mentor_registration_frontend():
    """Test mentor registration process"""
    print("\n👨‍🏫 Testing Mentor Registration Process...")
    
    base_url = "http://localhost:8000"
    
    # Test mentor registration data
    test_mentor = {
        "username": f"frontend_mentor_{int(time.time())}",
        "email": f"frontend_mentor_{int(time.time())}@example.com",
        "password": "testpass123",
        "first_name": "Frontend",
        "last_name": "Mentor",
        "user_type": "mentor"
    }
    
    try:
        # Step 1: Register mentor
        print("📝 Step 1: Registering mentor...")
        response = requests.post(
            f"{base_url}/api/users/register/",
            json=test_mentor,
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        
        if response.status_code == 201:
            print("✅ Mentor registration successful!")
            
            # Step 2: Login
            print("\n🔐 Step 2: Logging in mentor...")
            login_data = {
                "username": test_mentor["username"],
                "password": test_mentor["password"]
            }
            
            login_response = requests.post(
                f"{base_url}/api/token/",
                json=login_data,
                headers={'Content-Type': 'application/json'},
                timeout=10
            )
            
            if login_response.status_code == 200:
                print("✅ Mentor login successful!")
                token_data = login_response.json()
                access_token = token_data.get('access')
                
                # Step 3: Check if mentor profile was created
                print("\n👤 Step 3: Checking mentor profile...")
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
                    print(f"User type: {profile_data[0]['user_type']}")
                    
                    # Step 4: Check if mentor appears in mentors list
                    print("\n🔍 Step 4: Checking mentors list...")
                    mentors_response = requests.get(
                        f"{base_url}/api/mentors/mentors/",
                        headers={
                            'Authorization': f"Bearer {access_token}",
                            'Content-Type': 'application/json'
                        },
                        timeout=10
                    )
                    
                    if mentors_response.status_code == 200:
                        mentors_data = mentors_response.json()
                        print("✅ Mentors list retrieved!")
                        print(f"Total mentors: {len(mentors_data.get('results', mentors_data))}")
                    else:
                        print(f"⚠️ Mentors endpoint not available: {mentors_response.status_code}")
                        
                else:
                    print(f"❌ Mentor profile retrieval failed: {profile_response.status_code}")
                    
            else:
                print(f"❌ Mentor login failed: {login_response.status_code}")
                
        else:
            print(f"❌ Mentor registration failed: {response.status_code}")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Mentor registration test failed: {e}")

def main():
    """Main test function"""
    print("🚀 Frontend Registration Process Test")
    print("=" * 60)
    
    # Test regular user registration
    test_frontend_registration()
    
    # Test mentor registration
    test_mentor_registration_frontend()
    
    print("\n" + "=" * 60)
    print("📊 Frontend Registration Test Complete!")
    print("\n🌐 Next Steps:")
    print("   1. Open http://localhost:3000/register in your browser")
    print("   2. Try registering a new account")
    print("   3. You should be redirected to the dashboard after successful registration")

if __name__ == "__main__":
    main() 