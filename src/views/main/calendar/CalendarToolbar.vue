<template>
  <v-tooltip bottom style="padding:0;margin:0">
    <template v-slot:activator="{ on, attrs}">
      <v-btn 
        class="toolbarContainer text-none"
        elevation="0"
        v-on="on"
        v-bind="attrs"
        style="background:transparent;padding:0"
        @click="clicked"
      >
        <v-checkbox 
          v-if="calendar.loading == 0"
          class="text-truncate text-no-wrap mr-1"
          v-model="calendar.active"
          :color="calendar.color"
          @click="clicked"
          ripple
        >
        </v-checkbox>
        <v-progress-circular
          v-else
          class="mr-2 text-center"
          indeterminate
          size="30"
          :color="calendar.color"
        >
          {{calendar.loading}}
        </v-progress-circular>
        <v-label><div style="letter-spacing:normal">{{calendar.name}}</div></v-label>

        <div style="width:100%; flex-shrink:100"></div>
        <div >
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
      </v-btn>
      <!-- <v-progress-linear
        :active="loading > 0"
        indeterminate
        absolute
        bottom
        :color="(calendar.color) ? calendar.color : 'primary'"
      >
      </v-progress-linear> -->

    </template>
    {{calendar.name}}
  </v-tooltip>
</template>

<script>
import { readCalendars, readCalendarsWithoutTower, readTowerCalendar } from '@/store/calendar/getters'
import { dispatchDeleteCalendar, dispatchFetchCalendars, dispatchUpdateCalendar } from '@/store/calendar/actions'
import { commitUpdateCalendars } from '@/store/calendar/mutations'

export default {

  props: {
    calendarId: {
      required:true
    },
    tower: {
      default: false
    }
  },
  emits:['change'],

  data() {
    return {
      nameDialog: false,
    }
  },

  computed: {
    calendars: function ()  {
      return readCalendars(this.$store)
    },

    towerCalendar: function() {
      return readTowerCalendar(this.$store)
    },
    
    calendar: {
      get() {
        return this.calendars.find(x => x.uid == this.calendarId)
      },
      set(object) {
        commitUpdateCalendars(this.$store, [object])
      }
    },

    loading: function(){
      return (this.calendar.loading) ? this.calendar.loading : 0
    }
  },
  methods: {
    nameChanged() {
      this.nameDialog = false
      this.save()
    },
    deleteCalendar() {
      dispatchDeleteCalendar(this.$store, this.calendarId)
    },

    save() {
      dispatchUpdateCalendar(this.$store, this.calendar)
    },

    editName() {
      this.editable = true
    },

    editColor() {
      this.editName()
    },

    clicked() {
      this.calendar.active = !this.calendar.active
      console.log(this.calendar.active)
      this.updateCalendar()
    },

    updateCalendar() {
      dispatchUpdateCalendar(this.$store, this.calendar);
      this.$emit('change', this.calendar);
    },
    editable() {
      if (!this.calendar) return false
      return this.calendar.rights.includes('u')
    },
  }
  
}
</script>

<style scoped>

.toolbarContainer {
  width:100%;
  display:flex;
  margin:0;
  padding:0;
  justify-content: flex-start;
  align-items:center;
}

</style>