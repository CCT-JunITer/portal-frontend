<template>
  <div class="root">
    <iframe src="https://tower.cct-ev.de/" width="100%" height="100%" frameBorder="0"></iframe>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component({})
export default class TowerAnwesenheit extends Vue {

}
</script>

<style scoped lang="scss">
.root {
  display: flex;
  flex-direction: row;
  height: 100%;
}

</style>
