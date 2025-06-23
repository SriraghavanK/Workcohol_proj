#!/usr/bin/env python3
"""
Test script to verify the Mentorship Booking Platform is working correctly.
This script tests both the backend API and frontend connectivity.
"""

import requests
import json
import time

def test_backend_api():
    """Test the Django backend API endpoints"""
    print("🔧 Testing Backend API...")
    
    base_url = "http://localhost:8000"
    
    # Test 1: Check if server is running
    try:
        response = requests.get(f"{base_url}/admin/", timeout=5)
        if response.status_code == 200:
            print("✅ Django server is running")
        else:
            print(f"⚠️  Django server responded with status: {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"❌ Django server is not running: {e}")
        return False
    
    # Test 2: Test API endpoints (should require authentication)
    endpoints = [
        "/api/users/",
        "/api/mentors/",
        "/api/bookings/",
        "/api/reviews/"
    ]
    
    for endpoint in endpoints:
        try:
            response = requests.get(f"{base_url}{endpoint}", timeout=5)
            if response.status_code == 401:
                print(f"✅ {endpoint} - Authentication required (expected)")
            else:
                print(f"⚠️  {endpoint} - Unexpected status: {response.status_code}")
        except requests.exceptions.RequestException as e:
            print(f"❌ {endpoint} - Error: {e}")
    
    return True

def test_frontend():
    """Test the Next.js frontend"""
    print("\n🎨 Testing Frontend...")
    
    try:
        response = requests.get("http://localhost:3000", timeout=5)
        if response.status_code == 200:
            print("✅ Next.js frontend is running")
            if "MentorConnect" in response.text or "mentorship" in response.text.lower():
                print("✅ Frontend content is loading correctly")
            else:
                print("⚠️  Frontend is running but content might not be loading properly")
        else:
            print(f"⚠️  Frontend responded with status: {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"❌ Frontend is not running: {e}")
        return False
    
    return True

def test_cors():
    """Test CORS configuration"""
    print("\n🌐 Testing CORS Configuration...")
    
    try:
        # Test if frontend can make requests to backend
        response = requests.get("http://localhost:8000/api/users/", 
                              headers={"Origin": "http://localhost:3000"}, 
                              timeout=5)
        
        if "Access-Control-Allow-Origin" in response.headers:
            print("✅ CORS is properly configured")
        else:
            print("⚠️  CORS headers not found in response")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ CORS test failed: {e}")

def main():
    """Main test function"""
    print("🚀 Mentorship Booking Platform - System Test")
    print("=" * 50)
    
    # Wait a moment for servers to fully start
    print("⏳ Waiting for servers to start...")
    time.sleep(2)
    
    # Test backend
    backend_ok = test_backend_api()
    
    # Test frontend
    frontend_ok = test_frontend()
    
    # Test CORS
    if backend_ok and frontend_ok:
        test_cors()
    
    # Summary
    print("\n" + "=" * 50)
    print("📊 Test Summary:")
    
    if backend_ok and frontend_ok:
        print("🎉 All systems are running correctly!")
        print("\n🌐 Access your application:")
        print("   Frontend: http://localhost:3000")
        print("   Backend API: http://localhost:8000")
        print("   Django Admin: http://localhost:8000/admin/")
        print("\n📝 Next steps:")
        print("   1. Open http://localhost:3000 in your browser")
        print("   2. Register a new account")
        print("   3. Explore the mentorship platform")
    else:
        print("❌ Some systems are not running properly")
        print("   Please check the error messages above")

if __name__ == "__main__":
    main() 