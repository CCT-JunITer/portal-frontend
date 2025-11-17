<template>
  <div class="root">
    <!-- Loading overlay -->
    <div v-if="loading" class="loading-overlay">
      <LoadingCCT></LoadingCCT>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="error-container">
      <v-card max-width="600" class="mx-auto">
        <v-card-title class="error-title">
          <v-icon large color="error" class="mr-2">mdi-alert-circle</v-icon>
          Tower nicht erreichbar
        </v-card-title>
        <v-card-text>
          <v-alert type="error" text dense>
            Die Tower-Anwesenheit konnte nicht geladen werden.
          </v-alert>
          <p class="mt-4">
            Mögliche Gründe:
          </p>
          <ul class="error-reasons">
            <li>Der Tower-Server ist vorübergehend nicht verfügbar</li>
            <li>Die Netzwerkverbindung wurde unterbrochen</li>
            <li>Der Dienst wird gerade gewartet</li>
          </ul>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="cctPurple" text @click="reload">
            <v-icon left>mdi-refresh</v-icon>
            Erneut versuchen
          </v-btn>
        </v-card-actions>
      </v-card>
    </div>

    <iframe 
      v-show="!loading && !error"
      ref="towerIframe"
      src="https://tower.cct-ev.de/" 
      width="100%" 
      height="100%" 
      frameBorder="0"
      @load="onIframeLoad"
      @error="onIframeError"
    ></iframe>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import LoadingCCT from '@/components/loading-cct/LoadingCCT.vue'

@Component({
  components: { LoadingCCT }
})
export default class TowerAnwesenheit extends Vue {
  private loading = true
  private error = false
  private loadTimeout: number | null = null

  mounted() {
    // Set timeout to show error if iframe doesn't load in time
    this.loadTimeout = window.setTimeout(() => {
      if (this.loading) {
        this.loading = false
        this.error = true
      }
    }, 10000) // 10 seconds timeout
  }

  beforeDestroy() {
    if (this.loadTimeout) {
      window.clearTimeout(this.loadTimeout)
    }
  }

  onIframeLoad() {
    // Clear timeout since iframe loaded
    if (this.loadTimeout) {
      window.clearTimeout(this.loadTimeout)
    }
    
    // Small delay to ensure content is visible
    setTimeout(() => {
      this.loading = false
      this.error = false
    }, 500)
  }

  onIframeError() {
    // Clear timeout and show error
    if (this.loadTimeout) {
      window.clearTimeout(this.loadTimeout)
    }
    this.loading = false
    this.error = true
  }

  reload() {
    this.loading = true
    this.error = false
    
    // Set new timeout
    this.loadTimeout = window.setTimeout(() => {
      if (this.loading) {
        this.loading = false
        this.error = true
      }
    }, 10000)
    
    // Reload iframe
    const iframe = this.$refs.towerIframe as HTMLIFrameElement
    if (iframe) {
      const currentSrc = iframe.src
      iframe.src = ''
      this.$nextTick(() => {
        iframe.src = currentSrc
      })
    }
  }
}
</script>

<style scoped lang="scss">
.root {
  position: relative;
  display: flex;
  flex-direction: row;
  height: 100%;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  z-index: 10;
}
</style>
