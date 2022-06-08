<template>
  <v-menu
    ref="menu"
    v-model="menu"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    nudge-right="40"
    max-width="290px"
    min-width="240px"
    v-bind="$attrs"
  >
    <template v-slot:activator="{ on, attrs }">
      <slot 
        name="activator" 
        v-bind:on="{...on, change: onInputChange}" 
        v-bind:attrs="{...attrs, value: dateFormatted}">
      </slot>
    </template>
    <v-date-picker
      :active-picker="defaultPicker"
      color="cctBlue"
      ref="picker"
      v-model="date"
      locale="de-de"
      @input="menu = false"
      v-bind="pickerProps"
    ></v-date-picker>
  </v-menu>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { format, formatISO, parse } from 'date-fns'

@Component({})
export default class DatePickerMenu extends Vue {

  public menu = false;

  // https://github.com/vuetifyjs/vuetify/blob/master/packages/vuetify/src/components/VDatePicker/VDatePicker.ts#L407
  @Prop({ required: false })
  public defaultPicker?: 'YEAR' | 'MONTH' | 'DATE';


  @Prop({ required: false, default: null })
  public value!: string | null;

  @Prop()
  public pickerProps!: object;


  set date(value) {
    this.$emit('input', this.toISO(value));
  }

  get date() {
    if (this.value === null) {
      return '';
    }
    return format(new Date(this.value), 'yyyy-MM-dd');
  }

  toISO(value: string) {
    try {
      const date = parse(value, 'yyyy-MM-dd', new Date())
      return formatISO(date);
    } catch(e) {
      return value;
    }
  }

  onInputChange(value: string) {
    try {
      const date = parse(value, 'dd.MM.yyyy', new Date());
      this.date = format(date, 'yyyy-MM-dd');
    } catch(e) {
      this.date = '';
    }
  }

  get dateFormatted() {
    if(!this.date) {
      return '';
    }
    try {
      return format(new Date(this.date), 'dd.MM.yyyy');
    } catch(e) {
      return '';
    }
  }
}
</script>

<style lang="scss">

</style>#