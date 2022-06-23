<template>
  <div class="root">
    <div class="fill-height">
      <calendar-view v-if="isFlagSet()"></calendar-view>
      <calendar v-else-if="!isTower()"></calendar>
      <tower v-else></tower>
    </div>
  </div>
</template>

<script lang="ts">
import { readUserProfile } from '@/store/main/getters';
import { Vue, Component, Prop } from 'vue-property-decorator'

import Calendar from './Calendar.vue';
import Tower from './Tower.vue';

@Component({
  components: {
    CalendarView: () => import('./CalendarView.vue'),
    Calendar: Calendar,
    Tower: Tower,
  }
})
export default class CalendarMain extends Vue {
  public get userProfile() {
    return readUserProfile(this.$store);
  }
  public isFlagSet() {
    const flag = this.$route.meta?.featureFlag;
    const features = this.userProfile?.features || [];
    return features.indexOf(flag) !== -1;
  }

  public isTower() {
    return this.$route.query.towernutzung;
  }
}
</script>

<style lang="scss" scoped>

.root {
  height: 100%;
}

</style>