// Complete Events UI Application
// All features: Onboarding, Events Home, Chatbot, Feedback
// Note: All data is hard-coded/mocked - no real backend calls

// Detect iOS mode - check after DOM loads
function isIOSMode() {
  if (typeof window !== 'undefined' && document) {
    // Check for iOS-specific elements
    return document.querySelector('.onboarding-screen') !== null ||
           document.querySelector('.ios-card') !== null ||
           document.querySelector('.ios-button') !== null ||
           document.querySelector('.nav-bar') !== null ||
           window.location.pathname.includes('events');
  }
  return false;
}

const IS_IOS = isIOSMode();

// ========== MOCK DATA ==========
// Hardcoded Profile: Waqas Arain (Series Hackathon Team Member)
const WAQAS_ARAIN_PROFILE = {
  firstName: 'Waqas',
  lastName: 'Arain',
  schoolEmail: 'waqasarain0250@gmail.com',
  schoolEmailVerified: true,
  headline: 'Co-Founder & Builder | Series Hackathon 2025',
  bio: 'Passionate about building products that create meaningful connections. Working on Series Event Layer to revolutionize networking through event-anchored introductions.',
  interests: ['Tech', 'AI', 'Founders', 'VC', 'Networking', 'Startups'],
  linkedInUrl: 'https://www.linkedin.com/in/waqas-arain/',
  websiteUrl: '',
  // User Relevance Score components (for Tiered Matching)
  careerStage: 'Founder/Early Career', // Used for matching algorithm
  goals: ['Network', 'Find Co-founders', 'Raise Capital', 'Learn'],
  profileScore: 85, // Dynamic score reflecting capacity/activity level
  nyuAffiliation: true,
  commitmentLevel: 'High'
};

// Mock Events aligned with PDF: Events as Anchors for Networking
// Events create shared context, deadlines, and built-in follow-through incentives
const MOCK_EVENTS = [
  {
    id: 'event-1',
    title: 'AI Founders Mixer',
    dateTime: '2024-12-07T19:00:00',
    location: 'The WeWork, 45th Street',
    description: 'Networking event for AI founders, investors, and builders. Drinks and light bites provided.',
    tags: ['Tech', 'AI', 'Founders'],
    hostName: 'Tech@NYU',
    spotsLeft: 3,
    hoursUntilStart: 3,
    urgencyLabel: 'Starts in 3 hours',
    // Event Score components (from PDF: Event Intelligence Layer)
    relevanceScore: 92, // High relevance for AI/Tech founders
    credibilityScore: 88, // Hosted by Tech@NYU
    userFitScore: 90, // Perfect match for founder profile
    sharedContext: 'AI/ML entrepreneurship and funding',
    eventType: 'Networking Mixer',
    expectedAttendance: 45
  },
  {
    id: 'event-2',
    title: 'Climate Tech Happy Hour',
    dateTime: '2024-12-08T18:00:00',
    location: 'The Flatiron, 5th Avenue',
    description: 'Connect with climate tech entrepreneurs and investors working on the future of sustainability.',
    tags: ['Climate', 'Tech', 'VC'],
    hostName: 'NYU Engage',
    spotsLeft: 5,
    hoursUntilStart: 27,
    urgencyLabel: 'Only 5 spots left'
  },
  {
    id: 'event-3',
    title: 'VC Office Hours',
    dateTime: '2024-12-09T14:00:00',
    location: 'Zoom',
    description: '1:1 office hours with partners from top VCs. Get feedback on your pitch and ask questions.',
    tags: ['VC', 'Finance', 'Startups'],
    hostName: 'Stern Club',
    spotsLeft: 2,
    hoursUntilStart: 50,
    urgencyLabel: 'Decide in 20 min to be grouped'
  },
  {
    id: 'event-4',
    title: 'AI Product Manager Roundtable',
    dateTime: '2024-12-10T19:30:00',
    location: 'The Commons, Brooklyn',
    description: 'Product managers from top AI companies sharing strategies, roadmaps, and building the future of AI products.',
    tags: ['AI', 'Tech', 'Products'],
    hostName: 'Tech@NYU',
    spotsLeft: 8,
    hoursUntilStart: 98,
    relevanceScore: 88,
    credibilityScore: 85,
    userFitScore: 82,
    sharedContext: 'AI product strategy and execution',
    eventType: 'Roundtable Discussion',
    expectedAttendance: 25
  },
  {
    id: 'event-5',
    title: 'Founder-Investor Speed Networking',
    dateTime: '2024-12-11T17:00:00',
    location: 'Stern School of Business',
    description: 'Structured speed networking between early-stage founders and active angel investors. 5-minute meetings, maximum connections.',
    tags: ['Startups', 'VC', 'Founders', 'Networking'],
    hostName: 'Stern Club',
    spotsLeft: 3,
    hoursUntilStart: 122,
    urgencyLabel: 'Only 3 spots left',
    relevanceScore: 98, // Extremely high for founders
    credibilityScore: 92,
    userFitScore: 96,
    sharedContext: 'Startup funding and investor relations',
    eventType: 'Speed Networking',
    expectedAttendance: 30
  },
  {
    id: 'event-6',
    title: 'Early Stage Startup Pitch Night',
    dateTime: '2024-12-12T18:00:00',
    location: 'NYU Tandon, Brooklyn',
    description: 'Watch early-stage startups pitch to investors and network with the ecosystem. Perfect for founders seeking feedback.',
    tags: ['Startups', 'VC', 'Founders'],
    hostName: 'Tech@NYU',
    spotsLeft: 12,
    hoursUntilStart: 146,
    relevanceScore: 94,
    credibilityScore: 88,
    userFitScore: 91,
    sharedContext: 'Startup pitching and investor feedback',
    eventType: 'Pitch Night',
    expectedAttendance: 75
  },
  {
    id: 'event-7',
    title: 'NYU Startup Founders Circle',
    dateTime: '2024-12-13T16:00:00',
    location: 'Leslie eLab, NYU',
    description: 'Exclusive monthly gathering for NYU-affiliated founders. Share challenges, wins, and build your network.',
    tags: ['Founders', 'Startups', 'Networking', 'NYU'],
    hostName: 'NYU Engage',
    spotsLeft: 5,
    hoursUntilStart: 170,
    urgencyLabel: 'NYU founders only - 5 spots',
    relevanceScore: 96, // Perfect for NYU founder
    credibilityScore: 90,
    userFitScore: 95,
    sharedContext: 'NYU founder community and peer support',
    eventType: 'Founders Circle',
    expectedAttendance: 20
  },
  {
    id: 'event-8',
    title: 'AI & ML Technical Deep Dive',
    dateTime: '2024-12-14T19:00:00',
    location: 'Remote',
    description: 'Technical discussion on ML architecture, model deployment, and AI infrastructure. For builders and engineers.',
    tags: ['AI', 'Tech', 'ML'],
    hostName: 'Tech@NYU',
    spotsLeft: 25,
    hoursUntilStart: 194,
    relevanceScore: 85,
    credibilityScore: 82,
    userFitScore: 78,
    sharedContext: 'AI/ML technical implementation',
    eventType: 'Technical Workshop',
    expectedAttendance: 40
  },
  {
    id: 'event-9',
    title: 'Angel Investor Meetup',
    dateTime: '2024-12-15T18:30:00',
    location: 'The Standard, Meatpacking',
    description: 'Connect with active angel investors and other founders. Open networking with a curated crowd.',
    tags: ['VC', 'Founders', 'Networking', 'Startups'],
    hostName: 'Stern Club',
    spotsLeft: 6,
    hoursUntilStart: 218,
    urgencyLabel: 'Only 6 spots left',
    relevanceScore: 93,
    credibilityScore: 89,
    userFitScore: 92,
    sharedContext: 'Early-stage funding and angel networks',
    eventType: 'Networking Meetup',
    expectedAttendance: 35
  },
  {
    id: 'event-10',
    title: 'Series Hackathon Demo Day',
    dateTime: '2024-12-16T17:00:00',
    location: 'A16Z Office, Soho',
    description: 'Showcase your hackathon project to Series team and investors. Perfect for teams building Series integrations.',
    tags: ['Hackathon', 'VC', 'Startups', 'Tech'],
    hostName: 'Series Team',
    spotsLeft: 2,
    hoursUntilStart: 242,
    urgencyLabel: 'Register now - 2 spots',
    relevanceScore: 100, // Perfect for hackathon participant
    credibilityScore: 95, // Series team hosting
    userFitScore: 100, // You're literally in the hackathon
    sharedContext: 'Series hackathon projects and demos',
    eventType: 'Demo Day',
    expectedAttendance: 15
  }
];

