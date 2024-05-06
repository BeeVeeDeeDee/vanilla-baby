import { NotFound } from "../pages";

/* 
  The Router class handles route-based rendering. It listens for popstate events, 
  renders the appropriate component based on the current path, and allows navigation 
  to specific paths. It provides methods for pre-route change cleanup (beforeRouteChange), 
  passing global components to all routes (exposeComponents), and accessing the current 
  route (currentRoute). It expects an array of routes, each with a path and a component, 
  in the constructor. Additional methods include getRouteHelp (returns help text for a route) 
  and getNextRoute (returns the next route).
*/

export class Router {
  constructor(routes) {
    this.routes = routes;
    this.currentComponent = null; 

    // state 
    this.state = {
      globalComponents: {}
    }

    window.addEventListener('popstate', this.renderRoute);
    window.addEventListener('DOMContentLoaded', this.renderRoute);
  }

  getRouteHelp = (name) => {
    const route = this.routes.find(route => route.pathName === name);
    return route.help;
  }

  getNextRoute = (name) => {
    const route = this.routes.find(route => route.pathName === name);
    return route.path;
  }

  navigateTo(path) {
    // update the browser's history
    history.pushState(null, null, path);
    // render the route
    this.renderRoute();
  }

  beforeRouteChange(newComponent) {
    // If the current component exists & has an unmount method, call it
    if (this.currentComponent && this.currentComponent.unmount) {
      // unmount all nescessary listeners, loops, timers, or set transitions
      this.currentComponent.unmount();
    }
    this.currentComponent = newComponent;
  }

  renderRoute = () => {
    // get the current path
    const path = window.location.pathname;
    // find the route that matches the path
    const route = this.routes.find(route => route.path === path);
    // check if the route exists
    if (route && route.component) {
      // create a new instance of the route's component and pass in the global distributed components
      const componentInstance = new route.component(this.state.globalComponents);
      this.beforeRouteChange(componentInstance);
    } else {
      // if the route does not exist, render the NotFound view
      const notFoundInstance = new NotFound();
      this.beforeRouteChange(notFoundInstance);
    }
  }

  exposeComponents = (components) => {
    this.state.globalComponents = components;
  }

  currentRoute = () => {
    const path = window.location.pathname;
    return this.routes.find(route => route.path === path);
  }
}

/*
  In this code, unmount is a method that you should implement in your page-components. 
  It should handle any necessary cleanup before the component is removed, such as 
  removing event listeners, stopping timers, or storing user input, etc. 
*/
