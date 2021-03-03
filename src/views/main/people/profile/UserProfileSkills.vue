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
</style>
