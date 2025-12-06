# Series Event Layer — Hax_25 Prototype

![Architecture](https://img.shields.io/badge/Architecture-Event--Driven-blue)
![Python](https://img.shields.io/badge/Python-3.11-green)
![Node.js](https://img.shields.io/badge/Node.js-18-green)
![Kafka](https://img.shields.io/badge/Apache-Kafka-orange)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14-blue)

A full-stack event-driven application demonstrating AI-powered warm introductions and event matching via the Series iMessage API.

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        Series Event Layer                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────────┐     ┌──────────────┐     ┌───────────────────┐   │
│  │  Layer I         │     │  Layer II    │     │  Layer III        │   │
│  │  Node.js Frontend│────▶│  Python      │────▶│  PostgreSQL       │   │
│  │                  │     │  Matcher     │     │                   │   │
│  │  • Express API   │     │              │     │  • user_profiles  │   │
│  │  • Kafka Producer│     │  • Kafka     │     │  • user_ratings   │   │
│  │  • React UI      │     │    Consumer  │     │  • past_events    │   │
│  │                  │     │  • Matching  │     │                   │   │
│  │                  │◀────│    Algorithm │     │                   │   │
│  │                  │     │  • Series API│     │                   │   │
│  └──────────────────┘     └──────────────┘     └───────────────────┘   │
│            │                      │                                      │
│            │     Apache Kafka     │                                      │
│            └──────────────────────┘                                      │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose
- Git

### Run the Full Stack

```bash
# Clone and navigate to project
cd "Series Hackathon"

# Start all services
docker-compose up --build

# Wait for services to initialize (~30 seconds)
# Then open http://localhost:3000
```

### Services

| Service | Port | Description |
|---------|------|-------------|
| Frontend | 3000 | Node.js/Express + React UI |
| Kafka | 29092 | Message broker (external) |
| Kafka Internal | 9092 | Message broker (internal) |
| PostgreSQL | 5432 | Database |
| Zookeeper | 2181 | Kafka coordination |

## 📁 Project Structure

```
Series Hackathon/
├── docker-compose.yml          # Infrastructure orchestration
├── db_setup.sql                # PostgreSQL schema & seed data
├── README.md                   # This file
│
├── python_matcher/             # Layer II: Core Logic
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── matcher_engine.py       # Main Kafka consumer & matching
│   ├── series_api.py           # Series iMessage API client
│   └── db_handler.py           # PostgreSQL operations
│
└── nodejs_frontend/            # Layer I: Presentation
    ├── Dockerfile
    ├── package.json
    ├── server.js               # Express server & Kafka producer
    └── public/
        └── index.html          # React-style UI
```

## ✨ Features Implemented

### 1. Algorithmic Bidding & Matching
**Location:** `python_matcher/matcher_engine.py::calculate_match_score()`

Calculates match scores based on:
- Shared Purpose/Background alignment (0-55 points)
- Location compatibility (0-25 points)
- Positive enforcement from ratings (0-25 points)
- Historical success (Activity & Memories) (0-20 points)
- Network tag overlap (0-15 points)
- User success rate bonus (0-10 points)

### 2. Shared Purpose / Event Proposals
**Location:** `nodejs_frontend/public/index.html`

Input form for users to specify:
- Shared Purpose (e.g., "Find a study group for Stern Club")
- Location preference
- Availability time
- Network opt-ins

### 3. Awkwardness Fix (Ratings & Memories)
**Location:** `db_setup.sql` + `python_matcher/db_handler.py`

- `user_ratings` table stores positive enforcement scores
- `past_events_memory` tracks historical interactions
- Matching algorithm queries these for better matches

### 4. Banks of People / Accurate Matching
**Location:** `db_setup.sql`

- `user_profiles` table with location, background, network_tags
- Pre-seeded with 8 diverse user profiles
- Python matcher queries and filters by criteria

### 5. Matches Instantly
**Location:** `python_matcher/matcher_engine.py::run()`

- Asynchronous Kafka consumer processes events immediately
- No batching or delays - instant matching upon receipt

### 6. Social FOMO / Deadlines
**Location:** `nodejs_frontend/public/index.html` + `python_matcher/matcher_engine.py`

- Frontend displays countdown timers for active proposals
- Python enforces 1-hour deadline - expired intents are discarded
- Visual urgency indicators for < 15 minutes remaining

### 7. Group Chat Events Become Visible
**Location:** `python_matcher/matcher_engine.py::send_notification()`

- After successful match, Python publishes to `series_frontend_notify` topic
- Node.js consumer receives and updates frontend in real-time

### 8. Series API Integration (Warm Intro)
**Location:** `python_matcher/series_api.py::send_warm_introduction()`

- Simulates POST to Series iMessage API
- Supports double opt-in for fear of rejection mitigation
- Generates contextual introduction messages

### 9. External Integrations
**Location:** `nodejs_frontend/public/index.html`

- Checkbox opt-ins for Stern Club, NYU Engage, Tech@NYU, IB Network
- Network tags influence matching algorithm

## 🔧 Configuration

### Environment Variables

#### Python Matcher
```env
KAFKA_BROKER=kafka:9092
KAFKA_TOPIC_INTENT=series_event_intents
KAFKA_TOPIC_NOTIFY=series_frontend_notify
SERIES_API_KEY=YOUR_HACKATHON_API_KEY
DB_HOST=postgres
DB_NAME=series_db
DB_USER=user
DB_PASSWORD=password
```

#### Node.js Frontend
```env
NODE_ENV=development
KAFKA_BROKER=kafka:9092
KAFKA_TOPIC_INTENT=series_event_intents
KAFKA_TOPIC_NOTIFY=series_frontend_notify
PORT=3000
```

## 🧪 Testing the Flow

1. **Open Frontend:** Navigate to http://localhost:3000

2. **Submit Intent:**
   - Enter your name and phone
   - Type a shared purpose (e.g., "Finance networking for IB")
   - Select location and availability
   - Check relevant integrations
   - Click "Match Instantly"

3. **Watch Logs:**
   ```bash
   # Python Matcher logs
   docker-compose logs -f python_matcher
   
   # Frontend logs
   docker-compose logs -f nodejs_frontend
   ```

4. **Observe Match:** 
   - Python processes intent within seconds
   - Series API call is simulated
   - Notification sent back to frontend
   - UI updates with match status

## 🗄️ Database Schema

### user_profiles
- `user_id` (PK)
- `full_name`, `background`, `network_tags[]`
- `location`, `phone_number`, `interests[]`

### user_ratings
- `rating_id` (PK)
- `rater_id`, `rated_id` (FK → user_profiles)
- `rating_score` (1-5), `feedback`

### past_events_memory
- `event_id` (PK)
- `purpose`, `matched_users[]`
- `outcome_success`, `match_score`

### active_intents
- `intent_id` (PK)
- `user_id`, `purpose`, `deadline`
- `status` (pending/matched/expired)

## 🔄 Kafka Topics

| Topic | Producer | Consumer | Purpose |
|-------|----------|----------|---------|
| `series_event_intents` | Node.js | Python | Event intent messages |
| `series_frontend_notify` | Python | Node.js | Match notifications |

## 📝 API Endpoints

### POST `/api/submit-intent`
Submit a new event intent for matching.

```json
{
  "userId": 42,
  "userPhone": "111-555-0001",
  "userName": "John Doe",
  "purpose": "Finance networking for IB",
  "location": "NYC",
  "availableTime": "Evening",
  "networkOptIn": ["stern_club", "ib_network"]
}
```

### GET `/api/events`
Get active events with FOMO timers.

### GET `/api/notifications`
Get recent match notifications.

### GET `/api/integrations`
Get available external integrations.

### GET `/api/status`
System health check.

## 🐛 Troubleshooting

### Kafka Connection Issues
```bash
# Check if Kafka is running
docker-compose ps kafka

# View Kafka logs
docker-compose logs kafka

# Restart Kafka
docker-compose restart kafka
```

### Database Issues
```bash
# Connect to PostgreSQL
docker-compose exec postgres psql -U user -d series_db

# Check tables
\dt

# View users
SELECT * FROM user_profiles;
```

### Reset Everything
```bash
docker-compose down -v
rm -rf db_data
docker-compose up --build
```

## 🎯 Hackathon Notes

This prototype demonstrates:
- **Event-driven architecture** with Kafka messaging
- **Microservices** with Docker containerization
- **Real-time matching** with instant Kafka consumption
- **Double opt-in** warm introductions via Series API
- **Gamification** with FOMO deadlines and ratings

The Series API calls are simulated in sandbox mode. To enable real introductions, replace `YOUR_HACKATHON_API_KEY` with actual credentials.

---

Built for Hax_25 Hackathon 🚀
