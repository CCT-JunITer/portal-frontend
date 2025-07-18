<template>
  <v-card outlined tile class="dotted" max-width="500" v-bind="$attrs">
    <v-card-title>Rechnung</v-card-title>
    <v-card-text class="text-no-wrap">
      <v-simple-table dense fixed-header>
        <thead>
          <tr>
            <th class="text-left">
              Bezeichnung
            </th>
            <th class="text-right">
              Wert 
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>BT (soll)</td>
            <td class="text-right">{{ project.bt_amount_expected }} BT</td>
          </tr>
          <tr
            v-for="v in values"
            :key="v.name">
            <td>{{ v.name }}</td>
            <td class="text-right">{{ v.key }}</td>
          </tr>
        </tbody>
        <tfoot class="font-weight-bold">
          <tr>
            <td>
              Gesamt
            </td>
            <td class="text-right">
              {{ $common.decimal2Text(total_bt, 2) }} BT
            </td>
          </tr>
          <tr v-if="total_volume">
            <td>
              Gesamt-Volumen
            </td>
            <td class="text-right">
              {{ $common.decimal2Text(total_volume, 2) }} €
            </td>
          </tr>
        </tfoot>
      </v-simple-table>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Project } from '../types'

@Component({})
export default class ProjectCalculation extends Vue {

  @Prop()
  public project!: Project;

  public get total_bt() {
    const bt = this.project.bt_amount_expected || 0;
    return bt 
      + (bt * (this.project.surcharge_amount_project_management || 0) / 100)
      + (bt * (this.project.surcharge_amount_documentation || 0) / 100)
  }

  public get total_volume() {
    return this.total_bt * (this.project.bt_rate || 0) 
      + (this.project.surcharge_amount_travel || 0)
      + (this.project.surcharge_amount_other || 0);
  }

  public get values() {
    return [{
              name: 'PM-Zuschlag',
              key: this.$common.decimal2Text(this.project.surcharge_amount_project_management) + '%',
              value: this.project.surcharge_amount_project_management,
            },
            {
              name: 'Dokumentationszuschlag',
              key: this.$common.decimal2Text(this.project.surcharge_amount_documentation) + '%',
              value: this.project.surcharge_amount_documentation,
            },
            {
              name: 'Reisekostenzuschlag',
              key: this.$common.decimal2Text(this.project.surcharge_amount_travel) + '€',
              value: this.project.surcharge_amount_travel,
            },
            {
              name: 'Zuschlag durch Sonstiges',
              key: this.$common.decimal2Text(this.project.surcharge_amount_other) + '€',
              value: this.project.surcharge_amount_other,
            },
            {
              name: 'Aufwand Angebotserstellung (BT)',
              key: this.$common.decimal2Text(this.project.bt_amount_bid_preparation) +  ' BT',
              value: this.project.bt_amount_bid_preparation,
            }
    ].filter(c => c.value)
  }
}
</script>

<style lang="scss" scoped>

.dotted {
  border-style: dashed;
}

</style>