// Mock People aligned with PDF: People attending events create shared context
// Each person has a User Relevance Score and compatibility metrics
const MOCK_PEOPLE = {
  'event-1': [
    { 
      id: 'p1', 
      name: 'Sarah Chen', 
      school: 'NYU Stern MBA', 
      headline: 'AI Product Manager at Google', 
      sharedInterests: ['AI', 'Tech', 'Products'], 
      avatar: 'SC',
      careerStage: 'Mid-Level Professional',
      profileScore: 82,
      compatibilityScore: 88, // High - both in AI/Tech
      goals: ['Network', 'Learn', 'Explore Opportunities'],
      linkedInUrl: 'https://linkedin.com/in/sarah-chen',
      phone: '+19175551234'
    },
    { 
      id: 'p2', 
      name: 'Alex Rivera', 
      school: 'NYU Tandon', 
      headline: 'Founder @ AI Startup (Seed Stage)', 
      sharedInterests: ['AI', 'Founders', 'Tech', 'Startups'], 
      avatar: 'AR',
      careerStage: 'Founder/Early Career',
      profileScore: 85,
      compatibilityScore: 95, // Very High - both founders in AI
      goals: ['Find Co-founders', 'Raise Capital', 'Network'],
      linkedInUrl: 'https://linkedin.com/in/alex-rivera',
      phone: '+19175551235'
    },
    { 
      id: 'p3', 
      name: 'Jordan Kim', 
      school: 'NYU Stern', 
      headline: 'ML Engineer at Anthropic', 
      sharedInterests: ['AI', 'Tech', 'ML'], 
      avatar: 'JK',
      careerStage: 'Mid-Level Professional',
      profileScore: 80,
      compatibilityScore: 85,
      goals: ['Network', 'Learn', 'Technical Discussions'],
      linkedInUrl: 'https://linkedin.com/in/jordan-kim',
      phone: '+19175551236'
    },
    { 
      id: 'p4', 
      name: 'Taylor Morgan', 
      school: 'NYU', 
      headline: 'AI Researcher & PhD Candidate', 
      sharedInterests: ['AI', 'Tech', 'Research'], 
      avatar: 'TM',
      careerStage: 'Graduate Student',
      profileScore: 78,
      compatibilityScore: 82,
      goals: ['Network', 'Learn', 'Academic Collaboration'],
      linkedInUrl: 'https://linkedin.com/in/taylor-morgan',
      phone: '+19175551237'
    },
    { 
      id: 'p5', 
      name: 'Marcus Johnson', 
      school: 'NYU Stern', 
      headline: 'Angel Investor (AI/ML Focus)', 
      sharedInterests: ['AI', 'VC', 'Startups', 'Tech'], 
      avatar: 'MJ',
      careerStage: 'Investor',
      profileScore: 92,
      compatibilityScore: 96, // Extremely High - investor + founder
      goals: ['Find Deals', 'Network', 'Mentor Founders'],
      linkedInUrl: 'https://linkedin.com/in/marcus-johnson',
      phone: '+19175551238'
    }
  ],
  'event-2': [
    { 
      id: 'p6', 
      name: 'Emma Wilson', 
      school: 'NYU', 
      headline: 'Climate Tech Founder', 
      sharedInterests: ['Climate', 'Tech', 'Startups'], 
      avatar: 'EW',
      careerStage: 'Founder/Early Career',
      profileScore: 83,
      compatibilityScore: 70, // Lower - different focus area
      goals: ['Network', 'Raise Capital'],
      phone: '+19175551239'
    },
    { 
      id: 'p7', 
      name: 'Sofia Martinez', 
      school: 'NYU Tandon', 
      headline: 'Climate Engineer', 
      sharedInterests: ['Climate', 'Tech'], 
      avatar: 'SM',
      careerStage: 'Mid-Level Professional',
      profileScore: 79,
      compatibilityScore: 68,
      goals: ['Network', 'Learn'],
      phone: '+19175551240'
    }
  ],
  'event-3': [
    { 
      id: 'p8', 
      name: 'David Park', 
      school: 'NYU Stern', 
      headline: 'Partner @ Sequoia Capital', 
      sharedInterests: ['VC', 'Finance', 'Startups'], 
      avatar: 'DP',
      careerStage: 'Investor',
      profileScore: 95,
      compatibilityScore: 98, // Extremely High - VC partner for founder
      goals: ['Find Deals', 'Mentor'],
      phone: '+19175551241'
    },
    { 
      id: 'p9', 
      name: 'Priya Patel', 
      school: 'NYU', 
      headline: 'Associate @ a16z', 
      sharedInterests: ['VC', 'Startups', 'Tech'], 
      avatar: 'PP',
      careerStage: 'Early Career Investor',
      profileScore: 87,
      compatibilityScore: 93,
      goals: ['Network', 'Learn', 'Source Deals'],
      phone: '+19175551242'
    },
    { 
      id: 'p10', 
      name: 'Ryan O\'Connor', 
      school: 'NYU Stern MBA', 
      headline: 'Founder @ Fintech Startup (Series A)', 
      sharedInterests: ['Startups', 'VC', 'Finance'], 
      avatar: 'RO',
      careerStage: 'Founder/Growth Stage',
      profileScore: 89,
      compatibilityScore: 90, // High - both founders
      goals: ['Network', 'Share Experiences', 'Mentor'],
      phone: '+19175551243'
    },
    { id: 'p9', name: 'Chris Lee', school: 'NYU Stern MBA', headline: 'VC Associate', sharedInterests: ['VC', 'Finance'], avatar: 'CL' },
    { id: 'p10', name: 'Rachel Green', school: 'NYU', headline: 'Startup Founder', sharedInterests: ['VC', 'Startups'], avatar: 'RG' }
  ]
};

const INTEREST_TAGS = ['Tech', 'AI', 'Climate', 'VC', 'Finance', 'Consumer', 'Creator', 'Founders', 'Startups', 'Networking', 'Social Media', 'Products'];

// ========== STATE MANAGEMENT ==========
class EventsState {
  constructor() {
    this.state = {
      userProfile: null,
      onboardingCompleted: false,
      committedEvents: [],
      feedback: [],
      chatbotMessages: []
    };
    this.load();
  }

  load() {
    try {
      const saved = localStorage.getItem('series_events_state');
      if (saved) this.state = { ...this.state, ...JSON.parse(saved) };
    } catch (e) {}
  }

  save() {
    try {
      localStorage.setItem('series_events_state', JSON.stringify(this.state));
    } catch (e) {}
  }

  setUserProfile(profile) {
    this.state.userProfile = profile;
    this.state.onboardingCompleted = true;
    this.save();
    this.updateUI();
  }

  // Auto-login with Waqas Arain profile for demo
  getDemoProfile() {
    return {
      firstName: 'Waqas',
      lastName: 'Arain',
      schoolEmail: 'waqasarain0250@gmail.com',
      schoolEmailVerified: true,
      headline: 'Co-Founder & Builder | Series Hackathon 2025',
      bio: 'Passionate about building products that create meaningful connections. Working on Series Event Layer to revolutionize networking through event-anchored introductions.',
      interests: ['Tech', 'AI', 'Founders', 'VC', 'Networking', 'Startups'],
      linkedInUrl: 'https://www.linkedin.com/in/waqas-arain/',
      websiteUrl: '',
      phone: '+15702399428', // Your phone number
      careerStage: 'Founder/Early Career',
      goals: ['Network', 'Find Co-founders', 'Raise Capital', 'Learn'],
      profileScore: 85,
      nyuAffiliation: true,
      commitmentLevel: 'High'
    };
  }

  getUserProfile() { 
    // For demo: return hardcoded profile if none exists
    if (!this.state.userProfile) {
      return this.getDemoProfile();
    }
    return this.state.userProfile; 
  }
  
  isOnboardingCompleted() { 
    // For demo: auto-complete onboarding
    // Check if profile exists in localStorage first
    const saved = localStorage.getItem('series_events_state');
    if (saved) {
      try {
        const state = JSON.parse(saved);
        return state.onboardingCompleted && state.userProfile !== null;
      } catch (e) {
        return true; // Default to true for demo
      }
    }
    return true; // Always show events page for demo
  }
  
