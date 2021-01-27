<template>
  <div>
    <v-timeline>
      <v-timeline-item
        v-for="n in 3"
        :key="n"
        color="cctBlue"
        large
      >
        <template v-slot:opposite>
          <span>2020</span>
        </template>
        <v-card class="elevation-2">
          <v-card-title class="headline">
            PV-Tool Project
          </v-card-title>
          <v-card-text>
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
          </v-card-text>
        </v-card>
      </v-timeline-item>
    </v-timeline>
  </div>
</template>


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { readRouteUser } from '@/store/main/getters';

@Component({})
export default class UserProfileProjects extends Vue {

  get userProfile() {
    return readRouteUser(this.$store)(this.$route);
  }

}
</script>
