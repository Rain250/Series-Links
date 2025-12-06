// iOS Messages Style Adapter
// Adapts events-full.js logic to iOS UI elements

// The full logic is in events-full.js, we just need to map the render functions
// to use iOS-style classes and structure

// Wait for events-full.js to load, then adapt
(function() {
    const waitForScript = setInterval(() => {
        if (window.state && window.renderEvents) {
            clearInterval(waitForScript);
            adaptToIOS();
        }
    }, 100);

    function adaptToIOS() {
        // Override render functions to use iOS classes
        const originalRenderEventCard = window.renderEventCard;
        if (originalRenderEventCard) {
            window.renderEventCard = function(event, isRecommended) {
                // Use iOS structure but same data
                return renderIOSEventCard(event, isRecommended);
            };
        }
    }

    function renderIOSEventCard(event, isRecommended) {
        const profile = window.state?.getUserProfile();
        const committed = window.state?.isEventCommitted(event.id);
        const relevance = profile ? getRelevanceText(event, profile) : '';
        
        return `
            <div class="event-item" data-event-id="${event.id}">
                <div class="event-title">${event.title}</div>
                <div class="event-meta">${formatDate(event.dateTime)} • ${event.location}</div>
                <div class="event-description">${event.description}</div>
                <div class="event-tags">
                    ${event.tags.map(tag => `<span class="event-tag">${tag}</span>`).join('')}
                </div>
                ${event.urgencyLabel ? `<span class="urgency-badge">${event.urgencyLabel}</span>` : ''}
                ${relevance ? `<div style="margin-top: 8px; color: var(--ios-blue); font-size: 15px;">${relevance}</div>` : ''}
                ${committed ? `<div style="margin-top: 12px; color: var(--ios-green); font-size: 15px;">✓ Going</div>` : ''}
                <div style="display: flex; gap: 8px; margin-top: 12px;">
                    ${!committed ? `<button class="ios-button" style="flex: 1;" data-action="commit" data-event-id="${event.id}">Commit</button>` : ''}
                    <button class="ios-button ios-button-secondary" style="flex: 1;" data-action="view-people" data-event-id="${event.id}">People</button>
                </div>
            </div>
        `;
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
    }

    function getRelevanceText(event, userProfile) {
        if (!userProfile || !userProfile.interests) return '';
        const matching = event.tags.filter(tag => userProfile.interests.includes(tag));
        if (matching.length === 0) return '';
        if (matching.length === 1) return `Matches your ${matching[0]} interest`;
        return `Matches your ${matching.slice(0, 2).join(' + ')} interests`;
    }
})();

