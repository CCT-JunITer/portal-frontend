<template>
  <v-row justify="center">
    <v-dialog
      v-model="visible"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar
          dark
          color="primary"
        >
          <v-btn
            icon
            dark
            @click="close"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>
            <v-text-field
              v-model="selectedEventInternal.name"
              flat
            >
            </v-text-field>
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn
              dark
              text
              @click="save"
            >
              Save
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>        
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { commitAddEventToCalendar, commitUpdateSelectedEvent } from '@/store/calendar/mutations'
import { dispatchUpdateCalendarEvent } from '@/store/calendar/actions'

export default {
  props: {
    initiallyVisible:Boolean,
  },

  emits:['changed', 'close'],

  data () {
    return {
      visible: this.initiallyVisible,
      selectedEvent:{},
      selectedEventInternal:{calendar:{name:''}},
    }
  },

  methods: {
    show(selectedEvent=undefined) {
      if (selectedEvent) this.setSelectedEvent(selectedEvent)
      this.visible = true
      this.selectedEventInternal = Object.assign({}, this.selectedEvent)
    },

    close() {
      this.visible = false
      this.selectedEventInternal = Object.assign({}, this.selectedEvent)
      this.$emit('close')
    },

    async save() {
      // TODO: maybe do both in one function
      commitUpdateSelectedEvent(this.$store, this.selectedEventInternal)
      // commitAddEventToCalendar(this.$store, this.selectedEvent)
      delete this.selectedEventInternal.color

      await dispatchUpdateCalendarEvent(this.$store, this.selectedEventInternal)
      this.close()
    },

    setSelectedEvent(selectedEvent) {
      this.selectedEvent = selectedEvent
    },
  },


}
</script>

<style scoped>

.eventCreator {
  height: 100%;
  width: 100%;
  justify-content:flex-start;
  align-items:flex-start;
}

.eventCreatorContent {
  z-index: 2;
}

</style>