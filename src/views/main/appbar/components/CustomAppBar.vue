<template>
  <v-app-bar class="background" v-bind="$attrs" v-on="$listeners">
    <slot></slot>
  </v-app-bar>
</template>

<script lang="ts">
import {
  Vue,
  Component
} from 'vue-property-decorator'

@Component({})
export default class CustomAppBar extends Vue {

}
</script>

<style>
.background {
  background-image: linear-gradient(30deg, var(--v-cctBlue-base) 0%, var(--v-cctBlue-base) 30%, var(--v-cctPurple-base) 100%);
}
</style>