import * as Create from '@/js/utils/dom-elements.js';
import { SlidePuzzle } from './components/SlidePuzzle';

export class AboutView {
  constructor(globalComponents) {
    ({ footer: this.footer, main: this.main } = globalComponents);
    this.parent = this.main.main; // the element itself is an object
    this.footerParent = this.footer.footer;
    this.footerClass = 'about';
    this.cards = [];
    this.render();
  }

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

  // reset footer state
  unmount = () => {
    // console.log('unmounting about view');
  }
}








