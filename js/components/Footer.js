/*
  components/Footer.js
  --------------------
  Each class (component) is responsible for rendering a specific part of the application.
  Each component has its own state and methods to update the state.
  The state is used to update the DOM elements.
*/

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

  setState = (newState) => {
    this.state = newState;
  };

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

  mount = (newState) => {
    this.state = newState;
    setTimeout(() => {
      this.updateUI();
    }, 300);
  };

  unmount = () => {
    this.setState({
      hasActionBar: false,
      actionBarClass: null,
      actionBarContent: null,
    });
    this.updateUI();
  };
}
