<template>
  <div class="root">
    <v-container>
      <h4 class="text-h4 my-5">Antrag erstellen</h4>
      <div>
        <v-tabs show-arrows background-color="transparent" slider-color="cctGreen" color="cctGrey">
          <v-tab :ripple="false" :to="{name: 'profile-request-alumni'}">
            <v-icon left>
              school
            </v-icon>
            Alumnisierung
          </v-tab>
          <v-tab :ripple="false" :to="{name: 'profile-request-passive'}" disabled>
            <v-icon left>
              mdi-sleep
            </v-icon>
            Passivisierung
          </v-tab>
          <v-tab :ripple="false" :to="{name: 'profile-request-ressort-change'}">
            <v-icon left>
              mdi-text-box-check
            </v-icon>
            Ressortwechsel
          </v-tab>
          <v-tab :ripple="false" :to="{name: 'profile-request-memberstatus'}">
            <v-icon left>
              people
            </v-icon>
            Mitgliederwerdegang
          </v-tab>
        </v-tabs>
        <v-divider></v-divider>
      </div>
      <router-view></router-view>
    </v-container>  
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({})
export default class UserProfileRequestCreate extends Vue {

}
</script>

<style lang="scss" scoped>

</style>