  commitToEvent(eventId, people = []) {
    if (!this.state.committedEvents.find(e => e.eventId === eventId)) {
      this.state.committedEvents.push({ eventId, committedAt: new Date().toISOString(), peopleIds: people.map(p => p.id) });
      this.save();
      this.updateUI();
    }
  }

  getCommittedEvents() { return this.state.committedEvents; }
  isEventCommitted(eventId) { return this.state.committedEvents.some(e => e.eventId === eventId); }

  submitFeedback(eventId, rating, outcomes, notes) {
    this.state.feedback.push({ eventId, rating, outcomes, notes, submittedAt: new Date().toISOString() });
    this.save();
  }

  getFeedback(eventId) { return this.state.feedback.find(f => f.eventId === eventId); }

  addChatbotMessage(message) {
    this.state.chatbotMessages.push({ ...message, timestamp: new Date().toISOString() });
    this.save();
  }

  getChatbotMessages() { return this.state.chatbotMessages; }

  updateUI() {
    if (window.renderEvents) window.renderEvents();
    if (window.renderPastEvents) window.renderPastEvents();
    if (window.updateUserInfo) window.updateUserInfo();
  }
}

const state = new EventsState();

// ========== UTILITY FUNCTIONS ==========
function getRecommendedEvents(userProfile) {
  if (!userProfile || !userProfile.interests) return MOCK_EVENTS.slice(0, 3);
  const scored = MOCK_EVENTS.map(event => ({
    event,
    score: event.tags.filter(tag => userProfile.interests.includes(tag)).length
  }));
  return scored.sort((a, b) => b.score - a.score).slice(0, 3).map(item => item.event);
}

function getRelevanceText(event, userProfile) {
  if (!userProfile || !userProfile.interests) return 'You might be interested in this event';
  const matching = event.tags.filter(tag => userProfile.interests.includes(tag));
  if (matching.length === 0) return 'This event might be relevant to you';
  if (matching.length === 1) return `Matches your ${matching[0]} interest`;
  return `Matches your ${matching.slice(0, 2).join(' + ')} interests`;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.style.opacity = '1';
  setTimeout(() => { toast.style.opacity = '0'; }, 3000);
}

// ========== ONBOARDING ==========
function getOnboardingStep() {
  // Get step from URL route
  const hash = window.location.hash.slice(1);
  if (hash && hash.startsWith('onboarding/')) {
    const step = parseInt(hash.split('/')[1]);
    if (step >= 1 && step <= 5) {
      return step;
    }
  }
  return 1;
}

function renderOnboarding() {
  const container = document.getElementById('onboarding');
  const step = getOnboardingStep();
  
  if (!container) {
    console.error('[ONBOARDING] Container not found!');
    return;
  }
  
  container.innerHTML = `
    <div class="step-indicator">
      ${[1,2,3,4,5].map(s => `<div class="step-dot ${s === step ? 'active' : (s < step ? 'complete' : '')}"></div>`).join('')}
    </div>
    <div class="onboarding-step active">
      ${renderOnboardingStep(step)}
    </div>
  `;

  attachOnboardingListeners();
}

// Make it available globally
window.renderOnboarding = renderOnboarding;

window.navigateToOnboardingStep = function(step) {
  console.log('[ONBOARDING] Navigating to step:', step);
  if (window.router) {
    // Force navigation even if same route
    window.router.currentRoute = null; // Reset to allow re-navigation
    window.router.goTo(`onboarding/${step}`);
  } else {
    window.location.hash = `onboarding/${step}`;
    // Small delay to ensure hash is updated
    setTimeout(() => {
      renderOnboarding();
    }, 100);
  }
};

function renderOnboardingStep(step) {
  const iosMode = isIOSMode();
  const cardClass = iosMode ? 'ios-card' : 'card';
  const inputClass = iosMode ? 'ios-input' : 'form-input';
  const labelClass = iosMode ? 'ios-label' : 'form-label';
  const buttonClass = iosMode ? 'ios-button' : 'btn btn-primary';
  const groupClass = iosMode ? 'mb-16' : 'form-group';
  const chipClass = iosMode ? 'ios-chip' : 'chip';
  const backButton = step > 1 ? `<button class="${iosMode ? 'nav-back' : 'btn btn-secondary'}" id="onboardingBackBtn" data-step="${step - 1}" style="margin-bottom: 16px; background: transparent; border: none; color: var(--series-text); font-size: 16px; padding: 8px 0; cursor: pointer;">← Back</button>` : '';
  
  switch(step) {
    case 1: return `
      <div class="${iosMode ? 'onboarding-header' : 'onboarding-header'}">
        <h1 class="onboarding-title">Let's get you into the right rooms.</h1>
        <p class="onboarding-subtitle">Step 1 of 5</p>
      </div>
      <div class="${cardClass}">
        <div class="${groupClass}">
          <label class="${labelClass}">First name</label>
          <input type="text" class="${inputClass}" id="firstName" placeholder="John">
        </div>
        <div class="${groupClass}">
          <label class="${labelClass}">Last name</label>
          <input type="text" class="${inputClass}" id="lastName" placeholder="Doe">
        </div>
        <button class="${buttonClass}" id="nextStep1" style="width: 100%; margin-top: 16px;" disabled>Next</button>
      </div>
    `;
    case 2: return `
      <div class="${iosMode ? 'onboarding-header' : 'onboarding-header'}">
        <h1 class="onboarding-title">Verify your school email</h1>
        <p class="onboarding-subtitle">Step 2 of 5</p>
      </div>
      <div class="${cardClass}">
        ${backButton}
        <div class="${groupClass}">
          <label class="${labelClass}">School email</label>
          <input type="email" class="${inputClass}" id="schoolEmail" placeholder="name@school.edu">
        </div>
        <button class="${buttonClass}" id="sendCode" style="width: 100%; margin-bottom: 16px;">Send code</button>
        <div id="codeSection" style="display: none;">
          <p style="color: ${iosMode ? 'var(--ios-green)' : 'var(--success)'}; margin-bottom: 16px; font-size: 15px;">Code sent to your school email.</p>
          <div class="${groupClass}">
            <label class="${labelClass}">Enter 6-digit code</label>
            <input type="text" class="${inputClass}" id="verificationCode" placeholder="000000" maxlength="6">
          </div>
          <button class="${buttonClass}" id="verifyCode" style="width: 100%; margin-bottom: 16px;">Verify</button>
        </div>
        <div id="verifiedBadge" class="verified-badge" style="display: none; margin-bottom: 16px;">
          ✓ Verified
        </div>
        <button class="${buttonClass}" id="nextStep2" style="width: 100%; margin-top: ${iosMode ? '0' : '1rem'};" disabled>Next</button>
      </div>
    `;
    case 3: return `
      <div class="${iosMode ? 'onboarding-header' : 'onboarding-header'}">
        <h1 class="onboarding-title">Tell us about yourself</h1>
        <p class="onboarding-subtitle">Step 3 of 5</p>
      </div>
      <div class="${cardClass}">
        ${backButton}
        <div class="${groupClass}">
          <label class="${labelClass}">What do you do?</label>
          <input type="text" class="${inputClass}" id="headline" placeholder="e.g., AI Product Manager">
        </div>
        <div class="${groupClass}">
          <label class="${labelClass}">Short bio / CV summary</label>
          <textarea class="${inputClass}" id="bio" placeholder="Tell us a bit about your background..."></textarea>
        </div>
        <div class="${groupClass}">
          <label class="${labelClass}">Interests / industries</label>
          <div class="${iosMode ? 'chips-row' : 'chips-container'}" id="interestChips">
            ${INTEREST_TAGS.map(tag => `<span class="${chipClass}" data-tag="${tag}">${tag}</span>`).join('')}
          </div>
        </div>
        <button class="${buttonClass}" id="nextStep3" style="width: 100%; margin-top: 16px;">Next</button>
      </div>
    `;
    case 4: return `
      <div class="${iosMode ? 'onboarding-header' : 'onboarding-header'}">
        <h1 class="onboarding-title">Add your links</h1>
        <p class="onboarding-subtitle">Step 4 of 5</p>
      </div>
      <div class="${cardClass}">
        ${backButton}
        <div class="${groupClass}">
          <label class="${labelClass}">LinkedIn URL *</label>
          <input type="url" class="${inputClass}" id="linkedInUrl" placeholder="https://linkedin.com/in/yourname">
        </div>
        <div class="${groupClass}">
          <label class="${labelClass}">Website / Portfolio (optional)</label>
          <input type="url" class="${inputClass}" id="websiteUrl" placeholder="https://yourwebsite.com">
        </div>
        <p style="color: ${iosMode ? 'var(--ios-text-muted)' : 'var(--text-muted)'}; font-size: 15px; margin-top: 16px; line-height: 1.4;">
          We'll verify these later. For now, this helps us match you to the right rooms.
        </p>
        <button class="${buttonClass}" id="nextStep4" style="width: 100%; margin-top: 16px;" disabled>Next</button>
      </div>
    `;
    case 5: return `
      <div class="onboarding-header">
        <h1 class="onboarding-title">You're all set!</h1>
        <p class="onboarding-subtitle">Step 5 of 5</p>
      </div>
      <div class="${cardClass}">
        ${backButton}
        <div id="summaryCard" style="padding: 1.5rem; background: var(--bg-secondary); border-radius: 12px;">
          <!-- Summary will be populated -->
        </div>
        <button class="btn btn-primary" id="enterEvents" style="width: 100%; margin-top: 2rem;">Enter events</button>
      </div>
    `;
  }
}

