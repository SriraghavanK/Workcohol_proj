#!/usr/bin/env python3
"""
Test script to verify the mentors API is working correctly.
"""

import requests
import json

def test_mentors_api():
    """Test the mentors API endpoints"""
    print("👨‍🏫 Testing Mentors API...")
    
    base_url = "http://localhost:8000"
    
    try:
        # Test 1: Get all mentors (public endpoint)
        print("\n📋 Test 1: Getting all mentors...")
        mentors_response = requests.get(
            f"{base_url}/api/mentors/mentors/",
            timeout=10
        )
        
        print(f"Mentors Response Status: {mentors_response.status_code}")
        
        if mentors_response.status_code == 200:
            mentors_data = mentors_response.json()
            print(f"✅ Found {len(mentors_data)} mentors")
            
            # Display mentor info
            for i, mentor in enumerate(mentors_data[:3]):  # Show first 3
                user = mentor.get('user', {})
                name = f"{user.get('first_name', '')} {user.get('last_name', '')}".strip()
                print(f"   {i+1}. {name} - ${mentor.get('hourly_rate', 0)}/hr - {mentor.get('experience_level', 'N/A')}")
        else:
            print(f"❌ Failed to get mentors: {mentors_response.text}")
        
        # Test 2: Get expertise areas
        print("\n🎯 Test 2: Getting expertise areas...")
        expertise_response = requests.get(
            f"{base_url}/api/mentors/expertise/",
            timeout=10
        )
        
        print(f"Expertise Response Status: {expertise_response.status_code}")
        
        if expertise_response.status_code == 200:
            expertise_data = expertise_response.json()
            print(f"✅ Found {len(expertise_data)} expertise areas")
            
            # Display expertise info
            for i, expertise in enumerate(expertise_data[:5]):  # Show first 5
                print(f"   {i+1}. {expertise.get('name', 'N/A')}")
        else:
            print(f"❌ Failed to get expertise: {expertise_response.text}")
        
        # Test 3: Search mentors
        print("\n🔍 Test 3: Searching mentors...")
        search_response = requests.get(
            f"{base_url}/api/mentors/mentors/?search=python",
            timeout=10
        )
        
        print(f"Search Response Status: {search_response.status_code}")
        
        if search_response.status_code == 200:
            search_data = search_response.json()
            print(f"✅ Found {len(search_data)} mentors matching 'python'")
        else:
            print(f"❌ Search failed: {search_response.text}")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Mentors API test failed: {e}")

def test_mentor_details():
    """Test getting individual mentor details"""
    print("\n👤 Testing Individual Mentor Details...")
    
    base_url = "http://localhost:8000"
    
    try:
        # First get all mentors to get an ID
        mentors_response = requests.get(
            f"{base_url}/api/mentors/mentors/",
            timeout=10
        )
        
        if mentors_response.status_code == 200:
            mentors_data = mentors_response.json()
            
            if mentors_data:
                mentor_id = mentors_data[0]['id']
                
                # Get individual mentor details
                detail_response = requests.get(
                    f"{base_url}/api/mentors/mentors/{mentor_id}/",
                    timeout=10
                )
                
                print(f"Mentor Detail Response Status: {detail_response.status_code}")
                
                if detail_response.status_code == 200:
                    mentor_detail = detail_response.json()
                    user = mentor_detail.get('user', {})
                    name = f"{user.get('first_name', '')} {user.get('last_name', '')}".strip()
                    print(f"✅ Retrieved details for: {name}")
                    print(f"   Hourly Rate: ${mentor_detail.get('hourly_rate', 0)}")
                    print(f"   Experience Level: {mentor_detail.get('experience_level', 'N/A')}")
                    print(f"   Company: {mentor_detail.get('company', 'N/A')}")
                    print(f"   Expertise: {len(mentor_detail.get('expertise', []))} areas")
                else:
                    print(f"❌ Failed to get mentor details: {detail_response.text}")
            else:
                print("❌ No mentors found to test details")
        else:
            print(f"❌ Failed to get mentors for details test: {mentors_response.text}")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Mentor details test failed: {e}")

def main():
    """Main test function"""
    print("🚀 Mentors API Test")
    print("=" * 50)
    
    # Test basic mentors API
    test_mentors_api()
    
    # Test mentor details
    test_mentor_details()
    
    print("\n" + "=" * 50)
    print("📊 Mentors API Test Complete!")
    print("\n🌐 You can now test the frontend at:")
    print("   http://localhost:3000/mentors")

if __name__ == "__main__":
    main() 