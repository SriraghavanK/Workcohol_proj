#!/usr/bin/env python3
"""
Test script to verify user registration functionality.
"""

import requests
import json
import time

def test_registration():
    """Test the user registration endpoint"""
    print("🔧 Testing User Registration...")
    
    base_url = "http://localhost:8000"
    
    # Test registration data
    test_user = {
        "username": f"testuser_{int(time.time())}",
        "email": f"testuser_{int(time.time())}@example.com",
        "password": "testpass123",
        "first_name": "Test",
        "last_name": "User",
        "user_type": "mentee"
    }
    
    try:
        # Test registration
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
            
            # Test login with the new user
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
                print("✅ Login successful after registration!")
                token_data = login_response.json()
                print(f"Access token received: {token_data.get('access', 'No token')[:20]}...")
            else:
                print(f"❌ Login failed: {login_response.status_code} - {login_response.text}")
                
        else:
            print(f"❌ Registration failed: {response.status_code}")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Registration test failed: {e}")

def test_mentor_registration():
    """Test mentor registration"""
    print("\n👨‍🏫 Testing Mentor Registration...")
    
    base_url = "http://localhost:8000"
    
    # Test mentor registration data
    test_mentor = {
        "username": f"testmentor_{int(time.time())}",
        "email": f"testmentor_{int(time.time())}@example.com",
        "password": "testpass123",
        "first_name": "Test",
        "last_name": "Mentor",
        "user_type": "mentor"
    }
    
    try:
        # Test registration
        response = requests.post(
            f"{base_url}/api/users/register/",
            json=test_mentor,
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        
        print(f"Mentor Registration Response Status: {response.status_code}")
        
        if response.status_code == 201:
            print("✅ Mentor registration successful!")
            
            # Test login
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
                
                # Test getting user profile
                profile_response = requests.get(
                    f"{base_url}/api/users/profiles/",
                    headers={
                        'Authorization': f"Bearer {token_data['access']}",
                        'Content-Type': 'application/json'
                    },
                    timeout=10
                )
                
                if profile_response.status_code == 200:
                    profile_data = profile_response.json()
                    print(f"✅ Profile retrieved: {profile_data}")
                else:
                    print(f"❌ Profile retrieval failed: {profile_response.status_code}")
                    
            else:
                print(f"❌ Mentor login failed: {login_response.status_code}")
                
        else:
            print(f"❌ Mentor registration failed: {response.status_code} - {response.text}")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Mentor registration test failed: {e}")

def main():
    """Main test function"""
    print("🚀 User Registration Test")
    print("=" * 50)
    
    # Test regular user registration
    test_registration()
    
    # Test mentor registration
    test_mentor_registration()
    
    print("\n" + "=" * 50)
    print("📊 Registration Test Complete!")

if __name__ == "__main__":
    main() 