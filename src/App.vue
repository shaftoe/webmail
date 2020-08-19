<template>
    <div class="flex flex-wrap justify-center">

      <div v-if="error" class="text-red-600 text-left p-3 text-2xl max-w-s">{{ error }}</div>
      <div v-if="sent" class="text-left p-3 text-2xl max-w-s">{{ sent }}</div>

      <form @submit.prevent="onLogin" v-if="!authOK" class="form">
        <div class="mb-4">
          <label for="accesskey" type="text" class="label">Access Key:</label>
          <input v-model="accessKey" id="accesskey" type="text" required class="input">
        </div>

        <div class="mb-6">
          <label for="secretkey" type="password" class="label">Secret Key:</label>
          <input v-model="secretKey" id="secretkey" type="password" required class="input">
        </div>

        <div class="flex items-center justify-center">
          <button name="submit" type="submit" class="bg-green-700 hover:bg-green-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Log in</button>
        </div>
      </form>

      <form @submit.prevent="onSubmit" v-else class="min-w-full">
        <fieldset :disabled="loading" class="form grid grid-cols-6">
          <label for="mailfrom" type="text" class="col-span-2">Mail from:</label>
          <input v-model="mailFrom" id="mailfrom" type="text" class="col-span-4 input" required>

          <label for="mailto" type="text" class="col-span-2">Mail to:</label>
          <input v-model="mailTo" id="mailto" type="text" class="col-span-4 input" required>

          <label for="mailcc" type="text" class="col-span-2">Cc:</label>
          <input v-model="mailCc" id="mailcc" type="text" class="col-span-4 input">

          <label for="mailbcc" type="text" class="col-span-2">Bcc:</label>
          <input v-model="mailBcc" id="mailbcc" type="text" class="col-span-4 input">

          <label for="subject" class="col-span-2">Subject:</label>
          <input v-model="subject" id="subject" type="text" class="col-span-4 input" required>

          <label for="message" class="col-span-6 mt-3 mb-3">Message</label>
          <textarea rows="8" v-model="message" id="message" class="col-span-6 shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-6 leading-tight focus:outline-none focus:shadow-outline" required></textarea>

          <div class="col-span-6 grid grid-cols-2 gap-2">
            <button name="submit" type="submit" class="bg-red-500 hover:bg-red-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Send</button>

            <button name="logout" @click="onLogOut" class="bg-green-400 hover:bg-green-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Log Out</button>
          </div>
        </fieldset>
      </form>

      <footer class="mt-10 min-w-full flex flex-wrap justify-around bg-green-700 text-white shadow-md">
        <small class="m-5">
          Last update: {{ lastUpdate }}
        </small>
        <small class="m-5">
          Version: <a :href="versionCommit">{{ version }}</a>
        </small>
      </footer>

    </div>
</template>

<script>
import { sendMail, updateAWSConfig } from './lib/api'

export default {
  name: 'App',

  data() {
    return {
      mailTo: "",
      mailFrom: "",
      mailCc: "",
      mailBcc: "",
      subject: "",
      message: "",
      accessKey: null,
      secretKey: null,
      error: null,
      sent: null,
      loggedIn: false,
      loading: false,
      lastUpdate: LAST_UPDATE,
      version: VERSION,
      versionCommit: VERSION_COMMIT,
    }
  },

  methods: {
    onSubmit() {
      this.error = null
      this.sent = null
      this.loading = true
      sendMail(this.mailFrom, this.mailTo, this.subject, this.message, this.cc, this.bcc)
        .then(messageID => {
          this.loading = false
          this.sent = `Message sent: ${messageID}`
        })
        .catch(error => {
          this.loading = false
          this.error = `ERROR: ${error}`
        })
    },

    onLogin() {
      if (this.accessKey && this.secretKey) {
        updateAWSConfig(this.accessKey, this.secretKey)
        this.loggedIn = true
      } else {
        this.error = "Missing parameter"
      }
    },

    onLogOut() {
      this.accessKey = null
      this.secretKey = null
      this.loggedIn = false
      this.error = null
      this.sent = null
      this.mailTo = ""
      this.mailFrom = ""
      this.mailCc = ""
      this.mailBcc = ""
      this.subject = ""
      this.message = ""
      this.loading = false
    },
  },

  computed: {
    authOK() {
      return (this.accessKey && this.secretKey && this.loggedIn)
    },

    cc() {
      if (this.mailCc.match(/^ *$/)) return []
      return this.mailCc.split(",").map(item => item.trim())
    },

    bcc() {
      if (this.mailBcc.match(/^ *$/)) return []
      return this.mailBcc.split(",").map(item => item.trim())
    },
  },
}
</script>

<style>
.label {
  @apply block text-gray-700 font-bold mb-2;
}

.input {
  @apply shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight;
}

.form {
  @apply bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 font-mono;
}

#app {
  text-align: center;
  margin-top: 50px;
}
</style>