-- Series Event Layer - Database Schema
-- PostgreSQL Persistence Layer for Hax_25 Prototype

-- Table for user data, essential for Algorithmic Bidding and Matching
CREATE TABLE user_profiles (
    user_id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    background TEXT, -- e.g., CS major, Finance professional (Used for Shared Purpose/Matching)
    network_tags TEXT[], -- Inter-club networks, integration points
    location VARCHAR(100), -- People can come from different places
    phone_number VARCHAR(20) UNIQUE, -- For opt-in/iMessage API plug
    interests TEXT[], -- Additional interests for better matching
    last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for tracking success and enforcing accurate matches
CREATE TABLE user_ratings (
    rating_id SERIAL PRIMARY KEY,
    rater_id INTEGER REFERENCES user_profiles(user_id) ON DELETE CASCADE,
    rated_id INTEGER REFERENCES user_profiles(user_id) ON DELETE CASCADE,
    rating_score INTEGER CHECK (rating_score BETWEEN 1 AND 5), -- Positive enforcement
    feedback TEXT,
    event_id INTEGER, -- Reference to the event where interaction occurred
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(rater_id, rated_id, event_id)
);

-- Table to store historical events/matches (Activity and Memories)
CREATE TABLE past_events_memory (
    event_id SERIAL PRIMARY KEY,
    purpose TEXT NOT NULL,
    matched_users INTEGER[], -- Array of user IDs that were matched
    initiator_id INTEGER REFERENCES user_profiles(user_id),
    outcome_success BOOLEAN, -- Used to fix Awkwardness
    match_score INTEGER, -- The algorithm's confidence score
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP,
    status VARCHAR(50) DEFAULT 'active', -- active, completed, expired, cancelled
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for tracking active event intents (for FOMO deadlines)
CREATE TABLE active_intents (
    intent_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES user_profiles(user_id),
    purpose TEXT NOT NULL,
    location VARCHAR(100),
    available_time VARCHAR(100),
    network_opt_in TEXT[], -- Networks user opted into
    deadline TIMESTAMP NOT NULL, -- FOMO deadline (1 hour from creation)
    status VARCHAR(50) DEFAULT 'pending', -- pending, matched, expired
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for external integrations (Stern Club, NYU Engage, etc.)
CREATE TABLE external_integrations (
    integration_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    api_endpoint VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster matching queries
CREATE INDEX idx_user_location ON user_profiles(location);
CREATE INDEX idx_user_background ON user_profiles USING GIN(to_tsvector('english', background));
CREATE INDEX idx_intent_status ON active_intents(status);
CREATE INDEX idx_intent_deadline ON active_intents(deadline);
CREATE INDEX idx_ratings_rated ON user_ratings(rated_id);

-- Mock bank of people data (Banks of people)
INSERT INTO user_profiles (full_name, background, network_tags, location, phone_number, interests) VALUES
('Alice Stern', 'Finance/MBA candidate with focus on Investment Banking and Private Equity', '{"stern_club", "ib_network", "pe_club"}', 'NYC', '111-555-0001', '{"networking", "finance", "investing"}'),
('Bob Tech', 'Computer Science major specializing in AI/ML and distributed systems', '{"hackathon_alumni", "tech_club", "ai_research"}', 'SF', '111-555-0002', '{"coding", "machine_learning", "startups"}'),
('Charlie Student', 'NYU Engaged student leader with focus on community building', '{"nyu_engage_list", "student_gov", "volunteer_corp"}', 'NYC', '111-555-0003', '{"leadership", "community", "events"}'),
('Diana Finance', 'Investment Banking Associate at Goldman Sachs', '{"stern_club", "ib_network", "gs_alumni"}', 'NYC', '111-555-0004', '{"finance", "deals", "networking"}'),
('Eve Engineer', 'Software Engineer at Google working on search infrastructure', '{"tech_club", "google_alumni", "swe_network"}', 'SF', '111-555-0005', '{"engineering", "systems", "tech"}'),
('Frank Founder', 'Startup founder in EdTech space, Y Combinator alumni', '{"yc_alumni", "startup_network", "edtech"}', 'NYC', '111-555-0006', '{"startups", "education", "venture"}'),
('Grace Grad', 'PhD candidate in Economics with focus on behavioral finance', '{"phd_network", "econ_club", "research_group"}', 'NYC', '111-555-0007', '{"research", "economics", "academia"}'),
('Henry Healthcare', 'Medical student interested in healthtech innovations', '{"med_school", "healthtech", "bio_club"}', 'NYC', '111-555-0008', '{"healthcare", "technology", "medicine"}');

-- Mock ratings data for positive enforcement
INSERT INTO user_ratings (rater_id, rated_id, rating_score, feedback) VALUES
(1, 2, 5, 'Great conversation about tech in finance'),
(2, 1, 4, 'Very knowledgeable about markets'),
(3, 1, 5, 'Excellent networking event organizer'),
(1, 3, 4, 'Engaging and helpful'),
(4, 1, 5, 'Professional and insightful'),
(5, 2, 5, 'Brilliant technical discussions'),
(6, 1, 4, 'Great advice on fundraising'),
(7, 4, 5, 'Deep knowledge of finance');

-- Mock past events for activity and memories
INSERT INTO past_events_memory (purpose, matched_users, initiator_id, outcome_success, match_score, status) VALUES
('Finance networking for IB recruiting', '{1, 4}', 1, true, 95, 'completed'),
('CS study group for algorithms', '{2, 5}', 2, true, 88, 'completed'),
('Startup pitch practice session', '{6, 1}', 6, true, 82, 'completed'),
('Healthcare tech brainstorm', '{8, 2}', 8, true, 75, 'completed');

-- External integrations mock data
INSERT INTO external_integrations (name, description, api_endpoint) VALUES
('Stern Club', 'NYU Stern Business School networking club', 'https://api.stern.nyu.edu/clubs'),
('NYU Engage', 'NYU student engagement platform', 'https://engage.nyu.edu/api'),
('Tech@NYU', 'NYU technology and startup club', 'https://techatnyu.org/api'),
('Alumni Network', 'Cross-university alumni networking', 'https://alumni.network/api');


