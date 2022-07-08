<template>
  <div class="toolbarContainer">
    <v-checkbox 
      style="display:block;width:100%;padding:0;margin:0;"
      class="text-truncate text-no-wrap"
      v-model="calendar.active"
      :color="calendar.color"
      @change="clicked"
      ripple
    >
      <template v-slot:label>
        <v-tooltip bottom style="padding:0;margin:0">
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
          <!-- <v-dialog
            v-model="nameDialog"
            persistent
            max-width="600px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-list-item
                link
                v-on="on"
                v-bind="attrs"
              >
                <v-list-item-icon>
                  <v-icon>mdi-pencil</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Name bearbeiten</v-list-item-title>


              </v-list-item>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">Kalender Name bearbeiten</span>
              </v-card-title>
              <v-card-text>
                <v-text-field
                  label="Name"
                  required
                ></v-text-field>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="nameDialog = false"
                >
                  Close
                </v-btn>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="nameDialog = false"
                >
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-list-item
            link
            @click="editColor"
          >
            <v-list-item-icon>
              <v-icon>mdi-pencil</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Farbe bearbeiten</v-list-item-title>
          </v-list-item> -->

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
  justify-content: flex-start;
  align-items:center;
}

</style>