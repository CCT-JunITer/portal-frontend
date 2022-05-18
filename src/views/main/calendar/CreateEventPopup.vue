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
          :items="calendarNames"
          v-model="calendar.name"
          label="Kalender"
          outlined
          disabled
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

        <v-text-field
          v-model="selectedEventInternal.location"
          label="Ort"
        >
        </v-text-field>

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
          color="success"
          @click="save"
          :loading="loading"
        >
          Speichern
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script>

import { dispatchRemoveEvent, dispatchUpdateCalendarEvent } from '@/store/calendar/actions'
import { commitAddEventToCalendar, commitSetSelectedEvent, commitUpdateSelectedEvent } from '@/store/calendar/mutations'
import { readCalendarById, readCalendars, readSelectedElement } from '@/store/calendar/getters'
import { getCalendarById } from '@/store/utils'
import  CalendarDateSelector from '@/views/main/calendar/CalendarDateSelector.vue'

export default {
  props: {

  },

  components: {
    CalendarDateSelector
  },

  emits: ['clickEditEvent', 'close', 'changed'],

  data() {
    return {
      selectedElement: null,
      selectedOpen: false,

      selectedEventInternal:{calendar:{name:''}, start:new Date(), end:new Date()},
      loading:false,
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
      if (!this.selectedEventInternal.timed) { // this is for allday events, for which the end property is a limit
        const end = new Date(this.selectedEventInternal.end)
        end.setDate(end.getDate()-1)
        this.selectedEventInternal.end = end
      }
    },

    show(selectedEvent=undefined) {
      // if (!selectedEvent) selectedEvent = this.selectedEvent
      this.loading = false;
      this.selectedOpen = true
      this.initSelectedEventInternal()
    },

    close() {
      this.loading = false;
      this.selectedOpen = false
      this.initSelectedEventInternal()
      this.$emit('close')
    },

    async save() {
      this.loading = true;
      const savedEvent = Object.assign({},this.selectedEventInternal)
      if (!savedEvent.timed) {
        const end = new Date(savedEvent.end)
        end.setDate(end.getDate()+1)
        savedEvent.end = end
      }
      // TODO: maybe do both in one function
      commitUpdateSelectedEvent(this.$store, savedEvent)
      // commitAddEventToCalendar(this.$store, this.selectedEvent)
      // delete this.selectedEventInternal.color
      await dispatchUpdateCalendarEvent(this.$store, savedEvent)
      this.$emit('changed')
      this.close()
    },

    async deleteEvent() {
      const response = await dispatchRemoveEvent(this.$store, this.selectedEvent)
      this.$emit('changed')
      this.close()
    },
  },

  computed: {
    calendars: function ()  {
      return readCalendars(this.$store)
    },

    calendarNames: function() {
      const calendarNames = []
      if (this.calendars.forEach) {
        this.calendars.forEach(element => {
          calendarNames.push(element.name)
        });
      }
      return calendarNames
    },

    selectedEvent: function () {
      const selected = readSelectedElement(this.$store)
      if (selected) return selected
      return {}
    },

    calendar: function () {
      const calendar = this.calendars.find(x => x.uid == this.selectedEventInternal.calendarId)
      if (!calendar) return {name:''}
      return calendar
    }
    
  }
}
</script>
