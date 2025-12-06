// Matching Animation and Scoring System

function calculateMatchScore(event, userProfile) {
  if (!userProfile || !event) return null;
  
  // Use event scores if available, otherwise calculate
  if (event.relevanceScore && event.credibilityScore && event.userFitScore) {
    // Weighted average: 40% relevance, 30% credibility, 30% user fit
    return Math.round(
      (event.relevanceScore * 0.4) + 
      (event.credibilityScore * 0.3) + 
      (event.userFitScore * 0.3)
    );
  }
  
  // Fallback: calculate from interests
  if (!userProfile.interests || !event.tags) return null;
  
  const matchingTags = event.tags.filter(tag => userProfile.interests.includes(tag));
  const matchPercentage = (matchingTags.length / Math.max(event.tags.length, userProfile.interests.length)) * 100;
  
  // Base score from tag matching
  let score = Math.round(matchPercentage);
  
  // Boost for founder events if user is a founder
  if (event.tags.includes('Founders') && (userProfile.headline?.toLowerCase().includes('founder') || userProfile.headline?.toLowerCase().includes('startup'))) {
    score += 15;
  }
  
  // Boost for AI/Tech events if user has AI/Tech interests
  if (event.tags.some(t => ['AI', 'Tech'].includes(t)) && userProfile.interests.some(i => ['AI', 'Tech'].includes(i))) {
    score += 10;
  }
  
  return Math.min(100, score);
}

function showMatchingAnimation(eventId, callback) {
  const event = MOCK_EVENTS.find(e => e.id === eventId);
  const profile = state.getUserProfile();
  const matchScore = calculateMatchScore(event, profile);
  
  // Create modal overlay
  const modal = document.createElement('div');
  modal.id = 'matchingModal';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.9);
    z-index: 10000;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: white;
    font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif;
  `;
  
  modal.innerHTML = `
    <div style="text-align: center; padding: 40px; max-width: 400px;">
      <div id="matchingSpinner" style="width: 80px; height: 80px; margin: 0 auto 30px; position: relative;">
        <div style="
          width: 80px;
          height: 80px;
          border: 4px solid rgba(255, 255, 255, 0.2);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        "></div>
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 24px;
          font-weight: 700;
        " id="matchingProgress">0%</div>
      </div>
      
      <h2 style="font-size: 28px; font-weight: 700; margin-bottom: 16px; letter-spacing: -0.5px;">
        Finding your match...
      </h2>
      
      <p id="matchingStatus" style="font-size: 17px; color: rgba(255, 255, 255, 0.8); margin-bottom: 20px;">
        Analyzing event compatibility
      </p>
      
      <div id="matchingScoreDisplay" style="display: none;">
        <div style="
          font-size: 72px;
          font-weight: 700;
          margin: 20px 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        " id="finalScore">0</div>
        <div style="font-size: 20px; font-weight: 600; margin-bottom: 10px;">Match Score</div>
        <div style="font-size: 16px; color: rgba(255, 255, 255, 0.7); margin-bottom: 30px;">
          ${event ? event.title : 'Event'}
        </div>
      </div>
    </div>
    
    <style>
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      @keyframes fadeIn {
        from { opacity: 0; transform: scale(0.9); }
        to { opacity: 1; transform: scale(1); }
      }
      #matchingScoreDisplay {
        animation: fadeIn 0.5s ease-out;
      }
    </style>
  `;
  
  document.body.appendChild(modal);
  
  // Animate progress
  let progress = 0;
  const progressInterval = setInterval(() => {
    progress += Math.random() * 15 + 5;
    if (progress > 90) progress = 90;
    
    const progressEl = document.getElementById('matchingProgress');
    const statusEl = document.getElementById('matchingStatus');
    
    if (progressEl) progressEl.textContent = Math.round(progress) + '%';
    
    if (statusEl) {
      if (progress < 30) {
        statusEl.textContent = 'Analyzing event compatibility...';
      } else if (progress < 60) {
        statusEl.textContent = 'Calculating match score...';
      } else if (progress < 90) {
        statusEl.textContent = 'Finalizing results...';
      }
    }
    
    if (progress >= 90) {
      clearInterval(progressInterval);
      
      // Show score
      setTimeout(() => {
        const spinner = document.getElementById('matchingSpinner');
        const scoreDisplay = document.getElementById('matchingScoreDisplay');
        const finalScore = document.getElementById('finalScore');
        
        if (spinner) spinner.style.display = 'none';
        if (scoreDisplay) scoreDisplay.style.display = 'block';
        if (finalScore) {
          // Animate score count-up
          let currentScore = 0;
          const scoreInterval = setInterval(() => {
            currentScore += Math.ceil(matchScore / 20);
            if (currentScore >= matchScore) {
              currentScore = matchScore;
              clearInterval(scoreInterval);
              
              // Call callback after showing score
              setTimeout(() => {
                modal.style.opacity = '0';
                modal.style.transition = 'opacity 0.3s';
                setTimeout(() => {
                  document.body.removeChild(modal);
                  if (callback) callback();
                }, 300);
              }, 1500);
            }
            if (finalScore) finalScore.textContent = currentScore;
          }, 30);
        }
      }, 500);
    }
  }, 150);
}

// Make available globally
window.calculateMatchScore = calculateMatchScore;
window.showMatchingAnimation = showMatchingAnimation;

