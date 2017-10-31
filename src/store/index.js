import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

// state
const state = {
  users: {
    1: {
      id: 1,
      name: 'Guillaume'
    },
    2: {
      id: 2,
      name: 'Annie'
    },
    3: {
      id: 3,
      name: 'Jules'
    }
  },
  profiles: {
    1: {
      id: 1,
      userId: 1,
      name: 'Boulot'
    },
    2: {
      id: 2,
      userId: 1,
      name: 'Home'
    },
    3: {
      id: 3,
      userId: 2,
      name: 'All'
    },
    4: {
      id: 4,
      userId: 3,
      name: 'Minus'
    }
  },
  passwords: {
    1: {
      id: 1,
      profileId: 1,
      accountName: "Mail",
      userName: "guillaume@zesty.com",
      length: 8,
      prefix: "",
      suffix: "",
      counter: 1
    },
    2: {
      id: 2,
      profileId: 1,
      accountName: "Asana",
      userName: "guillaume@zesty.com",
      length: 8,
      prefix: "",
      suffix: "",
      counter: 1
    },
    3: {
      id: 3,
      profileId: 1,
      accountName: "Stories on Board",
      userName: "guillaume@zesty.com",
      length: 8,
      prefix: "",
      suffix: "",
      counter: 1
    }
  },
};

// getters
const getters = {
  users: state => Object.keys(state.users).map(key => state.users[key]),
  user: state => id => state.users[id],
  profiles: state => user => Object.keys(state.profiles).map(key => state.profiles[key]).filter(profile => profile.userId === user.id),
  profile: state => id => state.profiles[id],
  passwords: state => profile => Object.keys(state.passwords).map(key => state.passwords[key]).filter(passwords => passwords.profileId === profile.id),
  password: state => id => state.passwords[id]
}

export default new Vuex.Store({
  state,
  getters
});
