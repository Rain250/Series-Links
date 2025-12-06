// Simple Router for Frame-based Navigation
class Router {
  constructor() {
    this.routes = new Map();
    this.currentRoute = null;
    this.history = [];
    this.init();
  }

  init() {
    // Handle browser back/forward
    window.addEventListener('popstate', (e) => {
      const route = e.state?.route || this.getRouteFromHash();
      if (route) {
        this.navigate(route, false);
      }
    });

    // Don't auto-navigate on init - let the app decide based on state
    // This prevents overriding explicit URLs
  }

  getRouteFromHash() {
    const hash = window.location.hash.slice(1);
    const path = window.location.pathname;
    
    // If hash exists, use it
    if (hash) {
      // Handle onboarding routes: onboarding/1, onboarding/2, etc.
      if (hash.startsWith('onboarding/')) {
        return hash; // Keep full path like "onboarding/1"
      }
      return hash;
    }
    
    // If no hash, check pathname
    if (path === '/about') return 'about';
    if (path === '/onboarding') return 'onboarding/1';
    if (path === '/events' || path === '/home') return 'events';
    
    return null;
  }

  register(route, handler) {
    this.routes.set(route, handler);
  }

  navigate(route, pushState = true) {
    console.log('[ROUTER] Navigating to route:', route, 'Current:', this.currentRoute);
    
    // Don't return early for onboarding routes - we want to re-render even if on same route
    if (this.currentRoute === route && !route.startsWith('onboarding/')) {
      return;
    }

    // Handle onboarding routes - they all use the same page element
    let targetPageId;
    if (route && route.startsWith('onboarding/')) {
      targetPageId = 'page-onboarding';
    } else if (route === 'about') {
      targetPageId = 'page-about';
    } else {
      targetPageId = `page-${route}`;
    }

    const handler = this.routes.get(route);
    
    // Hide all pages first (for all routes)
    document.querySelectorAll('.page').forEach(page => {
      page.classList.remove('active');
      page.classList.add('hidden');
    });
    
    // Handle onboarding routes - always call the handler to re-render
    if (route && route.startsWith('onboarding/')) {
      const targetPage = document.getElementById(targetPageId);
      if (targetPage) {
        targetPage.classList.remove('hidden');
        targetPage.classList.add('active');
        this.currentRoute = route;
        
        // Call the specific handler or base handler
        if (handler) {
          handler();
        } else {
          const baseHandler = this.routes.get('onboarding');
          if (baseHandler) baseHandler();
        }
        
        if (pushState) {
          window.history.pushState({ route }, '', `#${route}`);
          this.history.push(route);
        }
        return;
      }
    }
    
    if (!handler) {
      console.warn(`Route ${route} not found`);
      return;
    }

    // Show target page
    const targetPage = document.getElementById(targetPageId);
    if (targetPage) {
      targetPage.classList.remove('hidden');
      targetPage.classList.add('active');
      this.currentRoute = route;

      // Call handler
      if (handler) handler();
    } else {
      console.warn(`Page element #${targetPageId} not found`);
    }

    // Update URL
    if (pushState) {
      window.history.pushState({ route }, '', `#${route}`);
      this.history.push(route);
    }

    // Update nav active state
    this.updateNavActive(route);
  }

  updateNavActive(route) {
    document.querySelectorAll('[data-route]').forEach(nav => {
      if (nav.dataset.route === route) {
        nav.classList.add('active');
      } else {
        nav.classList.remove('active');
      }
    });
  }

  back() {
    if (this.history.length > 1) {
      this.history.pop(); // Remove current
      const prevRoute = this.history[this.history.length - 1];
      this.navigate(prevRoute, false);
      window.history.back();
    } else {
      this.navigate('events', false);
    }
  }

  goTo(route) {
    this.navigate(route, true);
  }
}

// Global router instance
window.router = new Router();


