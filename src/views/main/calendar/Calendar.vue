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
        <v-expansion-panel 
          ref="calendarSelectorPanel"
        >
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
            <v-list-item 
              v-if="towernutzung&&towerCalendar"
            >
              <calendar-toolbar :calendarId="towerCalendar.uid" :tower="true" @change="getEvents({start:undefined, end:undefined})">
              </calendar-toolbar>
            </v-list-item>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <!-- <v-divider class="my-2"></v-divider> -->

      <div style="height:100%;"></div>

      <v-btn
        style="width=100%"
        :href="`https://cloud.cct-ev.de/apps/calendar/${this.nextcloudViewTypes[this.type]}/${toUTCDateString(this.value)}`" 
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
            @click="() => this.value = 'today'"
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
          
        >
          <template v-slot:day-header="{}">
            <v-icon v-if="!towernutzung">mdi-chess-rook</v-icon>
          </template>
          <template 
            v-if="!towernutzung"
            v-slot:interval="{minutesToPixels, hour, day, month, year}"
          >
            <template
              v-for="event in getIntervalTowerEvents({minute:0, hour:hour, day:day, month:month-1, year:year})"
            >
              <div 
                :style="'margin-top:'+minutesToPixels(getIntervalEventStart(hour,day,month-1,year,event).getMinutes())+'px;height:'+minutesToPixels(getIntervalEventLength(hour,day,month-1,year,event))+'px;background-color:black;width:20px;z-index:30;position:absolute'"
                :key="event.uid"
              >
              </div>
            </template>
          </template>
          <template v-slot:event="{event, timeSummary}">
            <div v-if="type=='month'" class="ml-1">
              <strong v-if="event.event.timed" v-html="timeSummary()"></strong> <v-icon v-if="event.event.tower&&!towernutzung">mdi-chess-rook</v-icon>{{event.name}}
            </div>
            <div v-else :style="'padding-left:'+ ((getIntervalTowerEvents({minute:event.start.getMinutes(), hour:event.start.getHours(), day:event.start.getDate(), month:event.start.getMonth(), year:event.start.getFullYear()}).length > 0 && !towernutzung) ? '25' : '5') +'px'">
              <strong>{{event.name}} <v-icon v-if="event.event.tower&&!towernutzung">mdi-chess-rook</v-icon> </strong><div v-if="event.event.timed" ><div v-html="timeSummary()"></div></div>
            </div>
          </template>
        </v-calendar>
        
        <calendar-event-popup 
          ref="calendarEventPopup" 
          @clickEditEvent="showEventEditor"
          @changed="update(false, false)"
        >
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
import { readCalendars, readSelectedEvent, readTowerCalendar } from '@/store/calendar/getters';
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

function constructUIEventsFromDates(event, calendar) {
  const events = []
  let event_color = (calendar.color) ? calendar.color : 'blue';
  if (event.eventColor) {
    const rgb = keyword.rgb(event.eventColor)
    event_color = 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')'
  }

  event.dates.forEach((d, i, array) => {
    events.push({
      name:event.name,
      start:new Date(d[0]),
      end:new Date(d[1]),
      color:event_color,
      timed:event.timed,
      event:event,
      iteration:i
    })
  })
  return events
}

