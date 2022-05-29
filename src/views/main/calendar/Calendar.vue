<template>
  <div class="calendarContainer">
    <div class="calendarSidebar">
      
      <v-date-picker 
        v-model="picker"
        first-day-of-week="1"
        no-title
        :type="pickerType"
        scrollable
        color="primary"
      >
      </v-date-picker>
      <v-btn
        class=""
        block
        color="primary"
        @click="createNewEvent"
      >
        Event erstellen
      </v-btn>

      <v-expansion-panels 
        :value="1"
        class="mt-2" 
        flat
        tile
        ref="calendarSelector"
      >
        <v-expansion-panel ref="calendarSelectorPanel">
          <v-expansion-panel-header>
            <div style="color:#757575">Deine Kalender</div>
          </v-expansion-panel-header>

          <v-expansion-panel-content>
            <v-list-item 
              v-for="(calendar, i) in calendars"
              :key="i"
            >
              <calendar-toolbar :calendarId="calendar.uid" @change="getEvents({start:undefined, end:undefined})">
              </calendar-toolbar>
            </v-list-item>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <!-- <v-divider class="my-2"></v-divider> -->

      <div style="height:100%;"></div>

      <v-btn
        style="width=100%"
        :href="`https://cloud.cct-ev.de/apps/calendar/${this.nextcloudViewTypes[this.type]}/${this.value.toISOString().substring(0,10)}`" 
        target="_blank"
      >
        <v-icon>mdi-open-in-new</v-icon> In der Nextcloud bearbeiten
      </v-btn>
      
    </div>

    <!-- <v-divider vertical> </v-divider> -->

    <div class="calendarMainView">
      <v-sheet height="64">
        <v-toolbar
          flat
        >
          <v-btn
            outlined
            class="mr-4"
            color="grey darken-2"
            @click="() => this.value = new Date()"
          >
            Heute
          </v-btn>
          <v-btn
            fab
            text
            small
            color="grey darken-2"
            @click="$refs.calendar.prev()"
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
            @click="$refs.calendar.next()"
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
      <div class ="VCalendarView">
        <v-calendar
          ref="calendar"
          v-model="value"
          :weekdays="weekday"
          :type="type"
          :events="events"
          :event-overlap-mode="mode"
          :event-overlap-threshold="30"
          :event-color="event => event.color"
          @click:event="showEvent"
          @change="getEvents"
          @click:date="viewDay"
          
        ></v-calendar>
        
        <calendar-event-popup 
          ref="calendarEventPopup" 
          @clickEditEvent="showEventEditor"
          @changed="update(true)">
        </calendar-event-popup>
      </div>

    </div>
  </div>
</template>

<script>

import {api} from '@/api';
import { parseJSON } from 'date-fns';
import { keyword } from 'color-convert';
import CalendarEventPopup from './CreateEventPopup.vue'
import CalendarToolbar from './CalendarToolbar.vue';
import { commitSetSelectedEvent } from '@/store/calendar/mutations';
import { dispatchFetchCalendars } from '@/store/calendar/actions';
import { readCalendars } from '@/store/calendar/getters';
import { CalendarEvent } from './CalendarEvent';
import { readAuthenticationURL } from '@/store/main/getters';


