import * as Create from '@/js/utils/dom-elements.js';
// create a template for the home page
const homeTemplate = document.querySelector('main').cloneNode(true);

export class HomeView {
  constructor(globalComponents) {
    ({ footer: this.footer, main: this.main } = globalComponents);
    this.parent = this.main.main; // the element itself is an object
    this.footerParent = this.footer.footer;
    this.footerClass = 'home';
    this.originalTemplate = homeTemplate;
    this.render();
  }

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

  // reset footer state
  unmount = () => {
    // console.log('unmounting home view');
  }
}


