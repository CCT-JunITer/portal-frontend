<template>
  <v-menu
    v-model="selectedOpen"
    :close-on-content-click="false"
    :activator="selectedElement"
    offset-x
  >
    <v-card
      color="grey lighten-4"
      min-width="350px"
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

export default {
  props: {

  },

  emits: ['clickEditEvent', 'close'],

  data() {
    return {
      selectedElement: null,
      selectedOpen: false,

      selectedEventInternal:{calendar:{name:''}}
    }
  },

  methods: {
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

    show() {
      this.selectedOpen = true
      this.selectedEventInternal = Object.assign({}, this.selectedEvent)
    },

    close() {
      this.selectedOpen = false
      this.selectedEventInternal = Object.assign({}, this.selectedEvent)
      this.$emit('close')
    },

    async save() {
      // TODO: maybe do both in one function
      commitUpdateSelectedEvent(this.$store, this.selectedEventInternal)
      commitAddEventToCalendar(this.$store, this.selectedEvent)
      delete this.selectedEventInternal.color

      await dispatchUpdateCalendarEvent(this.$store, this.selectedEventInternal)
      this.close()
    },

    async deleteEvent() {
      console.log('deleted')
      const response = await dispatchRemoveEvent(this.$store, this.selectedEvent)
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
