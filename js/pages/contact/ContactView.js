import * as Create from '@/js/utils/dom-elements.js';
import UserStore from '@/js/stores/UserStore.js';

export class ContactView {
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

  setState = (newState) => {
    this.state = { ...this.state, ...newState };
  };

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

  renderName = () => {
    this.parent.innerHTML = '';
    this.wrapper = Create.Elements.DIV(this.parent, 'contact-view');
    this.heading = Create.Elements.Heading(this.wrapper, 3, null, null, this.userStore.userName, null, 'contact-heading');
  };

  // reset footer state
  unmount = () => {
    // maybe do something with the state
    this.state.yourName && 
    (this.userStore.userName = `changed <span style="color:dodgerblue">${this.state.yourName}</span> on unmounting Contact`);
  };
}
