<template>
  <div
    class="tiptap-vuetify-editor__content"
    v-bind="$attrs"
    v-on="$listeners"
    v-html="value"/>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({})
export default class ViewComponent extends Vue {

  @Prop()
  public value!: string;

}
</script>

<style lang="scss">
div.tiptap-vuetify-editor__content a {
  pointer-events: auto !important;
}
</style>