<template>
  <v-card class="project-available-time" v-bind="$attrs">
    <v-card-title>
      Verfügbarkeit
    </v-card-title>
    <v-card-text>
      <!-- Angebot notwendig -->
      <div class="row">
        <div class="col-md-12">
          <v-checkbox
            v-model="offerNeeded"
            prepend-icon="mdi-presentation"
            label="Angebot notwendig"
            :disabled="true"
          >
          </v-checkbox>
        </div>
      </div>
      <div class="row">
        <div v-for="week in weeks" :key="week.label" class="col-md-3 col-sm-6 col-12 py-1">
          <template v-if="!readonly">
            <v-combobox
              :items="btValues"
              :value="getTimeSlotAt(week.value) || 0"
              @input="setTimeSlotAt(week.value, typeof $event === 'object' && $event !== null ? $event.value : $event)"
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
            {{ $common.decimal2Text(Number(getTimeSlotAt(week.value) || 0), 1) }} BT
          </div>
        </div>
      </div>
    </v-card-text>
    <v-card-text>
      Anmerkung zu Zeitangaben
      <v-textarea
        placeholder="Hier antworten"
        :value="getRemarksValue()"
        @input="setRemarksValue"
        filled
        outlined
        dense
      ></v-textarea>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { weeksArray } from '../util';

@Component({})
export default class ProjectAvailableTime extends Vue {

  public btValues = new Array(16).fill(0).map((_, i) => ({ value: (i)/2, text: `${this.$common.decimal2Text((i)/2)}`}));

  @Prop()
  public fromDate!: string;

  @Prop()
  public toDate!: string;

  @Prop()
  public readonly offerNeeded!: boolean;

  @Prop({ default: false})
  public readonly readonly!: boolean;

  @Prop({ default: () => ({}) })
  public value!: { [key: string]: string | number };

  public getTimeSlotAt(key: string) {
    return this.value[key];
  }

  public setTimeSlotAt(key: string, value: string | number) {
    const updated = { ...this.value, [key]: value };
    this.$emit('input', updated);
  }

  public getRemarksValue(): string {
    return String(this.value['Anmerkungen'] || '');
  }

  public setRemarksValue(value: string) {
    this.setTimeSlotAt('Anmerkungen', value);
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
  white-space: nowrap;
  padding: 0;
  justify-content: flex-end;
}

.list-item {
  padding: 0 2px;
  text-align: right;
}


</style>