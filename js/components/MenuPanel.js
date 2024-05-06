/*
  components/MenuPanel.js
  -----------------------
  MenuPanel class is responsible for rendering the menu panel.
  It has a state that contains the icon, panel state, active item, breadcrumb, 
  help content, and the next route. The state is used to update the DOM elements.
*/

export class MenuPanel {
  constructor(elementGroup, appController) {
    // Destructure the elementGroup object
    ({ menuPanel: this.menuPanel, menuButton: this.menuButton, menuItems: this.menuItems } = elementGroup);
    // Destructure the appController object
    ({ router: this.router, helpPanel: this.helpPanel, navbar: this.navbar } = appController);
    // Add event listeners
    this.menuButton.addEventListener('click', () => this.toggleMenu());
    this.menuItems.forEach(menuItem => {
      menuItem.addEventListener('click', (e) => this.handleMenuItemClick(e));
    });

    // Initialize state
    this.state = {
      icon: 'menu',
      panelState: 'closed',
      activeItem: null,
      breadcrumb: null,
      helpContent: {},
      initialRoute: window.location.pathname,
      nextRoute: null,
    };

    // set the initial active item
    this.setActiveItem(this.state.initialRoute);
  }

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

  updateUI = () => {
    this.state.activeItem.classList.add('active');
    this.helpPanel.setHelpState(this.state.helpContent);
    this.navbar.setBreadcrumb(this.state.breadcrumb);
  };

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

  handleMenuItemClick = (e) => {
    if (this.state.activeItem === e.target) {
      return;
    }

    this.resetActiveMenuItems();
    this.state = {
      ...this.state,
      activeItem: e.target,
      breadcrumb: e.target.textContent,
      helpContent: this.router.getRouteHelp(e.target.textContent),
      nextRoute: this.router.getNextRoute(e.target.textContent),
    };

    this.router.navigateTo(this.state.nextRoute);
    this.updateUI();
  };
}
