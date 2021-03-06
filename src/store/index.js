import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate'
import uuid from 'uuid/v4'

import {
  NEW_USER,
  // DELETE_USER,
  // UPDATE_USER,
  NEW_PASSWORD,
  DELETE_PASSWORD,
  UPDATE_PASSWORD
} from './mutation-types'

Vue.use(Vuex);

// state
const state = {
  charsets: {
    1: {
      id: 1,
      name:'A-Za-z0-9 + special characters',
      chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`~!@#$%^&*()_-+={}|[]\\:\";'<>?,./"
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
  passwords: {
    1: {
      id: 1,
      userId: 1,
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
      userId: 1,
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
      userId: 1,
      accountName: "Stories on Board",
      userName: "guillaume@zesty.com",
      length: 8,
      prefix: "",
      suffix: "",
      counter: 1,
      charsetId: 1
    },
  }
};

// getters
const getters = {
  users: state => Object.keys(state.users).map(key => state.users[key]),
  user: state => id => state.users[id],
  passwords: state => userId => Object.keys(state.passwords).map(key => state.passwords[key]).filter(passwords => passwords.userId === userId),
  password: state => id => state.passwords[id],
  charsets: state => Object.keys(state.charsets).map(key => state.charsets[key]),
  charset: state => id => state.charsets[id]
}

const mutations = {
  [NEW_USER] (state, userId) {
    let newUser = {
      id: userId,
      name: "New user"
    }
    Vue.set(state.users, userId, newUser)
  },
  [UPDATE_PASSWORD] (state, { passwordId, newPassword }) {
    let password = this.getters.password(passwordId)
    Object.assign(password, newPassword)
  },
  [NEW_PASSWORD] (state, { userId, passwordId }) {
    let newPassword = {
      id: passwordId,
      userId: userId,
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
  [NEW_USER] ({commit}) {
    return new Promise((resolve) => {
      let userId = uuid()
      commit(NEW_USER, userId)
      resolve(userId)
    })
  },
  [NEW_PASSWORD] ({ commit }, userId) {
    return new Promise((resolve) => {
      let passwordId = uuid()
      commit(NEW_PASSWORD, { userId, passwordId })
      resolve(passwordId)
    })
  },
  [DELETE_PASSWORD] ({commit}, passwordId) {
    return new Promise((resolve) => {
      commit(DELETE_PASSWORD, passwordId)
      resolve(passwordId)
    })
  },
  [UPDATE_PASSWORD] ({commit}, { passwordId, newPassword }) {
    return new Promise((resolve) => {
      commit(UPDATE_PASSWORD, { passwordId, newPassword })
      resolve(passwordId)
    })
  }
}

const plugins = [
  createPersistedState()
]

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  plugins
});
