<template>
  <div class="root">
    <div class="fill-height">
      <calendar-view></calendar-view>
    </div>
  </div>
</template>

<script lang="ts">
import { readUserProfile } from '@/store/main/getters';
import { Vue, Component, Prop } from 'vue-property-decorator'
import CalendarView from './CalendarView.vue';

@Component({
  components: {
    CalendarView: CalendarView,
  }
})
export default class CalendarMain extends Vue {
  public get userProfile() {
    return readUserProfile(this.$store);
  }

  public isTower() {
    return this.$route.meta?.towernutzung;
  }
}
</script>

<style lang="scss" scoped>

.root {
  height: 100%;
}

</style>