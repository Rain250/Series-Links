/**
 * Series Event Layer - Frontend Server
 * Presentation/Input Layer (Layer I)
 * 
 * Handles:
 * - User intent submission via API
 * - Kafka message production
 * - Real-time notifications via Kafka consumer
 * - Event status display
 */

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { Kafka } = require('kafkajs');

const app = express();
const PORT = process.env.PORT || 3000;

// Kafka Configuration
const KAFKA_BROKER = process.env.KAFKA_BROKER || 'localhost:29092';
const KAFKA_TOPIC_INTENT = process.env.KAFKA_TOPIC_INTENT || 'series_event_intents';
const KAFKA_TOPIC_NOTIFY = process.env.KAFKA_TOPIC_NOTIFY || 'series_frontend_notify';

// Initialize Kafka
const kafka = new Kafka({
    clientId: 'series-frontend',
    brokers: [KAFKA_BROKER],
    retry: {
        initialRetryTime: 1000,
        retries: 10
    }
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'series-frontend-group' });

// In-memory stores for demo
const activeEvents = new Map();
const notifications = [];
const eventProposals = [];

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// --- Kafka Producer Setup ---
let kafkaReady = false;

async function initKafka() {
    try {
        console.log(`[KAFKA] Connecting to ${KAFKA_BROKER}...`);
        
        await producer.connect();
        console.log('[KAFKA] Producer connected');
        
        await consumer.connect();
        console.log('[KAFKA] Consumer connected');
        
        await consumer.subscribe({ topic: KAFKA_TOPIC_NOTIFY, fromBeginning: false });
        console.log(`[KAFKA] Subscribed to ${KAFKA_TOPIC_NOTIFY}`);
        
        // Run consumer in background
        consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                try {
                    const notification = JSON.parse(message.value.toString());
                    console.log(`[KAFKA] Received notification:`, notification.type);
                    
                    // Store notification
                    notifications.unshift({
                        ...notification,
                        receivedAt: new Date().toISOString()
                    });
                    
                    // Keep only last 100 notifications
                    if (notifications.length > 100) {
                        notifications.pop();
                    }
                    
                    // Update active events based on notification
                    if (notification.type === 'match_success') {
                        const userId = notification.user_id;
                        const existingEvent = Array.from(activeEvents.values())
                            .find(e => e.userId == userId && e.status === 'matching');
                        
                        if (existingEvent) {
                            existingEvent.status = 'matched';
                            existingEvent.matchedWith = notification.matched_user_name;
                            existingEvent.matchScore = notification.match_score;
                            existingEvent.updatedAt = new Date().toISOString();
                        }
                    }
                } catch (err) {
                    console.error('[KAFKA] Error processing notification:', err);
                }
            }
        });
        
        kafkaReady = true;
        console.log('[KAFKA] Ready to produce and consume messages');
    } catch (error) {
        console.error('[KAFKA] Initialization error:', error.message);
        console.log('[KAFKA] Will retry in 5 seconds...');
        setTimeout(initKafka, 5000);
    }
}

// Send intent to Kafka
async function sendIntentToKafka(intent) {
    if (!kafkaReady) {
        console.log('[KAFKA] Not ready, queuing intent...');
        return false;
    }
    
    try {
        await producer.send({
            topic: KAFKA_TOPIC_INTENT,
            messages: [
                { 
                    key: intent.id,
                    value: JSON.stringify(intent)
                }
            ]
        });
        console.log(`[KAFKA] Intent sent: ${intent.purpose}`);
        return true;
    } catch (error) {
        console.error('[KAFKA] Send error:', error);
        return false;
    }
}

// --- API Routes ---

/**
 * POST /api/submit-intent
 * Collects user Event Intent (Shared Purpose / Event Proposal)
 * Produces message to Kafka for Python matcher to consume
 */
app.post('/api/submit-intent', async (req, res) => {
    const { 
        userId, 
        userPhone, 
        userName,
        purpose, 
        location, 
        availableTime, 
        networkOptIn = []
    } = req.body;
    
    // --- Feature: Shared Purpose validation ---
    if (!purpose || purpose.trim().length < 3) {
        return res.status(400).json({ 
            success: false,
            error: "Shared Purpose is required for meaningful connection (min 3 characters)." 
        });
    }
    
    // Create intent payload
    const intentId = uuidv4();
    const intentPayload = {
        id: intentId,
        user_id: parseInt(userId) || Date.now() % 1000,
        user_phone: userPhone || '',
        user_name: userName || 'Anonymous',
        purpose: purpose.trim(),
        location: location || 'NYC',
        available_time: availableTime || 'Flexible',
        network_opt_in: networkOptIn,
        timestamp: new Date().toISOString(),
        deadline: new Date(Date.now() + 60 * 60 * 1000).toISOString() // 1 hour FOMO deadline
    };
    
    // --- Feature: External Integration (Sell idea / NYU Engage) ---
    if (networkOptIn.includes('nyu_engage')) {
        console.log(`[INTEGRATION] User opted into NYU Engage for: ${purpose}`);
    }
    if (networkOptIn.includes('stern_club')) {
        console.log(`[INTEGRATION] User opted into Stern Club for: ${purpose}`);
    }
    
    // Send to Kafka (produces messages to Kafka)
    const sent = await sendIntentToKafka(intentPayload);
    
    // Store in active events
    const event = {
        id: intentId,
        userId: intentPayload.user_id,
        purpose: purpose,
        location: location,
        status: 'matching',
        attendees: 1,
        deadline: intentPayload.deadline,
        createdAt: intentPayload.timestamp,
        kafkaSent: sent
    };
    
    activeEvents.set(intentId, event);
    eventProposals.push(event);
    
    res.json({ 
        success: true,
        intentId: intentId,
        status: "Intent received. AI Friends are looking for a match instantly...",
        deadline: intentPayload.deadline,
        message: "🔍 Your shared purpose has been submitted. Watch for matches!"
    });
});

