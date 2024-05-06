/*
  components/HelpPanel.js
  -----------------------
  HelpPanel class is responsible for rendering the help panel.
  It has a state that contains the help object and the panel state.
  The state is used to update the DOM elements.
*/

export class HelpPanel {
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

  // Method to set the help object state
  setHelpState = ({ helpHeading, helpSubtitle, helpBody }) => {
    this.state.help = { helpHeading, helpSubtitle, helpBody };

    this.helpHeading.textContent = helpHeading;
    this.helpSubtitle.textContent = helpSubtitle;
    this.helpBody.textContent = helpBody;
  };

  // method to set state
  setState = (newState) => {
    this.state = newState;
  };

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

  // getState() {
  //   return this.state;
  // }
}