function attachOnboardingListeners() {
  const step = getOnboardingStep();
  
  // Attach back button listener
  const backBtn = document.getElementById('onboardingBackBtn');
  if (backBtn) {
    const prevStep = parseInt(backBtn.dataset.step);
    backBtn.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('[ONBOARDING] Back button clicked, going to step:', prevStep);
      navigateToOnboardingStep(prevStep);
    });
  }
  
  // Load saved form data from localStorage
  const savedFirstName = localStorage.getItem('tempFirstName') || '';
  const savedLastName = localStorage.getItem('tempLastName') || '';
  const savedEmail = localStorage.getItem('tempSchoolEmail') || '';
  const savedVerified = localStorage.getItem('tempEmailVerified') === 'true';
  const savedHeadline = localStorage.getItem('tempHeadline') || '';
  const savedBio = localStorage.getItem('tempBio') || '';
  const savedInterests = JSON.parse(localStorage.getItem('tempInterests') || '[]');
  const savedLinkedIn = localStorage.getItem('tempLinkedIn') || '';
  const savedWebsite = localStorage.getItem('tempWebsite') || '';
  
  if (step === 1) {
    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    const nextBtn = document.getElementById('nextStep1');
    
    if (!firstName || !lastName || !nextBtn) {
      console.error('[ONBOARDING] Step 1 elements not found!', { firstName, lastName, nextBtn });
      return;
    }
    
    // Restore saved values
    if (savedFirstName) firstName.value = savedFirstName;
    if (savedLastName) lastName.value = savedLastName;
    
    const checkValid = () => {
      const isValid = firstName.value.trim() && lastName.value.trim();
      nextBtn.disabled = !isValid;
      console.log('[ONBOARDING] Step 1 validation:', { isValid, firstName: firstName.value, lastName: lastName.value });
    };
    
    firstName.addEventListener('input', checkValid);
    lastName.addEventListener('input', checkValid);
    checkValid(); // Initial check
    
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('[ONBOARDING] Step 1 Next clicked');
      localStorage.setItem('tempFirstName', firstName.value);
      localStorage.setItem('tempLastName', lastName.value);
      navigateToOnboardingStep(2);
    });
  }
  
  if (step === 2) {
    const sendCode = document.getElementById('sendCode');
    const codeSection = document.getElementById('codeSection');
    const verifyCode = document.getElementById('verifyCode');
    const verifiedBadge = document.getElementById('verifiedBadge');
    const nextBtn = document.getElementById('nextStep2');
    const emailInput = document.getElementById('schoolEmail');
    
    // Restore saved values
    if (emailInput && savedEmail) emailInput.value = savedEmail;
    if (savedVerified) {
      codeSection.style.display = 'block';
      verifiedBadge.style.display = 'block';
      nextBtn.disabled = false;
    }
    
    sendCode?.addEventListener('click', () => {
      codeSection.style.display = 'block';
      showToast('Code sent to your school email');
    });
    
    verifyCode?.addEventListener('click', () => {
      const code = document.getElementById('verificationCode').value;
      if (code.length === 6) {
        verifiedBadge.style.display = 'block';
        localStorage.setItem('tempSchoolEmail', emailInput.value);
        localStorage.setItem('tempEmailVerified', 'true');
        nextBtn.disabled = false;
        showToast('Email verified');
      }
    });
    
    nextBtn?.addEventListener('click', () => {
      navigateToOnboardingStep(3);
    });
  }
  
  if (step === 3) {
    const headlineInput = document.getElementById('headline');
    const bioInput = document.getElementById('bio');
    const chips = document.querySelectorAll('#interestChips .chip, #interestChips .ios-chip');
    
    // Restore saved values
    if (headlineInput && savedHeadline) headlineInput.value = savedHeadline;
    if (bioInput && savedBio) bioInput.value = savedBio;
    
    // Restore selected interests
    let selectedTags = [...savedInterests];
    savedInterests.forEach(interest => {
      const chip = Array.from(chips).find(c => c.dataset.tag === interest);
      if (chip) chip.classList.add('selected');
    });
    
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chip.classList.toggle('selected');
        const tag = chip.dataset.tag;
        if (chip.classList.contains('selected')) {
          if (!selectedTags.includes(tag)) selectedTags.push(tag);
        } else {
          selectedTags = selectedTags.filter(t => t !== tag);
        }
        localStorage.setItem('tempInterests', JSON.stringify(selectedTags));
      });
    });
    
    document.getElementById('nextStep3')?.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('[ONBOARDING] Step 3 Next clicked');
      localStorage.setItem('tempHeadline', headlineInput.value);
      localStorage.setItem('tempBio', bioInput.value);
      navigateToOnboardingStep(4);
    });
  }
  
  if (step === 4) {
    const linkedIn = document.getElementById('linkedInUrl');
    const website = document.getElementById('websiteUrl');
    const nextBtn = document.getElementById('nextStep4');
    
    // Restore saved values
    if (linkedIn && savedLinkedIn) linkedIn.value = savedLinkedIn;
    if (website && savedWebsite) website.value = savedWebsite;
    
    const checkValid = () => {
      nextBtn.disabled = !linkedIn.value.trim();
    };
    
    linkedIn?.addEventListener('input', checkValid);
    checkValid(); // Initial check
    
    nextBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('[ONBOARDING] Step 4 Next clicked');
      if (!linkedIn.value.trim()) {
        showToast('LinkedIn URL is required');
        return;
      }
      localStorage.setItem('tempLinkedIn', linkedIn.value);
      localStorage.setItem('tempWebsite', website.value || '');
      navigateToOnboardingStep(5);
    });
  }
  
  if (step === 5) {
    const profile = {
      firstName: localStorage.getItem('tempFirstName'),
      lastName: localStorage.getItem('tempLastName'),
      schoolEmail: localStorage.getItem('tempSchoolEmail'),
      schoolEmailVerified: localStorage.getItem('tempEmailVerified') === 'true',
      headline: localStorage.getItem('tempHeadline'),
      bio: localStorage.getItem('tempBio'),
      interests: JSON.parse(localStorage.getItem('tempInterests') || '[]'),
      linkedInUrl: localStorage.getItem('tempLinkedIn'),
      websiteUrl: localStorage.getItem('tempWebsite')
    };
    
    const summaryCard = document.getElementById('summaryCard');
    summaryCard.innerHTML = `
      <div style="margin-bottom: 1rem;"><strong>Name:</strong> ${profile.firstName} ${profile.lastName}</div>
      <div style="margin-bottom: 1rem;"><strong>Email:</strong> ${profile.schoolEmail} <span style="color: var(--success);">✓ Verified</span></div>
      <div style="margin-bottom: 1rem;"><strong>Headline:</strong> ${profile.headline}</div>
      <div style="margin-bottom: 1rem;"><strong>Interests:</strong> ${profile.interests.join(', ')}</div>
      <div><strong>LinkedIn:</strong> ${profile.linkedInUrl}</div>
    `;
    
    document.getElementById('enterEvents')?.addEventListener('click', () => {
      // Save profile
      state.setUserProfile(profile);
      localStorage.removeItem('onboardingStep');
      ['tempFirstName', 'tempLastName', 'tempSchoolEmail', 'tempEmailVerified', 'tempHeadline', 'tempBio', 'tempInterests', 'tempLinkedIn', 'tempWebsite'].forEach(k => localStorage.removeItem(k));
      
      // Show completion animation
      if (window.showOnboardingCompleteAnimation) {
        window.showOnboardingCompleteAnimation(() => {
          // After animation completes, navigate to events
          if (window.router) {
            window.router.goTo('events');
          } else {
            document.getElementById('onboarding').classList.add('hidden');
            const mainApp = document.getElementById('mainApp');
            if (mainApp) mainApp.classList.remove('hidden');
            if (window.initApp) window.initApp();
          }
        });
      } else {
        // Fallback if animation not loaded
        if (window.router) {
          window.router.goTo('events');
        } else {
          document.getElementById('onboarding').classList.add('hidden');
          const mainApp = document.getElementById('mainApp');
          if (mainApp) mainApp.classList.remove('hidden');
          if (window.initApp) window.initApp();
        }
      }
    });
  }
}