const FREQUENCIES = {'SECONDLY':1000, 'MINUTELY':60000, 'HOURLY':3600000, 'DAILY':86400000, 'WEEKLY':604800000}
function constructUIEvents(event, calendar) {
  const events = []
  let event_color = (calendar.color) ? calendar.color : 'blue';
  if (event.eventColor) {
    const rgb = keyword.rgb(event.eventColor)
    event_color = 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')'
  }

  const rrule = event.rrule
  let condition;
  if (rrule) {
    if (rrule.endtype == 'COUNT') {
      rrule.end = parseInt(rrule.end)
      condition = (i, date) => {return i < rrule.end};
    } else if (rrule.endtype == 'UNTIL') {
      const end = new Date(rrule.end)
      condition = (i, date) => {return date < end};
    } else {
      console.error('The type ' + rrule.endtype + ' is not known!')
    }
  } else {
    condition = (i, date) => {return i < 1};
  }
  let event_start = event.start;
  let event_end = event.end;
  if (event.name == 'Test allday') {
    console.log(event)
  }
  for (let i = 0; condition(i, event_start); i++) {
    event_start = new Date(event.start)
    event_end = new Date(event.end)

    if (rrule) {
      if (rrule.freq == 'MONTHLY') {
        event_start.setMonth(event_start.getMonth()+i)
        event_end.setMonth(event_end.getMonth()+i)
      } else if (rrule.freq == 'YEARLY') {
        event_start.setFullYear(event_start.getFullYear()+i)
        event_end.setFullYear(event_end.getFullYear()+i)
      } else {
        if (rrule.freq in FREQUENCIES) {
          event_start = new Date(event_start - (FREQUENCIES[rrule.freq]*-i))
          event_end = new Date(event_end - (FREQUENCIES[rrule.freq]*-i))
        }
      }

      

      if (rrule.exdate.find(element => new Date(element).toISOString() == event_start.toISOString())) {
        continue;
      }
    }

    if (!event.timed) {
      event_end.setDate(event_end.getDate()-1)
    }
    events.push({
      name:event.name,
      start:event_start,
      end:event_end,
      color:event_color,
      timed:event.timed,
      event:event,
      iteration:i
    })
  }




  return events
}

