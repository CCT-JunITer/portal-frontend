<template>
  <v-container v-if="!hasFlag">
    <v-card class="mx-auto" width="400">
      <v-card-title>
        Aktiviere die Beta
      </v-card-title>
      <v-card-text>
        Die Projekte des WMS werden <strong>demnächst endgültig</strong> in das Portal eingefügt. 
        <br>
        Bis dahin werden die Projekte weiterhin <a href="https://wms.cct-ev.de/projekte">im WMS</a> gepflegt.
        <br>
        <br>
        Viel Spaß beim Entdecken!
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="cctPurple"
          @click="enableBeta"
          dark
          text
        >
          Beta aktivieren
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
  <router-view v-else></router-view>
</template>

<script lang="ts">
import { dispatchToggleFeatureFlag } from '@/store/main/actions';
import { readIsFlagSet } from '@/store/main/getters'
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({})
export default class ProjectGate extends Vue {
  get hasFlag() {
    return readIsFlagSet(this.$store)('projects');
  }

  public async enableBeta() {
    await dispatchToggleFeatureFlag(this.$store, 'projects');
  }
}
</script>

<style lang="scss">

</style>