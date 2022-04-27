<template>
  <v-overlay
    :value="visible"
    opacity="1"
    color="white"
    z-index="1"
    class="eventCreator"
  > 
    <div class="eventCreatorContent">
      <div style="height:64px"></div> 

      <v-btn
        @click="close"
        icon
        color="black"
      >
        <v-icon>
          mdi-close-thick
        </v-icon>
      </v-btn>
      <v-btn
        class="white--text"
        color="teal"
        @click="save"
      >
        Speichern
      </v-btn>
    </div>
  </v-overlay>
</template>

<script>

export default {
  props: {
    initiallyVisible:Boolean,
  },

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
    },

    save() {
      Object.assign(this.selectedEvent, this.selectedEventInternal)
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