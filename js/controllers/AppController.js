import { Footer, HelpPanel, Main, Navbar, MenuPanel } from "@/js/components";
/*
  controllers/AppController.js
  ----------------------------
  AppController class is responsible for initializing the application
  and splitting the application into different components.
  each component is responsible for rendering a specific part of the application.
*/

export class AppController {
  constructor(elements = {}, settings = {}) {
    this.elementGroups = elements.groups;
    const { footer, helpPanel, main, menuPanel, navbar } = this.elementGroups;
    // settings
    const { router, config } = settings;
    this.router = router;
    // Initialize the components
    this.footer = new Footer(footer);
    this.helpPanel = new HelpPanel(helpPanel);
    this.main = new Main(main);
    this.navbar = new Navbar(navbar, config);
    this.menuPanel = new MenuPanel(menuPanel, this);

    // Distribute the global components to the page-specific components
    this.router.exposeComponents({
      footer: this.footer,
      helpPanel: this.helpPanel,
      main: this.main,
      menuPanel: this.menuPanel,
      navbar: this.navbar,
    });

    // close panel by clicking outside it
    document.body.addEventListener('click', (e) => {

      const helpPanelClicked = this.helpPanel.helpPanel.contains(e.target);
      const helpPanelOpen = this.helpPanel.state.panelState === 'open';
      const menuPanelClicked = this.menuPanel.menuPanel.contains(e.target);
      const menuPanelOpen = this.menuPanel.state.panelState === 'open';
      const helpButtonClicked = e.target === this.helpPanel.helpButton || e.target === this.helpPanel.helpButton.firstElementChild;
      const menuButtonClicked = e.target === this.menuPanel.menuButton || e.target === this.menuPanel.menuButton.firstElementChild;
      const menuItemClicked = this.menuPanel.menuItems.some(item => item.contains(e.target));
  
      if (!helpPanelClicked && helpPanelOpen && !menuButtonClicked && !menuItemClicked) {
        this.helpPanel.toggleMenu();
      }
      if (!menuPanelClicked && menuPanelOpen && !helpButtonClicked) {
        this.menuPanel.toggleMenu();
      }
    });

  }
  
}
