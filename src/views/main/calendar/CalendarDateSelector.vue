<template>
  <v-menu
    ref="menu"
    v-model="pickerVisible"
    :close-on-content-click="false"
    :nudge-right="40"
    :return-value.sync="test"
    transition="scale-transition"
    offset-y
    max-width="290px"
    min-width="290px"
    @input="tab=0"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        :label="label"
        :prepend-icon="prependIcon"
        :append-icon="appendIcon"
        readonly
        :value="dateString"
        v-on="on"
        v-bind="attrs"
      ></v-text-field>
    </template>
    <v-tabs
      v-if="timed"
      fixed-tabs
      v-model="tab"
    >
      <v-tab
        @click="timeView=true"
      >Datum</v-tab>
      <v-tab>Zeit</v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab" v-if="timed">
      <v-tab-item>
        <v-date-picker
          v-model="date"
          no-title
          scrollabe
          @input="tab = 1"
          :min="minDateString"
          :max="maxDateString"
        ></v-date-picker>
      </v-tab-item>
      <v-tab-item>
        <v-time-picker
          v-if="tab==1"
          ref="timePicker"
          v-model="time"
          format="24hr"
          scrollable
          no-title
          first-day-of-week="1"
          @click:minute="close"
          :min="minTimeString"
          :max="maxTimeString"
        >
        </v-time-picker>
      </v-tab-item>
    </v-tabs-items>
    <v-date-picker
      v-if="!timed"
      v-model="date"
      no-title
      scrollabe
      first-day-of-week="1"
      @input="close"
      :min="minDateString"
      :max="maxDateString"
    ></v-date-picker>
  </v-menu>
</template>
<script>

function dateToTimeString(date) {
  const parts = dateToParts(date)
  return parts.hour + ':' + parts.minute
}

function dateToParts(date, timed=true) {
  const dateCopy = new Date(date)
  return {
    year : ('000' + dateCopy.getFullYear()).slice(-4),
    month : ('0' + (dateCopy.getMonth()+1)).slice(-2),
    day : ('0' + dateCopy.getDate()).slice(-2),
    hour : (('0' + dateCopy.getHours()).slice(-2)),
    minute : ('0' + dateCopy.getMinutes()).slice(-2)
  }
}

export default {
  props: ['label', 'prependIcon', 'appendIcon', 'value', 'timed', 'min', 'max'],

  model: {
    prop: 'value',
    event: 'input'
  },

  data() {
    return {
      pickerVisible: false,
      tab:0,
      timeView:false,
      test:null
    };
  },

  methods: {
    close() {
      this.pickerVisible = false
      this.tab = 0
    }
  },
  computed: {
    minDateString() {
      if (!this.min) return ''
      const parts = dateToParts(this.min)
      return parts.year + '-' + parts.month + '-' + parts.day
    },
    maxDateString() {
      if (!this.max) return ''
      const parts = dateToParts(this.max)
      return parts.year + '-' + parts.month + '-' + parts.day
    },
    minTimeString() {
      if (!this.min || this.minDateString != this.date) return ''
      return dateToTimeString(this.min)
    },
    maxTimeString() {
      if (!this.max || this.maxDateString != this.date) return ''
      return dateToTimeString(this.max)
    },
    // minTimeString() {
    //   if (!this.min) return ''
    //   const date = new Date(this.min)
    //   date.setMinutes(date.getMinutes()+1)
    //   return date.toISOString()
    // },


    dateString: {
      get() {
        if (!this.timed) return this.dateStringGerman
        return this.dateStringGerman + ' um ' + this.time
      },
      set(value) {
        this.content = new Date(value)
      }
    },

    dateStringGerman() {
      const parts = dateToParts(this.content, this.timed)
      return parts.day + '.' + parts.month + '.' + parts.year
    },

    date: {
      get() {
        let str = ''
        if (this.content) {
          const parts = dateToParts(this.content, this.timed)
          str = parts.year + '-' + parts.month + '-' + parts.day
        }
        return str
      },
      set(value) {
        const splitted = value.split('-')
        const year = parseInt(splitted[0])
        const month = parseInt(splitted[1])-1
        const day = parseInt(splitted[2])
        const newDate = new Date(this.content)
        newDate.setFullYear(year)
        newDate.setMonth(month)
        newDate.setDate(day)
        this.content = newDate
      }
    },

    time: {
      get() {
        let str = ''
        if (this.content) {
          str = dateToTimeString(this.content)
        }
        return str
      }, 
      set(value) {
        const hour = parseInt(value.split(':')[0])
        const minutes = parseInt(value.split(':')[1])
        const oldDate = new Date(this.content)
        oldDate.setHours(hour)
        oldDate.setMinutes(minutes)
        
        this.content = oldDate
      }
    },

    content: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      }
    }
  },
};
</script>
