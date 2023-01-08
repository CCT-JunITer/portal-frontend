<template>
  <div class="d-flex justify-center align-center fill-height">
    <slot name="default" v-if="!dialog"></slot>
    <div :value="dialog" v-else>
      <v-card max-width="500">
        <v-toolbar
          color="primary"
          dark
        >
          Authentifizierung
        </v-toolbar>
        <v-card-text>
          <div class="text-body-1 pa-4">
            Das Portal hat noch keinen Zugriff auf die Nextcloud. Bitte öffne folgenden Link und logge dich einmalig bei der Nextcloud ein.
          </div>

          <!-- <p><b>{{this.authenticationURL}}</b></p> -->
          <div class="text-center">
            <v-btn
              :href="authenticationURL"
              target="_blank"
              color="primary"
              class="ma-5"
            >
              Hier Klicken zum Anmelden
            </v-btn>
          </div>
          <v-progress-linear
            indeterminate
            color="primary"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn 
            @click="close"
            text
            color="secondary"
          >
            Abbrechen
          </v-btn>
        </v-card-actions>
        
      </v-card>
    </div>
  </div>
</template>

<script>
import { readAuthenticationURL } from '../store/getters';
import { commitSetAuthenticationURL } from '../store/mutations';
import { api } from '../api'

export default {
  data() {
    return {
      // dialog: false,
      timer: undefined,
    };
  },

  watch: {
    authenticationURL(val) {
      if (this.timer) clearInterval(this.timer);
      if (this.dialog) this.show()
      else this.close()
    }
  },

  methods: {
    show() {
      const fun = this.checkAuthentication
      this.timer = window.setInterval(function() {
        fun();
      }, 5000)
    },

    close() {
      this.authenticationURL = undefined;
      if (this.timer) clearInterval(this.timer);
    },

    async checkAuthentication() {
      const response = await api.checkNextcloudAuthentication(this.$store.state.main.token);
      if (response.data) {
        this.close();
      }
    },
  },
  destroyed() {
    this.close();
  },

  computed: {
    dialog: {
      get:function () {
        return Boolean(this.authenticationURL)
      }
    },

    authenticationURL: {
      get:function() {
        return readAuthenticationURL(this.$store);
      }, 
      set:function(value) {
        commitSetAuthenticationURL(this.$store, value)
      }
    }
  }
};
</script>