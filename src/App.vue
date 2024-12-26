<template>
  <div id="app" :class="{'april-fools': $common.isAprilFools()}">
    <v-app>
      <router-view />
      <NotificationsManager></NotificationsManager>
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
import { api } from './api';

@Component({
  components: {
    NotificationsManager,
  },
})
export default class App extends Vue {
  public hasUpdate = false;

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
  }

  /**
   * Disable error capturing for now
   * since it's not needed and causes overhead
   */
  /*async errorCaptured(err, vm, info) {
    await api.trackError(this.$store.state.main.token, {
      error: err.message,
      info: info,
      state: this.$store.state,
      route: this.$route.fullPath
    });
  }*/
  
}
</script>

<style lang="sass">
@import '~vuetify/src/styles/styles.sass'

.flex-1 
  flex: 1 1

html
  overflow-y: auto!important


.april-fools
  filter:  hue-rotate(233deg)


@media #{map-get($display-breakpoints, 'md-and-up')}
  .input-lg
    max-width: 340px!important


</style>

