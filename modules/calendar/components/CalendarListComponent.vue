<template>
  <v-list style="padding-top:0;padding-bottom:0">
    <v-list-group
      :value="unfolded"
      :prepend-icon="icon"
    >
      <template v-slot:activator>
        <v-list-item-title>{{label}}</v-list-item-title>
      </template>
      
      <v-list-item v-if="calendars.length == 0">
        <v-list-item-title>Kein Kalender verfügbar</v-list-item-title>
      </v-list-item>

      <div v-if="calendars.length > 0">
        <v-tooltip
          bottom 
          style="padding:0;margin:0"
          v-for="(calendar, i) in calendars"
          :key="i"
        >
          
          <template v-slot:activator="{ on, attrs}">
            <v-list-item
              link
              dense
              :ripple="!isEditingName(calendar)"
              @click="clicked(calendar)"
              v-on="on"
              v-bind="attrs"
            >
    
              <v-list-item-icon class="text-center">
                <div v-if="calendar.loading == 0">
                  <v-icon :color="calendar.color" v-if="calendar.active">mdi-checkbox-marked</v-icon>
                  <v-icon :color="calendar.color" v-else>mdi-checkbox-blank-outline</v-icon>
                </div>
                <v-progress-circular
                  v-else
                  class="text-center pb-1"
                  indeterminate
                  size="30"
                  :color="calendar.color"
                >
                  {{calendar.loading}}
                </v-progress-circular>
              </v-list-item-icon>
              <v-list-item-title>
                <div v-if="!isEditingName(calendar)">
                  {{calendar.name}}
                </div>
  
                <v-text-field
                  v-else
                  ref="editCalendarName"
                  v-model="newName"
                  append-icon="mdi-check"
                  clearable
                  @click:clear="cancelEditCalendarName"
                  @click:append="saveNewName(calendar)"
                >
                </v-text-field>
              </v-list-item-title>
              <v-list-item-action
                style="margin:0"
              >
                <v-menu offset-x style="top:0;left:0">
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
                      @click="editCalendarName(calendar)"
                    >
                      <v-list-item-icon>
                        <v-icon>mdi-pencil</v-icon>
                      </v-list-item-icon>
                      <v-list-item-title>Kalendername ändern</v-list-item-title>
                    </v-list-item>
                    <v-list-item
                      link
                      @click="deleteCalendar(calendar)"
                    >
                      <v-list-item-icon>
                        <v-icon>mdi-delete</v-icon>
                      </v-list-item-icon>
                      <v-list-item-title>Kalender Löschen</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-list-item-action>
            </v-list-item>
          </template>
          {{calendar.name}}
        </v-tooltip>
      </div>
    </v-list-group>
  </v-list>
</template>

<script>
import { dispatchDeleteCalendar, dispatchFetchCalendars, dispatchUpdateCalendar } from '../store/actions'

export default {
  props: {
    value:{
      default: () => []
    },

    label:{
      required:true
    },
    icon:{
      default:undefined
    },
  },

  data() {
    return {
      unfolded: false,
      nameChangingCalendar:undefined,
      newName:''
    }
  },

  emits:['change'],

  methods: {
    clicked(calendar) {
      if (!this.isEditingName(calendar)) {
        calendar.active = !calendar.active
        this.updateCalendar(calendar)
      }
    },
    updateCalendar(calendar) {
      dispatchUpdateCalendar(this.$store, calendar);
      this.$emit('change', calendar);
    },
    deleteCalendar(calendar) {
      console.log('deleting ' + calendar.name)
    },

    editCalendarName(calendar) {
      this.nameChangingCalendar = calendar
      this.newName = calendar.name
    },

    cancelEditCalendarName() {
      this.newName = ''
      this.nameChangingCalendar = undefined
    },

    saveNewName(calendar) {
      calendar.name = this.newName
      this.updateCalendar(calendar)
      this.cancelEditCalendarName()
    },

    setUnfolded(value) {
      this.unfolded = value
    },

    isEditingName(calendar) {
      return this.nameChangingCalendar && this.nameChangingCalendar.uid == calendar.uid
    }
  },

  computed: {
    calendars: {
      get() {
        return this.value
      }
    },
  },
}

</script>