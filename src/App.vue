<template>
  <div id="app">
    <v-app>
      <router-view v-if="loggedIn !== null" />
      <NotificationsManager></NotificationsManager>
      <nextcloud-authentication-manager></nextcloud-authentication-manager>
      <v-snackbar
        v-model="hasUpdate"
        color="cctPurple"
        shaped
        right
        bottom
        timeout="-1"
      >
        App wird <strong>automatisch</strong> aktualisiert
        <template v-slot:action="{ attrs }">
          <v-btn
            color="cctOrange"
            small
            text
            v-bind="attrs"
            @click="skipWaiting"
          >
            neu laden
          </v-btn>
        </template>
      </v-snackbar>
    </v-app>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import NotificationsManager from '@/components/NotificationsManager.vue';
import { readIsLoggedIn } from '@/store/main/getters';
import { dispatchCheckLoggedIn } from '@/store/main/actions';
import NextcloudAuthenticationManager from '@/components/NextcloudAuthenticationManager.vue';
import { api } from './api';

@Component({
  components: {
    NotificationsManager,
    NextcloudAuthenticationManager
  },
})
export default class App extends Vue {
  public hasUpdate = false;

  get loggedIn() {
    return readIsLoggedIn(this.$store);
  }

  public async skipWaiting() {
    (this as any).$workbox.messageSkipWaiting();
    this.hasUpdate = false;
    window.location.reload();
  }

  public async created() {
    if ((this as any).$workbox) {
      (this as any).$workbox.addEventListener('waiting', () => {
        this.hasUpdate = true;
      });
    }
    await dispatchCheckLoggedIn(this.$store);
  }

  async errorCaptured(err, vm, info) {
    await api.trackError(this.$store.state.main.token, {
      error: err.message,
      info: info,
      state: this.$store.state,
      route: this.$route.fullPath
    });
  }
  
}
</script>

<style lang="sass">
@import '~vuetify/src/styles/styles.sass'

html
  overflow-y: auto!important


@media #{map-get($display-breakpoints, 'md-and-up')}
  .input-lg
    max-width: 340px!important


</style>

