<template>
  <component
    :is="fullscreen ? 'v-dialog' : 'v-menu'"
    v-model="selectedOpen"
    :close-on-content-click="false"
    :activator="selectedElement"
    :transition="fullscreen ? 'dialog-bottom-transition' : undefined"
    offset-x
    fullscreen
  >
    <v-card
      min-width="400px"
      flat
    >
      <v-toolbar
        :color="eventColor"
        :dark="darkmode"
      >
        <v-btn 
          icon
          @click="fullscreen = !fullscreen"
        >
          <v-icon v-if="!fullscreen">
            mdi-fullscreen
          </v-icon>
          <v-icon v-else>
            mdi-fullscreen-exit
          </v-icon>
        </v-btn>
        <v-toolbar-title style="width:100%">
          <v-text-field
            class="mt-3"
            v-model="selectedEventInternal.name"
            flat
            full-width
            :solo="!updatable"
            :readonly="!updatable"
          >
          </v-text-field>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-menu offset-y>
          <template v-slot:activator="{attrs, on }">
            <v-btn 
              icon
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>

          <v-list>
            <v-list-item
              link
              @click="deleteEvent"
              v-if="deletable"
            >
              <v-list-item-icon>
                <v-icon>mdi-delete</v-icon>
              </v-list-item-icon>
              <v-list-item-title
              > 
                Löschen
              </v-list-item-title>
            </v-list-item>

            <v-list-item
              link
              v-if="selectedEventInternal.rrule && deletable"
              @click="deleteExdate"
            >
              <v-list-item-icon>
                <v-icon>mdi-delete</v-icon>
              </v-list-item-icon>
              <v-list-item-title
              > 
                Dieses vorkommen löschen
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-toolbar>
      <v-card-text>
        <div v-if="fullscreen" class="mt-5"></div>

        <div style="display:flex; align-items:center;">
          <v-icon class="mr-1">mdi-calendar</v-icon>
          
          <v-select
            v-if="updatable"
            :items="calendars"
            item-color="color"
            v-model="calendar"
            item-text="name"
            item-value="uid"
            return-object
            label="Kalender"
            outlined
            hide-details
            @change="calendarChanged"
          >
            <template v-slot:item="{item}">
              <div>{{item.name}}</div> <v-spacer></v-spacer> <v-icon :color="item.color">mdi-circle</v-icon>
            </template>

          </v-select>
          <v-text-field
            v-else
            :value="(calendar) ? calendar.name : ''"
            outlined
            label="Kalender"
            readonly
            hide-details
          ></v-text-field>
          <calendar-color-picker-component
            v-model="eventColor"
            :disabled="!updatable"
          ></calendar-color-picker-component>
        </div>

        <div style="display:flex;">
          <component
            :is="selectedEventInternal.timed ? 'date-time-picker-menu' : 'date-picker-menu'"
            v-model ="startDate"
            defaultPicker="DATE"
            :disabled="!updatable"
            :pickerProps="{}"
          >
            <template v-slot:activator="{ on, attrs, }">
              <v-text-field
                label="Datum von"
                class="input-lg"
                v-bind="attrs"
                v-on="on"
                prepend-icon="mdi-calendar-range"
                required
                :rules="[$common.required]"
                :readonly="!updatable"
              ></v-text-field>
            </template>
          </component>
          

          <v-divider vertical inset class="mx-2"></v-divider>

          <component
            :is="selectedEventInternal.timed ? 'date-time-picker-menu' : 'date-picker-menu'"
            v-model ="endDate"
            defaultPicker="DATE"
            :disabled="!updatable"
            :pickerProps="{}"
          >
            <template v-slot:activator="{ on, attrs, }">
              <v-text-field
                label="Datum bis"
                class="input-lg"
                v-bind="attrs"
                v-on="on"
                prepend-icon="mdi-calendar-range"
                required
                :rules="[$common.required]"
                :readonly="!updatable"
              ></v-text-field>
            </template>
          </component>
        </div>
        
        <!-- <div style="margin-left:25px; margin-top: 10px;display:flex;justify-content: flex-start; align-items:center;"> -->
        <v-container style="margin-left:20px;margin-top:0">
          <v-row align-content="center">
            <v-col cols="auto" align-self="center">
              <v-checkbox 
                style="padding:0;margin:0"
                :value="!selectedEventInternal.timed"
                :input-value="!selectedEventInternal.timed"
                :readonly="!updatable"
                hide-details
                @change="timedChanged"
                label="ganztägig"
              ></v-checkbox>
            </v-col>
  
            <v-col>
              <calendar-r-rule-editor-component
                v-model="selectedEventInternal.rrule"
                :readonly="!updatable"
              >
              </calendar-r-rule-editor-component>
            </v-col>
            <v-spacer></v-spacer>
          </v-row>
        </v-container>
        <!-- </div> -->

        <calendar-event-location-component
          v-if="selectedOpen"
          v-model="selectedEventInternal"
          :readonly="!updatable"
        > 
        </calendar-event-location-component>

        <!-- <v-text-field
          v-model="selectedEventInternal.location"
          label="Ort"
          full-width
          prepend-icon="mdi-map-marker"
        >
        </v-text-field> -->

        <v-textarea
          v-model="selectedEventInternal.description"
          filled
          label="Beschreibung"
          :readonly="!updatable"
        ></v-textarea>

      </v-card-text>
      <v-spacer></v-spacer>
      <v-card-actions>
        <v-btn
          text
          color="secondary"
          @click="close"
        >
          Abbrechen
        </v-btn>

        <v-spacer></v-spacer>
        <v-btn
          v-if="selectedEventInternal.rrule"
          color="success"
          @click="saveExdate"
          :loading="loadingExdate"
          disabled
        >
          Dieses aktualisieren
        </v-btn>
        <v-btn
          :color="(selectedEventInternal.rrule) ? '' : 'success'"
          @click="save"
          :loading="loading" 
          v-if="updatable"
        >
          {{(selectedEventInternal.rrule) ? 'Alle aktualisieren' : 'Speichern'}}
        </v-btn>
      </v-card-actions>
    </v-card>
  </component>
