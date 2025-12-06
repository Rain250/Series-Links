"""
Series API Integration Module
Handles warm introductions via the Series iMessage API
"""

import os
import json
import requests
from datetime import datetime

SERIES_API_KEY = os.environ.get('SERIES_API_KEY', 'YOUR_HACKATHON_API_KEY')
SERIES_API_BASE = "https://sandbox.series.so/api/v1"


class SeriesAPIClient:
    """Client for interacting with the Series iMessage API"""
    
    def __init__(self, api_key: str = None):
        self.api_key = api_key or SERIES_API_KEY
        self.base_url = SERIES_API_BASE
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
    
    def send_warm_introduction(self, user_a_phone: str, user_b_phone: str, 
                                shared_purpose: str, context: dict = None) -> dict:
        """
        Simulates a POST request to the Series iMessage API to initiate a group chat.
        This addresses Fear of rejections and creating happenstance via AI friend/double opt-in intro.
        
        Args:
            user_a_phone: Phone number of the initiating user
            user_b_phone: Phone number of the matched user  
            shared_purpose: The common goal/interest that sparked the match
            context: Additional context for the introduction
            
        Returns:
            dict: Response from the API (simulated in hackathon mode)
        """
        api_endpoint = f"{self.base_url}/intro/warm"
        
        payload = {
            "initiator_phone": user_a_phone,
            "target_phone": user_b_phone,
            "shared_goal": shared_purpose,
            "intro_type": "warm",  # Double opt-in for reducing fear of rejection
            "message_template": self._generate_intro_message(shared_purpose, context),
            "timestamp": datetime.now().isoformat()
        }
        
        # Add optional context if provided
        if context:
            payload["context"] = context
        
        # HACKATHON MODE: Simulate the API call
        print(f"\n{'='*60}")
        print(f"[SERIES API] Warm Introduction Request")
        print(f"{'='*60}")
        print(f"Endpoint: {api_endpoint}")
        print(f"Initiator: {user_a_phone}")
        print(f"Target: {user_b_phone}")
        print(f"Shared Purpose: {shared_purpose}")
        print(f"{'='*60}")
        
        # In production, uncomment this:
        # try:
        #     response = requests.post(api_endpoint, json=payload, headers=self.headers, timeout=10)
        #     response.raise_for_status()
        #     return response.json()
        # except requests.exceptions.RequestException as e:
        #     print(f"[SERIES API ERROR] {e}")
        #     return {"success": False, "error": str(e)}
        
        # Simulated success response
        return {
            "success": True,
            "chat_id": f"chat_{hash(user_a_phone + user_b_phone) % 100000}",
            "message": "Group chat initiated successfully",
            "participants": [user_a_phone, user_b_phone],
            "timestamp": datetime.now().isoformat()
        }
    
    def _generate_intro_message(self, shared_purpose: str, context: dict = None) -> str:
        """
        Generates a contextual introduction message for the group chat.
        This fixes awkwardness by providing a clear reason for connection.
        """
        base_message = f"Hey! 👋 You both expressed interest in: {shared_purpose}"
        
        if context:
            if context.get('match_score', 0) > 90:
                base_message += "\n\n✨ This is a high-compatibility match based on your backgrounds!"
            if context.get('mutual_connections'):
                base_message += f"\n\n🤝 You have {context['mutual_connections']} mutual connections."
            if context.get('shared_networks'):
                networks = ', '.join(context['shared_networks'])
                base_message += f"\n\n🔗 Shared networks: {networks}"
        
        base_message += "\n\nFeel free to introduce yourselves and start connecting! 🚀"
        return base_message
    
    def send_event_notification(self, phone_numbers: list, event_info: dict) -> dict:
        """
        Sends event visibility notifications to matched users.
        Makes group chat events become visible.
        """
        api_endpoint = f"{self.base_url}/notify/event"
        
        payload = {
            "recipients": phone_numbers,
            "event": event_info,
            "notification_type": "event_match",
            "timestamp": datetime.now().isoformat()
        }
        
        print(f"\n[SERIES API] Event Notification sent to {len(phone_numbers)} users")
        print(f"Event: {event_info.get('purpose', 'Unknown')}")
        
        return {
            "success": True,
            "notified_count": len(phone_numbers),
            "timestamp": datetime.now().isoformat()
        }
    
    def check_opt_in_status(self, phone_number: str) -> dict:
        """
        Checks if a user has opted into Series for introductions.
        Required for double opt-in warm introductions.
        """
        # Simulated check
        return {
            "phone": phone_number,
            "opted_in": True,
            "networks": ["series_network", "hackathon"],
            "last_active": datetime.now().isoformat()
        }


# Convenience function for direct imports
def send_warm_introduction(user_a_phone: str, user_b_phone: str, 
                           shared_purpose: str, context: dict = None) -> dict:
    """
    Convenience function to send a warm introduction via Series API.
    """
    client = SeriesAPIClient()
    return client.send_warm_introduction(user_a_phone, user_b_phone, shared_purpose, context)


if __name__ == "__main__":
    # Test the Series API client
    print("Testing Series API Client...")
    
    result = send_warm_introduction(
        user_a_phone="111-555-0001",
        user_b_phone="111-555-0002", 
        shared_purpose="Tech networking for startup founders",
        context={
            "match_score": 95,
            "mutual_connections": 3,
            "shared_networks": ["tech_club", "startup_network"]
        }
    )
    
    print(f"\nAPI Response: {json.dumps(result, indent=2)}")


