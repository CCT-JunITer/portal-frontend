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
    <v-card>
      <v-card-text class="px-0 py-0">
        <v-tabs fixed-tabs v-model="activeTab" background-color="cctBlue" dark>
          <v-tab key="calendar">
            <slot name="dateIcon">
              <v-icon>event</v-icon>
            </slot>
          </v-tab>
          <v-tab key="timer">
            <slot name="timeIcon">
              <v-icon>access_time</v-icon>
            </slot>
          </v-tab>
          <v-tab-item key="calendar">
            <v-date-picker
              color="cctBlue"
              v-model="date" 
              ref="picker"
              v-bind="pickerProps" 
              @input="activeTab = 1" 
              full-width
            >
            </v-date-picker>
          </v-tab-item>
          <v-tab-item key="timer">
            <v-time-picker
              color="cctBlue"
              ref="timer"
              v-model="time"
              format="24hr"
            ></v-time-picker>
          </v-tab-item>
        </v-tabs>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <slot name="actions" :parent="this">
          <v-btn color="grey lighten-1" text @click.native="clearHandler">Clear</v-btn>
          <v-btn color="green darken-1" text @click="okHandler">OK</v-btn>
        </slot>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { format, parse } from 'date-fns'

@Component({})
export default class DateTimePickerMenu extends Vue {

  public menu = false;
  public activeTab = 0;

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
    this.$emit('input', value + ' ' + this.time);
  }

  get date() {
    if (!this.value) {
      return '';
    }
    return format(new Date(this.value), 'yyyy-MM-dd');
  }

  get time() {
    if (!this.value) {
      return '';
    }
    return format(new Date(this.value), 'HH:mm');
  }

  set time(value) {
    this.$emit('input', this.date + ' ' + value);
  }

  okHandler() {
    this.resetPicker()
  }

  clearHandler() {
    this.resetPicker()
  }

  resetPicker() {
    this.menu = false
    this.activeTab = 0
  }

  

  onInputChange(value: string) {
    try {
      const date = parse(value, 'dd.MM.yyyy HH:mm', new Date());
      this.$emit('input', format(date, 'yyyy-MM-dd HH:mm'));
    } catch(e) {
      this.$emit('input', null);
    }
  }

  get dateFormatted() {
    if (!this.value) {
      return '';
    }
    try {
      return format(new Date(this.value), 'dd.MM.yyyy HH:mm');
    } catch(e) {
      return '';
    }
  }
}
</script>

<style lang="scss">

</style>