</template>

<script>

import { dispatchFetchCalendars, dispatchRemoveEvent, dispatchUpdateCalendar, dispatchUpdateCalendarEvent } from '../store/actions'
import { commitAddEventToCalendar, commitSetSelectedEvent, commitRemoveCalendarEvent, commitUpdateSelectedEvent, commitUpdateEvent } from '../store/mutations'
import { readCalendarByUID, readCalendars, readCalendarsWithoutTower, readSelectedEvent, readEventByUID, readTowerCalendar, getters} from '../store/getters'
import DateTimePickerMenu from '@/components/DateTimePickerMenu.vue'
import DatePickerMenu from '@/components/DatePickerMenu.vue'
import isAfter from 'date-fns/isAfter'
import intervalToDuration from 'date-fns/intervalToDuration'
import add from 'date-fns/add'
import sub from 'date-fns/sub'
import CalendarEventLocationComponent from '../components/CalendarEventLocationComponent.vue'
import CalendarRRuleEditorComponent from '../components/CalendarRRuleEditorComponent.vue'
import CalendarColorPickerComponent from '../components/CalendarColorPickerComponent.vue'

function hexToRgb(c){
  if(/^#([a-f0-9]{3}){1,2}$/.test(c)){
    if(c.length== 4){
      c= '#'+[c[1], c[1], c[2], c[2], c[3], c[3]].join('');
    }
    c= '0x'+c.substring(1);
    return [(c>>16)&255, (c>>8)&255, c&255]
  }
  return undefined;
}

