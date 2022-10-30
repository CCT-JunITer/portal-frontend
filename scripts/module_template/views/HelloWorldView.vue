<template>
  <v-container class="centered">
    <h1 class="text-h1">Hello World from module $MODULE_NAME$</h1>

    <h5 class="text-h5">Hallo, {{ $MODULE_NAME_CAMEL$Profile && $MODULE_NAME_CAMEL$Profile.full_name }}</h5>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { Route } from 'vue-router';
import { dispatchGet$MODULE_NAME$Profile } from '../store/actions';
import { read$MODULE_NAME$Profile } from '../store/getters';

@Component({})
export default class $MODULE_NAME$View extends Vue {

  get $MODULE_NAME_CAMEL$Profile() {
    return read$MODULE_NAME$Profile(this.$store);
  }


  @Watch('$route', { immediate: true })
  public async onRouteChange(newRoute?: Route) {
    if (newRoute) {
      await dispatchGet$MODULE_NAME$Profile(this.$store);
    }
  }

}
</script>

<style lang="scss">

</style>