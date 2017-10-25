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
            <md-option v-for="user in users" :value="user.id">{{user.name}}</md-option>
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
        <md-list-item v-for='profile in profiles' @click="selectProfile(profile); closeLeftSidenav()">
          <span>{{profile.name}}</span>

          <md-button class="md-icon-button md-list-action">
            <md-icon class="md-primary">chevron_right</md-icon>
          </md-button>
        </md-list-item>
      </md-list>

      <md-button class="md-raised md-accent" @click="closeLeftSidenav">Close</md-button>
    </md-sidenav>

    <form novalidate @submit.stop.prevent="submit">
      <md-input-container>
        <label>Main Password</label>
        <md-input type="password" v-model="mainPassword"></md-input>
      </md-input-container>
    </form>

    <md-layout md-gutter>
      <md-layout md-flex=33>
        <md-list>
          <md-list-item v-for='password in passwords' class='md-double-line'>
            <div class="md-list-text-container">
              <span>{{password.accountName}}</span>
              <span>{{password.userName}}</span>
            </div>

            <md-button class="md-icon-button md-list-action">
              <md-icon>delete</md-icon>
            </md-button>
          </md-list-item>
        </md-list>
      </md-layout>
    </md-layout>
  </div>
</template>

<script>
export default {
  name: 'Hello',
  data () {
    return {
      title: 'Passwords',
      currentUserId: 1,
      currentProfileId: 1,
      mainPassword: ''
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
    }
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
    currentUser () {
      return this.$store.getters.user(this.currentUserId)
    },
    currentProfile () {
      let profile = this.$store.getters.profile(this.currentProfileId)
      if (profile.userId !== this.currentUserId) {
        profile = this.profiles[0]
      }
      return profile;
    }
  }
}
</script>
