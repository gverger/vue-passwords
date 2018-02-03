<template>
  <md-card style="width:100%">
    <md-card-header>
      <md-card-header-text>
        <div class="md-title">{{localPassword.accountName}}</div>
        <div class="md-subhead">{{localPassword.userName}}</div>
      </md-card-header-text>
      <md-card-actions>
        <md-button class="md-raised md-warning" @click="cancel">
          cancel
        </md-button>
        <md-button class="md-raised md-primary" @click="save">
          SAVE
        </md-button>
      </md-card-actions>
    </md-card-header>
    <md-card-content>
      <md-field v-bind:class="{ 'md-invalid': valueChanged('accountName') }">
        <label>Account Name</label>
        <md-input v-model="localPassword.accountName"></md-input>
        <span class="md-error">Current value: "{{password.accountName}}"</span>
      </md-field>

      <md-field v-bind:class="{ 'md-invalid': valueChanged('userName') }">
        <label>User Name</label>
        <md-input v-model="localPassword.userName"></md-input>
        <span class="md-error">Current value: "{{password.userName}}"</span>
      </md-field>

      <div class="md-layout md-gutter">
        <div class="md-layout-item">
            <md-field v-bind:class="{ 'md-invalid': valueChanged('prefix') }">
            <label>Prefix</label>
            <md-input v-model="localPassword.prefix"></md-input>
            <span class="md-error">Current value: "{{password.prefix}}"</span>
          </md-field>
        </div>

        <div class="md-layout-item">
          <md-field v-bind:class="{ 'md-invalid': valueChanged('suffix') }">
            <label>Suffix</label>
            <md-input v-model="localPassword.suffix"></md-input>
            <span class="md-error">Current value: "{{password.suffix}}"</span>
          </md-field>
        </div>
        <div class="md-layout-item md-size-10">
          <md-field v-bind:class="{ 'md-invalid': valueChanged('length') }">
            <label>Length</label>
            <md-input type="number" v-model="localPassword.length"></md-input>
            <span class="md-error">Current value: "{{password.length}}"</span>
          </md-field>
        </div>

        <div class="md-layout-item md-size-10">
          <md-field v-bind:class="{ 'md-invalid': valueChanged('counter') }">
            <label>Count</label>
            <md-input type="number" v-model="localPassword.counter"></md-input>
            <span class="md-error">Current value: "{{password.counter}}"</span>
          </md-field>
        </div>
      </div>

      <md-field v-bind:class="{ 'md-invalid': valueChanged('charsetId') }">
        <label>Charset</label>
        <md-select v-model="localPassword.charsetId">
          <md-option v-for="charset in charsets" :key="charset.id" :value="charset.id">{{charset.name}}</md-option>
        </md-select>
        <span class="md-error">Current value: "{{charset(password.charsetId).name}}"</span>
      </md-field>
    </md-card-content>

  </md-card>
</template>

<script>
import { UPDATE_PASSWORD } from '@/store/mutation-types'

export default {
  // declare the props
  props: ['password'],
  data() {
    return {
      localPassword: Object.assign({}, this.password)
    }
  },
  methods: {
    setLocalPassword(newPassword) {
      this.localPassword = Object.assign({}, newPassword)
    },
    cancel () {
      this.setLocalPassword(this.password)
    },
    save () {
      this.$store.dispatch(UPDATE_PASSWORD,
        {
          passwordId: this.password.id,
          newPassword: this.localPassword
        }
      ).then((passwordId) => { console.log('updated ' + passwordId) })
    },
    valueChanged(property) {
      return this.localPassword[property] !== this.password[property]
    },
    charset(id) {
      return this.$store.getters.charset(id)
    }
  },
  computed: {
    charsets () {
      return this.$store.getters.charsets
    }
  },
  watch:{
    password(newPassword){
      this.setLocalPassword(newPassword)
    }
  }
}
</script>
