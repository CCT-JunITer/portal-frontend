<template>
  <div class="container">
    <div class="sidebar">
      <v-btn
        class=""
        block
        color="primary"
      >
        Event erstellen
      </v-btn>

      <v-date-picker 
        v-model="picker"
        first-day-of-week="1"
        no-title
        :type="pickerType"
        scrollable>
      </v-date-picker>

      <v-divider class="my-2"></v-divider>

    </div>

    <div class="mainView">
      <v-sheet height="64">
        <v-toolbar
          flat
        >
          <v-btn
            outlined
            class="mr-4"
            color="grey darken-2"
            @click="setToday"
          >
            Heute
          </v-btn>
          <v-btn
            fab
            text
            small
            color="grey darken-2"
            @click="prev"
          >
            <v-icon small>
              mdi-chevron-left
            </v-icon>
          </v-btn>
          <v-btn
            fab
            text
            small
            color="grey darken-2"
            @click="next"
          >
            <v-icon small>
              mdi-chevron-right
            </v-icon>
          </v-btn>
          <v-toolbar-title v-if="$refs.calendar">
            {{ $refs.calendar.title }}
          </v-toolbar-title>

          <v-spacer></v-spacer>
          <v-btn-toggle
            v-model="type"
            group
            mandatory
          >
            <v-btn value="day">
              Tag
            </v-btn>

            <v-btn value="week">
              Woche
            </v-btn>

            <v-btn value="month">
              Monat
            </v-btn>
          </v-btn-toggle>
        </v-toolbar>
      </v-sheet>
      <v-sheet height="100%" width="100%">
        <v-calendar
          ref="calendar"
          v-model="value"
          :weekdays="weekday"
          :type="type"
          :events="events"
          :event-overlap-mode="mode"
          :event-overlap-threshold="30"
          :event-color="getEventColor"
          :start="start"
          @change="getEvents"
          @click:date="viewDay"
        ></v-calendar>
      </v-sheet>

      <v-btn
        class="white--text"
        color="teal"
        @click="overlay = !overlay"
      >
        Show Overlay
      </v-btn>

      <v-overlay
        :value="overlay"
      > 
        <v-container>
          <v-row>
            <v-col>
              <v-btn
                class="white--text"
                color="teal"
                @click="overlay = false"
              >
                Hide Overlay
              </v-btn>

            </v-col>
          </v-row>
        </v-container>
      </v-overlay>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    type: 'month',
    types: ['month', 'week', 'day'],
    mode: 'stack',
    modes: ['stack', 'column'],
    weekday: [1, 2, 3, 4, 5, 6, 0],
    weekdays: [
      { text: 'Sun - Sat', value: [0, 1, 2, 3, 4, 5, 6] },
      { text: 'Mon - Sun', value: [1, 2, 3, 4, 5, 6, 0] },
      { text: 'Mon - Fri', value: [1, 2, 3, 4, 5] },
      { text: 'Mon, Wed, Fri', value: [1, 3, 5] },
    ],
    value: '',
    start:new Date(),
    events: [],
    colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'],
    names: ['Meeting', 'Holiday', 'PTO', 'Travel', 'Event', 'Birthday', 'Conference', 'Party'],

    overlay: false,
  }),
  methods: {
    getEvents ({ start, end }) {
      const events = []

      const min = new Date(`${start.date}T00:00:00`)
      const max = new Date(`${end.date}T23:59:59`)
      const days = (max.getTime() - min.getTime()) / 86400000
      const eventCount = this.rnd(days, days + 20)

      for (let i = 0; i < eventCount; i++) {
        const allDay = this.rnd(0, 3) === 0
        const firstTimestamp = this.rnd(min.getTime(), max.getTime())
        const first = new Date(firstTimestamp - (firstTimestamp % 900000))
        const secondTimestamp = this.rnd(2, allDay ? 288 : 8) * 900000
        const second = new Date(first.getTime() + secondTimestamp)

        events.push({
          name: this.names[this.rnd(0, this.names.length - 1)],
          start: first,
          end: second,
          color: this.colors[this.rnd(0, this.colors.length - 1)],
          timed: !allDay,
        })
      }

      this.events = events
    },
    getEventColor (event) {
      return event.color
    },
    rnd (a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a
    },

    datePickerChanged(date) {
      const newDate = new Date(date)
      if (this.type == 'month')this.start = new Date(this.start.setFullYear(newDate.getFullYear(), newDate.getMonth()))
      else this.start = new Date(this.start.setFullYear(newDate.getFullYear(), newDate.getMonth(), newDate.getDate()))
    },
    setToday() {
      this.start = new Date()
    },
    prev() {
      const offset = -1
      if (this.type == 'month') {
        this.start = new Date(this.start.setMonth(this.start.getMonth()+ offset))
      } else if (this.type == 'week') {
        this.start = new Date(this.start.setDate(this.start.getDate()+ (offset*7)))
      } else if (this.type == 'day') {
        this.start = new Date(this.start.setDate(this.start.getDate()+ offset))
      } else {
        throw new Error('The type ' + this.type + ' is not defined!');
      }
    },
    next() {
      const offset = 1
      if (this.type == 'month') {
        this.start = new Date(this.start.setMonth(this.start.getMonth()+ offset))
      } else if (this.type == 'week') {
        this.start = new Date(this.start.setDate(this.start.getDate()+ (offset*7)))
      } else if (this.type == 'day') {
        this.start = new Date(this.start.setDate(this.start.getDate()+ offset))
      } else {
        throw new Error('The type ' + this.type + ' is not defined!');
      }
    },

    viewDay ({ date }) {
      this.focus = date
      this.type = 'day'
      this.start = new Date(date)
    },

  },

  computed: {
    picker: {
      get: function() {
        const val = this.start.toISOString()
        if (this.type == 'month') return val.substring(0,7)
        return val.substring(0,10)
      },
      set: function(newDate) {
        this.datePickerChanged(newDate)
      }
    },
    pickerType: function() {
      if (this.type == 'month') return 'month';
      else {
        return 'date'
      }
    }

  }
}
</script>

<style>
.container {
  display: flex;
  width:100%;
  height:100%;
  padding:0;
}

.sidebar {
}

.mainView {
  padding-left:5px; 
  width:100%;
  height: 100%;
}

</style>