// ========== EVENTS RENDERING ==========
window.renderEvents = function() {
  console.log('[RENDER] Rendering events...');
  const profile = state.getUserProfile();
  const committedEvents = state.getCommittedEvents();
  
  console.log('[RENDER] Profile:', profile ? 'exists' : 'missing');
  console.log('[RENDER] Committed events:', committedEvents.length);
  console.log('[RENDER] Total events:', MOCK_EVENTS.length);
  
  // If user has committed to an event, only show that event
  if (committedEvents.length > 0) {
    const committedEventId = committedEvents[0].eventId;
    const committedEvent = MOCK_EVENTS.find(e => e.id === committedEventId);
    
    // Hide recommended title and all events sections
    const recommendedSection = document.getElementById('recommendedSection');
    const allEventsContainer = document.getElementById('allEvents');
    const allEventsParent = allEventsContainer?.closest('.events-section');
    const filterToggle = document.getElementById('filterToggle');
    
    // Hide filter toggle
    if (filterToggle) filterToggle.style.display = 'none';
    
    // Hide all events section
    if (allEventsParent) allEventsParent.style.display = 'none';
    
    // Show only the committed event in recommended section
    const recommendedContainer = document.getElementById('recommendedEvents');
    if (recommendedContainer && committedEvent && recommendedSection) {
      recommendedContainer.innerHTML = renderEventCard(committedEvent, true);
      const titleEl = recommendedSection.querySelector('.section-title');
      if (titleEl) titleEl.textContent = 'Your Event';
      recommendedSection.style.display = 'block';
    }
    
    // Show people going to this event
    renderPeopleForEvent(committedEventId);
  } else {
    // Normal flow - show recommended and all events
    console.log('[RENDER] No committed events, showing all events');
    const recommended = getRecommendedEvents(profile);
    let allEvents = MOCK_EVENTS;
    
    // Apply filters
    const filterMatch = document.getElementById('filterToggle')?.textContent === 'All' ? false : true;
    let filtered = filterMatch && profile ? allEvents.filter(e => e.tags.some(t => profile.interests.includes(t))) : allEvents;
    
    // Apply advanced filters
    const sortBy = localStorage.getItem('eventSortBy') || 'match';
    const minMatchScore = parseInt(localStorage.getItem('minMatchScore') || '0');
    const selectedTags = JSON.parse(localStorage.getItem('selectedTagFilters') || '[]');
    const selectedTypes = JSON.parse(localStorage.getItem('selectedTypeFilters') || '[]');
    
    // Filter by match score
    filtered = filtered.filter(event => {
      const score = window.calculateMatchScore ? window.calculateMatchScore(event, profile) : 100;
      return score >= minMatchScore;
    });
    
    // Filter by tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(event => 
        selectedTags.some(tag => event.tags.includes(tag))
      );
    }
    
    // Filter by event type (if we had event types, for now skip)
    
    // Sort events
    filtered = filtered.sort((a, b) => {
      if (sortBy === 'match') {
        const scoreA = window.calculateMatchScore ? window.calculateMatchScore(a, profile) : 0;
        const scoreB = window.calculateMatchScore ? window.calculateMatchScore(b, profile) : 0;
        return scoreB - scoreA;
      } else if (sortBy === 'date') {
        return new Date(a.dateTime) - new Date(b.dateTime);
      } else {
        return 0;
      }
    });
    
    // Show sections
    const recommendedSection = document.getElementById('recommendedSection');
    const allEventsContainer = document.getElementById('allEvents');
    const allEventsParent = allEventsContainer?.closest('.events-section');
    const filterToggle = document.getElementById('filterToggle');
    const peopleSection = document.getElementById('peopleSection');
    
    if (recommendedSection) {
      recommendedSection.style.display = 'block';
      const titleEl = recommendedSection.querySelector('.section-title');
      if (titleEl) titleEl.textContent = 'Recommended for you';
    }
    if (allEventsParent) allEventsParent.style.display = 'block';
    if (filterToggle) filterToggle.style.display = 'block';
    if (peopleSection) peopleSection.style.display = 'none';
    
    // Render recommended
    const recommendedContainer = document.getElementById('recommendedEvents');
    if (recommendedContainer) {
      console.log('[RENDER] Rendering', recommended.length, 'recommended events');
      recommendedContainer.innerHTML = recommended.map(event => renderEventCard(event, true)).join('');
      attachEventListeners();
    } else {
      console.error('[RENDER] Recommended container not found!');
    }
    
    // Render all events
    const allEventsContainerEl = document.getElementById('allEvents');
    if (allEventsContainerEl) {
      console.log('[RENDER] Rendering', filtered.length, 'all events');
      allEventsContainerEl.innerHTML = filtered.map(event => renderEventCard(event, false)).join('');
      attachEventListeners();
    } else {
      console.error('[RENDER] All events container not found!');
    }
  }
};

