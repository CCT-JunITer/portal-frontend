<template>
  <div class="root">
    <iframe src="https://shop.spreadshirt.de/CCT-Berlin-Shop/" width="100%" height="100%" frameBorder="0">

    </iframe>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component({})
export default class Shop extends Vue {

}
</script>

<style scoped lang="scss">
.root {
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>