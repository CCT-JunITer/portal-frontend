<template>
  <div class="root">
    <div class="fill-height">
      <nextcloud-authentication-manager>
        <calendar-view></calendar-view>
      </nextcloud-authentication-manager>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import CalendarView from './CalendarView.vue';
import NextcloudAuthenticationManager from '../components/NextcloudAuthenticationManager.vue'

@Component({
  components: {
    CalendarView, 
    NextcloudAuthenticationManager
  }
})
export default class CalendarMain extends Vue {
}
</script>

<style lang="scss" scoped>

.root {
  height: 100%;
}

</style>