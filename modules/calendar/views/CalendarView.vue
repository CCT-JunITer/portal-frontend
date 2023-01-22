<template>
  <div class="calendarContainer">
    <v-navigation-drawer 
      class="calendarSidebar transparentComponent"
      permanent
      touchless
      :mini-variant="mini"
      :width="expandedNavbarWidth"
    >
      <template v-slot:prepend>
        <v-list
          dense
          :width="expandedNavbarWidth"
          style="padding:0"
        >
          <v-list-item 
            link
            @click="mini = !mini"
            dense
          >
            <v-list-item-icon>
              <v-icon v-if="mini">mdi-chevron-right</v-icon>
              <v-icon v-else>mdi-chevron-left</v-icon>
            </v-list-item-icon>
            <v-list-item-subtitle>
              Seitenleiste ausblenden
            </v-list-item-subtitle>
          </v-list-item>
        </v-list>
        <v-divider></v-divider>
      </template>
      
      <calendar-list-component
        ref="updatableCalendarList"
        v-model="updatableCalendars"
        label="Kalender mit Editierrechten"
        icon="mdi-calendar-edit"
        :tooltipDisabled="!mini"
        @change="getEvents({start:undefined, end:undefined})"
      ></calendar-list-component>
      <v-divider></v-divider>
      <calendar-list-component
        ref="readonlyCalendarList"
        v-model="readonlyCalendarsWithoutTower"
        label="Kalender ohne Editierrechte"
        icon="mdi-calendar-blank"
        :tooltipDisabled="!mini"
        @change="getEvents({start:undefined, end:undefined})"
      ></calendar-list-component>
      <!-- <v-divider class="my-2"></v-divider> -->
      
      <!--<div style="height:100%;flex-shrink:100;"></div>-->

      <template v-slot:append>
        <v-divider></v-divider>

        <v-date-picker
          v-if="!mini && windowHeight > 800 && datePickerEnabled"
          v-model="picker"
          first-day-of-week="1"
          no-title
          :type="pickerType"
          scrollable
          color="primary"
          width="100%"
        >
        </v-date-picker>
        
        <v-tooltip right :disabled="!mini">
          <template v-slot:activator="{ on, attrs}">
            <v-list-item 
              :class="(updatableCalendars.length == 0) ? 'grey' : 'primary'"
              :disabled="updatableCalendars.length == 0"
              @click="() => createNewEvent()"
              link
              v-on="on"
              v-bind="attrs"
            >
              <v-list-item-icon><v-icon color="white">mdi-calendar-plus</v-icon></v-list-item-icon>
              <v-list-item-title style="color:white">
                NEUES EVENT ERSTELLEN
              </v-list-item-title>
            </v-list-item>
          </template>
          Neues Event erstellen
        </v-tooltip>
        
        <v-tooltip right :disabled="!mini">
          <template v-slot:activator="{ on, attrs}">
            <v-list-item 
              :href="nextcloudURL" 
              target="_blank"
              link
              v-on="on"
              v-bind="attrs"
            >
              <v-list-item-icon><v-icon>mdi-open-in-new</v-icon></v-list-item-icon>
              <v-list-item-title>
                IN DER NEXTCLOUD BEARBEITEN
              </v-list-item-title>
            </v-list-item>
          </template>
          In der Nextcloud bearbeiten
        </v-tooltip>
        <v-divider></v-divider>
        <v-list dense style="padding:0;margin:0">
          <v-list-group v-model="settingsUnfolded" append-icon="" @click="mini = false">
            <template v-slot:prependIcon>
              <v-tooltip right :disabled="!mini">
                <template v-slot:activator="{ on, attrs}">
                  <div v-on="on" v-bind="attrs">
                    <v-icon >mdi-cog-outline</v-icon>
                  </div>
                </template>
                Einstellungen
              </v-tooltip>
            </template>
            <template v-slot:activator>
              <v-list-item-subtitle>Einstellungen</v-list-item-subtitle>
            </template>
            <v-list-item-group
              :value="highlightedSettings"
              color="primary"
              multiple
            >
              <v-list-item @click="() => towerCalendar && setTowerCalendarActive(!towerCalendar.active)">
                <v-list-item-icon class="test-center"><v-icon v-if="towerCalendar && towerCalendar.active">mdi-checkbox-marked</v-icon><v-icon v-else>mdi-checkbox-blank-outline</v-icon></v-list-item-icon>
                <v-list-item-title>Toweranzeige anschalten</v-list-item-title>
              </v-list-item>
              <v-list-item @click="() => datePickerEnabled = !datePickerEnabled">
                <v-list-item-icon class="test-center"><v-icon v-if="datePickerEnabled">mdi-checkbox-marked</v-icon><v-icon v-else>mdi-checkbox-blank-outline</v-icon></v-list-item-icon>
                <v-list-item-title>Datumsanzeige anschalten</v-list-item-title>
              </v-list-item>
            </v-list-item-group>
          </v-list-group>
        </v-list>
      </template>
    </v-navigation-drawer>

    <!-- <v-divider vertical> </v-divider> -->

    <div class="calendarMainView">
      <v-sheet height="64">
        <v-toolbar
          flat
          style="background-color:transparent;line-break: auto;"
        >
          <v-btn
            v-if="windowWidth > smallWidth"
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
          <v-toolbar-title v-if="$refs.calendar && windowWidth > smallWidth">
            {{ $refs.calendar.title }}
          </v-toolbar-title>

          <v-spacer></v-spacer>
          <v-btn-toggle
            v-if="windowWidth > mediumWidth"
            v-model="type"
            group
            mandatory
          >
            <v-btn 
              v-for="item in types"
              :value="item.value"
              :key="item.value"
            >
              {{item.name}}
            </v-btn>
          </v-btn-toggle>
          <v-select
            v-else
            style="top:20px;width:25px"
            v-model="type"
            :items="types"
            item-text="name"
            item-value="value"
            label="Ansicht"
          >
          </v-select>
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
          @mousedown:event="startDrag"
          @mousedown:time="startTime"
          @mousemove:time="mouseMove"
          @mouseup:time="endDrag"
          @mouseleave.native="cancelDrag"
        >
          <template v-slot:day-header="{}">
            <v-icon v-if="!towernutzung">mdi-chess-rook</v-icon>
          </template>
          <template 
            v-if="!towernutzung && towerCalendar && towerCalendar.active"
            v-slot:interval="{minutesToPixels, hour, day, month, year}"
          >
            <template
              v-for="event in towerEventInInterval[[year, month-1, day, hour]]"
            >
              <template>
                <v-sheet
                  title=""
                  class="clickable"
                  color="black"
                  width="20px"
                  :height="minutesToPixels(event.length)"
                  tile
                  :key="event.uid"
                  :style="'z-index:1;position:absolute;margin-top:' + (event.padding)  + 'px;'"
                  @click="(clickEvent) => {showEvent({nativeEvent:clickEvent, event:event})}"
                ></v-sheet>
              </template>
            </template>
          </template>
          <template v-slot:event="{event, timed, timeSummary}">
            <div v-if="type=='month'" class="ml-1 disable-select">
              <strong v-if="event.event.timed" v-html="timeSummary()"></strong> <v-icon v-if="event.event.locationId=='tower'&&!towernutzung">mdi-chess-rook</v-icon>{{event.name}}
            </div>
            <div v-else class="disable-select" :style="'overflow-x:hidden;padding-left:'+ 
              ((towerEventInInterval[[event.start.getFullYear(), event.start.getMonth(), event.start.getDate(), event.start.getHours()]] && towerCalendar.active && !towernutzung) ? '25' : '5') +'px'">
              <strong :id="'e' + convert_uid_to_id(event.event.uid)">
                <v-icon v-if="!event.event.uid">mdi-new-box</v-icon>
                <v-icon v-if="event.event.locationId=='tower'&&!towernutzung">
                  mdi-chess-rook
                </v-icon>
                <v-icon v-if="event.event.locationId=='cctelefon'">
                  mdi-phone
                </v-icon>
                {{event.name}} 
              </strong>
              <div v-if="event.event.timed" ><div v-html="timeSummary()"></div></div>
            </div>
            <div
              v-if="timed"
              class="v-event-drag-bottom"
              @mousedown.stop="extendBottom(event)"
            ></div>
          </template>
        </v-calendar>
        
        <calendar-event-popup 
          ref="calendarEventPopup" 
          @clickEditEvent="showEventEditor"
          @changed="update(false, false)"
          @close="eventPopupClosed"
        >
        </calendar-event-popup>
      </div>

    </div>
  </div>
