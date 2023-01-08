<template>
  <div class="loading-page">
    <LoadingCCT></LoadingCCT>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import LoadingCCT from './LoadingCCT.vue'

@Component({
  components: { LoadingCCT }
})
export default class LoadingPage extends Vue {

}
</script>

<style lang="scss" scoped>
.loading-page {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}
</style>