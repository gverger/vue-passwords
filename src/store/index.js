import Vue from 'vue';
import Vuex from 'vuex';
import { NEW_PASSWORD, DELETE_PASSWORD, UPDATE_PASSWORD } from './mutation-types'

Vue.use(Vuex);

// state
const state = {
  charsets: {
    1: {
      id: 1,
      name:'A-Za-z0-9 + special characters',
      chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`~!@#$%^&*()_-+={}|[]\\:\";\'<>?,./"
    },
    2: {
      id: 2,
      name:'A-Za-z0-9',
      chars:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    },
    3: {
      id: 3,
      name:'0-9a-f',
      chars:"0123456789abcdef"
    },
    4: {
      id: 4,
      name:'A-Za-z',
      chars:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
    },
    5: {
      id: 5,
      name:'0-9',
      chars:"0123456789"
    }
  },
  nextCharsetId: 6,
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
      counter: 1,
      charsetId: 1
    },
    2: {
      id: 2,
      profileId: 1,
      accountName: "Asana",
      userName: "guillaume@zesty.com",
      length: 8,
      prefix: "",
      suffix: "",
      counter: 1,
      charsetId: 1
    },
    3: {
      id: 3,
      profileId: 1,
      accountName: "Stories on Board",
      userName: "guillaume@zesty.com",
      length: 8,
      prefix: "",
      suffix: "",
      counter: 1,
      charsetId: 1
    },
  },
  nextUserId: 3,
  nextProfileId: 5,
  nextPasswordId: 4
};

// getters
const getters = {
  users: state => Object.keys(state.users).map(key => state.users[key]),
  user: state => id => state.users[id],
  profiles: state => user => Object.keys(state.profiles).map(key => state.profiles[key]).filter(profile => profile.userId === user.id),
  profile: state => id => state.profiles[id],
  passwords: state => profile => Object.keys(state.passwords).map(key => state.passwords[key]).filter(passwords => passwords.profileId === profile.id),
  password: state => id => state.passwords[id],
  charsets: state => Object.keys(state.charsets).map(key => state.charsets[key]),
  charset: state => id => state.charsets[id]
}

const mutations = {
  [UPDATE_PASSWORD] (state, { passwordId, newPassword }) {
    let password = this.getters.password(passwordId)
    Object.assign(password, newPassword)
  },
  [NEW_PASSWORD] (state, { profileId, passwordId }) {
    console.log(passwordId)
    let newPassword = {
      id: passwordId,
      profileId: profileId,
      accountName: "",
      userName: "",
      length: 8,
      prefix: "",
      suffix: "",
      counter: 1,
      charsetId: 1
    }
    Vue.set(state.passwords, passwordId, newPassword)
  },
  [DELETE_PASSWORD] (state, passwordId) {
    Vue.delete(state.passwords, passwordId)
  }
}

const actions = {
  [NEW_PASSWORD] ({ commit, state }, profileId) {
    return new Promise((resolve, reject) => {
      let passwordId = state.nextPasswordId
      state.nextPasswordId ++
      commit(NEW_PASSWORD, { profileId, passwordId })
      resolve(passwordId)
    })
  },
  [DELETE_PASSWORD] ({commit}, passwordId) {
    return new Promise((resolve, reject) => {
      commit(DELETE_PASSWORD, passwordId)
      resolve(passwordId)
    })
  },
  [UPDATE_PASSWORD] ({commit}, { passwordId, newPassword }) {
    return new Promise((resolve, reject) => {
      commit(UPDATE_PASSWORD, { passwordId, newPassword })
      resolve(passwordId)
    })
  }
}

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
});
