// Simple router utility for handling URL changes
class SimpleRouter {
  constructor() {
    this.routes = new Map();
    this.currentRoute = null;
    
    // Listen for popstate events (back/forward buttons)
    window.addEventListener('popstate', () => {
      this.handleRouteChange();
    });
  }

  addRoute(path, handler) {
    this.routes.set(path, handler);
  }

  navigate(path) {
    window.history.pushState({}, '', path);
    this.handleRouteChange();
  }

  handleRouteChange() {
    const path = window.location.pathname;
    const handler = this.routes.get(path);
    
    if (handler) {
      handler();
    }
  }

  getCurrentPath() {
    return window.location.pathname;
  }

  getQueryParams() {
    return new URLSearchParams(window.location.search);
  }
}

export default new SimpleRouter(); 