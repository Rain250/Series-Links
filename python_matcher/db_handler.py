"""
Database Handler Module
Manages PostgreSQL connections and queries for the Series Event Layer
"""

import os
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime, timedelta
from typing import List, Dict, Optional, Tuple


class DatabaseHandler:
    """Handles all database operations for the matcher engine"""
    
    def __init__(self):
        self.conn_params = {
            'host': os.environ.get('DB_HOST', 'localhost'),
            'database': os.environ.get('DB_NAME', 'series_db'),
            'user': os.environ.get('DB_USER', 'user'),
            'password': os.environ.get('DB_PASSWORD', 'password'),
            'port': os.environ.get('DB_PORT', '5432')
        }
        self.conn = None
        self.cursor = None
    
    def connect(self) -> bool:
        """Establishes connection to PostgreSQL"""
        try:
            self.conn = psycopg2.connect(**self.conn_params)
            self.cursor = self.conn.cursor(cursor_factory=RealDictCursor)
            print(f"[DB] Connected to PostgreSQL at {self.conn_params['host']}")
            return True
        except psycopg2.Error as e:
            print(f"[DB ERROR] Connection failed: {e}")
            return False
    
    def disconnect(self):
        """Closes database connection"""
        if self.cursor:
            self.cursor.close()
        if self.conn:
            self.conn.close()
        print("[DB] Disconnected from PostgreSQL")
    
    def get_user_by_id(self, user_id: int) -> Optional[Dict]:
        """Fetches user profile by ID"""
        try:
            self.cursor.execute(
                "SELECT * FROM user_profiles WHERE user_id = %s",
                (user_id,)
            )
            return dict(self.cursor.fetchone()) if self.cursor.rowcount > 0 else None
        except psycopg2.Error as e:
            print(f"[DB ERROR] get_user_by_id: {e}")
            return None
    
    def get_user_by_phone(self, phone: str) -> Optional[Dict]:
        """Fetches user profile by phone number"""
        try:
            self.cursor.execute(
                "SELECT * FROM user_profiles WHERE phone_number = %s",
                (phone,)
            )
            result = self.cursor.fetchone()
            return dict(result) if result else None
        except psycopg2.Error as e:
            print(f"[DB ERROR] get_user_by_phone: {e}")
            return None
    
    def get_potential_matches(self, exclude_user_id: int, location: str = None, 
                               networks: List[str] = None) -> List[Dict]:
        """
        Fetches potential matches from the Banks of People.
        Filters by location and network tags for accurate matching.
        """
        try:
            query = """
                SELECT user_id, full_name, background, network_tags, 
                       location, phone_number, interests
                FROM user_profiles 
                WHERE user_id != %s
            """
            params = [exclude_user_id]
            
            # Filter by location if provided (People can come from different places)
            if location:
                query += " AND (location = %s OR location IS NULL)"
                params.append(location)
            
            # Filter by network tags if provided
            if networks:
                query += " AND network_tags && %s::text[]"
                params.append(networks)
            
            query += " ORDER BY last_login DESC NULLS LAST"
            
            self.cursor.execute(query, params)
            return [dict(row) for row in self.cursor.fetchall()]
        except psycopg2.Error as e:
            print(f"[DB ERROR] get_potential_matches: {e}")
            return []
    
    def get_user_average_rating(self, user_id: int) -> float:
        """
        Gets average rating for a user (Positive enforcement from rating).
        Higher ratings indicate better past interactions.
        """
        try:
            self.cursor.execute(
                """
                SELECT COALESCE(AVG(rating_score), 3.0) as avg_rating
                FROM user_ratings
                WHERE rated_id = %s
                """,
                (user_id,)
            )
            result = self.cursor.fetchone()
            return float(result['avg_rating']) if result else 3.0
        except psycopg2.Error as e:
            print(f"[DB ERROR] get_user_average_rating: {e}")
            return 3.0
    
    def get_mutual_event_history(self, user_a_id: int, user_b_id: int) -> Dict:
        """
        Gets historical interaction data between two users.
        Used for Activity and Memories to fix awkwardness.
        """
        try:
            self.cursor.execute(
                """
                SELECT COUNT(*) as event_count,
                       COUNT(CASE WHEN outcome_success THEN 1 END) as success_count,
                       AVG(match_score) as avg_score
                FROM past_events_memory
                WHERE %s = ANY(matched_users) AND %s = ANY(matched_users)
                """,
                (user_a_id, user_b_id)
            )
            result = self.cursor.fetchone()
            return {
                'event_count': result['event_count'] or 0,
                'success_count': result['success_count'] or 0,
                'avg_score': float(result['avg_score']) if result['avg_score'] else 0.0
            }
        except psycopg2.Error as e:
            print(f"[DB ERROR] get_mutual_event_history: {e}")
            return {'event_count': 0, 'success_count': 0, 'avg_score': 0.0}
    
    def get_user_success_rate(self, user_id: int) -> float:
        """
        Gets a user's overall success rate in past events.
        Used for matching algorithm weighting.
        """
        try:
            self.cursor.execute(
                """
                SELECT 
                    COUNT(*) as total,
                    COUNT(CASE WHEN outcome_success THEN 1 END) as successes
                FROM past_events_memory
                WHERE %s = ANY(matched_users)
                """,
                (user_id,)
            )
            result = self.cursor.fetchone()
            if result and result['total'] > 0:
                return result['successes'] / result['total']
            return 0.5  # Default 50% for new users
        except psycopg2.Error as e:
            print(f"[DB ERROR] get_user_success_rate: {e}")
            return 0.5
    
    def record_event(self, purpose: str, matched_users: List[int], 
                     initiator_id: int, match_score: int) -> Optional[int]:
        """
        Records a new event/match in the past_events_memory table.
        """
        try:
            self.cursor.execute(
                """
                INSERT INTO past_events_memory 
                (purpose, matched_users, initiator_id, match_score, status)
                VALUES (%s, %s, %s, %s, 'active')
                RETURNING event_id
                """,
                (purpose, matched_users, initiator_id, match_score)
            )
            self.conn.commit()
            result = self.cursor.fetchone()
            return result['event_id'] if result else None
        except psycopg2.Error as e:
            print(f"[DB ERROR] record_event: {e}")
            self.conn.rollback()
            return None
    
    def update_event_outcome(self, event_id: int, success: bool) -> bool:
        """Updates the outcome of an event"""
        try:
            self.cursor.execute(
                """
                UPDATE past_events_memory 
                SET outcome_success = %s, end_time = NOW(), status = 'completed'
                WHERE event_id = %s
                """,
                (success, event_id)
            )
            self.conn.commit()
            return True
        except psycopg2.Error as e:
            print(f"[DB ERROR] update_event_outcome: {e}")
            self.conn.rollback()
            return False
    
    def create_or_update_user(self, phone: str, full_name: str = None,
                               background: str = None, location: str = None,
                               networks: List[str] = None) -> Optional[int]:
        """Creates a new user or updates existing one"""
        try:
            existing = self.get_user_by_phone(phone)
            
            if existing:
                # Update existing user
                self.cursor.execute(
                    """
                    UPDATE user_profiles 
                    SET last_login = NOW(),
                        full_name = COALESCE(%s, full_name),
                        background = COALESCE(%s, background),
                        location = COALESCE(%s, location),
                        network_tags = COALESCE(%s, network_tags)
                    WHERE phone_number = %s
                    RETURNING user_id
                    """,
                    (full_name, background, location, networks, phone)
                )
            else:
                # Create new user
                self.cursor.execute(
                    """
                    INSERT INTO user_profiles 
                    (phone_number, full_name, background, location, network_tags)
                    VALUES (%s, %s, %s, %s, %s)
                    RETURNING user_id
                    """,
                    (phone, full_name or 'Anonymous', background, location, networks or [])
                )
            
            self.conn.commit()
            result = self.cursor.fetchone()
            return result['user_id'] if result else None
        except psycopg2.Error as e:
            print(f"[DB ERROR] create_or_update_user: {e}")
            self.conn.rollback()
            return None
    
    def get_expired_intents(self, hours: int = 1) -> List[Dict]:
        """
        Gets intents that have passed the FOMO deadline.
        Used for Social FOMO / Deadlines feature.
        """
        try:
            deadline = datetime.now() - timedelta(hours=hours)
            self.cursor.execute(
                """
                SELECT * FROM active_intents
                WHERE status = 'pending' AND deadline < %s
                """,
                (deadline,)
            )
            return [dict(row) for row in self.cursor.fetchall()]
        except psycopg2.Error as e:
            print(f"[DB ERROR] get_expired_intents: {e}")
            return []
    
    def mark_intents_expired(self, intent_ids: List[int]) -> bool:
        """Marks intents as expired"""
        if not intent_ids:
            return True
        try:
            self.cursor.execute(
                """
                UPDATE active_intents 
                SET status = 'expired'
                WHERE intent_id = ANY(%s)
                """,
                (intent_ids,)
            )
            self.conn.commit()
            return True
        except psycopg2.Error as e:
            print(f"[DB ERROR] mark_intents_expired: {e}")
            self.conn.rollback()
            return False
    
    def get_external_integrations(self, active_only: bool = True) -> List[Dict]:
        """Gets list of external integrations (Stern Club, NYU Engage, etc.)"""
        try:
            query = "SELECT * FROM external_integrations"
            if active_only:
                query += " WHERE is_active = true"
            self.cursor.execute(query)
            return [dict(row) for row in self.cursor.fetchall()]
        except psycopg2.Error as e:
            print(f"[DB ERROR] get_external_integrations: {e}")
            return []


# Singleton instance for easy imports
_db_instance = None

def get_db() -> DatabaseHandler:
    """Gets or creates the database handler singleton"""
    global _db_instance
    if _db_instance is None:
        _db_instance = DatabaseHandler()
        _db_instance.connect()
    return _db_instance


if __name__ == "__main__":
    # Test database connection
    db = get_db()
    
    print("\n--- Testing Database Handler ---")
    
    # Test get potential matches
    matches = db.get_potential_matches(exclude_user_id=1, location='NYC')
    print(f"\nPotential matches in NYC (excluding user 1): {len(matches)}")
    for m in matches:
        print(f"  - {m['full_name']}: {m['background'][:50]}...")
    
    # Test get average rating
    rating = db.get_user_average_rating(1)
    print(f"\nAverage rating for user 1: {rating:.2f}")
    
    # Test get mutual history
    history = db.get_mutual_event_history(1, 4)
    print(f"\nMutual event history between user 1 and 4: {history}")
    
    db.disconnect()


