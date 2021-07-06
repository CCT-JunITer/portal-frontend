<!-- Nur eine Kopie von Skills 

<template>
  <div>
    <v-chip pill v-for="skill in skills" :key="skill" class="pill" color="cctBlue" dark>{{ skill }}</v-chip>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { readRouteUser } from '@/store/main/getters';

@Component({})
export default class UserProfileSkills extends Vue {
  public skills = ['Web Development', 'Market Research', 'Business Plan Development', 'Process Optimization', 'SCRUM', 'Backend Development', 'Frontend Development']

  get userProfile() {
    return readRouteUser(this.$store)(this.$route);
  }

}
</script>
<style scoped>
.pill {
  margin: 5px;
}
</style> -->

<template>
  <v-card
    class="mx-auto"
    max-width="344"
    outlined
  >
    <v-list-item three-line>
      <v-list-item-content>
        <div class="overline mb-4">
          OVERLINE
        </div>
        <v-list-item-title class="headline mb-1">
          Headline 5
        </v-list-item-title>
        <v-list-item-subtitle>Greyhound divisely hello coldly fonwderfully</v-list-item-subtitle>
      </v-list-item-content>

    </v-list-item>

    <v-card-actions>
      <v-btn
        outlined
        rounded
        text
      >
        Schulung ansehen
      </v-btn>
    </v-card-actions>
  </v-card>
  
</template>


