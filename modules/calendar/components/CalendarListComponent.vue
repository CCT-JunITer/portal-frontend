<template>
  <v-list style="padding-top:0;padding-bottom:0">
    <v-list-group
      :value="unfolded"
      :prepend-icon="icon"
    >
      <template v-slot:activator>
        <v-list-item-title>{{label}}</v-list-item-title>
      </template>
      
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
            <v-list-item-title 
              v-text="calendar.name"
            />
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
                    @click="deleteCalendar(calendar)"
                  >
                    <v-list-item-icon>
                      <v-icon>mdi-delete</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Löschen</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-list-item-action>
          </v-list-item>
        </template>
        {{calendar.name}}
      </v-tooltip>
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
      unfolded: false
    }
  },

  emits:['change'],

  methods: {
    clicked(calendar) {
      calendar.active = !calendar.active
      this.updateCalendar(calendar)
    },
    updateCalendar(calendar) {
      dispatchUpdateCalendar(this.$store, calendar);
      this.$emit('change', calendar);
    },
    deleteCalendar(calendar) {
      console.log('deleting ' + calendar.name)
    },

    setUnfolded(value) {
      this.unfolded = value
    }
  },

  computed: {
    calendars: {
      get() {
        return this.value
      }
    }
  },
}

</script>