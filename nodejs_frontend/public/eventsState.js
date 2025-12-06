// Client-side State Management for Events UI
// Simple store using localStorage and event emitters

class EventsState {
  constructor() {
    this.state = {
      userProfile: null,
      onboardingCompleted: false,
      committedEvents: [],
      feedback: [],
      chatbotMessages: []
    };
    this.listeners = [];
    this.load();
  }

  // Load state from localStorage
  load() {
    try {
      const saved = localStorage.getItem('series_events_state');
      if (saved) {
        this.state = { ...this.state, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error('Failed to load state:', e);
    }
  }

  // Save state to localStorage
  save() {
    try {
      localStorage.setItem('series_events_state', JSON.stringify(this.state));
      this.notify();
    } catch (e) {
      console.error('Failed to save state:', e);
    }
  }

  // Subscribe to state changes
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Notify all listeners
  notify() {
    this.listeners.forEach(listener => listener(this.state));
  }

  // Get current state
  getState() {
    return { ...this.state };
  }

  // Set user profile
  setUserProfile(profile) {
    this.state.userProfile = profile;
    this.state.onboardingCompleted = true;
    this.save();
  }

  // Get user profile
  getUserProfile() {
    return this.state.userProfile;
  }

  // Check if onboarding completed
  isOnboardingCompleted() {
    return this.state.onboardingCompleted && this.state.userProfile !== null;
  }

  // Commit to event
  commitToEvent(eventId, people = []) {
    if (!this.state.committedEvents.find(e => e.eventId === eventId)) {
      this.state.committedEvents.push({
        eventId,
        committedAt: new Date().toISOString(),
        peopleIds: people.map(p => p.id)
      });
      this.save();
    }
  }

  // Get committed events
  getCommittedEvents() {
    return this.state.committedEvents;
  }

  // Check if event is committed
  isEventCommitted(eventId) {
    return this.state.committedEvents.some(e => e.eventId === eventId);
  }

  // Submit feedback
  submitFeedback(eventId, rating, outcomes, notes) {
    this.state.feedback.push({
      eventId,
      rating,
      outcomes,
      notes,
      submittedAt: new Date().toISOString()
    });
    this.save();
  }

  // Get feedback for event
  getFeedback(eventId) {
    return this.state.feedback.find(f => f.eventId === eventId);
  }

  // Add chatbot message
  addChatbotMessage(message) {
    this.state.chatbotMessages.push({
      ...message,
      timestamp: new Date().toISOString()
    });
    this.save();
  }

  // Get chatbot messages
  getChatbotMessages() {
    return this.state.chatbotMessages;
  }

  // Clear chatbot messages
  clearChatbotMessages() {
    this.state.chatbotMessages = [];
    this.save();
  }

  // Reset all state (for testing)
  reset() {
    this.state = {
      userProfile: null,
      onboardingCompleted: false,
      committedEvents: [],
      feedback: [],
      chatbotMessages: []
    };
    localStorage.removeItem('series_events_state');
    this.notify();
  }
}

// Global state instance
const eventsState = new EventsState();

// Export for use in other scripts
window.EventsState = EventsState;
window.eventsState = eventsState;

