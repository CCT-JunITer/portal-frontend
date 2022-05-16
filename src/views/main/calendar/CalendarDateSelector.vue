<template>
  <v-menu
    v-model="pickerVisible"
    :close-on-content-click="false"
    :nudge-right="40"
    transition="scale-transition"
    offset-y
    max-width="290px"
    min-width="290px"
  >
    <template v-slot:activator="{ on }">
      <v-text-field
        :label="label"
        :prepend-icon="icon"
        readonly
        :value="dateStringGerman + ' um ' + time"
        v-on="on"
      ></v-text-field>
    </template>
    <v-tabs
      fixed-tabs
      v-model="tab"
    >
      <v-tab
        @click="timeView=true"
      >Datum</v-tab>
      <v-tab>Zeit</v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item>
        <v-date-picker
          v-model="date"
          no-title
          scrollabe
          @input="tab = 1"
        ></v-date-picker>
      </v-tab-item>
      <v-tab-item>
        <v-time-picker
          ref="timePicker"
          v-model="time"
          format="24hr"
          scrollable
          no-title
          @click:minute="close"
        >
        </v-time-picker>
      </v-tab-item>
    </v-tabs-items>
  </v-menu>
</template>
<script>
export default {
  props: ['label', 'icon', 'value'],

  model: {
    prop: 'value',
    event: 'input'
  },

  data() {
    return {
      pickerVisible: false,
      tab:0,
      timeView:false
    };
  },

  methods: {
    close() {
      this.pickerVisible = false
      this.tab = 0
    }
  },
  computed: {
    dateString: {
      get() {
        let str = '';
        if (this.content) {
          str =  this.content.toISOString().split('T')
          str = str[0] + ' ' + str[1].substring(0,5)
        }
        return this.date + ' ' + this.time
      },
      set(value) {
        this.content = new Date(value)
      }
    },

    dateStringGerman() {
      const year = ('000' + this.content.getFullYear()).slice(-4)
      const month = ('0' + (this.content.getMonth()+1)).slice(-2)
      const day = ('0' + (this.content.getDate()+1)).slice(-2)
      return day + '.' + month + '.' + year
    },

    date: {
      get() {
        let str = ''
        if (this.content) {
          const year = ('000' + this.content.getFullYear()).slice(-4)
          const month = ('0' + (this.content.getMonth()+1)).slice(-2)
          const day = ('0' + (this.content.getDate()+1)).slice(-2)
          str =  year + '-' + month + '-' + day
        }
        return str
      },
      set(value) {
        const splitted = value.split('-')
        const year = parseInt(splitted[0])
        const month = parseInt(splitted[1])-1
        const day = parseInt(splitted[2])-1
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
          str = ('0' + this.content.getHours()).slice(-2) + ':' + ('0' + this.content.getMinutes()).slice(-2)
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
        console.log(this.$refs)
      }
    }
  },
};
</script>
