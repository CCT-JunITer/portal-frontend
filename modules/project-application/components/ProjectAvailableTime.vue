<template>
  <v-card class="project-available-time" v-bind="$attrs" v-on="$listeners">
    <v-card-title>
      Verfügbarkeit
    </v-card-title>
    <v-card-text>
      <div class="row">
        <div v-for="week in weeks" :key="week.label" class="col-md-3 col-sm-6 col-12 py-1">
          <template v-if="!readonly">
            <v-combobox
              :items="btValues"
              :value="getTimeSlotAt(week.value) || 0"
              @input="setTimeSlotAt(week.value, $event.value)"
              dense
              persistent-hint
              outlined
              suffix="BT"
              :hint="$common.format(week.start, 'dd.MM.yyyy') + ' - ' + $common.format(week.end, 'dd.MM.yyyy')"
              :label="week.label"
            >
            </v-combobox>
          </template>
          <div class="list-item-content text-overline" v-else>
            {{ $common.decimal2Text(getTimeSlotAt(week.value) || 0, 1) }} BT
          </div>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { weeksArray } from '../util';

@Component({})
export default class ProjectAvailableTime extends Vue {

  public btValues = new Array(16).fill(0).map((_, i) => ({ value: (i)/2, text: `${this.$common.decimal2Text((i)/2)}`}));
  public localValue = {}

  @Prop()
  public fromDate!: string;

  @Prop()
  public toDate!: string;

  @Prop()
  public readonly value!: object;

  @Prop({ default: false})
  public readonly readonly!: boolean;


  @Watch('value', { immediate: true })
  public onValueChange(value: object) {
    if (!value) {
      this.localValue = {};
      return;
    }
    this.localValue = value;
  }


  public getTimeSlotAt(key: string) {
    return this.localValue[key];
  }

  public setTimeSlotAt(key: string, value: string) {
    this.localValue[key] = value;
    this.$emit('input', this.localValue);
  }

  public get weeks() {
    return weeksArray(this.fromDate, this.toDate);
  }

}
</script>

<style lang="scss" scoped>
.week-column {
  border: 1px solid #e0e0e0;
  padding: 0 2px;
  text-align: center;
}


.overflow-table {
  overflow-x: auto;
}

.list-item-content {
  text-wrap: nowrap;
  padding: 0;
  justify-content: flex-end;
}

.list-item {
  padding: 0 2px;
  text-align: right;
}


</style>