export default {
  props: {

  },

  components: {
    CalendarEventLocationComponent,
    DateTimePickerMenu,
    DatePickerMenu,
    CalendarRRuleEditorComponent,
    CalendarColorPickerComponent
  },

  emits: ['clickEditEvent', 'close', 'changed'],

  data() {
    return {
      selectedElement: null,
      selectedOpen: false,
      fullscreen: false,

      calendar: {colo:'white', rights:'r'},

      cctLocations: ['Tower', 'CCTelefon'],
      selectedEventInternal:{calendar:{name:''}, start:new Date(), end:new Date(), timed:true, rrule:undefined},
      loading:false,
      loadingExdate:false,
    }
  },

  methods: {
    calendarChanged(newCalendar) {
      this.calendar = newCalendar
      this.selectedEventInternal.eventColor = this.calendar.color
    },

    timedChanged(fullday) {
      this.selectedEventInternal.timed = !fullday;
    },
    setSelectedElement(selectedElement) {
      this.selectedElement = selectedElement
    },

    setSelectedEvent(selectedEvent) {
      this.selectedEvent = selectedEvent
    },

    showEventEditor() {
      this.$emit('clickEditEvent', this.selectedEvent)
      this.close()
    },

    initSelectedEventInternal() {
      this.selectedEventInternal = Object.assign({}, this.selectedEvent)
      this.calendar = readCalendarByUID(this.$store)(this.selectedEventInternal.calendarId)
    },

    show(selectedEvent=undefined) {
      // if (!selectedEvent) selectedEvent = this.selectedEvent
      this.loadingExdate = false
      this.loading = false;
      this.selectedOpen = true
      this.fullscreen = false;
      this.initSelectedEventInternal()
      console.log(this.selectedEventInternal)
    },

    close() {
      if (this.selectedOpen == true) {
        this.loading = false;
        this.loadingExdate = false
        this.selectedOpen = false
        this.initSelectedEventInternal()
        this.$emit('close')
      }
    },

    async saveExdate() {
      // TODO: finish this function
      this.loadingExdate = true
      const event = this.selectedEvent
      this.deleteExdate()
      // console.log(event)
      // if (!event) return;
      if (!event.rrule.exdate) event.rrule.exdate = []
      event.rrule.exdate.push(new Date(event.start).toISOString().split('T')[0])
      await dispatchUpdateCalendarEvent(this.$store, {uid:event.uid, calendarId:event.calendarId, rrule:event.rrule})

      delete this.selectedEventInternal.uid
      delete this.selectedEventInternal.rrule
      this.selectedEventInternal.calendarId = this.calendar.uid
      // this.save(false)
      this.close()
    },

    async save(mouseEvent=undefined, loading=true, changes={}) {
      this.loading = loading;
      const savedEvent = Object.assign({},this.selectedEventInternal)
      Object.assign(savedEvent, changes)
      console.log(savedEvent)
      if (this.calendar.uid != savedEvent.calendarId) {
        // TODO: disable notifications for remove event
        await dispatchRemoveEvent(this.$store, {uid:savedEvent.uid, calendarId:savedEvent.calendarId, notify:false})
        savedEvent.calendarId = this.calendar.uid
        delete savedEvent.uid
      }
      //console.log(savedEvent);

      // fullday events need an end date that is at least one day later than the start date
      if (!savedEvent.timed) {
        // savedEvent.end.setDate(savedEvent.end.getDate()+1)
      }

      const wasTowerEvent = this.selectedEvent.locationId == 'tower'

      try {
        await dispatchUpdateCalendarEvent(this.$store, {event:savedEvent, notify:true})
      } catch(e) {
        if (e.response.status != 403) {
          throw e
        } else {
          this.loading = false;
          return;
        }
      }

      if ((wasTowerEvent || savedEvent.locationId == 'tower') && this.towerCalendar.uid) { // update tower calendar if tower event was changed
        if (savedEvent.towerId) commitRemoveCalendarEvent(this.$store, {calendarId: this.towerCalendar.uid, uid:savedEvent.towerId})
        dispatchFetchCalendars(this.$store, {notify:false, start:savedEvent.start, end:savedEvent.end, calendarIds:[this.towerCalendar.uid]})
      }

      // set calendar to active when it is updated, so that the event is displayed after saving
      this.calendar.active = true;
      dispatchUpdateCalendar(this.$store, this.calendar);

      // commitUpdateSelectedEvent(this.$store, savedEvent)
      this.$emit('changed')
      this.close()
    },

    async deleteExdate() {
      if (!this.selectedEventInternal.rrule.exdate) this.selectedEventInternal.rrule.exdate = []
      this.selectedEventInternal.rrule.exdate.push(this.selectedEventInternal.viewStart)
      this.save()
    },

    async deleteEvent() {
      this.loading = true
      commitRemoveCalendarEvent(this.$store, this.selectedEventInternal);
      const response = await dispatchRemoveEvent(this.$store, this.selectedEventInternal, false)
      this.$emit('changed') 
      this.close()
    },

  },

  computed: {
    darkmode() { // this function is only used to determine if the toolbar should be in darkmode. This ensures, that the title has enough contrast to its background to read it properly
      const rgb = hexToRgb(this.eventColor)
      if (!rgb) return false
      const brightness = rgb[0] + rgb[1] + rgb[2]
      const darkness = 255*3 - brightness
      return darkness >= brightness
    },

    eventColor: {
      get() {
        let color = this.selectedEventInternal.eventColor
        if (!color || color == '') color = this.calendar.color
        return color
      },

      set(val) {
        this.selectedEventInternal.eventColor = val
      }
    },

    startDate: {
      get() {
        return this.selectedEventInternal.start;
      },
      set(value) {
        let start = new Date(this.selectedEventInternal.start);
        const end = new Date(this.selectedEventInternal.end);
        const duration = intervalToDuration({
          start,
          end
        })
        start = new Date(value);
        this.selectedEventInternal.start = value;
        if (isAfter(start, end)) {
          // new start is after end
          this.selectedEventInternal.end = add(start, duration);
        }
      },
    },
    endDate: {
      get() {
        return this.selectedEventInternal.end;
      },
      set(value) {
        const start = new Date(this.selectedEventInternal.start);
        let end = new Date(this.selectedEventInternal.end);
        const duration = intervalToDuration({
          start,
          end
        })
        end = new Date(value);
        this.selectedEventInternal.end = value;
        if (isAfter(start, end)) {
          // new start is after end
          this.selectedEventInternal.start = sub(end, duration);
        }
      },
    },

    towerCalendar: function() {
      return readTowerCalendar(this.$store)
    },

    updatable: function() {
      if (!this.calendar) return false
      return this.calendar.rights.includes('u');
    },

    deletable: function() {
      if (!this.calendar) return false;
      return this.calendar.rights.includes('d')
    },

    calendars: function ()  {
      let calendars = [...readCalendars(this.$store)]
      // filtering out all calendars that we do not have rights to create an event
      calendars = calendars.filter((cal) => cal.rights.includes('c') || cal.uid == this.selectedEvent.uid)
      
      calendars.forEach(e => {
        e.text = e.name
      })
      return calendars
    },

    selectedEvent: function () {
      const selected = readSelectedEvent(this.$store)
      if (selected) return selected
      return {}
    },

    // calendar: function () {
    //   const calendar = this.calendars.find(x => x.uid == this.selectedEventInternal.calendarId)
    //   if (!calendar) return {name:''}
    //   return calendar
    // }
    
  }
}
</script>
<style scoped lang="scss">

.menu-fullscreen {
  top: 0!important;
  left: 0!important;
  width: 100%;
  height: 100%;
  max-height: 100%;
  max-width: 100%;
}

</style>