export default {
  components: {
    CalendarToolbar,
    CalendarEventPopup
  },

  async created() {
    // if (this.$route.params['viewType'] != 'default') {
    //   this.type = this.$route.params['viewType']
    // }
    // if (this.$route.params['viewDate'] != 'default') {
    //   if (this.$route.params['viewDate'].toLowerCase() == 'today') {
    //     this.value = new Date()
    //   } else {
    //     this.value = new Date(this.$route.params['viewDate'])
    //   }
    // }

    this.update(true);
  },

  data: () => ({
    // type: 'month',
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
    towerIndicatorIntervals:[0,15,30,45],
    towerIndicatorIntervalLength:1000*60*15, // 15 minutes
    // value: new Date(),
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
    async getEvents (payload, notify=true, fetch=false, calendarIds=undefined) {
      const {start, end} = this.getDateTimespan()

      if (start && end && !fetch) {
        if (this.viewStart > start || end > this.viewEnd) {
          fetch = true
        }
      }

      if (fetch) {
        if (!this.viewStart || this.viewStart > start) {
          this.viewStart = start
        }
        if (!this.viewEnd || this.viewEnd < end) {
          this.viewEnd = end
        }
        
        await dispatchFetchCalendars(this.$store, {notify:notify, start:start, end:end, calendarIds:calendarIds})
      }

      const events = []
      const towerIds = new Set()

      console.log([...this.calendars, this.towerCalendar])
      const towernutzung = this.towernutzung
      for (let i = 0; i < this.calendars.length; i++) {
        const activeCalendar = this.calendars[i];
        if (activeCalendar.active === undefined) activeCalendar.active = true;

        if (activeCalendar.active) {
          for (let j = 0; j < activeCalendar.events.length; j++) {
            const event = activeCalendar.events[j]

            if (!towernutzung || event.tower) { // only tower events are displayed if towernutzung
              const uiEvents = constructUIEventsFromDates(event, activeCalendar);
              events.push(...uiEvents)
              towerIds.add(event.towerId)
            }
          }
        }
      }

      // adding tower events for towernutzung
      if (towernutzung && this.towerCalendar) {
        this.towerCalendar.events.forEach(event => {
          if (!towerIds.has(event.uid)) {
            const uiEvents = constructUIEventsFromDates(event, this.towerCalendar);
            events.push(...uiEvents)
          }
        })
      }

      this.events = events
    },

    async update(notify, fetch=true, calendarIds=undefined) {
      await this.getEvents({}, notify, fetch, calendarIds)
      if (this.$refs.calendarSelectorPanel) this.$refs.calendarSelectorPanel.isActive = true;
    },

    showEventEditor(selectedEvent) {
      this.$refs.CreateEventView.show(selectedEvent)
    },

    datePickerChanged(date) {
      const newDate = new Date(date)
      if (this.type == 'month')this.value = new Date(this.value.setFullYear(newDate.getFullYear(), newDate.getMonth()))
      else this.value = new Date(this.value.setFullYear(newDate.getFullYear(), newDate.getMonth(), newDate.getDate()))
    },

    viewDay ({ date }) {
      this.$router.replace({params: {...this.$route.params, viewType:'day', viewDate:this.toUTCDateString(new Date(date))}, query:this.$route.query}).catch((err)=>err)
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
        const end = this.getSunday(end_of_month)
        end.setDate(end.getDate()+1)
        return {start: this.getMonday(start_of_month), end: end}
      } else if (this.type == 'week') {
        const monday = this.getMonday(this.value);
        const sunday = this.getSunday(this.value);
        sunday.setDate(sunday.getDate()+1)
        return {start: monday, end: sunday}
      } else if (this.type == 'day') {
        const end = new Date(this.value.toDateString())
        end.setDate(end.getDate()+1)
        return {start: this.value, end: end}
      }
    },

    getMonday(d) {
      d = new Date(d.toDateString());
      const day = d.getDay()
      const diff = d.getDate() - (day == 0 ? -6:day-1); // adjust when day is sunday
      return new Date(d.setDate(diff));
    },

    getSunday(d) {
      d = new Date(d.toDateString());
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
      const event = new CalendarEvent()
      event.name = 'Neues Event'
      event.start = new Date(this.value)
      event.start.setHours(new Date().getHours())
      event.start.setMinutes(0)
      event.end = new Date(event.start)
      event.end.setHours(event.end.getHours()+2)
      event.calendarId = calendar.uid
      if (this.towernutzung) event.tower = true
      event.dates = [[event.start, event.end]]

      // this.addEventToView(this.newEvent)
      const uiEvent = constructUIEventsFromDates(event, calendar);
      this.events.push(...uiEvent);
      commitSetSelectedEvent(this.$store, event)
      this.$refs.calendarEventPopup.show()

      return this.newEvent
    },

    addEventToView(event) {
      const uiEvent = this.newEvent.toUIEvent()
      if (!event.uiEvents) event.uiEvents = []
      event.uiEvents.push(uiEvent)
      this.events.push(uiEvent);
    },

    createDate(minutes=0, hour, day, month, year) {
      const d = new Date()
      d.setTime(0)
      d.setFullYear(year);
      d.setDate(day);
      d.setMonth(month);
      d.setHours(hour);
      d.setMinutes(minutes);
      return d
    },

    toUTCDateString(date) {
      return `${date.getFullYear().toString().padStart(4,'0')}-${(date.getMonth()+1).toString().padStart(2,'0')}-${date.getDate().toString().padStart(2,'0')}`
    },

    isTowerInterval(hour, day, month, year) {
      const intervalStart = this.createDate(hour, day, month, year)
      const intervalEnd = this.createDate(hour+1, day, month, year)
    },

    isInInterval(hour, day, month, year, event) {
      const intervalStart = this.createDate(hour, day, month, year)
      const intervalEnd = this.createDate(hour+1, day, month, year)
      return (event.start < intervalEnd && event.end > intervalStart)
    },

    getIntervalEventStart(hour, day, month, year, event) {
      const intervalStart = this.createDate(0, hour, day, month, year)
      const start = (event.start < intervalStart) ? intervalStart : event.start
      return start
    },

    getIntervalEventLength(hour, day, month, year, event) {
      const intervalStart = this.createDate(0, hour, day, month, year)
      const intervalEnd = this.createDate(0, hour+1, day, month, year)
      const start = (event.start < intervalStart) ? intervalStart : event.start
      const end = (event.end > intervalEnd) ? intervalEnd : event.end
      return (event.end-event.start)/1000/60
    },

    getIntervalEventEnd(hour, day, month, year, event) {
      const intervalEnd = this.createDate(0, hour+1, day, month, year)
      const end = (event.end > intervalEnd) ? intervalEnd : event.end
      return end
    },

    getIntervalTowerEvents({minutes, hour, day, month, year}, length=1000*60*60) {
      const intervalStart = this.createDate(minutes, hour, day, month, year)
      const intervalEnd = this.createDate(minutes, hour, day, month, year)
      intervalEnd.setTime(intervalEnd.getTime()+length)

      const intervals = []
      if (this.towerCalendar) {
        this.towerCalendar.events.forEach((event) => {
          if (event.start < intervalEnd && event.end > intervalStart) {
            const start = (event.start < intervalStart) ? intervalStart : event.start
            const end = (event.end > intervalEnd) ? intervalEnd : event.end
            intervals.push({
              event:event,
              start:start,
              end:end,
              length:(event.end-event.start)/1000/60
            });
          }
        })
      }
      return intervals;
    },

  },

  computed: {
    picker: {
      get: function() {
        const val = this.toUTCDateString(this.value)
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

    type: {
      set(value) {
        this.$router.replace({params: {...this.$route.params, viewType:value}, query:this.$route.query}).catch((err)=>err)
      },
      get() {
        const param = this.$route.params['viewType']
        if (param == 'default') return 'week'
        return param
      }
    },

    value: {
      set(value) {
        let date;
        if (['default', 'today', 'now'].includes(value)) date = new Date(new Date().toDateString())
        else {
          date = new Date(new Date(value).toDateString())
          value = this.toUTCDateString(date)
        }
        if (date != this.value) {
          this.$router.replace({params: {...this.$route.params, viewDate:value}, query:this.$route.query}).catch((err)=>err)
        }
      },
      get() {
        const param = this.$route.params['viewDate']
        if (param === undefined || param == 'today' || param == 'default' || param == 'now') {
          const now = new Date(new Date().toDateString())
          return now
        }
        return new Date(param)
      }
    },

    towernutzung: {
      get() {
        const tower = this.$route.query.towernutzung;
        if(tower === undefined){
          return false;
        }
        return tower.toLowerCase() == 'true' || tower.toLowerCase() == '1';
      },

      set(value) {
        this.$router.replace({params:this.route.params, query: { ...this.$route.query, towernutzung: value }});
      }
    },

    calendars: function ()  {
      const calendars = readCalendars(this.$store)
      return calendars
    },

    authenticationURL: function() {
      return readAuthenticationURL(this.$store);
    },

    towerCalendar: function() {
      return readTowerCalendar(this.$store);
    },

    selectedEvent: function() {
      return readSelectedEvent(this.$store)
    },

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