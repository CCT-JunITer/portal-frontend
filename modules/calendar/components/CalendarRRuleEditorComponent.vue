<template>
  <v-select
    v-model="rrule"
    filled
    dense
    hide-details
    :items="templates"
    :item-text="objectToText"
    return-object
    :readonly="readonly"
    :disabled="disabled"
  >
    <template v-slot:append-item>
      <v-dialog
        v-model="dialog"
        width="390"
      >
        <v-card>
          <v-toolbar 
            class="mb-2"
            color="primary" 
            dark

          >
            <div style="font-size: large;">Benutzerdefinierte Wiederholung</div>
          </v-toolbar>
          <v-card-text>
            <v-container>
              <v-row dense align="end">
                <v-col cols="3">
                  Wiederhole
                </v-col>
                <v-col cols="3">
                  <v-text-field
                    v-model="interval"
                    hide-details
                    single-line
                    type="number"
                    dense
                  ></v-text-field>
                </v-col>
                <v-col>
                  <v-select
                    v-model="freq"
                    single-line
                    :items="frequencies"
                    dense
                    hide-details
                  >

                  </v-select>
                </v-col>
              </v-row>



              <v-row>
                <v-col>
                  Ende
                </v-col>
              </v-row>

              <v-radio-group 
                v-model="endtype"
              >
                <v-row>
                  <v-col>
                    <v-radio
                      label="Nie"
                      :value="undefined"
                    >
                    </v-radio>
                  </v-col>
                </v-row>
                <v-row align="center">
                  <v-col cols="3">
                    <v-radio
                      label="Am"
                      value="UNTIL"
                    >
                    </v-radio>
                  </v-col>
                  <v-col cols="auto">
                    <date-picker-menu
                      v-model ="customEndDate"
                      defaultPicker="DATE"
                      :pickerProps="{}"
                      :disabled="endtype != 'UNTIL'"
                    >
                      <template v-slot:activator="{ on, attrs, }">
                        <v-text-field
                          style="padding-top:0"
                          v-bind="attrs"
                          single-line
                          hide-details
                          v-on="on"
                          required
                          :rules="[$common.required]"
                          :disabled="endtype != 'UNTIL'"
                        ></v-text-field>
                      </template>
                    </date-picker-menu>
                  </v-col>
                </v-row>
                <v-row align="end">
                  <v-col cols="3">
                    <v-radio
                      label="Nach"
                      value="COUNT"
                    >
                    </v-radio>
                  </v-col>
                  <v-col cols="3">
                    <v-text-field
                      v-model="customEndCount"
                      hide-details
                      type="number"
                      dense
                      :disabled="endtype != 'COUNT'"
                    ></v-text-field>
                  </v-col>
                  <v-col 
                    cols="auto" 
                    :style="'color:' + ((endtype != 'COUNT') ? 'grey' : 'black')"
                  >
                    Mal
                  </v-col>
                </v-row>
              </v-radio-group>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-btn 
              text
              @click="dialog = false"
            >
              Abbrechen
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn 
              color="success"
              text
              @click="applyCustomRRule"
            >
              Fertig
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>

  </v-select>
</template>

<script>
import DatePickerMenu from '@/components/DatePickerMenu.vue'