</template>

<script>

import CalendarEventPopup from './CreateEventPopup.vue'
import CalendarListComponent from '../components/CalendarListComponent.vue';
import { commitSetSelectedEvent } from '../store/mutations';
import { dispatchFetchCalendars, dispatchFetchCalendarRights, dispatchUpdateCalendar} from '../store/actions';
import { readCalendars, readCalendarsWithoutTower, readSelectedEvent, readTowerCalendar, readUpdatableCalendarsWithoutTower, readReadonlyCalendarsWithoutTower, readAuthenticationURL} from '../store/getters';
import { CalendarEvent } from '../types/CalendarEvent';



const FREQUENCIES = {'SECONDLY':1000, 'MINUTELY':60000, 'HOURLY':3600000, 'DAILY':86400000, 'WEEKLY':604800000}
function constructUIEvents(event, calendar, viewStart, viewEnd) {
  
  const events = []

  const rrule = event.rrule
  let condition = (i, date) => {return i < 1};
  let interval = 1
  if (rrule && rrule.interval) interval = rrule.interval
  let i_offset = 0;
  if (rrule) {
    // calculate i_offset, such that only recurring events are generated in the viewStart and viewEnd interval for performance reasons
    if (rrule.freq == 'MONTHLY') {
      i_offset = (viewStart.getFullYear() - event.end.getFullYear()) + (viewStart.getMonth() - event.end.getMonth())
    } else if (rrule.freq == 'YEARLY') {
      i_offset = viewStart.getFullYear() - event.end.getFullYear()
    } else {
      if (rrule.freq in FREQUENCIES) {
        const freq = FREQUENCIES[rrule.freq]
        i_offset = Math.floor((viewStart.valueOf()/freq) - (event.end.valueOf()/freq))
      }
    }
    i_offset = Math.max(i_offset, 0) / interval

    if (rrule.endtype == 'COUNT') {
      rrule.end = parseInt(rrule.end)
      condition = (i, date) => {return i < rrule.end};
    } else if (rrule.endtype == 'UNTIL') {
      const end = new Date(rrule.end)
      condition = (i, date) => {return date < end};
    } else if (!rrule.endtype) {
      condition = (i, date) => {return date < viewEnd}
    } else {
      console.error('The type ' + rrule.endtype + ' is not known!')
    }
  }

  let event_start = event.start;
  let event_end = event.end;
  for (let i = i_offset; condition(i, event_start); i++) {
    event_start = new Date(event.start)
    event_end = new Date(event.end)

    if (rrule) {
      if (rrule.freq == 'MONTHLY') {
        event_start.setMonth(event_start.getMonth()+(i*interval))
        event_end.setMonth(event_end.getMonth()+(i*interval))
      } else if (rrule.freq == 'YEARLY') {
        event_start.setFullYear(event_start.getFullYear()+(i*interval))
        event_end.setFullYear(event_end.getFullYear()+(i*interval))
      } else {
        if (rrule.freq in FREQUENCIES) {
          event_start = new Date(event_start - (FREQUENCIES[rrule.freq]*-(i*interval)))
          event_end = new Date(event_end - (FREQUENCIES[rrule.freq]*-(i*interval)))
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
      color:event.eventColor,
      timed:event.timed,
      event:event,
      iteration:i
    })
  }

  return events;
}

export default {
  components: {
    // CalendarToolbar,
    CalendarEventPopup,
    CalendarListComponent,
  },

  async created() {
    this.update(true);
    dispatchFetchCalendarRights(this.$store, {})
    window.addEventListener('resize', this.windowResized);
    this.windowResized()
  },

  destroyed() {
    window.removeEventListener('resize', this.windowResized);
  },

  data: () => ({
    mode: 'stack',
    weekday: [1, 2, 3, 4, 5, 6, 0],
    towerIndicatorIntervals:[0,15,30,45],
    towerIndicatorIntervalLength:1000*60*15, // 15 minutes
    events: [],
    types: [
      {name:'Tag', value:'day'},
      {name:'4 Tage', value:'4day'},
      {name:'Woche', value:'week'},
      {name:'Monat', value:'month'},
    ],
    nextcloudViewTypes: {'day':'timeGridDay', '4day': 'timeGridWeek', 'week':'timeGridWeek', 'month':'dayGridMonth'},
    
    mini:false,
    datePickerEnabled: true,
    settingsUnfolded:false,
    expandedNavbarWidth:350,

    windowWidth: -1,
    windowHeight: -1,

    mediumWidth: 1000,
    smallWidth: 550,

    newEvent: undefined,

    // for drag and drop
    dragEvent: null,
    dragStart: null,
    createEvent: null,
    createStart: null,
    extendOriginal: null,
    dragDiv: null,
  }),
  methods: {


    async getEvents (payload, notify=false, fetch=false, calendarIds=undefined) {
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
      this.newEvent = undefined
      const towerIds = new Set()
      console.log(this.allCalendars)

      const towernutzung = this.towernutzung
      for (let i = 0; i < this.calendars.length; i++) {
        const activeCalendar = this.calendars[i];
        if (activeCalendar.active === undefined) activeCalendar.active = true;

        if (activeCalendar.active) {
          for (let j = 0; j < activeCalendar.events.length; j++) {
            const event = activeCalendar.events[j]

            if (!towernutzung || event.locationId == 'tower') { // only tower events are displayed if towernutzung
              const uiEvents = constructUIEvents(event, activeCalendar, this.viewStart, this.viewEnd);
              events.push(...uiEvents)
              towerIds.add(event.towerId)
            }
          }
        }
      }
      // adding tower events for towernutzung
      if (towernutzung && this.towerCalendar && this.towerCalendar.active) {
        this.towerCalendar.events.forEach(event => {
          if (!towerIds.has(event.uid)) {
            const uiEvents = constructUIEvents(event, this.towerCalendar, this.viewStart, this.viewEnd);
            events.push(...uiEvents)
          }
        })
      }

      this.events = events
    },

    windowResized() {
      if (this.windowWidth != window.innerWidth || this.windowHeight != window.innerHeight) {
        this.windowWidth = window.innerWidth
        this.windowHeight = window.innerHeight
  
        if (this.windowWidth < this.mediumWidth) {
          this.mini = true
          if (this.type == 'week') this.type = '4day'
        }
        else {
          if (this.type == '4day') this.type = 'week'
          this.mini = false
        }
      }
    },

    async update(notify, fetch=true, calendarIds=undefined) {
      await this.getEvents({}, notify, fetch, calendarIds)
      if (this.$refs.updatableCalendarList) this.$refs.updatableCalendarList.setUnfolded(true);
      if (this.$refs.readonlyCalendarList) this.$refs.readonlyCalendarList.setUnfolded(true);
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
        eventCopy.viewStart = new Date(event.start)
        eventCopy.viewEnd = new Date(event.end)
        commitSetSelectedEvent(this.$store, eventCopy)
        this.$refs.calendarEventPopup.setSelectedElement(nativeEvent.target)
        this.$refs.calendarEventPopup.setFullscreen(this.windowWidth < this.mediumWidth)
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
      } else if (this.type == 'week' || this.type == '4day') {
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
      const diff = d.getDate() - (day == 0 ? 6:day-1); // adjust when day is sunday
      return new Date(d.setDate(diff));
    },

    getSunday(d) {
      d = new Date(d.toDateString());
      const day = d.getDay()
      const diff = d.getDate() + (day == 0 ? 0:7-day); // adjust when day is sunday
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

    createNewEvent(start=undefined, end=undefined) {
      if (!this.updatableCalendars || this.updatableCalendars.length < 1) {
        alert('Du brauchst einen Kalender, damit du Events erstellen kannst.')
        return undefined
      }
      let calendar = this.updatableCalendars.find((x) => x.active) // allways take initially the first active calendar in the updatable list 
      if (!calendar) calendar = this.updatableCalendars[0]

      if (!start) {
        start = new Date(this.value)
        start.setHours(new Date().getHours())
        start.setMinutes(0)
      }

      if (!end) {
        end = new Date(start)
        end.setHours(end.getHours()+2)
      }
      let event = undefined
      if (!this.newEvent || this.newEvent.event.uid) {
        event = new CalendarEvent()
        event.name = 'Neues Event'
        event.start = start
        event.end = end
        event.calendarId = calendar.uid
        if (this.towernutzung) event.locationId = 'tower'
        event.dates = [[event.start, event.end]]
        event.eventColor = calendar.color

        const uiEvent = constructUIEvents(event, calendar, this.viewStart, this.viewEnd);
        this.events.push(...uiEvent);
        commitSetSelectedEvent(this.$store, event)
        this.newEvent = uiEvent[0]
      } else {
        event = this.newEvent.event
        event.start = start
        event.end = end
        this.newEvent.start = start
        this.newEvent.end = end
      }

      return this.newEvent
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

    toUTCDateTimeString(date) {
      return `${date.getFullYear().toString().padStart(4,'0')}-${(date.getMonth()+1).toString().padStart(2,'0')}-${date.getDate().toString().padStart(2,'0')}T${(date.getHours()).toString().padStart(2,'0')}:${(date.getMinutes()).toString().padStart(2,'0')}`
    },

    toUTCDateString(date) {
      return `${date.getFullYear().toString().padStart(4,'0')}-${(date.getMonth()+1).toString().padStart(2,'0')}-${date.getDate().toString().padStart(2,'0')}`
    },

    // Start: Drag and drop methods

    startDrag ({ event, timed }) {
      // check rights
      if (event && timed) {
        this.dragEvent = event
        this.dragTime = null
        this.extendOriginal = null
      }
      this.$refs.calendarEventPopup.close()
    },
    startTime (tms) {
      this.$refs.calendarEventPopup.close()
      const mouse = this.toTime(tms)

      // this prevents dragging new events if the black box referring to a tower event is clicked
      if (tms.nativeEvent.target.classList.contains('v-sheet')) return;

      if (this.dragEvent && this.dragTime === null) {
        const start = this.dragEvent.start

        this.dragTime = mouse - start
      } else {
        this.createStart = new Date(this.roundTime(mouse))
        this.createEvent = this.createNewEvent(this.createStart, this.createStart)
      }
    },
    roundTime (time, down = true) {
      const roundTo = 15 // minutes
      const roundDownTime = roundTo * 60 * 1000

      return down
        ? time - time % roundDownTime
        : time + (roundDownTime - (time % roundDownTime))
    },
    toTime (tms) {
      return new Date(tms.year, tms.month - 1, tms.day, tms.hour, tms.minute).getTime()
    },
    rnd (a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a
    },
    rndElement (arr) {
      return arr[this.rnd(0, arr.length - 1)]
    },
    extendBottom (event) {
      this.createEvent = event
      this.createStart = event.start
      this.extendOriginal = event.end
    },
    mouseMove (tms) {
      const mouse = this.toTime(tms)

      if (this.dragEvent && this.dragTime !== null) {
        const event_calendar = this.allCalendars.find(x => {return x.uid && x.uid == this.dragEvent.event.calendarId})
        if (event_calendar.rights.includes('u')) {
          const start = this.dragEvent.start
          const end = this.dragEvent.end
          const duration = end - start
          const newStartTime = mouse - this.dragTime
          const newStart = this.roundTime(newStartTime)
          const newEnd = newStart + duration
  
          this.dragEvent.start = new Date(newStart)
          this.dragEvent.end = new Date(newEnd)
          this.dragEvent.event.start = new Date(this.dragEvent.start)
          this.dragEvent.event.end = new Date(this.dragEvent.end)
        }
      } else if (this.createEvent && this.createStart !== null) {
        const mouseRounded = new Date(this.roundTime(mouse, false))
        const min = (mouseRounded < this.createStart) ? mouseRounded : this.createStart
        const max = (mouseRounded < this.createStart) ? this.createStart : mouseRounded

        this.createEvent.start = min
        this.createEvent.end = max
        this.createEvent.event.start = new Date(this.createEvent.start)
        this.createEvent.event.end = new Date(this.createEvent.end)
      }
    },
    endDrag () {
      // the following lines of code search for the new created div in the calendar and call the showEvent function with it
      // the div is found by its id. The id of the div is the uid of the event converted by the convertuid_to_id function, so that it matches the id pattern
      const event = (this.createEvent) ? this.createEvent : this.dragEvent
      if (this.$refs.calendar && event) { 
        const div = this.$refs.calendar.$el.querySelector('#e' + this.convert_uid_to_id(event.event.uid))
        if (div) {
          const nativeEvent = {target:div.parentNode.parentNode, stopPropagation:()=>{return 0}}
          this.showEvent({nativeEvent:nativeEvent, event:event})
        }
      }

      this.dragTime = null
      this.dragEvent = null
      this.createEvent = null
      this.createStart = null
      this.extendOriginal = null
    },
    cancelDrag () {
      if (this.createEvent) {
        if (this.extendOriginal) {
          this.createEvent.end = this.extendOriginal
        } else {
          const i = this.events.indexOf(this.createEvent)
          if (i !== -1) {
            this.events.splice(i, 1)
          }
        }
      }

      this.createEvent = null
      this.createStart = null
      this.dragTime = null
      this.dragEvent = null
    },

    convert_uid_to_id(uid) {
      if (!uid) return 'undefined'
      return uid.replace(/[^A-Za-z0-9_-]/g, '')
    },
    // End: Drag and Drop methods

    eventPopupClosed() {
      if (!this.dragEvent || this.dragEvent.event.uid != this.newEvent.event.uid) this.getEvents({start:undefined, end:undefined})
    },

    setTowerCalendarActive(active) {
      this.towerCalendar.active = active
      dispatchUpdateCalendar(this.$store, this.towerCalendar)
      this.getEvents({start:undefined, end:undefined}, false, false, undefined)
    },
  },

  computed: {
    highlightedSettings: function() {
      const highlighted = []

      if (this.datePickerEnabled) highlighted.push(1)
      if (this.towerCalendar && this.towerCalendar.active) highlighted.push(0)
      
      return highlighted
    },

    nextcloudURL: function () {
      return 'https://cloud.cct-ev.de/apps/calendar/' + this.nextcloudViewTypes[this.type] + '/' + this.toUTCDateString(this.value)
    },

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
        const tower = this.$route.meta?.towernutzung;
        if(tower === undefined){
          return false;
        } else if (tower instanceof String) {
          return tower.toLowerCase() == 'true' || tower.toLowerCase() == '1';
        } else {
          return tower;
        }
      },

      set(value) {
        this.$router.replace({params:this.route.params, meta: { ...this.$route.meta, towernutzung: value }});
      }
    },

    calendars: function ()  {
      const calendars = readCalendarsWithoutTower(this.$store)
      return calendars
    },

    allCalendars: function() {
      return readCalendars(this.$store)
    },

    updatableCalendars: function() {
      const calendars = readUpdatableCalendarsWithoutTower(this.$store)
      if (!calendars) return []
      return calendars;
    },

    readonlyCalendarsWithoutTower: function() {
      const calendars = readReadonlyCalendarsWithoutTower(this.$store)
      if (!calendars) return []
      return calendars;
    },

    authenticationURL: function() {
      return readAuthenticationURL(this.$store);
    },

    towerCalendar: function() {
      return readTowerCalendar(this.$store);
    },

    /**
     * This function generates a dict for each hourly interval in week view, where it saves all tower events in a list that are scheduled in that interval and calculates the length and y position of the black box
     * This has to be recalculated each time the value or type is changed 
     */
    towerEventInInterval: function() {
      const dict = {}
      let startDay = this.getMonday(this.value)
      if (this.type == '4day') startDay = new Date(this.value.toDateString())
      
      if (this.towerCalendar && this.towerCalendar.events) {
        const towerevents = []
        this.towerCalendar.events.forEach(event => {
          const uiEvents = constructUIEvents(event, this.towerCalendar, this.viewStart, this.viewEnd)
          towerevents.push(...uiEvents)
        })
        towerevents.sort((a,b) => {return a.start-b.start})
        for (let h = 0; h < (24*7)+1; h++) {
          const intervalStart = new Date(startDay - h*1000*60*60*-1)
          const intervalEnd = new Date(startDay - (h+1)*1000*60*60*-1)
          while (towerevents.length > 0 && (towerevents[0].end < intervalStart)) towerevents.shift();
          
          const key = [intervalStart.getFullYear(), intervalStart.getMonth(), intervalStart.getDate(), intervalStart.getHours()]
          const eventsInInterval = []
          while (towerevents.length > 0 && 
            (towerevents[0].start <= intervalEnd && intervalStart <= towerevents[0].end)) {
            const start = (towerevents[0].start < intervalStart) ? intervalStart : towerevents[0].start
            const end = (towerevents[0].end > intervalEnd) ? intervalEnd : towerevents[0].end - (1000*60) // to have a pixel space between each tower interval
            eventsInInterval.push({...towerevents[0],
                                   // convert to minutes
                                   length:(end-start)/1000/60, 
                                   padding:Math.max(0, (towerevents[0].start - intervalStart) / 1000/60)
            })
            if (towerevents[0].end <= intervalEnd) {
              towerevents.shift()
            } else {
              break
            }
          }
          
          dict[key] = (eventsInInterval.length > 0) ? eventsInInterval : undefined
        }
      }
      return dict
    },

    selectedEvent: function() {
      return readSelectedEvent(this.$store)
    },

  },

  mounted() {
    // this ensures that the calendar scrolls initially to the bottom of the page
    this.$refs.calendar.$children[0].scrollToTime(1000*60*60*24)
  },


  watch: {
    mini(val) {
      if (val) this.settingsUnfolded = false
    },
    towernutzung(val) {
      this.update(false)
    },

    authenticationURL(val) {
      if (!val) {
        this.update(true)
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .calendarContainer {
    background-image: linear-gradient(210deg, var(--v-cctBlue-base) 0%, var(--v-cctBlue-base) 30%, var(--v-cctPurple-base) 100%);
    display: flex;
    position:absolute;
    flex-direction: row;
    height:100%;
    width:100%;
    overflow:hidden;
  }
  
  .transparentComponent {
    opacity:0.85;
  }

  .calendarSidebar {
  height:100%;
  display:flex;
  align-items:flex-start;
  flex-direction: column;
  flex-shrink:0;
  margin-left:10px;
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
}

.clickable:hover {
  cursor:pointer
}

.calendarMainView {
  background-color:transparent;
  width:100%;
  height: 100%;
  flex-shrink:1;
}

.VCalendarView {
  height:calc(100% - 64px);
}

.disable-select {
  -webkit-user-select: none;  
  -moz-user-select: none;    
  -ms-user-select: none;      
  user-select: none;
}

.v-event-drag-bottom {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 4px;
  height: 4px;
  cursor: ns-resize;

  &::after {
    display: none;
    position: absolute;
    left: 50%;
    height: 4px;
    border-top: 1px solid white;
    border-bottom: 1px solid white;
    width: 16px;
    margin-left: -8px;
    opacity: 0.8;
    content: '';
  }

  &:hover::after {
    display: block;
  }
}
</style>

<style>
.v-date-picker-table {
  background: transparent;
}

.v-date-picker-header {
  background-color: transparent ;
}

.v-picker.v-card.v-picker--date.theme--light {
  background-color: transparent;
}

.theme--light.v-picker__body {
  background-color: transparent;
}

</style>