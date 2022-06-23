<template>
  <v-dialog 
    v-bind="$attrs"
    v-on="$listeners"
    v-model="dialog"
    :width="300"
  >
    <template v-slot:activator="activator">
      <slot name="activator" v-bind="activator"></slot>
    </template>
    <v-card>
      <v-card-title class="text-h5">
        {{ title }}
      </v-card-title>

      <v-card-text>
        {{ content }}
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="secondary"
          text
          @click="dialog = false" 
        >
          Abbrechen
        </v-btn>
        <v-btn
          color="primary"
          text
          @click="accept"
        >
          Akzeptieren
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'

@Component({})
export default class ConsentDialog extends Vue {

  public dialog = false;

  @Prop()
  public title!: string;

  @Prop()
  public content!: string;


  @Emit()
  public accept() {
    this.dialog = false;
    return null;
  }

}
</script>

<style lang="scss">

</style>