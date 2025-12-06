"""
Series Event Layer - Matcher Engine
Core Logic / Kafka Bridge (Layer II)

This module handles:
- Kafka consumption of event intents
- Algorithmic bidding and matching
- Coordination of warm introductions via Series API
- Notification publishing back to frontend
"""

import os
import json
import time
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
from confluent_kafka import Consumer, Producer, KafkaException, KafkaError

from db_handler import get_db, DatabaseHandler
from series_api import SeriesAPIClient, send_warm_introduction

# --- Configuration (Hackathon Credentials) ---
KAFKA_BROKER = os.environ.get('KAFKA_BROKER', 'localhost:29092')
TOPIC_INTENT = os.environ.get('KAFKA_TOPIC_INTENT', 'series_event_intents')
TOPIC_NOTIFY = os.environ.get('KAFKA_TOPIC_NOTIFY', 'series_frontend_notify')
SERIES_API_KEY = os.environ.get('SERIES_API_KEY', 'YOUR_HACKATHON_API_KEY')

# Matching thresholds
MATCH_THRESHOLD = 60  # Minimum score for a successful match
FOMO_DEADLINE_HOURS = 1  # Intent expiration time


class MatcherEngine:
    """
    Core matching engine that processes event intents and coordinates matches.
    Implements algorithmic bidding and matching logic.
    """
    
    def __init__(self):
        self.db: Optional[DatabaseHandler] = None
        self.consumer: Optional[Consumer] = None
        self.producer: Optional[Producer] = None
        self.series_api: Optional[SeriesAPIClient] = None
        self.running = False
    
    def initialize(self) -> bool:
        """Initialize all connections and clients"""
        print("\n" + "="*60)
        print("🚀 Series Event Layer - Matcher Engine")
        print("="*60)
        
        # Initialize Database
        print("\n[INIT] Connecting to PostgreSQL...")
        self.db = get_db()
        if not self.db.conn:
            print("[ERROR] Database connection failed!")
            return False
        
        # Initialize Kafka Consumer (async consumption for instant matching)
        print(f"[INIT] Connecting to Kafka at {KAFKA_BROKER}...")
        try:
            self.consumer = Consumer({
                'bootstrap.servers': KAFKA_BROKER,
                'group.id': 'series-matcher-group',
                'auto.offset.reset': 'earliest',
                'enable.auto.commit': True
            })
            self.consumer.subscribe([TOPIC_INTENT])
            print(f"[INIT] Subscribed to topic: {TOPIC_INTENT}")
        except KafkaException as e:
            print(f"[ERROR] Kafka Consumer init failed: {e}")
            return False
        
        # Initialize Kafka Producer (for notifications)
        try:
            self.producer = Producer({
                'bootstrap.servers': KAFKA_BROKER,
                'client.id': 'series-matcher-producer'
            })
            print(f"[INIT] Producer ready for topic: {TOPIC_NOTIFY}")
        except KafkaException as e:
            print(f"[ERROR] Kafka Producer init failed: {e}")
            return False
        
        # Initialize Series API Client
        self.series_api = SeriesAPIClient(SERIES_API_KEY)
        print("[INIT] Series API Client initialized")
        
        print("\n✅ Matcher Engine initialized successfully!")
        return True
    
    def calculate_match_score(self, intent: Dict, potential_match: Dict) -> Tuple[int, Dict]:
        """
        Implements Algorithmic Bidding & Matching with multiple factors:
        - Shared Purpose/Background alignment
        - Location compatibility
        - Positive enforcement from ratings
        - Activity and memories (historical success)
        
        Returns tuple of (score, context_dict)
        """
        score = 0
        context = {
            'factors': [],
            'shared_networks': [],
            'mutual_connections': 0
        }
        
        match_user_id = potential_match['user_id']
        
        # 1. Shared Purpose/Background Check (Base score: 0-40 points)
        purpose = intent.get('purpose', '').lower()
        background = (potential_match.get('background') or '').lower()
        interests = potential_match.get('interests', []) or []
        
        # Check for keyword matches in background
        purpose_words = set(purpose.split())
        background_words = set(background.split())
        common_words = purpose_words & background_words
        
        if common_words:
            purpose_score = min(len(common_words) * 10, 40)
            score += purpose_score
            context['factors'].append(f"Shared keywords: {', '.join(common_words)} (+{purpose_score})")
        
        # Check interests overlap
        for interest in interests:
            if interest.lower() in purpose:
                score += 15
                context['factors'].append(f"Interest match: {interest} (+15)")
                break
        
        # 2. Location Compatibility (0-25 points)
        intent_location = intent.get('location', '').upper()
        match_location = (potential_match.get('location') or '').upper()
        
        if intent_location and match_location:
            if intent_location == match_location:
                score += 25
                context['factors'].append(f"Same location: {intent_location} (+25)")
            else:
                # People can come from different places - partial score
                score += 5
                context['factors'].append(f"Different location but available (+5)")
        
        # 3. Positive Enforcement from Rating (0-25 points)
        avg_rating = self.db.get_user_average_rating(match_user_id)
        rating_score = int(avg_rating * 5)  # Scale 1-5 rating to 5-25 points
        score += rating_score
        context['factors'].append(f"User rating: {avg_rating:.1f}/5.0 (+{rating_score})")
        
        # 4. Activity and Memories - Historical Success (0-20 points)
        intent_user_id = intent.get('user_id')
        if intent_user_id:
            history = self.db.get_mutual_event_history(intent_user_id, match_user_id)
            
            if history['event_count'] > 0:
                # Previous successful interactions boost score
                if history['success_count'] > 0:
                    memory_score = min(history['success_count'] * 10, 20)
                    score += memory_score
                    context['factors'].append(
                        f"Previous success: {history['success_count']} events (+{memory_score})"
                    )
                    context['mutual_connections'] = history['event_count']
        
        # 5. Network Tag Overlap (Bonus: 0-15 points)
        intent_networks = set(intent.get('network_opt_in', []) or [])
        match_networks = set(potential_match.get('network_tags') or [])
        
        shared_networks = intent_networks & match_networks
        if shared_networks:
            network_score = min(len(shared_networks) * 5, 15)
            score += network_score
            context['factors'].append(f"Shared networks: {', '.join(shared_networks)} (+{network_score})")
            context['shared_networks'] = list(shared_networks)
        
        # 6. User Success Rate (Bonus: 0-10 points)
        success_rate = self.db.get_user_success_rate(match_user_id)
        if success_rate > 0.7:
            score += 10
            context['factors'].append(f"High success rate: {success_rate:.0%} (+10)")
        elif success_rate > 0.5:
            score += 5
            context['factors'].append(f"Good success rate: {success_rate:.0%} (+5)")
        
        return score, context
    
    def process_intent(self, intent: Dict) -> Optional[Dict]:
        """
        Main intent processing function.
        Triggered upon consuming a new Kafka message.
        
        Returns match result dict or None if no match found.
        """
        print(f"\n{'─'*60}")
        print(f"📥 [NEW INTENT] Processing event intent")
        print(f"{'─'*60}")
        print(f"  Purpose: {intent.get('purpose', 'Unknown')}")
        print(f"  User ID: {intent.get('user_id', 'Unknown')}")
        print(f"  Location: {intent.get('location', 'Any')}")
        print(f"  Timestamp: {intent.get('timestamp', 'Unknown')}")
        
        # 1. Enforce FOMO Deadline (Social FOMO / Set deadlines from this)
        intent_timestamp = intent.get('timestamp')
        if intent_timestamp:
            try:
                if isinstance(intent_timestamp, str):
                    created_time = datetime.fromisoformat(intent_timestamp.replace('Z', '+00:00'))
                else:
                    created_time = datetime.fromtimestamp(intent_timestamp / 1000)
                
                age = datetime.now(created_time.tzinfo) if created_time.tzinfo else datetime.now()
                age_hours = (age - created_time.replace(tzinfo=None)).total_seconds() / 3600
                
                if age_hours > FOMO_DEADLINE_HOURS:
                    print(f"\n⏰ Intent EXPIRED - {age_hours:.1f} hours old (deadline: {FOMO_DEADLINE_HOURS}h)")
                    print("   Social FOMO deadline passed. Discarding intent.")
                    return None
                else:
                    remaining = FOMO_DEADLINE_HOURS - age_hours
                    print(f"\n⏱️ Time remaining: {remaining:.1f} hours until FOMO deadline")
            except (ValueError, TypeError) as e:
                print(f"\n⚠️ Could not parse timestamp: {e}")
        
        # 2. Fetch potential matches from Banks of People
        intent_user_id = intent.get('user_id', 0)
        intent_location = intent.get('location')
        intent_networks = intent.get('network_opt_in', [])
        
        potential_matches = self.db.get_potential_matches(
            exclude_user_id=intent_user_id,
            location=intent_location,
            networks=intent_networks if intent_networks else None
        )
        
        print(f"\n🔍 Found {len(potential_matches)} potential matches in database")
        
        if not potential_matches:
            print("   No eligible matches found. Waiting for more users...")
            return None
        
        # 3. Calculate match scores for all candidates
        best_match = None
        best_score = 0
        best_context = {}
        
        print("\n📊 Calculating match scores:")
        for match in potential_matches:
            score, context = self.calculate_match_score(intent, match)
            print(f"   • {match['full_name']}: {score} points")
            for factor in context['factors']:
                print(f"     └─ {factor}")
            
            if score > best_score:
                best_score = score
                best_match = match
                best_context = context
        
        # 4. Check if best match meets threshold
        if not best_match or best_score < MATCH_THRESHOLD:
            print(f"\n❌ No match above threshold ({MATCH_THRESHOLD}). Best: {best_score}")
            return None
        
        print(f"\n✨ BEST MATCH FOUND!")
        print(f"   User: {best_match['full_name']}")
        print(f"   Score: {best_score} (threshold: {MATCH_THRESHOLD})")
        print(f"   Background: {best_match.get('background', 'N/A')[:60]}...")
        
        # 5. Coordinate Warm Introduction (Matches Instantly)
        intent_phone = intent.get('user_phone', '')
        match_phone = best_match.get('phone_number', '')
        purpose = intent.get('purpose', 'Connection')
        
        # Add match score to context for intro message
        best_context['match_score'] = best_score
        
        api_result = self.series_api.send_warm_introduction(
            user_a_phone=intent_phone,
            user_b_phone=match_phone,
            shared_purpose=purpose,
            context=best_context
        )
        
        # 6. Record event in database (Activity and Memories)
        event_id = self.db.record_event(
            purpose=purpose,
            matched_users=[intent_user_id, best_match['user_id']],
            initiator_id=intent_user_id,
            match_score=best_score
        )
        print(f"\n📝 Event recorded in database (ID: {event_id})")
        
        # 7. Prepare result
        result = {
            'success': True,
            'intent_id': intent.get('id'),
            'initiator': {
                'user_id': intent_user_id,
                'phone': intent_phone
            },
            'matched_user': {
                'user_id': best_match['user_id'],
                'full_name': best_match['full_name'],
                'phone': match_phone,
                'background': best_match.get('background')
            },
            'match_score': best_score,
            'purpose': purpose,
            'event_id': event_id,
            'api_result': api_result,
            'context': best_context
        }
        
        return result
    
    def send_notification(self, notification: Dict):
        """
        Sends notification back to frontend via Kafka.
        Makes Group Chat Events Become Visible.
        """
        try:
            self.producer.produce(
                topic=TOPIC_NOTIFY,
                value=json.dumps(notification).encode('utf-8'),
                callback=self._delivery_callback
            )
            self.producer.flush(timeout=5)
            print(f"\n📤 Notification sent to {TOPIC_NOTIFY}")
        except KafkaException as e:
            print(f"\n[ERROR] Failed to send notification: {e}")
    
    def _delivery_callback(self, err, msg):
        """Kafka producer delivery callback"""
        if err:
            print(f"[KAFKA] Delivery failed: {err}")
        else:
            print(f"[KAFKA] Message delivered to {msg.topic()}[{msg.partition()}]")
    
    def run(self):
        """
        Main event loop - asynchronously consumes Kafka messages.
        Implements instant matching upon receipt.
        """
        if not self.initialize():
            print("\n❌ Failed to initialize. Exiting.")
            return
        
        self.running = True
        print(f"\n🎧 Matcher Engine listening on {TOPIC_INTENT}...")
        print("   Waiting for event intents...\n")
        
        try:
            while self.running:
                # Poll for new messages (non-blocking with timeout)
                msg = self.consumer.poll(timeout=1.0)
                
                if msg is None:
                    continue
                
                if msg.error():
                    if msg.error().code() == KafkaError._PARTITION_EOF:
                        continue
                    else:
                        print(f"[KAFKA ERROR] {msg.error()}")
                        continue
                
                # Parse the intent message
                try:
                    intent = json.loads(msg.value().decode('utf-8'))
                except json.JSONDecodeError as e:
                    print(f"[ERROR] Invalid JSON in message: {e}")
                    continue
                
                # Process the intent (Matches Instantly)
                result = self.process_intent(intent)
                
                if result and result.get('success'):
                    # Build notification for frontend
                    notification = {
                        'type': 'match_success',
                        'user_id': result['initiator']['user_id'],
                        'matched_user_id': result['matched_user']['user_id'],
                        'matched_user_name': result['matched_user']['full_name'],
                        'match_score': result['match_score'],
                        'purpose': result['purpose'],
                        'event_id': result['event_id'],
                        'timestamp': datetime.now().isoformat(),
                        'message': f"🎉 You've been matched with {result['matched_user']['full_name']}!"
                    }
                    
                    # Send notification to make group chat visible
                    self.send_notification(notification)
                    
                    print(f"\n{'='*60}")
                    print("✅ MATCH COMPLETE - Group chat events are now visible!")
                    print(f"{'='*60}\n")
                else:
                    # Send pending notification
                    notification = {
                        'type': 'match_pending',
                        'user_id': intent.get('user_id'),
                        'purpose': intent.get('purpose'),
                        'status': 'searching',
                        'timestamp': datetime.now().isoformat(),
                        'message': "🔍 Still searching for the perfect match..."
                    }
                    self.send_notification(notification)
        
        except KeyboardInterrupt:
            print("\n\n⚠️ Shutting down Matcher Engine...")
        finally:
            self.shutdown()
    
    def shutdown(self):
        """Clean shutdown of all connections"""
        self.running = False
        
        if self.consumer:
            self.consumer.close()
            print("[SHUTDOWN] Kafka Consumer closed")
        
        if self.producer:
            self.producer.flush(timeout=5)
            print("[SHUTDOWN] Kafka Producer flushed")
        
        if self.db:
            self.db.disconnect()
        
        print("👋 Matcher Engine stopped.")


def main():
    """Entry point for the Matcher Engine"""
    # Wait for Kafka and PostgreSQL to be ready
    startup_delay = int(os.environ.get('STARTUP_DELAY', 15))
    print(f"⏳ Waiting {startup_delay}s for services to start...")
    time.sleep(startup_delay)
    
    engine = MatcherEngine()
    engine.run()


if __name__ == "__main__":
    main()


