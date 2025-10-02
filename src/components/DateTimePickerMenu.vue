<template>
  <v-menu
    ref="menu"
    v-model="menu"
    :open-on-click="false"
    :close-on-content-click="false"
    transition="scale-transition"
    nudge-right="40"
    max-width="290px"
    min-width="240px"
    offset-y
    v-bind="$attrs"
    :disabled="disabled"
  >
    <template v-slot:activator="{ on, attrs }">
      <slot 
        name="activator" 
        v-bind:on="{...on, input: onInputChange, change: onInputChange, 'click:append': () => menu = true}" 
        v-bind:attrs="{...attrs, value: dateFormatted, 'append-icon': 'mdi-calendar', 'rules': [v => (!!v && isValid(v)) || 'Falsches Datumsformat']}">
      </slot>
    </template>
    <v-card tile>
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
      </v-tabs>
      <v-tabs-items v-model="activeTab">
        <v-tab-item key="calendar" eager>
          <v-date-picker
            :active-picker="defaultPicker"
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
      </v-tabs-items>
      <v-card-actions>
        <v-spacer></v-spacer>
        <slot name="actions" :parent="this">
          <v-btn color="grey lighten-1" text @click.native="clearHandler">Clear</v-btn>
          <v-btn color="green darken-1" text @click="okHandler">OK</v-btn>
        </slot>
      </v-card-actions>
      <v-card-text v-if="!isDifferentTimezone && germanTimeFormatted" class="warning--text text-body-2 py-2">
        <v-icon small color="warning" class="mr-1">mdi-alert</v-icon>
        Achtung du bist in einer anderen Zeitzone und entsprechend wird die von dir angegebene Zeit in Deutschland {{ germanTimeFormatted }} sein
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { format, formatISO, isValid, parse } from 'date-fns'

@Component({})
export default class DateTimePickerMenu extends Vue {

  public menu = false;
  public activeTab = 0;
  // https://github.com/vuetifyjs/vuetify/blob/master/packages/vuetify/src/components/VDatePicker/VDatePicker.ts#L407
  @Prop({ required: false })
  public defaultPicker?: 'YEAR' | 'MONTH' | 'DATE';


  @Prop({ required: false, default: null })
  public value!: string | null;

  @Prop({ required: false, default: {} })
  public pickerProps!: object;

  @Prop({ required: false, default: false })
  public disabled?: boolean;

  public date: string | null = null;
  public time: string | null = null;

  @Watch('value', {immediate: true})
  public onValueChange(nextValue?: string) {
    if (!nextValue || !isValid(new Date(nextValue))) {
      return;
    }
    this.date = format(new Date(nextValue), 'yyyy-MM-dd');
    this.time = format(new Date(nextValue), 'HH:mm');
  }

  public isValid(value: string) {
    const date = this.getDateFromInput(value);
    return !!date && isValid(date);
  }

  getDateFromInput(value: string) {
    const formatString = 'dd.MM.yyyy HH:mm';
    if (value.length !== formatString.length) {
      return null;
    }
    const date = parse(value, formatString, new Date());
    return date;
  }

  toISO(value: string) {
    try {
      const date = parse(value, 'yyyy-MM-dd HH:mm', new Date())
      return formatISO(date);
    } catch(e) {
      return value;
    }
  }

  okHandler() {
    this.$emit('input', this.toISO(this.date + ' ' + this.time))
    this.resetPicker()
  }

  clearHandler() {
    this.$emit('input', null);
    this.resetPicker()
  }

  resetPicker() {
    this.menu = false
    this.activeTab = 0
  }

  

  onInputChange(value: string) {
    try {
      const date = this.getDateFromInput(value);
      if (date === null) {
        return;
      }
      this.$emit('input', this.toISO(format(date, 'yyyy-MM-dd HH:mm')));
    } catch(e) {
      //
    }
  }

  public get dateFormatted() {
    if (!this.value) {
      return '';
    }
    try {
      return format(new Date(this.value), 'dd.MM.yyyy HH:mm');
    } catch(e) {
      return '';
    }
  }

  public get isDifferentTimezone() {
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return userTimezone !== 'Europe/Berlin';
  }

  public get germanTimeFormatted() {
    if (!this.date || !this.time) {
      return '';
    }
    try {
      const dateTimeString = this.date + ' ' + this.time;
      const date = parse(dateTimeString, 'yyyy-MM-dd HH:mm', new Date());
      if (!isValid(date)) {
        return '';
      }
      // Convert to German time (Europe/Berlin)
      const germanTime = new Date(date.toLocaleString('en-US', { timeZone: 'Europe/Berlin' }));
      return format(germanTime, 'dd.MM.yyyy HH:mm');
    } catch(e) {
      return '';
    }
  }
}
</script>

<style lang="scss">

</style>