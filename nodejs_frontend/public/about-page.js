// About Page - Series Hackathon Information

window.renderAboutPage = function() {
  const container = document.getElementById('aboutPageContent');
  if (!container) return;
  
  container.innerHTML = `
    <div style="max-width: 680px; margin: 0 auto;">
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 48px;">
        <h1 style="font-size: 42px; font-weight: 700; color: var(--series-text); margin-bottom: 8px; letter-spacing: -0.8px;">
          Series 25' Hackathon
        </h1>
        <p style="font-size: 18px; color: var(--series-text-secondary);">
          Presented by <strong>Waqas A</strong> & <strong>Rayan S</strong>
        </p>
      </div>

      <!-- Current Approach -->
      <section style="margin-bottom: 48px;">
        <h2 style="font-size: 28px; font-weight: 700; color: var(--series-text); margin-bottom: 16px; letter-spacing: -0.5px;">
          Series' Current Approach
        </h2>
        <p style="font-size: 17px; color: var(--series-text-secondary); line-height: 1.6; margin-bottom: 16px;">
          Functions as social graph optimizer to identify high-value relationships and broker introductions between users.
          The concept is foundationally sound, but implementation leaves room for opportunity.
        </p>
        <p style="font-size: 17px; color: var(--series-text); font-weight: 600; line-height: 1.6;">
          Networking doesn't start with a person.<br>
          It starts with an <strong>Anchor</strong>.
        </p>
        <p style="font-size: 17px; color: var(--series-text-secondary); line-height: 1.6; margin-top: 16px;">
          Recognizing that lets us rethink how connections should actually be formed.
        </p>
      </section>

      <!-- Problem Areas -->
      <section style="margin-bottom: 48px;">
        <h2 style="font-size: 28px; font-weight: 700; color: var(--series-text); margin-bottom: 24px; letter-spacing: -0.5px;">
          Existing Problem Areas
        </h2>
        
        <div style="background: var(--series-gray-light); border-radius: 12px; padding: 20px; margin-bottom: 16px;">
          <h3 style="font-size: 20px; font-weight: 600; color: var(--series-text); margin-bottom: 8px;">
            Social Friction
          </h3>
          <p style="font-size: 15px; color: var(--series-text-secondary); line-height: 1.5;">
            Cold introductions lack shared context or goals, causing awkwardness and low follow-through
          </p>
        </div>

        <div style="background: var(--series-gray-light); border-radius: 12px; padding: 20px; margin-bottom: 16px;">
          <h3 style="font-size: 20px; font-weight: 600; color: var(--series-text); margin-bottom: 8px;">
            Skill-Mismatch
          </h3>
          <p style="font-size: 15px; color: var(--series-text-secondary); line-height: 1.5;">
            Naturally have far more low-capacity users than high-capacity ones, creating structural mismatches leading to pairing that can't reciprocate
          </p>
        </div>

        <div style="background: var(--series-gray-light); border-radius: 12px; padding: 20px; margin-bottom: 16px;">
          <h3 style="font-size: 20px; font-weight: 600; color: var(--series-text); margin-bottom: 8px;">
            Opaque Rating System
          </h3>
          <p style="font-size: 15px; color: var(--series-text-secondary); line-height: 1.5;">
            There is no clear or specialized ranking system, leading to mismatch and drop-off
          </p>
        </div>

        <div style="background: var(--series-gray-light); border-radius: 12px; padding: 20px;">
          <h3 style="font-size: 20px; font-weight: 600; color: var(--series-text); margin-bottom: 8px;">
            Monetization
          </h3>
          <p style="font-size: 15px; color: var(--series-text-secondary); line-height: 1.5;">
            The platform lacks a clear, sustainable revenue model, and intuitive options like subscriptions or ads conflict with model.
          </p>
        </div>
      </section>

      <!-- Our Solution -->
      <section style="margin-bottom: 48px;">
        <h2 style="font-size: 28px; font-weight: 700; color: var(--series-text); margin-bottom: 24px; letter-spacing: -0.5px;">
          Tiered User-Event Matching
        </h2>

        <div style="margin-bottom: 32px;">
          <h3 style="font-size: 20px; font-weight: 600; color: var(--series-text); margin-bottom: 12px;">
            A. User Onboarding
          </h3>
          <p style="font-size: 17px; color: var(--series-text-secondary); line-height: 1.6;">
            We onboard users by collecting their backgrounds, interests, and LinkedIn data to build a dynamic profile score that reflects their career stage and goals. We then use this data to create a user relevance score.
          </p>
        </div>

        <div style="margin-bottom: 32px;">
          <h3 style="font-size: 20px; font-weight: 600; color: var(--series-text); margin-bottom: 12px;">
            B. Event Intelligence Layer
          </h3>
          <p style="font-size: 17px; color: var(--series-text-secondary); line-height: 1.6;">
            We independently score events based on relevance, credibility, and user fit, letting us identify the top 2-3 opportunities for each user at any moment.
          </p>
        </div>

        <div>
          <h3 style="font-size: 20px; font-weight: 600; color: var(--series-text); margin-bottom: 12px;">
            C. Context-Aware Recommendations
          </h3>
          <p style="font-size: 17px; color: var(--series-text-secondary); line-height: 1.6;">
            When a user asks the chatbot for recommendations, we rank and surface the highest-fit events first, ensuring relevance and reducing decision friction. We then show the most compatible people attending.
          </p>
        </div>

        <div style="background: var(--series-black); color: white; border-radius: 12px; padding: 24px; margin-top: 32px;">
          <p style="font-size: 17px; line-height: 1.6; font-weight: 500;">
            Meaningful networking comes from shared context, and events create the strongest context. Instead of starting with people and hoping for relevance, we start with the events where interests, goals, and opportunities naturally align.
          </p>
        </div>
      </section>

      <!-- Why Events as Anchor -->
      <section style="margin-bottom: 48px;">
        <h2 style="font-size: 28px; font-weight: 700; color: var(--series-text); margin-bottom: 24px; letter-spacing: -0.5px;">
          Why Use Events as an Anchor?
        </h2>

        <div style="margin-bottom: 24px;">
          <h3 style="font-size: 20px; font-weight: 600; color: var(--series-text); margin-bottom: 8px;">
            Built-in incentive to follow through
          </h3>
          <p style="font-size: 15px; color: var(--series-text-secondary); line-height: 1.6; margin-bottom: 8px;">
            Interacting with someone you'll see at an upcoming event creates stronger motivation to know them than a casual call or text.
          </p>
          <p style="font-size: 13px; color: var(--series-text-muted); font-style: italic; line-height: 1.5;">
            Research on anticipated future interaction shows that when people expect to meet someone again, they communicate more openly and invest more effort in the relationship (Kellermann, 1986)
          </p>
        </div>

        <div style="margin-bottom: 24px;">
          <h3 style="font-size: 20px; font-weight: 600; color: var(--series-text); margin-bottom: 8px;">
            Effective Deadline
          </h3>
          <p style="font-size: 15px; color: var(--series-text-secondary); line-height: 1.6; margin-bottom: 8px;">
            The event date introduces time pressure that reduces drop-off and encourages timely responses.
          </p>
          <p style="font-size: 13px; color: var(--series-text-muted); font-style: italic; line-height: 1.5;">
            Research on temporal landmarks shows that time-bound events increase motivation and reduce procrastination by creating a clear psychological endpoint (Dai, Milkman & Riis, 2014)
          </p>
        </div>

        <div>
          <h3 style="font-size: 20px; font-weight: 600; color: var(--series-text); margin-bottom: 8px;">
            Shared Context / Goal
          </h3>
          <p style="font-size: 15px; color: var(--series-text-secondary); line-height: 1.6; margin-bottom: 8px;">
            Attendees automatically have a common topic, goal, or objective, making it far easier to start and sustain a conversation.
          </p>
          <p style="font-size: 13px; color: var(--series-text-muted); font-style: italic; line-height: 1.5;">
            Research on joint activity shows that shared goals increase coordination, disclosure, and willingness to engage meaningfully with others (Clark, 1996)
          </p>
        </div>
      </section>

      <!-- Scoring Systems -->
      <section style="margin-bottom: 48px;">
        <h2 style="font-size: 28px; font-weight: 700; color: var(--series-text); margin-bottom: 24px; letter-spacing: -0.5px;">
          Scoring Systems
        </h2>

        <div style="background: var(--series-gray-light); border-radius: 12px; padding: 24px; margin-bottom: 24px;">
          <h3 style="font-size: 20px; font-weight: 600; color: var(--series-text); margin-bottom: 16px;">
            User Relevance Score
          </h3>
          <p style="font-size: 15px; color: var(--series-text-secondary); line-height: 1.6; margin-bottom: 16px;">
            Combines onboarding info + LinkedIn data to estimate how contextually relevant and "valuable" a user is for different event types.
          </p>
          <ul style="font-size: 15px; color: var(--series-text-secondary); line-height: 1.8; padding-left: 20px;">
            <li><strong>User Onboarding:</strong> General information such as name, location, school, interests, and basic background</li>
            <li><strong>Personalization:</strong> Open-ended questions that reveal deeper context about goals, personality, and preferences</li>
            <li><strong>Experience Layer (ExpL):</strong> LinkedIn signals (roles, seniority, projects) to avoid mismatching very advanced users with beginners (Scale of 1-3)</li>
          </ul>
        </div>

        <div style="background: var(--series-gray-light); border-radius: 12px; padding: 24px;">
          <h3 style="font-size: 20px; font-weight: 600; color: var(--series-text); margin-bottom: 16px;">
            Event Score
          </h3>
          <p style="font-size: 15px; color: var(--series-text-secondary); line-height: 1.6; margin-bottom: 16px;">
            Quantifies how relevant, credible, and useful an event is for different types of users. Uses structured event metadata plus historical performance signals.
          </p>
          <ul style="font-size: 15px; color: var(--series-text-secondary); line-height: 1.8; padding-left: 20px;">
            <li><strong>Event Ingestion & Categorization:</strong> Tagged based on location, industry/topic, skill level, and format</li>
            <li><strong>Event Quality Rating:</strong> Evaluated on organizer strength, historical attendance, user feedback</li>
            <li><strong>Contextual Match:</strong> Re-rank users by how well their profile fits the event's tags</li>
          </ul>
        </div>
      </section>

      <!-- CTA Button -->
      <div style="text-align: center; margin-top: 48px; padding: 48px 24px; background: var(--series-gray-light); border-radius: 12px;">
        <h2 style="font-size: 28px; font-weight: 700; color: var(--series-text); margin-bottom: 16px; letter-spacing: -0.5px;">
          Ready to Get Started?
        </h2>
        <p style="font-size: 17px; color: var(--series-text-secondary); margin-bottom: 32px; line-height: 1.6;">
          Complete onboarding to start matching with events and people
        </p>
        <button class="ios-button" onclick="window.router.goTo('onboarding/1')" style="
          background: var(--series-black);
          color: white;
          border: none;
          border-radius: 8px;
          padding: 16px 32px;
          font-size: 17px;
          font-weight: 600;
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
        ">
          Start Onboarding
        </button>
      </div>
    </div>
  `;
};

