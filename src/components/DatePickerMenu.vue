<template>
  <v-menu
    ref="menu"
    v-model="menu"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    max-width="290px"
    min-width="auto"
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
      ref="picker"
      v-model="date"
      locale="de-de"
      @input="menu = false"
      v-bind="pickerProps"
    ></v-date-picker>
  </v-menu>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { format, parse } from 'date-fns'

@Component({})
export default class DatePickerMenu extends Vue {

  public menu = false;

  @Watch('menu')
  public onMenuOpen(menu: boolean) {
    if (menu && this.defaultPicker) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setTimeout(() => (this.$refs.picker as any).activePicker = this.defaultPicker);
    }
  }

  // https://github.com/vuetifyjs/vuetify/blob/master/packages/vuetify/src/components/VDatePicker/VDatePicker.ts#L407
  @Prop({ required: false })
  public defaultPicker?: 'YEAR' | 'MONTH' | 'DATE';


  @Prop({ required: false, default: null })
  public value!: string | null;

  @Prop()
  public pickerProps!: object;


  set date(value) {
    this.$emit('input', value);
  }

  get date() {
    return this.value;
  }

  onInputChange(value: string) {
    try {
      const date = parse(value, 'dd.MM.yyyy', new Date());
      this.date = format(date, 'yyyy-MM-dd');
    } catch(e) {
      this.date = null;
    }
  }

  get dateFormatted() {
    if(!this.date) {
      return '';
    }
    return format(new Date(this.date), 'dd.MM.yyyy');
  }
}
</script>

<style lang="scss">

</style>#