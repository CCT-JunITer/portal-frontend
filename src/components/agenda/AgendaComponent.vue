<template>
  <div class="rounded mb-4" style="border: 1px solid #999; padding: 10px" v-bind="$attrs">
    <div class="text-overline">Agenda</div>
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <v-text-field
        @keydown.enter="addToAgenda"
        label="Neuer Agendapunkt"               
        v-model="newAgenda"
        prepend-icon="mdi-format-title"            
      ></v-text-field>
      <v-btn x-large icon color="cctOrange" @click="addToAgenda">
        <v-icon> mdi-plus-circle</v-icon>
      </v-btn>
    </div>
    <draggable @input="$emit('input', $event)" :value="value" group="people" @start="drag=true" @end="drag=false">
      <div 
        v-for="(element, index) in value" 
        :key="index"
        class="agenda-item rounded my-2"
        style="background: #eee; padding-left: 10px"
      >
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <b>{{ index + 1 }}</b> {{ element }}
          </div>
          <v-btn large icon color="cctGrey" @click="removeItemFromAgenda(index)">
            <v-icon> mdi-minus-circle</v-icon>
          </v-btn>
        </div>
      </div>
    </draggable>
    <small><v-icon size="17px">mdi-information-outline</v-icon> Agendapunkte können per Drag and Drop verschoben werden</small>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import Draggable from 'vuedraggable'

@Component({
  components: { Draggable }
})
export default class AgendaComponent extends Vue {

  @Prop()
  public value!: string[];
  public drag = false;
  public newAgenda = '';

  public addToAgenda() {
    if (this.newAgenda.length > 0) {
      this.$emit('input', [...(this.value || []), this.newAgenda]);
      this.newAgenda = '';
    }
  }

  public removeItemFromAgenda(index: number) {
    this.$emit('input', this.value.filter((v, i) => i !== index));
  }

}
</script>

<style lang="scss">

</style>