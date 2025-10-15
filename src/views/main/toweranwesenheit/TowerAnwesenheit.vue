<template>
  <div class="root">
    <!-- Loading state -->
    <div v-if="loading" class="fallback-container">
      <LoadingCCT></LoadingCCT>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="fallback-container">
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

    <!-- Iframe -->
    <iframe 
      v-else
      ref="towerIframe"
      src="https://tower.cct-ev.de/" 
      width="100%" 
      height="100%" 
      frameBorder="0"
      @load="onIframeLoad"
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
  private timeoutId: number | null = null
  private contentCheckId: number | null = null

  mounted() {
    // Set a timeout to detect if iframe doesn't load
    this.timeoutId = window.setTimeout(() => {
      if (this.loading) {
        this.loading = false
        this.error = true
      }
    }, 10000) // 10 seconds timeout
  }

  beforeDestroy() {
    if (this.timeoutId) {
      window.clearTimeout(this.timeoutId)
    }
    if (this.contentCheckId) {
      window.clearTimeout(this.contentCheckId)
    }
  }

  onIframeLoad() {
    if (this.timeoutId) {
      window.clearTimeout(this.timeoutId)
    }
    
    // Check if iframe body is empty
    try {
      const iframe = this.$refs.towerIframe as HTMLIFrameElement
      if (iframe && iframe.contentDocument) {
        const body = iframe.contentDocument.body
        
        // Check if body exists and has meaningful content
        if (!body || body.children.length === 0 || body.textContent?.trim() === '') {
          // Body is empty, show error
          this.loading = false
          this.error = true
          return
        }
        
        // Additional delayed check - sometimes content loads after the initial load event
        this.contentCheckId = window.setTimeout(() => {
          try {
            const currentBody = iframe.contentDocument?.body
            if (!currentBody || currentBody.children.length === 0 || currentBody.textContent?.trim() === '') {
              this.loading = false
              this.error = true
            }
          } catch (e) {
            // Ignore errors on delayed check
          }
        }, 2000) // Check again after 2 seconds
      }
    } catch (e) {
      // Cross-origin restriction - can't access iframe content
      // We'll assume it loaded successfully if we got the load event
      console.warn('Cannot access iframe content (cross-origin):', e)
    }
    
    this.loading = false
    this.error = false
  }

  reload() {
    this.loading = true
    this.error = false
    
    // Clear any existing timeouts
    if (this.contentCheckId) {
      window.clearTimeout(this.contentCheckId)
    }
    
    this.timeoutId = window.setTimeout(() => {
      if (this.loading) {
        this.loading = false
        this.error = true
      }
    }, 10000)
    
    // Reload iframe by resetting the src
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
  display: flex;
  flex-direction: row;
  height: 100%;
}

.fallback-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 24px;
}

.error-title {
  color: var(--v-cctBlue-base);
  font-weight: 500;
}

.error-reasons {
  color: var(--v-cctGrey-base);
  font-size: 0.9rem;
  line-height: 1.6;
  
  li {
    margin-bottom: 8px;
  }
}
</style>