function renderEventCard(event, isRecommended) {
  const profile = state.getUserProfile();
  const committed = state.isEventCommitted(event.id);
  const relevance = profile ? getRelevanceText(event, profile) : '';
  const hasCommitted = state.getCommittedEvents().length > 0;
  
  if (isIOSMode()) {
    // iOS Messages style
    return `
      <div class="event-item" data-event-id="${event.id}">
        <div class="event-title">${event.title}</div>
        <div class="event-meta">${formatDate(event.dateTime)} • ${event.location}</div>
        <div class="event-description">${event.description}</div>
        <div class="event-tags">
          ${event.tags.map(tag => `<span class="event-tag">${tag}</span>`).join('')}
        </div>
        ${event.urgencyLabel ? `<span class="urgency-badge">${event.urgencyLabel}</span>` : ''}
        ${relevance && !hasCommitted ? `<div style="margin-top: 8px; color: var(--series-black); font-size: 15px;">${relevance}</div>` : ''}
        ${committed ? `<div style="margin-top: 12px; color: var(--series-black); font-size: 15px; font-weight: 500;">✓ You're going to this event</div>` : ''}
        <div style="display: flex; gap: 8px; margin-top: 12px;">
          ${!committed && !hasCommitted ? `<button class="ios-button" style="flex: 1;" data-action="commit" data-event-id="${event.id}">Commit</button>` : ''}
          ${committed ? `<button class="ios-button ios-button-secondary" style="flex: 1;" data-action="view-people" data-event-id="${event.id}">See who's going</button>` : (!hasCommitted ? `<button class="ios-button ios-button-secondary" style="flex: 1;" data-action="view-people" data-event-id="${event.id}">People</button>` : '')}
        </div>
      </div>
    `;
  }
  
  // Original style
  return `
    <div class="event-card ${committed ? 'committed' : ''}" data-event-id="${event.id}">
      <div class="event-header">
        <div style="flex: 1;">
          <div class="event-title">${event.title}</div>
          <div style="color: var(--text-muted); font-size: 0.9rem; margin-top: 0.25rem;">
            ${formatDate(event.dateTime)} • ${event.location}
          </div>
        </div>
        ${committed ? '<span style="color: var(--success);">✓ Going</span>' : ''}
      </div>
      <p style="color: var(--text-secondary); font-size: 0.9rem; margin: 1rem 0;">${event.description}</p>
      <div class="event-tags">
        ${event.tags.map(tag => `<span class="event-tag">${tag}</span>`).join('')}
      </div>
      ${isRecommended && relevance && !hasCommitted ? `<p style="color: var(--accent-primary); font-size: 0.9rem; margin-top: 0.75rem;">${relevance}</p>` : ''}
      ${event.urgencyLabel ? `<div style="margin-top: 1rem;"><span class="urgency-chip">${event.urgencyLabel}</span></div>` : ''}
      <div style="display: flex; gap: 0.75rem; margin-top: 1rem;">
        ${!committed && !hasCommitted ? `<button class="btn btn-primary" style="flex: 1; padding: 0.75rem;" data-action="commit" data-event-id="${event.id}">Commit to this event</button>` : ''}
        ${committed ? `<button class="btn btn-secondary" style="flex: 1; padding: 0.75rem;" data-action="view-people" data-event-id="${event.id}">See who's going</button>` : (!hasCommitted ? `<button class="btn btn-secondary" style="flex: 1; padding: 0.75rem;" data-action="view-people" data-event-id="${event.id}">See people going</button>` : '')}
      </div>
    </div>
  `;
}

function attachEventListeners() {
  const hasCommitted = state.getCommittedEvents().length > 0;
  
  document.querySelectorAll('[data-action="commit"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const eventId = e.target.dataset.eventId;
      const people = MOCK_PEOPLE[eventId] || [];
      
      // Only allow committing to one event
      if (hasCommitted) {
        showToast('You can only commit to one event at a time.');
        return;
      }
      
      // Show matching animation
      if (window.showMatchingAnimation) {
        window.showMatchingAnimation(eventId, () => {
          // After animation completes
          state.commitToEvent(eventId, people);
          showToast('🎉 You\'re going! See who else is attending below.');
          renderEvents();
          renderPastEvents();
          renderPeopleForEvent(eventId);
        });
      } else {
        // Fallback if animation not loaded
        state.commitToEvent(eventId, people);
        showToast('🎉 You\'re going! See who else is attending below.');
        renderEvents();
        renderPastEvents();
        renderPeopleForEvent(eventId);
      }
    });
  });
  
  document.querySelectorAll('[data-action="view-people"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const eventId = e.target.dataset.eventId;
      if (window.router) {
        window.router.goTo(`people?eventId=${eventId}`);
      } else {
        renderPeopleForEvent(eventId);
        const peopleSection = document.getElementById('peopleSection');
        if (peopleSection) {
          peopleSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // Add click handlers for event cards to navigate to detail
  document.querySelectorAll('.event-item, .event-card').forEach(card => {
    const eventId = card.dataset.eventId;
    if (eventId && window.router) {
      card.style.cursor = 'pointer';
      card.addEventListener('click', (e) => {
        // Don't navigate if clicking buttons
        if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;
        window.router.goTo(`event-detail?id=${eventId}`);
      });
    }
  });
}

// ========== RENDER PEOPLE FOR EVENT ==========
function renderPeopleForEvent(eventId) {
  const people = MOCK_PEOPLE[eventId] || [];
  const event = MOCK_EVENTS.find(e => e.id === eventId);
  
  if (!event) return;
  
  // Find or create people section
  let peopleSection = document.getElementById('peopleSection');
  const recommendedSection = document.getElementById('recommendedSection');
  
  if (!peopleSection && recommendedSection) {
    // Create people section after recommended section
    peopleSection = document.createElement('div');
    peopleSection.id = 'peopleSection';
    peopleSection.className = isIOSMode() ? 'events-section' : 'card';
    recommendedSection.parentNode.insertBefore(peopleSection, recommendedSection.nextSibling);
  }
  
  if (peopleSection) {
    const iosMode = isIOSMode();
    
    peopleSection.innerHTML = `
      <div class="section-title" style="padding: 32px 24px 16px 24px; border-bottom: none;">
        ${people.length} ${people.length === 1 ? 'person is' : 'people are'} going to this event
      </div>
      <div class="people-list" style="background: var(--series-white);">
        ${people.map(p => renderPersonCard(p, event.id)).join('')}
      </div>
    `;
    peopleSection.style.display = 'block';
    peopleSection.style.padding = '0';
    peopleSection.style.background = 'var(--series-white)';
    
    // Attach message listeners
    document.querySelectorAll('[data-action="message-person"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const personName = e.target.dataset.personName;
        openMessageModal(personName, event.title);
      });
    });
  }
}

function renderPersonCard(person, eventId) {
  const iosMode = isIOSMode();
  
  // Parse school info better
  let schoolName = '';
  let degree = '';
  if (person.school) {
    // Handle formats like "NYU Stern MBA" or "NYU Tandon"
    const parts = person.school.split(/\s+/);
    if (parts.length >= 2) {
      schoolName = parts.slice(0, -1).join(' ');
      const lastPart = parts[parts.length - 1];
      if (['MBA', 'MS', 'BS', 'BA', 'PhD', 'MA'].includes(lastPart)) {
        degree = lastPart;
      } else {
        schoolName = person.school;
      }
    } else {
      schoolName = person.school;
    }
  }
  
  return `
    <div class="person-card">
      <div class="person-avatar">${person.avatar}</div>
      <div class="person-info">
        <div class="person-name">${person.name}</div>
        ${schoolName || person.headline ? `
          <div class="person-details">
            ${schoolName ? `<span>${schoolName}</span>` : ''}
            ${degree ? `<span style="margin-left: 4px;">• ${degree}</span>` : ''}
            ${person.headline && schoolName ? `<br>` : ''}
            ${person.headline ? `<span style="display: block; margin-top: ${schoolName ? '2px' : '0'};}">${person.headline}</span>` : ''}
          </div>
        ` : ''}
        ${person.sharedInterests && person.sharedInterests.length > 0 ? `
          <div class="person-tags">
            ${person.sharedInterests.map(i => `<span class="person-tag">${i}</span>`).join('')}
          </div>
        ` : ''}
      </div>
      <button class="person-message-btn" 
              data-action="message-person" 
              data-person-name="${person.name}"
              data-person-phone="${person.phone || ''}">
        Message
      </button>
    </div>
  `;
}

// ========== PAST EVENTS ==========
window.renderPastEvents = function() {
  const committed = state.getCommittedEvents();
  const pastEvents = committed.map(c => {
    const event = MOCK_EVENTS.find(e => e.id === c.eventId);
    return event ? { ...event, committed: c } : null;
  }).filter(Boolean);
  
  const container = document.getElementById('pastEvents');
  const section = document.getElementById('pastEventsSection');
  
  if (pastEvents.length === 0) {
    section.style.display = 'none';
    return;
  }
  
  section.style.display = 'block';
  container.innerHTML = pastEvents.map(event => `
    <div class="event-card">
      <div class="event-title">${event.title}</div>
      <div style="color: var(--text-muted); font-size: 0.9rem; margin: 0.5rem 0;">
        ${formatDate(event.dateTime)} • ${event.location}
      </div>
      ${!state.getFeedback(event.id) ? 
        `<button class="btn btn-secondary" style="width: 100%; margin-top: 1rem;" data-action="give-feedback" data-event-id="${event.id}">Give feedback</button>` :
        '<p style="color: var(--success); margin-top: 1rem;">✓ Feedback submitted</p>'
      }
    </div>
  `).join('');
  
  document.querySelectorAll('[data-action="give-feedback"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      openFeedbackModal(e.target.dataset.eventId);
    });
  });
};

// ========== USER INFO ==========
window.updateUserInfo = function() {
  const profile = state.getUserProfile();
  if (profile) {
    const avatar = document.getElementById('userAvatar');
    const name = document.getElementById('userName');
    if (avatar) avatar.textContent = (profile.firstName[0] + profile.lastName[0]).toUpperCase();
    if (name) name.textContent = `${profile.firstName} ${profile.lastName}`;
  }
};

// ========== CHATBOT ==========
function openChatbot() {
  document.getElementById('chatbotDrawer').classList.add('open');
  const messages = document.getElementById('chatbotMessages');
  if (messages.children.length === 0) {
    addChatbotMessage('assistant', 'Tell me when you\'re free and what you want out of tonight. I\'ll find 2-3 events and 5 people to go with.');
  }
}

function closeChatbot() {
  document.getElementById('chatbotDrawer').classList.remove('open');
}

function addChatbotMessage(role, text, data = null) {
  const messages = document.getElementById('chatbotMessages');
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${role}`;
  messageDiv.innerHTML = text;
  messages.appendChild(messageDiv);
  messages.scrollTop = messages.scrollHeight;
  state.addChatbotMessage({ role, text, data });
}

function sendChatbotMessage(text) {
  if (!text.trim()) return;
  
  addChatbotMessage('user', text);
  
  // Simulate typing
  const typingDiv = document.createElement('div');
  typingDiv.className = 'message assistant';
  typingDiv.innerHTML = '...';
  typingDiv.id = 'typing';
  document.getElementById('chatbotMessages').appendChild(typingDiv);
  
  setTimeout(() => {
    document.getElementById('typing')?.remove();
    const recommendations = generateRecommendations();
    recommendations.forEach(rec => {
      const recDiv = document.createElement('div');
      recDiv.className = 'message assistant';
      recDiv.innerHTML = renderEventRecommendation(rec);
      document.getElementById('chatbotMessages').appendChild(recDiv);
    });
    document.getElementById('chatbotMessages').scrollTop = document.getElementById('chatbotMessages').scrollHeight;
  }, 1500);
}

function generateRecommendations() {
  const profile = state.getUserProfile();
  const recommended = getRecommendedEvents(profile).slice(0, 3);
  return recommended.map(event => ({
    event,
    people: MOCK_PEOPLE[event.id] || []
  }));
}

function renderEventRecommendation(rec) {
  const profile = state.getUserProfile();
  const relevance = getRelevanceText(rec.event, profile);
  
  return `
    <div style="background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px; padding: 1rem; margin: 0.5rem 0;">
      <div style="font-weight: 600; margin-bottom: 0.5rem;">${rec.event.title}</div>
      <div style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.5rem;">
        ${formatDate(rec.event.dateTime)} • ${rec.event.location}
      </div>
      <p style="font-size: 0.85rem; color: var(--accent-primary); margin-bottom: 0.75rem;">${relevance}</p>
      ${rec.event.urgencyLabel ? `<div style="margin-bottom: 0.75rem;"><span class="urgency-chip">${rec.event.urgencyLabel}</span></div>` : ''}
      <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">
        <button class="btn btn-primary" style="flex: 1; padding: 0.5rem; font-size: 0.85rem;" onclick="window.commitFromChatbot('${rec.event.id}')">Commit</button>
        <button class="btn btn-secondary" style="flex: 1; padding: 0.5rem; font-size: 0.85rem;" onclick="window.showPeople('${rec.event.id}')">See people</button>
      </div>
      <div id="people-${rec.event.id}" style="display: none;">
        ${renderPeopleList(rec.people, rec.event.id)}
      </div>
    </div>
  `;
}

function renderPeopleList(people, eventId) {
  return people.map(p => `
    <div class="person-card" style="margin-top: 0.75rem;">
      <div class="person-avatar">${p.avatar}</div>
      <div style="flex: 1;">
        <div style="font-weight: 600;">${p.name}</div>
        <div style="font-size: 0.85rem; color: var(--text-secondary);">${p.school}</div>
        <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.25rem;">${p.headline}</div>
        <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem; flex-wrap: wrap;">
          ${p.sharedInterests.map(i => `<span class="event-tag">${i}</span>`).join('')}
        </div>
      </div>
      <button class="btn btn-secondary" style="padding: 0.5rem 1rem; font-size: 0.85rem;" onclick="window.openMessageModal('${p.name}', '${MOCK_EVENTS.find(e => e.id === eventId)?.title}')">Message</button>
    </div>
  `).join('');
}

window.commitFromChatbot = function(eventId) {
  // Only allow committing to one event
  if (state.getCommittedEvents().length > 0) {
    showToast('You can only commit to one event at a time.');
    return;
  }
  
  const people = MOCK_PEOPLE[eventId] || [];
  state.commitToEvent(eventId, people);
  showToast('🎉 You\'re committed! See who else is going below.');
  renderEvents();
  renderPastEvents();
  renderPeopleForEvent(eventId);
  addChatbotMessage('assistant', `Great! You're going. ${people.length} other ${people.length === 1 ? 'person is' : 'people are'} also attending. Scroll down to see them!`);
  
  // Close chatbot and scroll to people
  setTimeout(() => {
    closeChatbot();
    const peopleSection = document.getElementById('peopleSection');
    if (peopleSection) {
      peopleSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 500);
};

window.showPeople = function(eventId) {
  const peopleDiv = document.getElementById(`people-${eventId}`);
  if (peopleDiv) {
    peopleDiv.style.display = peopleDiv.style.display === 'none' ? 'block' : 'none';
  }
};

// ========== MESSAGE MODAL ==========
function openMessageModal(personName, eventTitle, personPhone = null) {
  const modal = document.getElementById('messageModal');
  if (!modal) return;
  
  document.getElementById('messageModalTitle').textContent = `Message ${personName} about ${eventTitle}`;
  const messageText = document.getElementById('messageText');
  messageText.value = `Hey ${personName}, I'm also heading to ${eventTitle}. Want to link up and go together?`;
  modal.classList.add('open');
  
  // Store phone number for sending
  modal.dataset.recipientPhone = personPhone || '';
  modal.dataset.recipientName = personName;
  modal.dataset.eventTitle = eventTitle;
  
  const sendBtn = document.getElementById('sendMessageBtn');
  const cancelBtn = document.getElementById('cancelMessageBtn');
  const closeBtn = document.getElementById('closeMessageModal');
  
  const closeModal = () => modal.classList.remove('open');
  
  if (sendBtn) {
    sendBtn.onclick = async () => {
      const message = messageText.value.trim();
      if (!message) {
        showToast('Please enter a message');
        return;
      }
      
      // Try to send via API if phone number available
      if (personPhone) {
        sendBtn.disabled = true;
        sendBtn.textContent = 'Sending...';
        
        try {
          const response = await fetch('/api/send-message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              toPhone: personPhone,
              message: message,
              eventName: eventTitle,
              recipientName: personName
            })
          });
          
          const result = await response.json();
          if (result.success) {
            showToast('✅ Message sent via iMessage!');
          } else {
            showToast('⚠️ ' + (result.error || 'Failed to send'));
          }
        } catch (error) {
          console.error('Error sending message:', error);
          showToast('⚠️ Message failed (check console)');
        } finally {
          sendBtn.disabled = false;
          sendBtn.textContent = 'Send';
        }
      } else {
        // Fallback: UI-only (no phone number)
        showToast('Message sent (demo mode - no phone number)');
      }
      
      closeModal();
    };
  }
  
  if (cancelBtn) cancelBtn.onclick = closeModal;
  if (closeBtn) closeBtn.onclick = closeModal;
}