export default {
  components: {
    CalendarToolbar,
    CalendarEventPopup
  },

  async created() {
    this.update(true);
  },

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
    value: new Date(),
    viewStart:undefined,
    viewEnd:undefined,
    events: [],
    colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'],
    names: ['Meeting', 'Holiday', 'PTO', 'Travel', 'Event', 'Birthday', 'Conference', 'Party'],
    nextcloudViewTypes: {'day':'timeGridDay', 'week':'timeGridWeek', 'month':'dayGridMonth'},

    overlay: true,
    newEvent: null,
    newEventDiv: null,

    // for drag and drop
    dragEvent: null,
    dragStart: null,
    createEvent: null,
    createStart: null,
    extendOriginal: null,
    dragDiv: null,
  }),
  methods: {
    async getEvents (payload, notify=true, fetch=false) {
      const {start, end} = this.getDateTimespan()
      // if (start && end.date) {
      //   if (start.date) start = new Date(start.date + 'T' + start.time)
      // }
      // if (end && end.date) {
      //   if (end.date) end = new Date(end.date + 'T' + end.time)
      // }

      if (start && end && !fetch) {
        if (this.viewStart > start || end > this.viewEnd) {
          fetch = true
        }
      }

      if (fetch) {
        this.viewStart = start
        this.viewEnd = end
        
        await dispatchFetchCalendars(this.$store, {notify:notify, start:start, end:end})
      }
      // if (!this.calendars) {
      //   this.calendars = await this.dateSearch()
      // }

      // TODO: finish the reading of the events
      const events = []
      // const interval = this.getDateTimespan()
      // const start_d = interval.start
      // const end_d = interval.end
      // console.log(start_d.toISOString())
      // console.log(end_d.toISOString())

      // const calendars = await this.dateSearch(start_d, end_d)
      console.log(this.calendars)
      for (let i = 0; i < this.calendars.length; i++) {
        const activeCalendar = this.calendars[i];
        if (activeCalendar.active === undefined) activeCalendar.active = true;

        if (activeCalendar.active) {
          for (let j = 0; j < activeCalendar.events.length; j++) {
            // TODO: those conversions should be done in create
            // TODO: create somewhere a Event Class
            // const activeEvent = activeCalendar.events[j];
            // // activeEvent.uiEvents = []

            // const event_start = new Date(activeEvent.start)
            // const event_end = new Date(activeEvent.end)
            // if (!activeEvent.timed) event_end.setDate(event_end.getDate()-1)
            
            // let event_color = (activeCalendar.color) ? activeCalendar.color : this.colors[i];
            // if (activeEvent.eventColor) {
            //   const rgb = keyword.rgb(activeEvent.eventColor)
            //   event_color = 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')'
            //   // event_color = this.colors[i]
            // }
            // activeEvent.start = event_start
            // activeEvent.end = event_end
            // activeEvent.color = event_color


            // let new_event = {
            //   name: activeEvent.name,
            //   start: event_start,
            //   end: event_end,
            //   color: event_color,
            //   timed: activeEvent.timed,
            //   event: activeEvent
            // }
            // activeEvent.uiEvents.push(new_event)
            const activeEvent = constructUIEvents(activeCalendar.events[j], activeCalendar);
            events.push(...activeEvent)

            // if (activeEvent.rrule) {
            //   if (activeEvent.rrule.endtype == 'COUNT') {
            //     for (let k = 1; k <= activeEvent.rrule.end; k++) {
            //       event_start = new Date(activeEvent.start)
            //       event_end = new Date(activeEvent.end)
            //       if (activeEvent.rrule.freq == 'DAILY') {
            //         event_start.setDate(event_start.getDate()+k)
            //         event_end.setDate(event_end.getDate()+k)
            //       } else {
            //         break
            //       }
            //       new_event = {
            //         name: activeEvent.name,
            //         start: event_start,
            //         end: event_end,
            //         color: event_color,
            //         timed: activeEvent.timed,
            //         event: activeEvent
            //       }
            //       activeEvent.uiEvents.push(new_event)
            //       events.push(new_event)

            //     }
            //   }
            // }
          }
        }
      }
      // if (this.newEvent) events.push(this.newEvent)
      // const min = new Date(`${start.date}T00:00:00`)
      // const max = new Date(`${end.date}T23:59:59`)
      // const days = (max.getTime() - min.getTime()) / 86400000
      // const eventCount = this.rnd(days, days + 20)

      // for (let i = 0; i < eventCount; i++) {
      //   const allDay = this.rnd(0, 3) === 0
      //   const firstTimestamp = this.rnd(min.getTime(), max.getTime())
      //   const first = new Date(firstTimestamp - (firstTimestamp % 900000))
      //   const secondTimestamp = this.rnd(2, allDay ? 288 : 8) * 900000
      //   const second = new Date(first.getTime() + secondTimestamp)

      //   events.push({
      //     name: this.names[this.rnd(0, this.names.length - 1)],
      //     start: first,
      //     end: second,
      //     color: this.colors[this.rnd(0, this.colors.length - 1)],
      //     timed: !allDay,
      //   })
      // }
      this.events = events
    },

    async update(notify) {
      const {start, end} = this.getDateTimespan()
      await this.getEvents({start:start, end:end}, notify, true)
      if (this.$refs.calendarSelectorPanel) this.$refs.calendarSelectorPanel.isActive = true;
    },

    // async dateSearch(start=undefined, end=undefined, calendars=undefined) {
    //   const response = await api.getCalendar(this.$store.state.main.token, start, end, calendars)
    //   // const events = JSON.parse(response.data)
    //   return response.data
    // },

    showEventEditor(selectedEvent) {
      this.$refs.CreateEventView.show(selectedEvent)
    },

    // rnd (a, b) {
    //   return Math.floor((b - a + 1) * Math.random()) + a
    // },
    // rndElement (arr) {
    //   return arr[this.rnd(0, arr.length - 1)]
    // },

    datePickerChanged(date) {
      const newDate = new Date(date)
      if (this.type == 'month')this.value = new Date(this.value.setFullYear(newDate.getFullYear(), newDate.getMonth()))
      else this.value = new Date(this.value.setFullYear(newDate.getFullYear(), newDate.getMonth(), newDate.getDate()))
    },
    // async setToday() {
    //   // const test = await api.getCalendar(this.$store.state.main.token)
    //   // console.log(test.data)
    //   this.value = new Date()
    // },
    // prev() {
    //   const offset = -1
    //   if (this.type == 'month') {
    //     this.value = new Date(this.value.setMonth(this.value.getMonth()+ offset))
    //   } else if (this.type == 'week') {
    //     this.value = new Date(this.value.setDate(this.value.getDate()+ (offset*7)))
    //   } else if (this.type == 'day') {
    //     this.value = new Date(this.value.setDate(this.value.getDate()+ offset))
    //   } else {
    //     throw new Error('The type ' + this.type + ' is not defined!');
    //   }
    // },
    // next() {
    //   const offset = 1
    //   if (this.type == 'month') {
    //     this.value = new Date(this.value.setMonth(this.value.getMonth()+ offset))
    //   } else if (this.type == 'week') {
    //     this.value = new Date(this.value.setDate(this.value.getDate()+ (offset*7)))
    //   } else if (this.type == 'day') {
    //     this.value = new Date(this.value.setDate(this.value.getDate()+ offset))
    //   } else {
    //     throw new Error('The type ' + this.type + ' is not defined!');
    //   }
    // },

    viewDay ({ date }) {
      this.type = 'day'
      this.value = new Date(date)
    },

    showEvent ({ nativeEvent, event }) {
      const open = () => {
        const eventCopy = Object.assign({}, event.event)
        eventCopy.start = new Date(event.start)
        eventCopy.end = new Date(event.end)
        console.log(eventCopy)
        commitSetSelectedEvent(this.$store, eventCopy)
        this.$refs.calendarEventPopup.setSelectedElement(nativeEvent.target)
        requestAnimationFrame(() => requestAnimationFrame(() => this.$refs.calendarEventPopup.show()))
      }

      if (this.selectedOpen) {
        this.selectedOpen = false
        requestAnimationFrame(() => requestAnimationFrame(() => open()))
      } else {
        open()
      }

      nativeEvent.stopPropagation()
    },

    getDateTimespan() {
      if (this.type == 'month') {
        const start_of_month = new Date(this.value.getFullYear(), this.value.getMonth())
        const end_of_month = this.getLastDayOfMonth(this.value)
        return {start: this.getMonday(start_of_month), end: this.getSunday(end_of_month)}
      } else if (this.type == 'week') {
        const monday = this.getMonday(this.value);
        const sunday = this.getSunday(this.value);
        return {start: monday, end: sunday}
      } else if (this.type == 'day') {
        return {start: this.value, end: this.value}
      }
    },

    getMonday(d) {
      d = new Date(d);
      const day = d.getDay()
      const diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
      return new Date(d.setDate(diff));
    },

    getSunday(d) {
      d = new Date(d);
      const day = d.getDay()
      const diff = d.getDate() + (7-day) + (day == 0 ? -7:0); // adjust when day is sunday
      return new Date(d.setDate(diff));
    },

    getLastDayOfMonth(d) {
      return new Date(d.getFullYear(), d.getMonth() + 1, 0);
    },

    // getCalendarByName(name) {
    //   this.calendars.forEach(element => {
    //     if (element.name == name) return element
    //   });
    //   return null
    // },

    createNewEvent() {
      // if (!this.newEvent) {
      //   this.newEvent = new Event()
      //   this.events.push(this.newEvent)
      // }
      // for (const key in this.newEvent) {
      //   delete this.newEvent[key]
      // }

      const calendar = this.calendars[0]
      const end = new Date(this.value)
      end.setHours(end.getHours()+2)
      const event = new CalendarEvent()
      event.name = 'Neues Event'
      event.start = new Date(this.value),
      event.end = end,
      event.calendarId = calendar.uid

      // this.addEventToView(this.newEvent)
      const uiEvent = constructUIEvents(event, calendar);
      this.events.push(...uiEvent);

      return this.newEvent
    },

    addEventToView(event) {
      const uiEvent = this.newEvent.toUIEvent()
      if (!event.uiEvents) event.uiEvents = []
      event.uiEvents.push(uiEvent)
      this.events.push(uiEvent);
    }
  },

  computed: {
    picker: {
      get: function() {
        const val = this.value.toISOString()
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
    },

    calendars: function ()  {
      return readCalendars(this.$store)
    },

    authenticationURL: function() {
      return readAuthenticationURL(this.$store);
    }

  },

  watch: {
    authenticationURL(val) {
      if (!val) {
        this.update(true)
      }
    }
  }
}
</script>

<style scoped>
  :root {
    --calendarSidebar: #A2A2A1FF;
  }

  .calendarContainer {
    display: flex;
    position:fixed;
    flex-direction: row;
    height:calc(100% - 64px);
    width:100%;
    background-color:#EEEEEE;
  }

.calendarSidebar {
  background-color:#EEEEEE;
  color:#757575;
  height:calc(100%);
  width:300px;
  display:flex;
  align-items:flex-start;
  flex-direction: column;
  flex-basis:auto;
}

.calendarMainView {
  width:100%;
  height: 100%;
}

.VCalendarView {
  height:calc(100% - 64px);
}

</style>

<style>


.v-date-picker-table {
  background: #EEEEEE;
}

.v-date-picker-header {
  background-color: #EEEEEE;
}

.v-expansion-panel-content__wrap {
  background-color: #EEEEEE;
}

.v-expansion-panel-header {
  background-color: #EEEEEE;
}
</style>