/**
 * GET /api/events
 * Returns active events with FOMO deadlines (Social FOMO)
 * Shows who is going / group chat events
 */
app.get('/api/events', (req, res) => {
    const now = new Date();
    
    // Convert Map to array and add computed fields
    const events = Array.from(activeEvents.values()).map(event => {
        const deadline = new Date(event.deadline);
        const remainingMs = deadline - now;
        const remainingMinutes = Math.max(0, Math.floor(remainingMs / 60000));
        
        return {
            ...event,
            remainingMinutes,
            isExpired: remainingMs <= 0,
            displayStatus: event.status === 'matched' 
                ? `✅ Matched with ${event.matchedWith}!` 
                : remainingMs <= 0 
                    ? '⏰ Expired' 
                    : '🔍 Matching...'
        };
    });
    
    // Sort by creation time, newest first
    events.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json({
        success: true,
        events: events.slice(0, 20), // Return latest 20
        totalActive: events.filter(e => !e.isExpired && e.status !== 'matched').length
    });
});

/**
 * GET /api/notifications
 * Returns recent notifications for frontend updates
 * Makes Group Chat Events Become Visible
 */
app.get('/api/notifications', (req, res) => {
    const userId = req.query.userId;
    
    let userNotifications = notifications;
    if (userId) {
        userNotifications = notifications.filter(n => 
            n.user_id == userId || n.matched_user_id == userId
        );
    }
    
    res.json({
        success: true,
        notifications: userNotifications.slice(0, 20),
        total: userNotifications.length
    });
});

/**
 * GET /api/integrations
 * Returns available external integrations (Stern Club, NYU Engage, etc.)
 * Feature: Sell Idea / Integrate with Existing Systems
 */
app.get('/api/integrations', (req, res) => {
    const integrations = [
        {
            id: 'stern_club',
            name: 'Stern Club',
            description: 'NYU Stern Business School networking events',
            icon: '🎓',
            active: true
        },
        {
            id: 'nyu_engage',
            name: 'NYU Engage',
            description: 'NYU student engagement and campus events',
            icon: '🏛️',
            active: true
        },
        {
            id: 'tech_nyu',
            name: 'Tech@NYU',
            description: 'Technology and startup community events',
            icon: '💻',
            active: true
        },
        {
            id: 'ib_network',
            name: 'IB Network',
            description: 'Investment Banking recruiting and networking',
            icon: '💼',
            active: true
        },
        {
            id: 'hackathon_alumni',
            name: 'Hackathon Alumni',
            description: 'Past hackathon participants network',
            icon: '🚀',
            active: true
        }
    ];
    
    res.json({
        success: true,
        integrations
    });
});

/**
 * GET /api/status
 * Health check and system status
 */
app.get('/api/status', (req, res) => {
    res.json({
        success: true,
        service: 'Series Event Layer - Frontend',
        kafkaReady,
        activeEventsCount: activeEvents.size,
        notificationsCount: notifications.length,
        uptime: process.uptime()
    });
});

/**
 * GET /api/event/:id
 * Get specific event details
 */
app.get('/api/event/:id', (req, res) => {
    const event = activeEvents.get(req.params.id);
    
    if (!event) {
        return res.status(404).json({
            success: false,
            error: 'Event not found'
        });
    }
    
    res.json({
        success: true,
        event
    });
});

// Serve main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve events page (iOS style)
app.get('/events', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'events-ios.html'));
});

// --- Server Startup ---
app.listen(PORT, async () => {
    console.log('\n' + '='.repeat(60));
    console.log('🚀 Series Event Layer - Frontend Server');
    console.log('='.repeat(60));
    console.log(`   URL: http://localhost:${PORT}`);
    console.log(`   Kafka Broker: ${KAFKA_BROKER}`);
    console.log(`   Intent Topic: ${KAFKA_TOPIC_INTENT}`);
    console.log(`   Notify Topic: ${KAFKA_TOPIC_NOTIFY}`);
    console.log('='.repeat(60) + '\n');
    
    // Initialize Kafka after server starts
    await initKafka();
});

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('\n[SHUTDOWN] Closing connections...');
    await producer.disconnect();
    await consumer.disconnect();
    process.exit(0);
});


