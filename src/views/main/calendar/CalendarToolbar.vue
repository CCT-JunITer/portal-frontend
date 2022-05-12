<template>
  <div class="toolbarContainer">
    <v-checkbox 
      style="display:block;width:100%"
      class="text-truncate text-no-wrap"
      v-model="calendar.active"
      :color="calendar.color"
      @change="clicked"
      ripple
    >
      <template v-slot:label>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <div
              v-on="on"
            >
              {{calendar.name}}
            </div>
          </template>
          {{calendar.name}}
        </v-tooltip>
      </template>
    </v-checkbox>

    <div style="width:100%; flex-shrink:100"></div>
    <div style="justify-self:flex-end;">
      <v-menu offset-x >
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
    </div>
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
import { dispatchDeleteCalendar, dispatchUpdateCalendar } from '@/store/calendar/actions'

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
    },
    clicked() {
      dispatchUpdateCalendar(this.$store, this.calendar);
      this.$emit('change');
    }
  }
  
}
</script>

<style scoped>

.toolbarContainer {
  width:100%;
  display:flex;
  justify-content: flex-start;
  align-items:center;
}

</style>