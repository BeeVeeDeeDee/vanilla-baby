/*
  components/NavBar.js
  --------------------
  The Navbar class is responsible for rendering the navbar.
  it has a state that contains the state of the flipswitch, the theme and the breadcrumb.
*/

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

  setState = (newState) => {
    this.state = newState;
  };

  handleThemeChange = () => {
    this.setState({
      theme: this.state.inputChecked ? 'light' : 'dark',
      inputChecked: !this.state.inputChecked,
    });
    this.tsInput.checked = this.state.inputChecked;
    document.body.classList.toggle('light-theme', this.state.inputChecked);
  };

  setBreadcrumb = (viewName) => {
    this.setState({ breadcrumb: viewName });
    this.breadcrumb.textContent = this.state.breadcrumb;
  };

}
