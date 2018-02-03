<template>
  <div class="passwords-viewport">
    <md-toolbar>
      <div class="md-title">
        PASSWORDS
      </div>

      <div class="md-toolbar-section-end">
        <div class="md-layout md-gutter">
          <div class="md-layout-item">
            <md-field>
              <md-icon>vpn_key</md-icon>
              <md-input type="password" v-model="mainPassword" placeholder="Master Password"></md-input>
            </md-field>
            <span v-if="mainPassword">Check: {{ checkSum }}</span>
          </div>

          <div class="md-layout-item">
            <md-field>
              <md-select name="users" id="users" v-model="currentUserId">
                <md-button class="md-icon-button" md-menu-trigger slot="icon">
                  <md-icon>people</md-icon>
                </md-button>
                <md-option v-for="user in users" :key="user.id" :value="user.id">{{user.name}}</md-option>
              </md-select>
            </md-field>
          </div>
        </div>
      </div>
    </md-toolbar>

    <div class="main-panel md-layout md-gutter">
      <div class="md-layout-item viewport">
        <md-toolbar :md-elevation="1">
          <div class="md-title" style="flex: 70">
            <md-field md-clearable md-inline>
              <md-icon>search</md-icon>
              <label>Search</label>
              <md-input v-model="searchString"></md-input>
            </md-field>
          </div>
          <div class="md-toolbar-section-end">
            <md-button class="md-icon-button md-primary md-raised" @click="addPassword()">
              <md-icon>add</md-icon>
            </md-button>
          </div>
        </md-toolbar>

        <md-list class="passwords-list">
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

      </div>
        <div class="md-layout-item">
          <password-edit :password='currentPassword' v-if="currentPassword"/>
        </div>
    </div>
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
    edit(password) {
      this.currentPasswordId = password.id;
    },
    addPassword() {
      this.$store.dispatch(NEW_PASSWORD, this.currentUserId)
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
    passwords() {
      return this.$store.getters.passwords(this.currentUserId);
    },
    filteredPasswords() {
      return this.passwords.filter(pwd => this.fuzzyMatch(this.searchString, pwd.accountName));
    },
    currentUser() {
      return this.$store.getters.user(this.currentUserId);
    },
    currentPassword() {
      let password = this.$store.getters.password(this.currentPasswordId);
      if (!password || password.userId !== this.currentUserId) {
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
