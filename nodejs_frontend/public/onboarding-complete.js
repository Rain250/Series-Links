// Onboarding Complete Animation

function showOnboardingCompleteAnimation(callback) {
  // Create full-screen overlay
  const overlay = document.createElement('div');
  overlay.id = 'onboardingCompleteOverlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    z-index: 20000;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: white;
    font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif;
    overflow: hidden;
  `;
  
  overlay.innerHTML = `
    <div style="text-align: center; padding: 40px; max-width: 500px; position: relative;">
      <!-- Animated Background Circles -->
      <div style="
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 400px;
        height: 400px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.1);
        animation: pulse 2s ease-in-out infinite;
      "></div>
      <div style="
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 300px;
        height: 300px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.15);
        animation: pulse 2s ease-in-out infinite 0.5s;
      "></div>
      
      <!-- Checkmark Animation -->
      <div id="checkmarkContainer" style="
        width: 120px;
        height: 120px;
        margin: 0 auto 40px;
        position: relative;
        z-index: 1;
      ">
        <svg id="checkmarkSvg" width="120" height="120" viewBox="0 0 120 120" style="
          transform: scale(0);
          animation: scaleIn 0.5s ease-out 0.3s forwards;
        ">
          <circle
            cx="60"
            cy="60"
            r="55"
            fill="none"
            stroke="white"
            stroke-width="4"
            stroke-dasharray="345"
            stroke-dashoffset="345"
            style="animation: drawCircle 1s ease-out 0.5s forwards;"
          />
          <path
            id="checkmarkPath"
            d="M 35 60 L 55 80 L 85 40"
            fill="none"
            stroke="white"
            stroke-width="6"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-dasharray="60"
            stroke-dashoffset="60"
            style="animation: drawCheck 0.6s ease-out 1.5s forwards;"
          />
        </svg>
      </div>
      
      <!-- Success Message -->
      <h1 id="successTitle" style="
        font-size: 48px;
        font-weight: 700;
        margin-bottom: 16px;
        letter-spacing: -1px;
        opacity: 0;
        transform: translateY(20px);
        animation: fadeInUp 0.6s ease-out 2.1s forwards;
      ">You're All Set!</h1>
      
      <p id="successSubtitle" style="
        font-size: 20px;
        opacity: 0;
        transform: translateY(20px);
        animation: fadeInUp 0.6s ease-out 2.3s forwards;
        margin-bottom: 40px;
        color: rgba(255, 255, 255, 0.9);
      ">We're finding the perfect events for you...</p>
      
      <!-- Events Loading Animation -->
      <div id="eventsLoading" style="
        opacity: 0;
        animation: fadeIn 0.5s ease-out 2.8s forwards;
        margin-top: 40px;
      ">
        <div style="
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-bottom: 20px;
        ">
          <div class="event-dot" style="
            width: 12px;
            height: 12px;
            background: white;
            border-radius: 50%;
            animation: bounce 1.4s ease-in-out infinite;
            animation-delay: 0s;
          "></div>
          <div class="event-dot" style="
            width: 12px;
            height: 12px;
            background: white;
            border-radius: 50%;
            animation: bounce 1.4s ease-in-out infinite;
            animation-delay: 0.2s;
          "></div>
          <div class="event-dot" style="
            width: 12px;
            height: 12px;
            background: white;
            border-radius: 50%;
            animation: bounce 1.4s ease-in-out infinite;
            animation-delay: 0.4s;
          "></div>
        </div>
        <p style="
          font-size: 16px;
          color: rgba(255, 255, 255, 0.8);
          margin-top: 20px;
        ">Analyzing preferences...</p>
      </div>
      
      <!-- Events Preview (animated in) -->
      <div id="eventsPreview" style="
        display: none;
        margin-top: 40px;
      ">
        <div style="
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 24px;
        ">Perfect matches found!</div>
        <div style="
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          max-width: 300px;
          margin: 0 auto;
        ">
          <div class="event-card-preview" style="
            background: rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(10px);
            border-radius: 12px;
            padding: 16px;
            text-align: center;
            transform: scale(0);
            animation: scaleIn 0.4s ease-out forwards;
            animation-delay: 3.5s;
          ">
            <div style="font-size: 32px; margin-bottom: 8px;">🎯</div>
            <div style="font-size: 14px; font-weight: 600;">Events</div>
          </div>
          <div class="event-card-preview" style="
            background: rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(10px);
            border-radius: 12px;
            padding: 16px;
            text-align: center;
            transform: scale(0);
            animation: scaleIn 0.4s ease-out forwards;
            animation-delay: 3.7s;
          ">
            <div style="font-size: 32px; margin-bottom: 8px;">👥</div>
            <div style="font-size: 14px; font-weight: 600;">People</div>
          </div>
          <div class="event-card-preview" style="
            background: rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(10px);
            border-radius: 12px;
            padding: 16px;
            text-align: center;
            transform: scale(0);
            animation: scaleIn 0.4s ease-out forwards;
            animation-delay: 3.9s;
          ">
            <div style="font-size: 32px; margin-bottom: 8px;">✨</div>
            <div style="font-size: 14px; font-weight: 600;">Matches</div>
          </div>
        </div>
      </div>
    </div>
    
    <style>
      @keyframes pulse {
        0%, 100% {
          transform: translate(-50%, -50%) scale(1);
          opacity: 0.3;
        }
        50% {
          transform: translate(-50%, -50%) scale(1.1);
          opacity: 0.5;
        }
      }
      
      @keyframes scaleIn {
        to {
          transform: scale(1);
        }
      }
      
      @keyframes drawCircle {
        to {
          stroke-dashoffset: 0;
        }
      }
      
      @keyframes drawCheck {
        to {
          stroke-dashoffset: 0;
        }
      }
      
      @keyframes fadeInUp {
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes fadeIn {
        to {
          opacity: 1;
        }
      }
      
      @keyframes bounce {
        0%, 80%, 100% {
          transform: translateY(0);
          opacity: 0.5;
        }
        40% {
          transform: translateY(-20px);
          opacity: 1;
        }
      }
    </style>
  `;
  
  document.body.appendChild(overlay);
  
  // Show events preview after loading
  setTimeout(() => {
    const loading = document.getElementById('eventsLoading');
    const preview = document.getElementById('eventsPreview');
    
    if (loading) loading.style.opacity = '0';
    if (preview) {
      preview.style.display = 'block';
      preview.style.animation = 'fadeIn 0.5s ease-out forwards';
    }
  }, 3500);
  
  // Complete animation and callback
  setTimeout(() => {
    overlay.style.transition = 'opacity 0.5s ease-out';
    overlay.style.opacity = '0';
    
    setTimeout(() => {
      if (document.body.contains(overlay)) {
        document.body.removeChild(overlay);
      }
      if (callback) callback();
    }, 500);
  }, 4500);
}

// Make available globally
window.showOnboardingCompleteAnimation = showOnboardingCompleteAnimation;

