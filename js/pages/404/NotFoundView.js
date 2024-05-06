import * as Create from '@/js/utils/dom-elements.js';

export class NotFound {
  constructor() {
    this.parentElement = document.querySelector('main');
    this.render();
  }

  render = () => {
    this.parentElement.innerHTML = '';
    this.mainElement = Create.Elements.DIV(this.parentElement, 'not-found', null, '404 - Page does not, or no longer, exist.');
  }
}