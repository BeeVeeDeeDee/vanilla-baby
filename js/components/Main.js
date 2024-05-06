/*
  components/Main.js
  ------------------
  Main class is responsible for rendering the main content of the application.
*/

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