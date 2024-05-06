class UserStore {
  constructor() {
    this.state = {
      userName: null,
    };
  }

  get userName() {
    return this.state.userName;
  }

  set userName(userName) {
    this.state.userName = userName;
  }

  getSettings() {
    return this.state;
  }

}

// Export an instance of the store
export default new UserStore();