window.openMessageModal = openMessageModal;

// ========== FEEDBACK MODAL ==========
function openFeedbackModal(eventId) {
  const event = MOCK_EVENTS.find(e => e.id === eventId);
  const modal = document.getElementById('feedbackModal');
  document.getElementById('feedbackModalTitle').textContent = `How did ${event?.title} go?`;
  modal.classList.add('open');
  
  let rating = 0;
  let outcomes = [];
  
  document.querySelectorAll('.star-rating .star').forEach((star, idx) => {
    star.onclick = () => {
      rating = idx + 1;
      document.querySelectorAll('.star-rating .star').forEach((s, i) => {
        s.textContent = i < rating ? '★' : '☆';
        s.classList.toggle('active', i < rating);
      });
    };
  });
  
  document.querySelectorAll('[data-outcome]').forEach(chip => {
    chip.onclick = () => {
      chip.classList.toggle('selected');
      const outcome = chip.dataset.outcome;
      if (chip.classList.contains('selected')) {
        outcomes.push(outcome);
      } else {
        outcomes = outcomes.filter(o => o !== outcome);
      }
    };
  });
  
  document.getElementById('submitFeedbackBtn').onclick = () => {
    const notes = document.getElementById('feedbackNotes').value;
    state.submitFeedback(eventId, rating, outcomes, notes);
    showToast('Thanks! We\'ll use this to improve future matches.');
    modal.classList.remove('open');
    renderPastEvents();
  };
  
  document.getElementById('cancelFeedbackBtn').onclick = () => {
    modal.classList.remove('open');
  };
}

