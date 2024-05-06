# <span style="color:dodgerblue;">Architecture Breakdown.</span>

This document provides an overview of a Single Page Application (SPA) built entirely with vanilla JavaScript. The application adheres to the Model-View-Controller (MVC) design pattern, promoting separation of concerns for easier understanding and maintenance. The codebase is object-oriented, enhancing scalability and maintainability. This document serves as a guide, explaining the structure and functionality of different parts of the application:    
<span style="color:dodgerblue; font-weight:bold;">what</span> happens <span style="color:dodgerblue; font-weight:bold;">where</span> and <span style="color:dodgerblue; font-weight:bold;">why</span>.

## Table of content

__Template - Initiate - Organize - Control__  

- [index.html](#index) 
- [app.js](#app)   
- [ElementOrganizer.js](#elementOrganizer) 
- [AppController.js](#appController)

__Routing__  

- [Router.js](#router)

__Global Components__  

- [MenuPanel.js](#menuPanel)
- [HelpPanel.js](#helpPanel)
- [Navbar.js](#navbar)
- [Main.js](#main)
- [Footer.js](#footer)

__Views / Pages__  

- [Pages: Homeview](#homeView)
- [dom-elements.js.](#elements) : Utility.
- [Pages: AboutView](#aboutView)
- [PageSpecific: SlidePuzzle](#slidePuzzle)
- [PageSpecific: Confetti](#confetti)
- [Pages: ContactView](#contactView)
- [Stores: UserStore](#store) : Store example
- [Pages: NotFound](#notFound)  

__General app settings:__  

- [vite.config.js](#vite)
- [jsconfig.json](#jsconfig)


## <a id="index"></a><span style="color:hotpink;">index.html</span> 

The index.html file is the entry point of this application. In the head-section the title of the application is set by using the .env variable VITE_APP_NAME. Have a look at the .env [environment] file and rename the variable to your prefered name.  Also in the head section: the google-icons stylesheet and the main stylesheet are referenced. App.css works like an organizer of all other stylesheets. 

In the body of the HTML file all global parts of the interface are rendered which are used throughout the whole application:  

- A loader element which creates a spinning svg loader on initial pageload. 
- A header with a navbar: [breadcrum, flipswitch]
- A menupanel [left] [icon-button, panel, menu-items]
- A help-panel [right] [icon-button, panel, helpheading, helpsubtitle, helpbody] , 
- A main section: placeholder division for any page/view to be rendered in. 
- A footer: placeholder for any actions to be rendered in.  

The loader acts as a solution to deal with any loading time (e.g. data fetching) and any flashes of unstyled content [FOUC] at the initial page load. At the bottom of the body you find a script which handles the loader. First the `handleLoadingEvents` function is declared with type (event type) as an argument. When The event `load` is dispatched it logs a message to the console. When the event `DOMContentLoaded` is dispatched it (for now) simulates an async operation, and then fires the render function. The render function hides the loader element and logs a message to the console. At the bottom of the script we listen for predefined events, to showcase what kind of global events are dispatched while loading or unloading the window, and attach the `handleLoadingEvents` function. 

```js
const handleLoadingEvents = (type) => {

  type === 'load' && console.log(`loading...`, `loading-time (ms):`, performance.now()); 

  if (type === 'DOMContentLoaded') { 
    // Data fetching simulation
    setTimeout(() => {
      render();
    }, 500);   
  }

}

const render = () => {
  const loader = document.querySelector('[data-component="loader"]');
  loader.style.display = 'none';
  console.log(import.meta.env.VITE_APP_NAME + ' fully loaded')
}

['beforeload', 'load', 'DOMContentLoaded', 'beforeunload', 'unload'].forEach(eventType =>
  window.addEventListener(eventType, handleLoadingEvents(eventType))
);
```

lastly, at the bottom of the body, the script `<script type="module" src="./js/app.js"></script>` is loaded in.  

## <a id="app"></a><span style="color:hotpink;">app.js</span> 

in this file the application gets dispatched, or initiated if you will. At the top of the file you find the imported modules. 
```js
import { Router, routes } from '@/js/Router';
import { ElementOrganizer } from '@/js/utils/ElementOrganizer.js';
import { AppController } from '@/js/controllers/AppController';
```
Then we create a new instance of the Router component and populate it whith our routes. More on the router and routes [Here](#router)
```js
const router = new Router(routes);
```
Finally we create a new instance of the ElementOrganizer class
```js
const elements = new ElementOrganizer(document.querySelectorAll('[data-component]'));
```
And we create a auto-rendering instance of the AppController class we call app.
```js
const app = new AppController(elements, settings);
```

## <a id="elementOrganizer"></a><span style="color:hotpink;">ElementOrganizer</span> 

Let's start with the `ElementOrganizer` object, since it is the bridge between static HTML elements and interactivity. `@/js/utils/ElementOrganizer.js`. This object gathers all element we want to reuse and organizes them into groups. We could have simply used the nodeList generated by `document.querySelectorAll('[data-component=]')` but you can imagine,  
that if the number of data-components grows, this will become a rather large pile which we pass around, let's make our logics readable and catch what we threw / use what we need.

In the `ElementOrganizer` class, the constructor is initializing the components property with all the elements in the document that have a data-component attribute. This is done using the querySelectorAll method. Next it is initializing the _groups[[1]](#private) property as an empty object. This property will later be used to group the components by their data-group attribute. Finally It is calling the sortElements method. This method will sort the components into groups based on their data-group attribute.
```js
export class ElementOrganizer {
  constructor(nodeList) {
    this.components = nodeList; 
    this._groups = {};
    this.sortElements();
  }

  // all methods
}
```
`sortElements` is responsible for sorting elements into groups based on their `data-group` & `data-component` attributes. A breakdown of the method:  

It iterates over each component in the components array using forEach.  
```js
this.components.forEach(component => {
```
For each component, it retrieves the data-group and data-component attributes.  
```js
const group = component.getAttribute('data-group');
const componentType = component.getAttribute('data-component');
```
If the component has a data-group attribute, it checks if a group with that name   
already exists in the _groups object. If not, it creates a new group.  
```js
if (group) {
  if (!this._groups[group]) {
    this._groups[group] = {};
  }
```
It then checks if a component of the same type already exists in the group. If not, it adds the component to the group.
```js
if (!this._groups[group][componentType]) {
  this._groups[group][componentType] = component;
}
```
If a component of the same type already exists and it's an array, it renames the key by appending an 's' to it, deletes the old key, and then pushes the new component into the array.  
```js
else if (this._groups[group][componentType] instanceof Array) {
  this._groups[group][componentType + 's'] = this._groups[group][componentType];
  delete this._groups[group][componentType];
  this._groups[group][componentType + 's'].push(component);
}
```
If a component of the same type already exists but it's not an array, it transforms the value into an array containing the existing component and the new one.  
```js
else {
  this._groups[group][componentType] = [this._groups[group][componentType], component];
}
```
Go ahead and uncomment the console.log(elements); statement in app.js #15 and check the output.

## <a id="appController"></a><span style="color:hotpink;">AppController</span> 

Since the `AppController` is the heart of this application, it controlls the applications rendering, we now continue with this object. `@/js/controllers/AppController.js`.  

High-over, the `AppController` object is responsible for __initializing the application__ and __splitting the application into different components__. Each component is responsible for rendering a specific part of the application and handling it's logics.    

First we import all component classes. To simplify the import statement, index.js file bundles all components in the components folder, so we can more easily do:
```js
import { Footer, HelpPanel, Main, Navbar, MenuPanel } from "@/js/components";
// instead of 
import { Footer } from 'path/to/Footer';
import { HelpPanel } from 'path/to/HelpPanel';
// etc. etc.
```
In the first lines of the constructor the elements object, organized by the ElementOrganizer, are being destructured: unpacked in distict variables, to make the code readable and maintainable.
```js
constructor(elements = {}, settings = {}) {
  this.elementGroups = elements.groups;
  const { footer, helpPanel, main, menuPanel, navbar } = this.elementGroups;
```
The same goes for the Router object, passed in directly at `app.js` #15.  
```js
const { router, config } = settings;
this.router = router;
```
Next, all components which make up the global components of the UI are being initiated. The appropriate elements are passed as a property.
```js
this.footer = new Footer(footer);
this.helpPanel = new HelpPanel(helpPanel);
this.main = new Main(main);
this.navbar = new Navbar(navbar, config);
this.menuPanel = new MenuPanel(menuPanel, this);
```
Then the component instances are exposed to the `Router` object, so these objects can be passed as a property to page-specific components. More about this in a [minute](#router).
```js
this.router.exposeComponents({
  footer: this.footer,
  helpPanel: this.helpPanel,
  main: this.main,
  menuPanel: this.menuPanel,
  navbar: this.navbar,
});
```
Finally we listen for clicks outside the panels (menu/help) and close the panel if set conditions are met.
```js
document.body.addEventListener('click', (e) => {
  
  // ... bunch of conditions used to check what is being clicked

  if (!helpPanelClicked && helpPanelOpen && !menuButtonClicked && !menuItemClicked) {
    this.helpPanel.toggleMenu();
  }
  if (!menuPanelClicked && menuPanelOpen && !helpButtonClicked) {
    this.menuPanel.toggleMenu();
  }
});
```
That's all. That's that. Let's move on to the Router object.


## <a id="router"></a><span style="color:hotpink;">Router</span> 

Because we want this application to run like a single page application the router will have to handle navigating to another view while actally staying on the same index.html page. Also making sure to handle manually typed urls in the browser. To do so we can use the History API. [https://developer.mozilla.org/en-US/docs/Web/API/History_API]. Have a look at its documentation.       

For our applications routing logics we make use of the `pushState` method of the `History` API. With this method we can add an entry to the browser's session history stack. In other words; we can tell the browser what url we want to visit The method has 3 parameters `pushState(data: any, unused: string, url?: string | URL | null | undefined)`. For now we will only use the last parameter: url.  

The idea of handling the routes is when a user clicks a menu-item in the [menu panel](#menuPanel), the textContent of the menu-item will be chacked against the array of route objects (routes). If a route's pathName is equal to the menu-item's name we will tell the browser to navigate to another "page". If it doesn't match a route we will have to tell the user the "page" does not exist. [404]  

> __You can see how this system is vulnerable__. What if the menu-item text changes?   
> __How can you make this less fragile?__  


The `Router` class handles route-based rendering. Beside using `pushState` to set a new state, it also listens for `popstate` events: usage of the prev and next button of the browser, and reusing the state set by `pushState`.   

Besides navigating the user to specific "page" of the application, the router objects main job is to distribute and initiates the "page-specific" components. It does that when needed.   

Let's have a look at the code. The script starts with importing the NotFound component, this component renders a 404 page and let's the user know the page they are looking for does not or no longer exist.
```js
import { NotFound } from "../pages";
```
In the constructor of the Router class, the routes object is passed in. Each Route has a path, which is the last part of the url, a pathName, the view-component that belongs to that specific route and the help object which will be rendered in the helpPanel.
```js
constructor(routes) {
  this.routes = routes;

// @/js/Router/routes.js
{ 
  path: '/', 
  pathName: 'Home', 
  component: HomeView,
  help: helpData.HomeView,
},
{ 
  path: '/about', 
  pathName: 'About', 
  component: AboutView,
  help: helpData.AboutView,
},
{ 
  path: '/contact', 
  pathName: 'Contact', 
  component: ContactView,
  help: helpData.ContactView,
}
```
A placeholder variable `this.currentComponent` is set to null. This variable will be used to store the component used in the current route. More about this a little later on.  
```js
this.currentComponent = null; 
```
Then the state of the Router is decalred with one key: `globalComponents`, whcih is set to an empty object. It will later be populated with the exposed global components. Finally we listen for `popstate` & `DomContentLoaded` and fire the `renderRoute` method when these events are dispatched.
```js
  // state 
  this.state = {
    globalComponents: {}
  }

  window.addEventListener('popstate', this.renderRoute);
  window.addEventListener('DOMContentLoaded', this.renderRoute);
}
```
The `getRouteHelp` method can be called to get the help object which meets the routes path. An example of the implementation can be found at MenuPanel #48. More about the MenuPanel component later on.
```js
getRouteHelp = (name) => {
  const route = this.routes.find(route => route.pathName === name);
  return route.help;
}
```
The `getNextRoute` method is a helper method which we use to get the route's path [url]. It checks the given name [pathName] and uses the native es `find()` method to look through the array of route objects. This method is used in the `MenuPanel` component #86.
```js
getNextRoute = (name) => {
  const route = this.routes.find(route => route.pathName === name);
  return route.path;
}
```
The `navigateTo` method is used for actually populating the pushState method of the history object. For now we leave the first two arguments (data, unused) empty [null]. Then the `renderRoute` method gets fired. More on rendering the route in a minute.
```js
navigateTo(path) {
  // update the browser's history
  history.pushState(null, null, path);
  // render the route
  this.renderRoute();
}
```
The `beforeRouteChange` method acts as guard method. It checks if the current component has a unmount method. If so, it fires the unmount method before rendering the new component. This unmount method in a component will reset any timers, event listeners or loops when the user naviagtes to another "page". Imagine you have a music player in the about section of your page, and it plays a tune. When the user navigates away from the about section the music will keep playing and the user will not be able to kill the sound, except for reloading the complete application and losing any unsaved data.

```js
beforeRouteChange(newComponent) {
  // If the current component exists & has an unmount method, call it
  if (this.currentComponent && this.currentComponent.unmount) {
    // unmount all nescessary listeners, loops, timers, or set transitions
    this.currentComponent.unmount();
  }
  this.currentComponent = newComponent;
}
```
An example of some unmounting logics can be found in the ContactView component. Here it changes the value of the stored username on unmount, if a name was stored in the first place.
```js
// @/js/pages/contact/ContactView.js
unmount = () => {
  // maybe do something with the state
  this.state.yourName && 
  (this.userStore.userName = `changed <span style="color:dodgerblue">${this.state.yourName}</span> on unmounting Contact`);
};
```
The `renderRoute` method renders a route if the route exists and has a valid component, produces the NotFound if these requirements are not met.
```js
renderRoute = () => {
  // get the current path
  const path = window.location.pathname;

  // find the route that matches the path
  const route = this.routes.find(route => route.path === path);

  // check if the route exists and it has a component
  if (route && route.component) {

    // create a new instance of the route's component and pass in the globally exposed components
    const componentInstance = new route.component(this.state.globalComponents);
    
    // use the beforeRoute method in case an unmount method is present.
    this.beforeRouteChange(componentInstance);
  } else {
    // if the route does not exist, render the NotFound view
    const notFoundInstance = new NotFound();

    // use the beforeRoute method in case an unmount method is present.
    this.beforeRouteChange(notFoundInstance);
  }
}
```
When the `exposeComponents` method is called, it sets the state of the Router, which, if you remember was the globalComponents object. This way the components we need can be set as a property in any new component `new route.component(this.state.globalComponents);` in the `renderRoute` method. The initial call is made in the AppController where all component instances are dispatched.

```js
exposeComponents = (components) => {
  this.state.globalComponents = components;
}

 // @/js/controllers/AppController.js 
this.router.exposeComponents({
  footer: this.footer,
  helpPanel: this.helpPanel,
  main: this.main,
  menuPanel: this.menuPanel,
  navbar: this.navbar,
});
```
Finally, the `currentRoute` method is a helper method which lets us retrieve the current route.
```js
currentRoute = () => {
  const path = window.location.pathname;
  return this.routes.find(route => route.path === path);
}
```

## <a id="menuPanel"></a><span style="color:hotpink;">MenuPanel</span> 

The MenuPanel object is responsible for rendering the menu panel. By opening the menu panel (clicking the menuIcon) the user can select other parts or views of the application. By clicking one the menu items, the new route gets triggered and the new view gets rendered inside the `<main></main>` section.    

Furthermore, the menu panel sets the help object in the help panel and renders the breadcrumb title in the NavBar component, which renders the navigation-bar in the top of the application.    

In the constructor of the component class the elementGroup & the appController instance are passed in as a property. This happens in the AppController class. Both objects are destructured for readability purposes.
```js
constructor(elementGroup, appController) {
  // Destructure the elementGroup object
  ({ menuPanel: this.menuPanel, menuButton: this.menuButton, menuItems: this.menuItems } = elementGroup);
  // Destructure the appController object
  ({ router: this.router, helpPanel: this.helpPanel, navbar: this.navbar } = appController);

// @/js/controllers/AppController.js is where the menuPanel instance is being created.
this.menuPanel = new MenuPanel(menuPanel, this); // this refers to the appcontroller itself.
```
Then the event listeners are added to both the menuIcon button, for opening and closing the menu, and to all menu items which will be used to navigate to other routes.
```js
this.menuButton.addEventListener('click', () => this.toggleMenu());
this.menuItems.forEach(menuItem => {
  menuItem.addEventListener('click', (e) => this.handleMenuItemClick(e));
});
```
Then, the state object of the menuPanel is created inside the constructor and populated with initial values. Finally, the `setActiveItem` method is called to update the UI and set the menu item which relates to the current path to active. 
```js
this.state = {
  icon: 'menu',
  panelState: 'closed',
  activeItem: null,
  breadcrumb: null,
  helpContent: {},
  initialRoute: window.location.pathname,
  nextRoute: null,
};

this.setActiveItem(this.state.initialRoute);
```
The methods `resetActiveMenuItems` & `setActiveItem` are both in charge of dealing with the menu interface. They handle respectively the removing or adding of the active state of the menu item when clicked by a user. To make an item active it uses the state object and then updates the UI using the `updateUI` method.
```js
resetActiveMenuItems() {
  this.menuItems.forEach(item => item.classList.remove('active'));
}

setActiveItem = (route) => {
  this.resetActiveMenuItems();
  this.menuItems.forEach(item => {
    if (item.getAttribute('data-path') === route) {
      this.state = {
        ...this.state,
        activeItem: item,
        breadcrumb: item.textContent,
        helpContent: this.router.getRouteHelp(item.textContent),
      };
      this.updateUI();
    }
  });
};
```
The `updateUI` method adds the `active` class to the active menu item, it sets the helpState, more about the `helpPanel` in a little bit, and finally it sets the breadcrumb state object.
```js
updateUI = () => {
  this.state.activeItem.classList.add('active');
  this.helpPanel.setHelpState(this.state.helpContent);
  this.navbar.setBreadcrumb(this.state.breadcrumb);
};
```
the `toggleMenu` method takes care of opening or closing the menu panel. It prevents the user from scrolling the page when the menu panel is open, sets the state of the menu panel: changes the icon and sets the `panelState` flag. Then it toggles the `open` class, adds it or removes it, updates the position of the menu icon by adding or removing the `slide-left` class and finally changes sets the icon depending on the `panelState` flag.
```js
toggleMenu = () => {
  // prevent scrolling when the menu is open
  document.body.classList.toggle('no-scroll');

  this.state = {
    ...this.state,
    icon: this.state.icon === 'menu' ? 'close' : 'menu',
    panelState: this.state.panelState === 'closed' ? 'open' : 'closed'
  };
  this.menuPanel.classList.toggle('open');
  this.menuButton.classList.toggle('slide-left');
  this.menuButton.firstElementChild.textContent = this.state.icon;
};
```
The last but most important method in the MenuPanel object is the `handleMenuItemClick` method. It takes care of all route related logics. It starts by checking if the user accidentally re-clicks the current active menu-item, and, if so,does nothing. This check is built in to prevent any reloading of allready present data and interface states.  
```js
handleMenuItemClick = (e) => {
  if (this.state.activeItem === e.target) {
    return;
  }
```
The method then resets the active menu item, sets the new state
```js
  this.resetActiveMenuItems();
  this.state = {
    ...this.state,
    activeItem: e.target,
    breadcrumb: e.target.textContent,
    helpContent: this.router.getRouteHelp(e.target.textContent),
    nextRoute: this.router.getNextRoute(e.target.textContent),
  };
```
Uses the router object to navigate to the next route and then updates the UI: changes the breadcrumb, the active menu-item and the helpPanel text.
```js
  this.router.navigateTo(this.state.nextRoute);
  this.updateUI();
};
```
That's it for the MenuPanel object.

## <a id="helpPanel"></a><span style="color:hotpink;">HelpPanel</span>

The HelpPanel object is responsible for rendering the help panel which you find by clicking on the help icon button on the right side of the application. This panel is used to provide the user with help if needed. The help information is route-specific and, as you remember from the menu panel functionality, gets initiated when navigating to another route.  

In the constructor of this class object the `elementGroup` object gets destructured, the `state` object is populated and an event listener is added to the `helpButtonlisten` component to listen for clicks.
```js
constructor(elementGroup) {
    ({
      helpPanel: this.helpPanel, helpButton: this.helpButton,
      helpHeading: this.helpHeading, helpSubtitle: this.helpSubtitle,
      helpBody: this.helpBody
    } = elementGroup);

    // Initialize state
    this.state = {
      help: {
        helpHeading: this.helpHeading.textContent,
        helpSubtitle: this.helpSubtitle.textContent,
        helpBody: this.helpBody.textContent,
      },
      icon: 'question_mark',
      panelState: 'closed'
    };

    // Add event listener on help-button
    this.helpButton.addEventListener('click', this.toggleMenu);
  }
```
The `setHelpState` method takes care of setting the new state, which means, any new data that populates the help heading, subtitle and bodytext. If you remember, this is done in the MenuPanel when the user clicks a menu-item and navigates to another route. The method takes a destructured object as argument, for readability and expectational purposes. Knowing what to expect helps understanding the code and debugging potential errors.
```js
setHelpState = ({ helpHeading, helpSubtitle, helpBody }) => {
  this.state.help = { helpHeading, helpSubtitle, helpBody };

  this.helpHeading.textContent = helpHeading;
  this.helpSubtitle.textContent = helpSubtitle;
  this.helpBody.textContent = helpBody;
};
```
The `setState` method is a helper method which can be called throughout the HelpPanel object to set a new state. For instance, it is used in the `toggleMenu` method to set the state of the icon and the panel open/closed flag.
```js
setState = (newState) => {
  this.state = newState;
};
```
The `toggleMenu` method takes care of opening or closing of the panel, preventing the user to scroll the body when the help panel is open, as mentioned before: sets the state of the icon and panelstate flag and then updates the DOM to reflect the new state.
```js
toggleMenu = () => {
  // prevent scrolling when the help panel is open
  document.body.classList.toggle('no-scroll');

  this.setState({
    icon: this.state.icon === 'question_mark' ? 'close' : 'question_mark',
    panelState: this.state.panelState === 'closed' ? 'open' : 'closed',
  });

  // Update the DOM elements to reflect the new state
  this.helpButton.firstElementChild.textContent = this.state.icon;
  this.helpPanel.classList.toggle('open', this.state.panelState === 'open');
  this.helpButton.classList.toggle('slide-right', this.state.panelState === 'open');

};
```
That is all there is to it.


## <a id="navbar"></a><span style="color:hotpink;">Navbar</span> 

The Navbar class is responsible for rendering and keeping track of the state of the navbar. In the constructor of the object the elementGroup object and config object [passed in by the AppController #21]. The elementGroup object then gets destructured, the flipswitch (theme toggling element) gets an event listener, the state gets prpeared and populated with the theme from the config object. Then the initial theme, configured at app.js #9, gets initiated.
```js
export class Navbar {
  constructor(elementGroup, config) {
    // Destructure the elementGroup object
    ({ breadcrumb: this.breadcrumb = '', flipswitch: this.flipswitch, tsInput: this.tsInput } = elementGroup);
    // add event listeners
    this.flipswitch.addEventListener('click', this.handleThemeChange);
    // Initialize state
    this.state = {
      inputChecked: config.theme === 'light' ? true : false,
      theme: config.theme,
      breadcrumb: 'home',
    };

    // Set the initial theme
    this.tsInput.checked = this.state.theme === 'light';
    document.body.classList.toggle('light-theme', this.state.theme === 'light');
    // console.log(this.state.theme === 'light');
  }
```
The `setState` method, as seen before, takes care of setting the new state.
```js
  setState = (newState) => {
    this.state = newState;
  };
```
The `handleThemeChange` method takes care of switching the theme of the application when the user clicks the toggle switch (flipswitch). It does so by simply adding or removing a class called `light-theme` to the body.
```js
  handleThemeChange = () => {
    this.setState({
      theme: this.state.inputChecked ? 'light' : 'dark',
      inputChecked: !this.state.inputChecked,
    });
    this.tsInput.checked = this.state.inputChecked;
    document.body.classList.toggle('light-theme', this.state.inputChecked);
  };
```
By adding a `light-theme` class to the body we can then set alternative variables to parts of the UI, as shown in `app.css`. This means that when the body gets appended the class `light-theme`, the root variables, for example `--default-text-color`, get changed and reflect on the esthetics of the UI. 
```css
/* default-theme (dark) */
:root {
  --default-text-color: rgba(255, 255, 255, 0.87);
  /* etc. */
}

body {
  /* other styles */
  color: var(--default-text-color); 
  /* other styles */
}

.light-theme {
  --default-text-color: rgba(51, 51, 51, 0.87);
  /* etc. */
}
```
Finally, the `setBreadCrumb` method takes care of changing the bradcrumb text.
```js
  setBreadcrumb = (viewName) => {
    this.setState({ breadcrumb: viewName });
    this.breadcrumb.textContent = this.state.breadcrumb;
  };
}
```

## <a id="main"></a><span style="color:hotpink;">Main</span> 

The `Main` object might be the most simple of all components. It takes care of rendering and clearing out the main content of a "page". It has two methods: `clear`, which clear out any previously appended elements, and a `render` method, which can be called to render content to the main component. An example of this can be found at ContactView.js #68. That is all for the `Main` component.
```js
export class Main {
  constructor(elementGroup) {
    ({ main: this.main } = elementGroup);
  }

  clear = () => {
    this.main.innerHTML = '';
  };

  render = (content) => {
    this.main.appendChild(content);
  };

}
```
## <a id="footer"></a><span style="color:hotpink;">Footer</span>

The `Footer` object manages the state and behavior of the footer element. It has properties for the footer and action bar elements, and a state object that tracks whether the action bar is present, its CSS class, and its content.  

`constructor(elementGroup)`: Initializes the Footer object with the footer and action bar elements, and sets the initial state.
```js
export class Footer {
  constructor(elementGroup) {
    ({ footer: this.footer, actionBar: this.actionBar } = elementGroup);

    // state
    this.state = {
      hasActionBar: false,
      actionBarClass: null,
      actionBarContent: null,
    };

  }
```
`setState(newState)`: Updates the state of the Footer object.
```js
setState = (newState) => {
  this.state = newState;
};
```
`updateUI()`: Updates the UI based on the current state. It clears the action bar, removes any CSS classes from the action bar that aren't 'action-bar', and if the state indicates that the action bar should be present, it adds the 'open' class, any specified CSS class, and any specified content to the action bar.
```js
updateUI = () => {
  // clear out the footer
  this.actionBar.innerHTML = '';

  // Remove any class from actionBar.classList except 'action-bar'
  for (let i = this.actionBar.classList.length - 1; i >= 0; i--) {
    const className = this.actionBar.classList[i];
    if (className !== 'action-bar') {
      this.actionBar.classList.remove(className);
    }
  }

  this.state.hasActionBar && this.actionBar.classList.add('open');
  this.state.actionBarClass && this.actionBar.classList.add(this.state.actionBarClass);
  this.state.actionBarContent && this.actionBar.appendChild(this.state.actionBarContent);
};
```
`mount(newState)`: Sets the state and then updates the UI after a delay of 300 milliseconds.
```js
mount = (newState) => {
  this.state = newState;
  setTimeout(() => {
    this.updateUI();
  }, 300);
};
```
`unmount()`: Resets the state to indicate that the action bar is not present, and then updates the UI.
```js
unmount = () => {
  this.setState({
    hasActionBar: false,
    actionBarClass: null,
    actionBarContent: null,
  });
  this.updateUI();
};
```

## <a id="homeView"></a><span style="color:hotpink;">Pages: HomeView</span> 

With all global components in place, we now can focus on the actual content of our application. We move on to the `Pages`, which basically are views rendered into the `<main></main>` element of our application. Let's start with the initial route: `Home`.

The `HomeView` object manages the rendering of the home page view.

`constructor(globalComponents)`: Initializes the HomeView object with global components, which include the main content area and the footer. It also sets the footer class to 'home' and stores the original template of the home page.

```js
constructor(globalComponents) {
  ({ footer: this.footer, main: this.main } = globalComponents);
  this.parent = this.main.main; // the element itself is an object
  this.footerParent = this.footer.footer;
  this.footerClass = 'home';
  this.originalTemplate = homeTemplate;
  this.render();
}
```
`render()`: This method is responsible for rendering the home page. It resets the footer state, re-renders the main content area with the original home page template, creates a new footer content object, and then changes the footer state to include the new footer content. The footer content is created using the Elements object which will be explained in a little bit.
```js
render = () => {
  // reset footer state
  this.footer.unmount();

  // rerender original parent content
  this.parent.innerHTML = this.originalTemplate.innerHTML;

  // create footer content object    
  const footerContent = Create.Elements.DIV(null, 'footer-content', null, `&copy; 2024 ${import.meta.env.VITE_APP_NAME}.`)

  // change footer state
  this.footer.mount({
    hasActionBar: true,
    actionBarClass: this.footerClass,
    actionBarContent: footerContent,
  });
};
```
`unmount()`: This method is currently empty, but could be used to reset the state of the HomeView object and clean up any resources when the home view is no longer needed. It might be called when the user navigates away from the home page.

## <a id="elements"></a><span style="color:hotpink;">Utility: Elements</span>

The Elements object is a utility module. It serves as a very basic lightweight framework   
for creating HTML elements. This object is an example of an [Object Literal](#objectLiteral) type     
of decalartion andcontains a collection of methods for creating different types of     
HTML elements. Each method is responsible for creating a specific type of element (like a div,     
icon, img, etc.), setting its properties, and appending it to a parent element if one is provided. 
```js
export const Elements = {
  DIV: (parent, cssClass, cssText, innerHTML, onClick, id) => 
        Elements.createElement("div", parent, cssClass, cssText, innerHTML, onClick, id),
  // All methods use the createElement method
  createElement: (elementType, parent, cssClass, cssText, innerHTML, onClick, id, name) => {
    let element = document.createElement(elementType);
    cssClass && (element.className = cssClass);
    cssText && (element.style.cssText = cssText);
    innerHTML && (element.innerHTML = innerHTML);
    onClick && element.addEventListener("click", onClick);
    id && (element.id = id);
    name && (element.name = name);
    parent && parent.appendChild(element);
    return element;
  },
```

These methods are meant to simplify the creation of HTML elements, e.g.
```js
// example
const element = document.createElement('div');
element.className = 'your-classname';
element.addEventListener('click', () => {
  // your function
})
element.style.cssText = 'whatever inline style';
element.innerHTML = 'whatever content';
element.id = 'yourId';
// etc. 
document.body.appendChild(element);
```
We now can simply import the Elements module and create it more elegantly and shorter.
```js
import * as Create from 'path/to/dom-elements.js';

const myElement = Create.Elements.DIV(document.body, 'your-classname', 'whatever inline style', null, yourFunction);
```

## <a id="aboutView"></a><span style="color:hotpink;">Pages: AboutView</span>

The `AboutView` object manages the rendering of the about page view in a web application.
In the script we import the Elements object and a component called `SlidePuzzle` which I created for example purposes. We will dive into that a little later. 

`constructor(globalComponents)`: Initializes the AboutView object with global components, which include the main content area and the footer. It also sets the footer class to 'about', and calls the render method to render the about page.

```js
constructor(globalComponents) {
  ({ footer: this.footer, main: this.main } = globalComponents);
  this.parent = this.main.main; // the element itself is an object
  this.footerParent = this.footer.footer;
  this.footerClass = 'about';
  this.cards = [];
  this.render();
}
```
`render()`: This method is responsible for rendering the about page. It clears the main content area, unmounts the footer, creates a new 'about-view' div, creates a new instance of SlidePuzzle with the 'about-view' div as the parent, creates a new footer content object with the text 'Play the slide puzzle.', and then changes the footer state to show the action bar with the new footer content.
```js
render = () => {
  // clear parent element
  this.main.clear();

  // change footer state
  this.footer.unmount();

  this.mainElement = Create.Elements.DIV(this.parent, 'about-view');

  // create slide puzzle
  new SlidePuzzle(this.mainElement, 3);

  // create footer content object
  const footerContent = Create.Elements.DIV(null, 'footer-content', null, 'Play the slide puzzle.');
  
  // change footer state (show action bar with button)
  this.footer.mount({
    hasActionBar: true,
    actionBarClass: this.footerClass,
    actionBarContent: footerContent,
  });
};
```
`unmount():` currently empty (like HomeView.unmount()), would be used to reset the state of the AboutView object and clean up any resources when the about view is no longer needed. 

## <a id="slidePuzzle"></a><span style="color:hotpink;">Pagespecific: SlidePuzzle</span> 

As you can see by navigating to `js/pages/about`, another folder called components can be found. I do it like this so I can have page specific components organized at where I need them. Rule of thumb for me is: is a component used globally (in multiple places) it should be placed under the `js/components` folder, is it only used in a specific page or view: it gets stored there.

__What?:__ I have created this slidepuzzle for fun. Because my son asked me to make his analog slidepuzzle digital, together we thought about what makes for a slidepuzzle. Our joined thoughts, our take on the matter is what this component does. If it is the best or easyest approach? I leave that up to you to decide. 

The `SlidePuzzle` object manages the state and behavior of a slide puzzle game. `constructor(parentEl, size)`: Initializes the SlidePuzzle object with the parent element and the size of the puzzle. It also sets several properties related to the puzzle's state, such as the number of pieces, the size of each piece, the index of the selected piece, and whether the puzzle has been shuffled. It then calculates the width and height of the puzzle and calls the render method to render the puzzle.

```js
constructor(parentEl, size) {
  Object.assign(this, {
    parentEl, size, pieceSize: 75, shuffleCount: 100,
    numberOfPieces: size ** 2, highlighted: size ** 2, shuffled: false, selectedPieceIndex: '',
    selectedPiece: null
  });
  this.width = this.size * this.pieceSize + this.size * 2 + 'px';
  this.height = this.size * this.pieceSize + this.size * 2 + 'px';
  this.render();
}
```
`render()`: This method is responsible for rendering the puzzle. It clears the parent element, creates a new wrapper div, and then creates the puzzle pieces. Each piece is a div with a click event handler that calls the swap method. The last piece is marked as the selected piece. After all the pieces are created, it calls the shuffle method to shuffle the pieces.
```js
render() {
  this.parentEl.innerHTML = '';
  const wrapper = Create.Elements.DIV(this.parentEl, null, `width:${this.width}; height:${this.height}`);

  Array.from({ length: this.numberOfPieces }, (_, i) => {
    const piece = Create.Elements.DIV(wrapper, 'piece', `width:${this.pieceSize}px; height:${this.pieceSize}px; line-height:${this.pieceSize}px`, i + 1, () => this.swap(i + 1));
    piece.dataset.index = i + 1;
    if (i + 1 === this.numberOfPieces) {
      this.selectedPieceIndex = piece.dataset.index;
      this.selectedPiece = piece;
      piece.classList.add('selected');
    }
  });

  this.shuffle();
}
```
`shuffle()`: This method shuffles the pieces of the puzzle. It randomly selects a direction for each piece and then calls the swap method to swap the piece with the piece in the selected direction.
```js
shuffle() {
  this.shuffleCount += Math.floor(Math.random() * (200 - this.shuffleCount) + this.shuffleCount);
  Array.from({ length: this.shuffleCount }, () => {
    const direction = [this.highlighted + 1, this.highlighted - 1, this.highlighted + this.size, this.highlighted - this.size][Math.floor(Math.random() * 4)];
    this.swap(direction);
  });
  this.shuffled = true;
}
```
`swap(clicked)`: This method swaps the clicked piece with the selected piece if the clicked piece is adjacent to the selected piece. After the swap, it checks if the puzzle is solved. If the puzzle is solved, it creates a new Confetti object and starts the confetti animation.
```js
swap(clicked) {
  if (clicked < 1 || clicked > this.numberOfPieces) return;

  if (clicked === this.highlighted + 1 && clicked % this.size !== 1) {
    this.setSelected(clicked);
  } else if (clicked === this.highlighted - 1 && clicked % this.size !== 0) {
    this.setSelected(clicked);
  } else if (clicked === this.highlighted + this.size || clicked === this.highlighted - this.size) {
    this.setSelected(clicked);
  }
  // check if the puzzle is solved after the swap
  if (this.shuffled && this.checkHasWon()) {
    const confetti = new Confetti();
    confetti.startConfetti();
    setTimeout(() => confetti.stopConfetti(), 3000);
  }
}
```
`checkHasWon()`: This method checks if the puzzle is solved. It does this by checking if the index of each piece matches its number.
```js
checkHasWon() {
  return Array.from({ length: this.numberOfPieces }, (_, i) => {
    const tile = document.querySelector(`[data-index~="${i + 1}"]`);
    return parseInt(tile.dataset.index) === parseInt(tile.innerHTML);
  }).every(Boolean);
}
```
`setSelected(index)`: This method sets the selected piece. It swaps the numbers of the current selected piece and the piece at the given index, and then updates the highlighted property to the given index.
```js
setSelected(index) {
  const currentTile = document.querySelector(`[data-index~="${this.highlighted}"]`);
  const newTile = document.querySelector(`[data-index~="${index}"]`);
  [currentTile.innerHTML, newTile.innerHTML] = [newTile.innerHTML, currentTile.innerHTML];
  currentTile.classList.toggle('selected');
  newTile.classList.toggle('selected');
  this.highlighted = index;
}
```

## <a id="confetti"></a><span style="color:hotpink;">Pagespecific: Confetti</span>
The `Confetti` object manages the creation, animation, and behavior of a confetti effect. `constructor()`: Initializes the Confetti object with properties like maximum particle count, particle speed, colors, dimensions, and others. It also binds the runAnimation method to the current instance and calls the render method.

```js
constructor() {
  Object.assign(this, {
    maxParticleCount: 150,
    particleSpeed: 2,
    colors: confettiColors,
    width: window.innerWidth,
    height: window.innerHeight,
    streamingConfetti: false,
    animationTimer: null,
    particles: [],
    waveAngle: 0,
    runAnimation: this.runAnimation.bind(this)
  });
  this.render();
}
```
`render()`: Creates a canvas element, attaches a resize event listener to the window, gets the 2D rendering context for the canvas, and generates the initial set of particles.
```js

render() {
  this.canvas = Create.Elements.CANVAS(document.body, 'confetti-canvas', this.width, this.height);
  window.addEventListener("resize", () => this.handleResize(), true);
  this.context = this.canvas.getContext("2d");
  this.generateParticles();
}
```
`generateParticles()`: Creates new particles until the maximum particle count is reached.
```js
generateParticles() {
  while (this.particles.length < this.maxParticleCount) {
    this.particles.push(this.resetParticle({}, this.width, this.height));
  }
}
```
`resetParticle(particle, width, height)`: Resets the properties of a particle, such as color, position, diameter, tilt, and tilt angle increment.
```js
resetParticle(particle, width, height) {
  particle.color = this.colors[(Math.random() * this.colors.length) | 0];
  particle.x = Math.random() * width;
  particle.y = Math.random() * height - height;
  particle.diameter = Math.random() * 10 + 5;
  particle.tilt = Math.random() * 10 - 10;
  particle.tiltAngleIncrement = Math.random() * 0.07 + 0.05;
  particle.tiltAngle = 0;
  return particle;
}
```
`handleResize()`: Updates the dimensions of the canvas when the window is resized.
```js
handleResize() {
  this.width = window.innerWidth;
  this.height = window.innerHeight;
  this.canvas.width = this.width;
  this.canvas.height = this.height;
}
```
`startConfetti()`: Starts the confetti animation. It sets up the request animation frame method, generates particles, sets the streaming confetti flag to true, and starts the animation timer.
```js
startConfetti() {
  this.width = window.innerWidth;
  this.height = window.innerHeight;

  window.requestAnimFrame = (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
      return window.setTimeout(callback, 16.6666667);
    }
  );

  if (this.canvas === null) {
    this.render();
  }

  this.generateParticles();
  this.streamingConfetti = true;

  if (this.animationTimer === null) {
    this.animationTimer = window.requestAnimFrame(this.runAnimation);
  }
}
```
`stopConfetti()`: Stops the confetti animation by setting the streaming confetti flag to false.
```js
stopConfetti() {
  this.streamingConfetti = false;
}
```
`removeConfetti()`: Stops the confetti and removes all particles.
```js
removeConfett() {
  this.stopConfetti();
  this.particles = [];
}
```
`toggleConfetti()`: Toggles the confetti animation on and off.
```js
toggleConfetti() {
  if (this.streamingConfetti) {
    this.stopConfetti();
  } else {
    this.startConfetti();
  }
}
```
`drawParticles(context)`: Draws the particles on the canvas.
```js
drawParticles(context) {
  this.particles.forEach(({ diameter, color, x, tilt, y }) => {
    context.beginPath();
    context.lineWidth = diameter;
    context.strokeStyle = color;
    context.moveTo(x + tilt + diameter / 2, y);
    context.lineTo(x + tilt, y + tilt + diameter / 2);
    context.stroke();
  });
}
```
`updateParticles()`: Updates the position and tilt of each particle, and removes particles that have moved off the canvas.
```js
updateParticles() {
  this.waveAngle += 0.01;
  this.particles = this.particles.filter((particle, i) => {
    if (!this.streamingConfetti && particle.y < -15) particle.y = this.height + 100;
    else {
      particle.tiltAngle += particle.tiltAngleIncrement;
      particle.x += Math.sin(this.waveAngle);
      particle.y += (Math.cos(this.waveAngle) + particle.diameter + this.particleSpeed) * 0.5;
      particle.tilt = Math.sin(particle.tiltAngle) * 15;
    }
    if (particle.x > this.width + 20 || particle.x < -20 || particle.y > this.height) {
      if (this.streamingConfetti && this.particles.length <= this.maxParticleCount) this.resetParticle(particle, this.width, this.height);
      else return false;
    }
    return true;
  });
}
```
`runAnimation()`: Clears the canvas, updates the particles, draws the particles, and requests the next animation frame. More about `requestAnimationFrame`: https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
```js
runAnimation() {
  this.context.clearRect(0, 0, this.width, this.height);
  if (this.particles.length) {
    this.updateParticles();
    this.drawParticles(this.context);
    this.animationTimer = requestAnimationFrame(() => this.runAnimation());
  } else {
    this.animationTimer = null;
  }
}
```
## <a id="contactView"></a><span style="color:hotpink;">Pages: ContactView</span> 

The `ContactView` object manages the rendering of a very minimal contact form view example. `constructor(globalComponents)`: Initializes the ContactView object with global components, which include the main content area and the footer. It also sets the footer class to 'contact', and initializes the state with a yourName property set to null.
```js
constructor(globalComponents) {
  ({ footer: this.footer, main: this.main } = globalComponents);
  this.parent = this.main.main; // the element itself is an object
  this.footerParent = this.footer.footer;
  this.footerClass = 'contact';
  this.userStore = UserStore;

  // state
  this.state = {
    yourName: null,
  };

  this.render();
}
```
`setState(newState)`: Updates the state of the ContactView object by merging the current state with the new state.
```js
setState = (newState) => {
  this.state = { ...this.state, ...newState };
};
```
`render()`: This method is responsible for rendering the contact form or the user's name, depending on whether the user's name is stored in userStore. It also updates the footer with a message about using the form to store the user's name.
```js
render = () => {

  // clear parent element
  this.main.clear();
  this.footer.unmount();

  this.userStore.userName && this.renderName();
  !this.userStore.userName && this.renderForm();
  
  const footerContent = Create.Elements.DIV(null, 'footer-content', null, 'Use the form to store your name.');

  this.footer.mount({
    hasActionBar: true,
    actionBarClass: this.footerClass,
    actionBarContent: footerContent,
  });
};
```
`renderForm()`: This method creates and renders a form that asks for the user's name. When the user types in the input field, a button is created that, when clicked, stores the user's name in userStore and re-renders the view to display the user's name.
```js
renderForm = () => {
  this.wrapper = Create.Elements.DIV(null, 'contact-view');
  // create heading 
  this.heading = Create.Elements.Heading(this.wrapper, 3, null, 'margin:0; padding:0; font-family: var( --Inter-font); font-weight:100;', 'State your name', null, 'contact-heading');
  // create contact form
  this.input = Create.Elements.createInput(
    this.wrapper,
    'text',
    null,
    null,
    'Your name',
    this.state.inputValue,
    null,
    () => {
      let buttonExists = Array.from(this.wrapper.children).some(child => child.className === 'default-btn');
      if(!buttonExists) {
        Create.Elements.Button(this.wrapper, 'store your name', () => {
          this.userStore.userName = this.input.value;
          this.setState({ yourName: this.input.value });
          this.renderName();
        }, false, 'default-btn');
      }
    },
  );

  // create contact view
  this.main.render(this.wrapper);
}
```
`renderName()`: This method clears the parent element and renders the user's name.

```js
renderName = () => {
  this.parent.innerHTML = '';
  this.wrapper = Create.Elements.DIV(this.parent, 'contact-view');
  this.heading = Create.Elements.Heading(this.wrapper, 3, null, null, this.userStore.userName, null, 'contact-heading');
};
```
`unmount()`: This method is called when the ContactView is no longer needed. If the state's yourName property is not null, it updates the userName property in userStore to indicate that the name was changed when the ContactView was unmounted. This example of `unmount()` shows what possibilities you have when navigating away from this view. You could: save the userName in a database, or some other data handling related to forms. 
```js
unmount = () => {
  // maybe do something with the state
  this.state.yourName && 
  (this.userStore.userName = `changed <span style="color:dodgerblue">${this.state.yourName}</span> on unmounting Contact`);
};
```

## <a id="store"></a><span style="color:hotpink;">Stores: UserStore</span>

The `UserStore` object manages the state of a user in the application. `constructor()`: Initializes the UserStore object with a state object that has a userName property set to null.

```js
class UserStore {
  constructor() {
    this.state = {
      userName: null,
    };
  }
```
`get userName()`: This getter method returns the current userName from the state.
```js
  get userName() {
    return this.state.userName;
  }
```
`set userName(userName)`: This setter method updates the userName in the state.
```js
  set userName(userName) {
    this.state.userName = userName;
  }
```
`getSettings()`: This method returns the entire state object, which currently only includes the userName.
```js
  getSettings() {
    return this.state;
  }
}
```
At the end of the file, an instance of `UserStore` is created and exported. This means that the same `UserStore` instance can be imported and used across different parts of the application, making it a __singleton__. This is a common pattern for managing __global state__ in a JavaScript application.
```js
export default new UserStore();
```
This instance of the UserStore class can be imported like shown in `ContactView`:
```js
import UserStore from '@/js/stores/UserStore.js';
```
## <a id="notFound"></a><span style="color:hotpink;">Pages: NotFoundView</span> 

The `NotFound` object manages the rendering of a "404 - Page Not Found" message. It gets fired when a user navigates (manually in the address bar) or when (uncarefully) a route is no longer available. `constructor()`: Initializes the NotFound object by selecting the main HTML element as the parent element and then calling the render method.
```js
constructor() {
    this.parentElement = document.querySelector('main');
    this.render();
  }
```
`render()`: This method is responsible for rendering the "404 - Page Not Found" message. It first clears the parent element, then creates a new div with the class 'not-found' and the text '404 - Page does not, or no longer, exist.'.
```js
  render = () => {
    this.parentElement.innerHTML = '';
    this.mainElement = Create.Elements.DIV(this.parentElement, 'not-found', null, '404 - Page does not, or no longer, exist.');
  }
```
This component does not need an `unmount` method since it will automatically reload the application with which any state will be destroyed.

## <a id="vite"></a><span style="color:hotpink;">vite.config.js</span> 

`vite.config.js` is a configuration file for Vite. It exports a configuration object that Vite uses to customize its behavior. `server`: This object configures the development server. The port property sets the port on which the server listens to 2727. `preview`: This object configures the preview server. The port property sets the port on which the preview server listens to 8080. `build`: This object configures the build process. The outDir property sets the output directory for the build files to "production". `resolve`: This object configures how module imports are resolved. The alias property allows you to create shortcuts for import paths. In this case, "@" is set as an alias for the project root directory. This means you can import files relative to the project root by starting the import path with "@". The `defineConfig` function is used to define the configuration. It provides better type checking and autocompletion in editors that support TypeScript.

```js
import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  server: {
    port: 2727,
  },
  preview: {
    port: 8080,
  },
  build: {
    outDir: "production",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
});
```

## <a id="jsconfig"></a><span style="color:hotpink;">jsconfig.json</span> 

`jsconfig.json` is a file which is used in JavaScript projects to provide information to the code editor for features like autocompletion (Intellisense), type checking, and path aliasing. `compilerOptions`: This object provides options for the compiler. `baseUrl`: This is set to ".", which means the base directory for resolving non-relative module names is the same directory as the jsconfig.json file. `paths`: This object is used to map module names to file locations. The "@/" key maps to the "./" path, meaning any module name that starts with "@" will be resolved relative to the base URL. `exclude`: This array specifies folders that should be excluded from the compiler's files. In this case, the "node_modules" folder is excluded, which is common because it typically contains third-party code.

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "exclude": ["node_modules"]
}

```

  
---


__That raps it up.__ A lot to think about, play around with, break, fix, build upon, never use again. My intention was to provide you with a detailed example application which shows many general concepts in frontend programming and could be a nice step towards exploring any javascript framework. 

Good Luck & Happy Coding ✌🏼

## Do It Yourself

- create another route: Work. What steps do you need to take?
- refactor & improve the vulnerable routing logics mentioned earlyer. 
- How to go about data persistence? 

### Footnotes

<a id="private">1: </a>The underscore _ prefix in _groups is a common convention in JavaScript (and other languages) to indicate that a property or method is intended to be private. A Private property should not be accessed or modified directly from outside the class. Instead, developers should use the public methods provided by the class to interact with it. 

<a id="objectLiteral">2: </a>Object Literal: list of zero or more pairs of property names and associated values of an object, enclosed in curly braces.