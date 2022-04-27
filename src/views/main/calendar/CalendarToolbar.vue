<template>
  <div class="toolbarContainer">
    <v-checkbox 
      v-model="calendar.active"
      :color="calendar.color"
      ripple
      :label="calendar.name"
      @change="$emit('change')"
    >
    </v-checkbox>
    
    <div style="width:100%"></div>
    <v-menu offset-x>
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
          @click="editName"
        >
          <v-list-item-icon>
            <v-icon>mdi-pencil</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Name bearbeiten</v-list-item-title>
        </v-list-item>

        <v-list-item
          link
          @click="editColor"
        >
          <v-list-item-icon>
            <v-icon>mdi-pencil</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Farbe bearbeiten</v-list-item-title>
        </v-list-item>

        <v-list-item
          link
          @click="deleteCalendar"
        >
          <v-list-item-icon>
            <v-icon>mdi-delete</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Löschen</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <!-- <v-overlay
      :value="editable"
      opacity="1"
      color="white"
      z-index=0
    >
    </v-overlay> -->
  </div>
</template>

<script>
import { readCalendars } from '@/store/calendar/getters'
import { dispatchDeleteCalendar } from '@/store/calendar/actions'

export default {

  props: {
    calendarId: {
      required:true
    },
  },
  emits:['change'],

  data() {
    return {
      editable:false
    }
  },

  computed: {
    calendars: function ()  {
      return readCalendars(this.$store)
    },
    
    calendar: function() {
      console.log(this.calendarId)
      console.log(this.calendars)
      return this.calendars.find(x => x.uid == this.calendarId)
    }
  },
  methods: {
    deleteCalendar() {
      dispatchDeleteCalendar(this.$store, this.calendarId)
    },

    editName() {
      this.editable = true
    },

    editColor() {
      this.editName()
    }
  }
  
}
</script>

<style scoped>

.toolbarContainer {
  width:100%;
  display:flex;
  justify-content: center;
}

</style>