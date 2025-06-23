#!/usr/bin/env python3
"""
Test script to verify the booking functionality works correctly.
"""

import requests
import json
from datetime import datetime, timedelta

def test_booking_flow():
    """Test the complete booking flow"""
    print("📅 Testing Booking Flow...")
    
    base_url = "http://localhost:8000"
    
    try:
        # Step 1: Login as a mentee
        print("\n👤 Step 1: Logging in as mentee...")
        login_data = {
            "username": "frontend_user_1750517167",
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
        
        # Step 2: Get available mentors
        print("\n👨‍🏫 Step 2: Getting available mentors...")
        mentors_response = requests.get(
            f"{base_url}/api/mentors/mentors/",
            headers={
                'Authorization': f"Bearer {access_token}",
                'Content-Type': 'application/json'
            },
            timeout=10
        )
        
        if mentors_response.status_code != 200:
            print(f"❌ Failed to get mentors: {mentors_response.status_code}")
            return
        
        mentors_data = mentors_response.json()
        if not mentors_data:
            print("❌ No mentors available for booking")
            return
        
        mentor = mentors_data[0]  # Use first mentor
        mentor_id = mentor['id']
        user = mentor.get('user', {})
        mentor_name = f"{user.get('first_name', '')} {user.get('last_name', '')}".strip()
        print(f"✅ Found mentor: {mentor_name} (ID: {mentor_id})")
        
        # Step 3: Create a booking
        print("\n📅 Step 3: Creating a booking...")
        
        # Set booking date to tomorrow
        tomorrow = datetime.now() + timedelta(days=1)
        booking_date = tomorrow.strftime('%Y-%m-%d')
        
        booking_data = {
            "mentor": mentor_id,
            "session_type": "video_call",
            "session_date": booking_date,
            "session_time": "14:00",
            "duration_minutes": 60,
            "topic": "Career advice and technical interview preparation",
            "description": "I would like to discuss my career goals and get tips for technical interviews."
        }
        
        booking_response = requests.post(
            f"{base_url}/api/bookings/bookings/",
            json=booking_data,
            headers={
                'Authorization': f"Bearer {access_token}",
                'Content-Type': 'application/json'
            },
            timeout=10
        )
        
        print(f"Booking Response Status: {booking_response.status_code}")
        
        if booking_response.status_code == 201:
            booking_result = booking_response.json()
            print("✅ Booking created successfully!")
            print(f"   Booking ID: {booking_result.get('id')}")
            print(f"   Status: {booking_result.get('status')}")
            print(f"   Total Amount: ${booking_result.get('total_amount', 0)}")
            print(f"   Session Date: {booking_result.get('session_date')}")
            print(f"   Session Time: {booking_result.get('session_time')}")
            
            booking_id = booking_result.get('id')
            
            # Step 4: Get user's bookings
            print("\n📋 Step 4: Getting user's bookings...")
            bookings_response = requests.get(
                f"{base_url}/api/bookings/bookings/",
                headers={
                    'Authorization': f"Bearer {access_token}",
                    'Content-Type': 'application/json'
                },
                timeout=10
            )
            
            if bookings_response.status_code == 200:
                bookings_data = bookings_response.json()
                print(f"✅ Found {len(bookings_data)} bookings for user")
                
                # Find our booking
                our_booking = next((b for b in bookings_data if b.get('id') == booking_id), None)
                if our_booking:
                    print(f"   Our booking found with status: {our_booking.get('status')}")
                else:
                    print("   Our booking not found in user's bookings")
            else:
                print(f"❌ Failed to get user bookings: {bookings_response.status_code}")
            
            # Step 5: Test booking cancellation
            print("\n❌ Step 5: Testing booking cancellation...")
            cancel_response = requests.post(
                f"{base_url}/api/bookings/bookings/{booking_id}/cancel/",
                headers={
                    'Authorization': f"Bearer {access_token}",
                    'Content-Type': 'application/json'
                },
                timeout=10
            )
            
            if cancel_response.status_code == 200:
                print("✅ Booking cancelled successfully!")
            else:
                print(f"❌ Failed to cancel booking: {cancel_response.status_code}")
                
        else:
            print(f"❌ Booking creation failed: {booking_response.text}")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Booking test failed: {e}")

def test_mentor_booking_management():
    """Test mentor's ability to manage bookings"""
    print("\n👨‍🏫 Testing Mentor Booking Management...")
    
    base_url = "http://localhost:8000"
    
    try:
        # Step 1: Login as a mentor
        print("\n👤 Step 1: Logging in as mentor...")
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
        
        # Step 2: Get mentor's bookings
        print("\n📋 Step 2: Getting mentor's bookings...")
        bookings_response = requests.get(
            f"{base_url}/api/bookings/bookings/",
            headers={
                'Authorization': f"Bearer {access_token}",
                'Content-Type': 'application/json'
            },
            timeout=10
        )
        
        if bookings_response.status_code == 200:
            bookings_data = bookings_response.json()
            print(f"✅ Found {len(bookings_data)} bookings for mentor")
            
            # Show booking details
            for i, booking in enumerate(bookings_data[:3]):  # Show first 3
                mentee = booking.get('mentee', {})
                mentee_name = f"{mentee.get('first_name', '')} {mentee.get('last_name', '')}".strip()
                print(f"   {i+1}. {mentee_name} - {booking.get('status')} - {booking.get('session_date')}")
        else:
            print(f"❌ Failed to get mentor bookings: {bookings_response.status_code}")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Mentor booking management test failed: {e}")

def main():
    """Main test function"""
    print("🚀 Booking System Test")
    print("=" * 60)
    
    # Test mentee booking flow
    test_booking_flow()
    
    # Test mentor booking management
    test_mentor_booking_management()
    
    print("\n" + "=" * 60)
    print("📊 Booking System Test Complete!")
    print("\n🌐 You can now test the booking flow at:")
    print("   1. Register/login as a mentee")
    print("   2. Go to http://localhost:3000/mentors")
    print("   3. Click 'Book Session' on any mentor")
    print("   4. Fill out the booking form")

if __name__ == "__main__":
    main() 