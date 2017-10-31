<template>
  <div class="passwords-viewport">
    <md-toolbar>
      <md-button class="md-icon-button" @click="toggleLeftSidenav">
        <md-icon>menu</md-icon>
      </md-button>

      <h2 class="md-title">{{ title }} - {{ currentUser.name }} - {{ currentProfile.name }}</h2>

      <md-layout md-align='end'>
        {{currentUser.name}}
        <md-layout md-flex="5">
          <md-select name="users" id="users" v-model="currentUserId">
            <md-button class="md-icon-button" md-menu-trigger slot="icon">
              <md-icon>people</md-icon>
            </md-button>
            <md-option v-for="user in users" :key="user.id" :value="user.id">{{user.name}}</md-option>
          </md-select>
        </md-layout>
      </md-layout>
    </md-toolbar>

    <md-sidenav class="md-left" ref="leftSidenav">
      <md-toolbar>
        <div class="md-toolbar-container">
          <h3 class="md-title">Profiles</h3>
        </div>
      </md-toolbar>

      <md-list>
        <md-list-item v-for='profile in profiles' :key="profile.id" @click="selectProfile(profile); closeLeftSidenav()">
          <span>{{profile.name}}</span>

          <md-button class="md-icon-button md-list-action">
            <md-icon class="md-primary">chevron_right</md-icon>
          </md-button>
        </md-list-item>
      </md-list>

      <md-button class="md-raised md-accent" @click="closeLeftSidenav">Close</md-button>
    </md-sidenav>

    <md-layout md-gutter md-flex-offset="10">
      <md-layout md-flex='50'>
        <md-input-container>
          <label v-if="mainPassword.length == 0">Main Password</label>
          <label v-else>Check: {{ checkSum }}</label>
          <md-input type="password" v-model="mainPassword"></md-input>
        </md-input-container>
      </md-layout>
    </md-layout>

    <md-layout md-gutter md-flex-offset="10">
      <md-layout md-flex="40">
        <md-card>
          <md-card-header>
            <md-layout>
              <md-layout md-flex="70">
                <md-input-container>
                  <label>Search</label>
                  <md-input v-model="searchString"></md-input>
                </md-input-container>
              </md-layout>
              <md-layout md-align="end">
                <md-button class="md-icon-button md-raised md-primary">
                  <md-icon>add</md-icon>
                </md-button>
              </md-layout>
            </md-layout>
          </md-card-header>
          <md-card-content>
            <md-list>
              <md-list-item v-for='password in filteredPasswords' :key="password.id" class='md-triple-line'>
                <md-button class="md-icon-button md-list-action">
                  <md-icon>delete</md-icon>
                </md-button>
                <div class="md-list-text-container">
                  <span>{{password.accountName}}</span>
                  <span>{{password.userName}}</span>
                </div>
                <md-button class="md-icon-button md-list-action" v-clipboard="generate(password)">
                  <md-icon>vpn_key</md-icon>
                </md-button>

              </md-list-item>
            </md-list>
          </md-card-content>

        </md-card>
      </md-layout>
    </md-layout>
  </div>
</template>

<script>
import passwordMaker from '@/utils/md5.js'
import fuzzyMatchMixin from '@/utils/fuzzy-match'

export default {
  name: 'Hello',
  mixins: [fuzzyMatchMixin],
  data () {
    return {
      title: 'Passwords',
      currentUserId: 1,
      currentProfileId: 1,
      mainPassword: '',
      searchString: '',
      lastPing: null,
      pingInterval: null,
      detectPing: null
    }
  },
  methods: {
    toggleLeftSidenav() {
      this.$refs.leftSidenav.toggle()
    },
    closeLeftSidenav() {
      this.$refs.leftSidenav.close()
    },
    selectProfile(profile) {
      this.currentProfileId = profile.id
    },
    generate(password) {
      return "PASSWORD"
    },
    detectSleep () {
      const self = this
      const timePeriod = 5000 //10 * 60 * 1000 // 10 minutes
      this.lastPing = (new Date()).getTime()

      this.pingInterval = setInterval(function() {
        self.lastPing = (new Date()).getTime()
      }, timePeriod)

      this.detectPing = setInterval(function() {
        let currentTime = (new Date()).getTime()
        if (currentTime > (self.lastPing + timePeriod * 2)) {
          self.mainPassword = ""
        }
      }, 2000)
    },
  },
  computed: {
    users () {
      return this.$store.getters.users
    },
    profiles() {
      return this.$store.getters.profiles(this.currentUser)
    },
    passwords () {
      return this.$store.getters.passwords(this.currentProfile)
    },
    filteredPasswords () {
      return this.passwords.filter(pwd => this.fuzzyMatch(this.searchString, pwd.accountName))
    },
    currentUser () {
      return this.$store.getters.user(this.currentUserId)
    },
    currentProfile () {
      let profile = this.$store.getters.profile(this.currentProfileId)
      if (profile.userId !== this.currentUserId) {
        profile = this.profiles[0]
      }
      return profile;
    },
    checkSum () {
        let key = this.mainPassword
        let charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        let password = passwordMaker.any_md5(key, charset)
        return password.substr(0,3)
    }
  },
  mounted: function() {
    const self = this
    this.detectSleep()
  },
  beforeDestroy () {
    clearInterval(this.pingInterval)
    clearInterval(this.detectPing)
  },
}
</script>
