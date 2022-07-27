<template>
  <v-tooltip bottom style="padding:0;margin:0">
    <template v-slot:activator="{ on, attrs}">
      <v-btn 
        class="toolbarContainer text-none"
        elevation="0"
        v-on="on"
        v-bind="attrs"
        style="background:transparent;padding:0"
        @change="clicked"
      >
        <v-checkbox 
          style="width:100%;"
          class="text-truncate text-no-wrap"
          v-model="calendar.active"
          :color="calendar.color"
          @change="clicked"
          ripple
          :label="calendar.name"
        >
        </v-checkbox>

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
    </template>
    {{calendar.name}}
  </v-tooltip>
</template>

<script>
import { readCalendars, readTowerCalendar } from '@/store/calendar/getters'
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
      editable:false,
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
        if (this.tower) return this.towerCalendar
        return this.calendars.find(x => x.uid == this.calendarId)
      },
      set(object) {
        commitUpdateCalendars(this.$store, [object])
      }
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
  margin:0;
  padding:0;
  justify-content: flex-start;
  align-items:center;
}

</style>