export default {
  props: ['value', 'disabled', 'readonly'],

  components: {
    DatePickerMenu
  },

  model: {
    prop:'value',
    event: 'change'
  },

  data() {
    return {
      freqToName:{
        undefined: 'Einmalig',
        'DAILY':'Täglich',
        'WEEKLY': 'Wöchentlich',
        'MONTHLY': 'Monatlich',
        'YEARLY': 'Jährlich',
      },
      freqToNamePlural: {
        'DAILY':'Tägig',
      },
      templates: [
        {freq:undefined},
        {freq:'DAILY'},
        {freq:'WEEKLY'},
        {freq:'WEEKLY', interval:2},
        {freq:'MONTHLY'},
        {freq:'YEARLY'},
        {freq:'custom'}
      ],

      lastRRule: undefined,
      customRRule: {},
      customEndDate: '',
      customEndCount: '',
      dialog:false
    }
  },


  methods: {
    objectToText(obj) {
      const freq = (obj) ? obj.freq : undefined
      if (freq == 'custom') return 'Benutzerdefiniert...'

      let text = this.freqToName[freq]
      if (freq && obj.interval && obj.interval > 1) {
        text = obj.interval + ' ' + ((freq in this.freqToNamePlural) ? this.freqToNamePlural[freq] : this.freqToName[freq])
      }
      
      // console.log(typeName + '  ' + ((obj) ? obj.freq : 'object undefined'))
      if (obj.end && obj.endtype) {
        if (obj.endtype == 'COUNT') {
          text += ', ' + obj.end + ' Mal'
        } else if (obj.endtype == 'UNTIL') {
          const end = new Date(obj.end)
          text += ' bis zum ' + end.getDate() + '.' + end.getMonth() + '.' + end.getFullYear()
        }
      }

      return text
    },

    addTemplate(val){
      const rruleText = this.objectToText(val)

      if (this.rruleTexts.indexOf(rruleText) == -1) {
        const customObject = this.templates[this.templates.length-1]
        this.templates[this.templates.length-1] = {...val}
        this.templates.push(customObject)
      }
    },

    creatCustomRRule() {
      this.customEndDate = new Date().toISOString().substr(0, 10)
      this.customEndCount = 5
      const defaultObject = {
        freq:'WEEKLY',
        interval:1,
        endtype:undefined,
        end:undefined,
        exdate:[]
      }
      if (this.lastRRule && this.lastRRule.freq) Object.assign(defaultObject, this.lastRRule)
      this.customRRule = defaultObject

      if (this.endtype == 'UNTIL') this.customEndDate = this.customRRule.end
      else if (this.endtype == 'COUNT') this.customEndCount = this.customRRule.end
      this.addTemplate(this.customRRule)
      this.dialog = true
    },

    applyCustomRRule() {
      if (this.customRRule.endtype == 'UNTIL') {
        this.customRRule.end = new Date(this.customEndDate)
      } else if (this.customRRule.endtype == 'COUNT') {
        this.customRRule.end = this.customEndCount
      }
      this.rrule = this.customRRule
      this.dialog = false
    },

  },

  created() {
    this.addTemplate(this.rrule)
  },

  watch: {
    rrule: {
      
      handler(newValue, oldValue) {
        if (newValue !== oldValue) this.lastRRule = oldValue
        this.addTemplate(newValue)
        if (newValue.freq == 'custom') {
          this.creatCustomRRule()
        }
      },
    },

    dialog: {
      handler(newValue, oldValue) {
        // dialog was closed
        console.log(newValue, oldValue)
        if (!newValue && oldValue) {
          console.log(this.rrule)
          console.log(this.lastRRule)
          if (this.rrule.freq == 'custom') {
            this.rrule = this.lastRRule
          }
        }
      }
    },
  },

  computed: {
    frequencies: function() {
      const frequencies = []
      for (const [key, value] of Object.entries(this.freqToName)) {
        if (key != 'undefined') {
          frequencies.push({text:value, value:key})
        }
      }
      return frequencies
    },
    rrule: {
      get: function() {
        if (!this.value) return this.templates[0];
        return this.value
      },

      set: function(val) {
        if (val.freq === undefined) val = undefined
        this.$emit('change', {...val});
      }
    },

    rruleTexts: function() {
      const l = []
      this.templates.forEach(element => {
        l.push(this.objectToText(element))
      });
      return l
    },

    interval:{
      get: function() {
        if (!this.customRRule || !this.customRRule.interval) return Number.NaN
        return this.customRRule.interval
      },
      set: function(value) {
        this.customRRule = {...this.customRRule, interval:Number.parseInt(value)}
      }
    },

    freq:{
      get: function() {
        if (!this.customRRule || !this.customRRule.freq) return null
        return this.customRRule.freq
      },
      set: function(value) {
        this.customRRule = {...this.customRRule, freq:value}
      }
    },

    endtype: {
      get: function() {
        if (!this.customRRule || !this.customRRule.endtype) return null 
        return this.customRRule.endtype
      },
      set: function(value) {
        this.customRRule = {...this.customRRule, endtype:value}
      }
    }
  }
}
</script>

<style>

</style>