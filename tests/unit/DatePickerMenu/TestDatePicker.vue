<template>
  <v-app>
    <date-picker-menu
      v-model="date"
      :pickerProps="pickerProps"
    >
      <template v-slot:activator="{ on, attrs, }">
        <v-text-field
          label="Geburtstag"
          class="input-lg"
          v-bind="attrs"
          v-on="on"
          required
          :rules="[$common.required]"
        ></v-text-field>
      </template>
    </date-picker-menu>
  </v-app>
</template>

<script lang="ts">
import DatePickerMenu from '@/components/DatePickerMenu.vue'
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({
  components: { DatePickerMenu }
})
export default class TestDatePicker extends Vue {

  public date = '2020-01-01';

  @Prop()
  public pickerProps!: object;

}
</script>

<style lang="scss">

</style>