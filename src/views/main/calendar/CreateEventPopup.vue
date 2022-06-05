<template>
  <v-menu
    v-model="selectedOpen"
    :close-on-content-click="false"
    :activator="selectedElement"
    offset-x
  >
    <v-card
      color="grey lighten-4"
      min-width="400px"
      flat
    >
      <v-toolbar
        :color="selectedEvent.color"
        dark
      >
        <v-btn 
          icon
          @click="showEventEditor"
        >
          <v-icon>
            mdi-pencil
          </v-icon>
        </v-btn>
        <v-toolbar-title>
          <v-text-field
            v-model="selectedEventInternal.name"
            flat
            full-width
          ></v-text-field>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <!-- <v-btn icon>
          <v-icon>mdi-heart</v-icon>
        </v-btn> -->
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
            >
              <v-list-item-icon>
                <v-icon>mdi-delete</v-icon>
              </v-list-item-icon>
              <v-list-item-title
              > 
                Löschen 
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-toolbar>
      <v-card-text>
        <v-select
          :items="calendars"
          v-model="calendar"
          item-text="name"
          item-value="uid"
          return-object
          label="Kalender"
          outlined
        ></v-select>

        <div style="display:flex">
          <calendar-date-selector
            v-model="selectedEventInternal.start"
            label="Start"
            prepend-icon="event"
            :timed="selectedEventInternal.timed"
            :max="selectedEventInternal.end"
          >
          </calendar-date-selector>

          <v-divider vertical inset class="mx-2"></v-divider>

          <calendar-date-selector
            v-model="selectedEventInternal.end"
            label="Ende"
            append-icon="event"
            :timed="selectedEventInternal.timed"
            :min="selectedEventInternal.start"
          >
          </calendar-date-selector>
        </div>

        <!--TODO: changing this does not work right now in the backend-->
        <!-- <v-checkbox 
          :value="!selectedEventInternal.timed"
          @change="timedChanged"
          label="ganztägig"
        ></v-checkbox> -->

        <calendar-event-location-component
          v-if="selectedOpen"
          v-model="selectedEventInternal"
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
        ></v-textarea>

      </v-card-text>
      <v-card-actions>
        <v-btn
          text
          color="secondary"
          @click="close"
        >
          Cancel
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
        >
          {{(selectedEventInternal.rrule) ? 'Alle aktualisieren' : 'Speichern'}}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script>

import { dispatchRemoveEvent, dispatchUpdateCalendarEvent } from '@/store/calendar/actions'
import { commitAddEventToCalendar, commitSetSelectedEvent, commitRemoveCalendarEvent, commitUpdateSelectedEvent } from '@/store/calendar/mutations'
import { readCalendarById, readCalendars, readSelectedElement, readEventByUID, readCalendarByUID} from '@/store/calendar/getters'
import { getCalendarById } from '@/store/utils'
import CalendarEventLocationComponent from './components/CalendarEventLocationComponent.vue'
import  CalendarDateSelector from '@/views/main/calendar/CalendarDateSelector.vue'

export default {
  props: {

  },

  components: {
    CalendarDateSelector,
    CalendarEventLocationComponent
  },

  emits: ['clickEditEvent', 'close', 'changed'],

  data() {
    return {
      selectedElement: null,
      selectedOpen: false,

      calendar: undefined,

      cctLocations: ['Tower', 'CCTelefon'],
      selectedEventInternal:{calendar:{name:''}, start:new Date(), end:new Date()},
      loading:false,
      loadingExdate:false
    }
  },

  methods: {
    timedChanged(fullday) {
      if (fullday) {
        this.selectedEventInternal.start = new Date(this.selectedEventInternal.start.toDateString())
        this.selectedEventInternal.end = new Date(this.selectedEventInternal.end.toDateString())
      }
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
      this.calendar = readCalendarByUID(this.$store, this.selectedEventInternal.uid)
      if (!this.selectedEventInternal.timed) { // this is for allday events, for which the end property is a limit
        const end = new Date(this.selectedEventInternal.end)
        end.setDate(end.getDate()-1)
        this.selectedEventInternal.end = end
      }
    },

    show(selectedEvent=undefined) {
      // if (!selectedEvent) selectedEvent = this.selectedEvent
      this.loadingExdate = false
      this.loading = false;
      this.selectedOpen = true
      this.initSelectedEventInternal()
    },

    close() {
      this.loading = false;
      this.loadingExdate = false
      this.selectedOpen = false
      this.initSelectedEventInternal()
      this.$emit('close')
    },

    async saveExdate() {
      // TODO: finish this function
      this.loadingExdate = true
      const event = this.selectedEvent
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

    async save(mouseEvent=undefined, loading=true) {
      this.loading = loading;
      const savedEvent = Object.assign({},this.selectedEventInternal)
      if (!savedEvent.timed) {
        const end = new Date(savedEvent.end)
        end.setDate(end.getDate()+1)
        savedEvent.end = end
      }

      if (this.calendar.uid != savedEvent.calendarId) {
        // TODO: disable notifications for remove event
        await dispatchRemoveEvent(this.$store, {uid:savedEvent.uid, calendarId:savedEvent.calendarId, notify:false})
        savedEvent.calendarId = this.calendar.uid
        delete savedEvent.uid
      }
      console.log(savedEvent);

      commitUpdateSelectedEvent(this.$store, savedEvent)
      await dispatchUpdateCalendarEvent(this.$store, savedEvent)
      this.$emit('changed')
      this.close()
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
    calendars: function ()  {
      const calendars = readCalendars(this.$store)
      
      calendars.forEach(e => {
        e.text = e.name
      })
      return calendars
    },

    uiCalendars() {
      const calendarNames = []
      if (this.calendars.forEach) {
        console.log(this.calendars)
        this.calendars.forEach(element => {
          calendarNames.push({
            text:element.name,
            element:element
          })
        });
      }
      return calendarNames
    },

    selectedEvent: function () {
      const selected = readSelectedElement(this.$store)
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