// ========== FILTER TOGGLE ==========
document.getElementById('filterToggle')?.addEventListener('click', function() {
  // Don't allow filtering if user has committed to an event
  if (state.getCommittedEvents().length > 0) {
    return;
  }
  this.textContent = this.textContent === 'All' ? 'Matches my interests' : 'All';
  renderEvents();
});

// ========== INITIALIZE ==========
function initApp() {
  updateUserInfo();
  renderEvents();
  renderPastEvents();
  
  // Chatbot
  document.getElementById('chatbotButton')?.addEventListener('click', openChatbot);
  document.getElementById('closeChatbot')?.addEventListener('click', closeChatbot);
  document.getElementById('sendMessage')?.addEventListener('click', () => {
    const input = document.getElementById('chatbotInput');
    sendChatbotMessage(input.value);
    input.value = '';
  });
  document.getElementById('chatbotInput')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      document.getElementById('sendMessage')?.click();
    }
  });
}

// ========== NAVIGATION HELPERS ==========
window.renderEventDetail = function(eventId) {
  const event = MOCK_EVENTS.find(e => e.id === eventId);
  if (!event) {
    window.router.goTo('events');
    return;
  }

  const committed = state.isEventCommitted(event.id);
  const profile = state.getUserProfile();
  const relevance = getRelevanceText(event, profile);

  document.getElementById('eventDetailTitle').textContent = event.title;
  document.getElementById('eventDetailContent').innerHTML = `
    <div class="ios-card" style="margin-top: 16px;">
      <div style="padding: 16px;">
        <div class="event-title" style="font-size: 22px; margin-bottom: 12px;">${event.title}</div>
        <div class="event-meta" style="margin-bottom: 16px;">${formatDate(event.dateTime)} • ${event.location}</div>
        <div class="event-description" style="margin-bottom: 16px;">${event.description}</div>
        <div class="event-tags" style="margin-bottom: 16px;">
          ${event.tags.map(tag => `<span class="event-tag">${tag}</span>`).join('')}
        </div>
        ${event.urgencyLabel ? `<span class="urgency-badge">${event.urgencyLabel}</span>` : ''}
        ${relevance ? `<div style="margin-top: 12px; color: var(--ios-blue); font-size: 15px;">${relevance}</div>` : ''}
        ${committed ? `<div style="margin-top: 16px; color: var(--ios-green); font-size: 15px; font-weight: 500;">✓ You're going to this event</div>` : ''}
        <div style="display: flex; gap: 8px; margin-top: 20px;">
          ${!committed && state.getCommittedEvents().length === 0 ? `<button class="ios-button" data-action="commit-detail" data-event-id="${event.id}">Commit</button>` : ''}
          <button class="ios-button ios-button-secondary" onclick="window.router.goTo('people?eventId=${event.id}')" style="flex: 1;">See who's going</button>
        </div>
      </div>
    </div>
  `;

  // Attach commit listener
  document.querySelector('[data-action="commit-detail"]')?.addEventListener('click', (e) => {
    const eventId = e.target.dataset.eventId;
    const people = MOCK_PEOPLE[eventId] || [];
    if (state.getCommittedEvents().length > 0) {
      showToast('You can only commit to one event at a time.');
      return;
    }
    state.commitToEvent(eventId, people);
    showToast('🎉 You\'re committed!');
    window.router.goTo('events');
  });

  // Show people preview
  renderPeopleForEvent(eventId);
};

window.renderPeoplePage = function(eventId) {
  const event = MOCK_EVENTS.find(e => e.id === eventId);
  const people = MOCK_PEOPLE[eventId] || [];

  if (!event) {
    window.router.goTo('events');
    return;
  }

  document.getElementById('peopleListTitle').textContent = `Going to ${event.title}`;
  document.getElementById('peopleListContent').innerHTML = `
    <div class="ios-card" style="margin-top: 16px;">
      <div style="padding: 16px;">
        <p style="color: var(--ios-text-secondary); font-size: 15px; margin-bottom: 16px;">
          ${people.length} ${people.length === 1 ? 'person is' : 'people are'} going to this event
        </p>
        <div class="people-list">
          ${people.map(p => renderPersonCard(p, event.id)).join('')}
        </div>
      </div>
    </div>
  `;

  // Attach message listeners
  document.querySelectorAll('[data-action="message-person"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const personName = e.target.dataset.personName || e.target.closest('[data-person-name]')?.dataset.personName;
      const personPhone = e.target.dataset.personPhone || e.target.closest('[data-person-phone]')?.dataset.personPhone;
      openMessageModal(personName, event.title, personPhone);
    });
  });
};

window.renderProfilePage = function() {
  const profile = state.getUserProfile();
  if (!profile) {
    window.router.goTo('events');
    return;
  }

  document.getElementById('profilePageContent').innerHTML = `
    <div class="ios-card" style="margin-top: 16px;">
      <div style="padding: 16px;">
        <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 24px;">
          <div class="person-avatar" style="width: 64px; height: 64px; font-size: 24px;">
            ${(profile.firstName[0] + profile.lastName[0]).toUpperCase()}
          </div>
          <div>
            <div style="font-size: 22px; font-weight: 600;">${profile.firstName} ${profile.lastName}</div>
            <div style="font-size: 15px; color: var(--ios-text-secondary); margin-top: 4px;">${profile.headline || ''}</div>
          </div>
        </div>
        <div style="border-top: 0.5px solid var(--ios-separator); padding-top: 16px;">
          <div style="margin-bottom: 16px;">
            <div class="ios-label">EMAIL</div>
            <div style="font-size: 15px; margin-top: 4px;">${profile.schoolEmail} ${profile.schoolEmailVerified ? '✓' : ''}</div>
          </div>
          <div style="margin-bottom: 16px;">
            <div class="ios-label">BIO</div>
            <div style="font-size: 15px; margin-top: 4px; color: var(--ios-text-secondary);">${profile.bio || 'No bio provided'}</div>
          </div>
          <div style="margin-bottom: 16px;">
            <div class="ios-label">INTERESTS</div>
            <div class="chips-row" style="margin-top: 8px;">
              ${(profile.interests || []).map(i => `<span class="ios-chip selected">${i}</span>`).join('')}
            </div>
          </div>
          ${profile.linkedInUrl ? `
            <div style="margin-bottom: 16px;">
              <div class="ios-label">LINKEDIN</div>
              <a href="${profile.linkedInUrl}" target="_blank" style="color: var(--ios-blue); font-size: 15px; text-decoration: none;">View Profile</a>
            </div>
          ` : ''}
        </div>
      </div>
    </div>
  `;
};

// ========== START ==========
document.addEventListener('DOMContentLoaded', () => {
  console.log('[APP] DOM loaded, initializing...');
  
  // Check if user is logged in (check localStorage)
  const isLoggedIn = localStorage.getItem('user_logged_in') === 'true';
  if (!isLoggedIn && !window.location.pathname.includes('/onboarding') && !window.location.pathname.includes('/login')) {
    // Redirect to login if not on login/onboarding page
    if (!window.location.hash) {
      window.location.href = '/login';
      return;
    }
  }
  
  // Ensure state has demo profile
  const profile = state.getUserProfile();
  if (!profile) {
    const demoProfile = state.getDemoProfile();
    state.setUserProfile(demoProfile);
    console.log('[APP] Demo profile loaded:', demoProfile.firstName);
  }
  
  // Determine route from URL
  const path = window.location.pathname;
  const hash = window.location.hash.slice(1);
  
  // Wait for router to initialize
  setTimeout(() => {
    if (window.router) {
      console.log('[APP] Router found, path:', path, 'hash:', hash);
      
      // Check pathname first
      if (path === '/about') {
        window.router.goTo('about');
      } else if (hash) {
        window.router.navigate(hash, false);
      } else if (path === '/home' || path === '/events') {
        window.router.goTo('events');
      } else if (path === '/onboarding' || hash.startsWith('onboarding')) {
        // Force show onboarding regardless of completion status
        console.log('[APP] Navigating to onboarding');
        window.router.goTo('onboarding/1');
      } else {
        // Default to events
        window.router.goTo('events');
      }
    } else {
      console.log('[APP] Router not found, using fallback...');
      // Fallback if router not loaded
      const eventsPage = document.getElementById('page-events');
      if (eventsPage) {
        eventsPage.classList.remove('hidden');
        eventsPage.classList.add('active');
        window.initApp();
      } else {
        // Last resort
        window.initApp();
      }
    }
  }, 200);
});

