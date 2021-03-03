<template>
  <div class="root">
    <iframe src="https://guide.cct-ev.de" width="100%" height="100%">

    </iframe>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component({})
export default class Guide extends Vue {

}
</script>

<style lang="scss">
.root {
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>