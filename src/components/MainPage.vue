<template>
  <div class="passwords-viewport">
    <md-toolbar>
      <h2 class="md-title" style="flex: 1;">
        {{ title }} - {{ currentUser.name }} - {{ currentProfile.name }}
      </h2>

      <md-button class="md-icon-button" @click="addUser">
        <md-icon>add</md-icon>
      </md-button>
      {{currentUser.name}}
      <md-layout md-flex="5">
        <md-select name="users" id="users" v-model="currentUserId">
          <md-button class="md-icon-button" md-menu-trigger slot="icon">
            <md-icon>people</md-icon>
          </md-button>
          <md-option v-for="user in users" :key="user.id" :value="user.id">{{user.name}}</md-option>
        </md-select>
      </md-layout>
    </md-toolbar>

    <md-layout md-gutter md-flex-offset="10" md-column>
      <md-layout md-row>
        <md-layout md-flex='40'>
          <md-input-container>
            <md-icon>vpn_key</md-icon>
            <label>Check: {{ checkSum }}</label>
            <md-input type="password" v-model="mainPassword" placeholder="Main Password"></md-input>
          </md-input-container>
        </md-layout>
      </md-layout>

      <md-layout md-row md-gutter="16">
        <md-layout md-flex='40' md-align="end">
          <md-card>
            <md-card-header>
              <md-layout>
                <md-layout md-flex="70">
                  <md-input-container md-clearable md-inline>
                    <md-icon>search</md-icon>
                    <label>Search</label>
                    <md-input v-model="searchString"></md-input>
                  </md-input-container>
                </md-layout>
                <md-layout md-align="end">
                  <md-button class="md-icon-button md-primary md-raised"
                             @click="addPassword(currentProfile)">
                    <md-icon>add</md-icon>
                  </md-button>
                </md-layout>
              </md-layout>
            </md-card-header>
            <md-card-content>
              <md-list>
                <md-list-item v-if='filteredPasswords.length == 0'>
                  No account matches your search...
                </md-list-item>
                <md-list-item v-for='password in filteredPasswords' :key="password.id" class='md-triple-line' @click="edit(password)">
                  <md-button class="md-icon-button md-list-action" @click="deletePassword(password)">
                    <md-icon>delete</md-icon>
                  </md-button>
                  <div class="md-list-text-container">
                    <span>{{password.accountName}}</span>
                    <span>{{password.userName}}</span>
                  </div>
                  <md-button class="md-icon-button md-list-action" @click="copyGeneratedPassword(password)">
                    <md-icon class="md-primary">content_paste</md-icon>
                  </md-button>
                  <md-button v-if="isCurrentPassword(password)" class="md-icon-button md-list-action">
                    <md-icon class="md-primary">chevron_right</md-icon>
                  </md-button>
                </md-list-item>
              </md-list>
            </md-card-content>
          </md-card>
        </md-layout>
        <md-layout md-flex>
          {{generate(currentPassword)}}
          <password-edit :password='currentPassword' v-if="currentPassword"/>
        </md-layout>
      </md-layout>
    </md-layout>
  </div>
</template>

<script>
import passwordMD5 from '@/utils/md5';
import fuzzyMatchMixin from '@/utils/fuzzy-match';

import PasswordEdit from '@/components/PasswordEdit';
import { NEW_USER, NEW_PASSWORD, DELETE_PASSWORD } from '@/store/mutation-types';

export default {
  name: 'Hello',
  mixins: [fuzzyMatchMixin],
  components: {
    'password-edit': PasswordEdit,
  },
  data() {
    return {
      title: 'Passwords',
      currentUserId: 1,
      currentProfileId: 1,
      currentPasswordId: 1,
      mainPassword: '',
      searchString: '',
      lastPing: null,
      pingInterval: null,
      detectPing: null,
    };
  },
  methods: {
    addUser() {
      this.$store.dispatch(NEW_USER).then((userId) => { this.currentUserId = userId; });
    },
    selectProfile(profile) {
      this.currentProfileId = profile.id;
    },
    edit(password) {
      this.currentPasswordId = password.id;
    },
    addPassword() {
      this.$store.dispatch(NEW_PASSWORD, this.currentProfileId)
        .then((passwordId) => { this.currentPasswordId = passwordId; });
    },
    deletePassword(password) {
      this.$store.dispatch(DELETE_PASSWORD, password.id);
    },
    isCurrentPassword(password) {
      return password.id === this.currentPasswordId;
    },
    charset(id) {
      return this.$store.getters.charset(id).chars;
    },
    copyGeneratedPassword(password) {
      this.$clipboard(this.generate(password));
    },
    generate(password) {
      if (!password) {
        return '';
      }
      let generatedPassword = '';
      let count = 0;
      const data = password.accountName + password.userName + password.counter;
      while (generatedPassword.length < password.length) {
        let key = this.mainPassword + data;
        if (count > 0) {
          key += `\n${count}`;
        }
        generatedPassword += passwordMD5.any_md5(key, this.charset(password.charsetId));
        count += 1;
      }
      if (password.prefix) {
        generatedPassword = password.prefix + generatedPassword;
      }
      if (password.suffix) {
        generatedPassword = generatedPassword
          .substring(0, password.length - password.suffix.length) + password.suffix;
      }
      generatedPassword = generatedPassword.substring(0, password.length);
      return generatedPassword;
    },
    detectSleep() {
      const self = this;
      const timePeriod = 5 * 60 * 1000; // 5 minutes
      this.lastPing = (new Date()).getTime();

      this.pingInterval = setInterval(() => {
        self.lastPing = (new Date()).getTime();
      }, timePeriod);

      this.detectPing = setInterval(() => {
        const currentTime = (new Date()).getTime();
        if (currentTime > (self.lastPing + (timePeriod * 2))) {
          self.mainPassword = '';
        }
      }, 2000);
    },
  },
  computed: {
    users() {
      return this.$store.getters.users;
    },
    profiles() {
      return this.$store.getters.profiles(this.currentUser);
    },
    passwords() {
      return this.$store.getters.passwords(this.currentProfile);
    },
    filteredPasswords() {
      return this.passwords.filter(pwd => this.fuzzyMatch(this.searchString, pwd.accountName));
    },
    currentUser() {
      return this.$store.getters.user(this.currentUserId);
    },
    currentProfile() {
      let profile = this.$store.getters.profile(this.currentProfileId);
      if (!profile || profile.userId !== this.currentUserId) {
        profile = {};
      }
      return profile;
    },
    currentPassword() {
      let password = this.$store.getters.password(this.currentPasswordId);
      if (!password || password.profileId !== this.currentProfileId) {
        password = null;
      }
      return password;
    },
    charsets() {
      return this.$store.getters.charsets;
    },
    checkSum() {
      const key = this.mainPassword;
      const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const password = passwordMD5.any_md5(key, charset);
      return password.substr(0, 3);
    },
  },
  mounted() {
    this.detectSleep();
  },
  beforeDestroy() {
    clearInterval(this.pingInterval);
    clearInterval(this.detectPing);
  },
};
</script>
