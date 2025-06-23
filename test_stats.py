#!/usr/bin/env python3
"""
Test script to verify the stats endpoint.
"""

import requests
import json

def test_stats_endpoint():
    """Test the stats endpoint"""
    print("📊 Testing Stats Endpoint...")
    
    base_url = "http://localhost:8000"
    
    # First, login to get a token
    login_data = {
        "username": "frontend_user_1750517167",
        "password": "testpass123"
    }
    
    try:
        # Login
        login_response = requests.post(
            f"{base_url}/api/token/",
            json=login_data,
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        
        if login_response.status_code == 200:
            token_data = login_response.json()
            access_token = token_data.get('access')
            
            # Test stats endpoint
            stats_response = requests.get(
                f"{base_url}/api/users/users/me/stats/",
                headers={
                    'Authorization': f"Bearer {access_token}",
                    'Content-Type': 'application/json'
                },
                timeout=10
            )
            
            print(f"Stats Response Status: {stats_response.status_code}")
            print(f"Stats Response: {stats_response.text}")
            
            if stats_response.status_code == 200:
                print("✅ Stats endpoint working!")
            else:
                print("❌ Stats endpoint not working")
                
        else:
            print(f"❌ Login failed: {login_response.status_code}")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Stats test failed: {e}")

if __name__ == "__main__":
    test_stats_endpoint() 