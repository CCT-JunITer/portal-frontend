<template>
  <div class="EditEventEntry">
    <div>
      <v-tabs center-active fixed-tabs color="cctBlue">
        <v-tab :ripple="false" :to="{name: 'event-create-training'}">
          <v-icon left>
            mdi-account
          </v-icon>
          Training
        </v-tab>
        <v-tab :ripple="false" :to="{name: 'event-create-meeting'}">
          <v-icon left>
            mdi-school
          </v-icon>
          Meeting
        </v-tab>
      </v-tabs>
      <v-divider></v-divider>
    </div>
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({})
export default class EditEventEntry extends Vue {

}
</script>

<style lang="scss">

</style>