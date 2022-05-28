<template>
  <div class="CalendarLocationContainer">
    <v-icon class="mr-3">mdi-map-marker</v-icon>

    <v-text-field
      v-model="location"
      label="Ort"
      full-width
      :disabled="selectedItem.textfieldDisabled"
    >
    </v-text-field>
    <v-select
      v-model="selectedItem"
      :items="cctLocations"
      item-text="name"
      @change="changed"
      return-object
      class="ml-3"
      label="Typ"
      style="width:60px;align-self:flex-end"
    >
    </v-select>

    <!-- <v-menu offset-y>
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
        >
          <v-list-item-title
          > 
            Tower 
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu> -->
  </div>
</template>


<script>
export default {
  props: ['value'],
  
  model: {
    prop:'value',
    event: 'change'
  },

  data() {
    const cctLocations = [
      {name: 'custom', location: '', tower:false, textfieldDisabled:false},
      {name: 'Tower', location: 'Towerlocation', tower:true, textfieldDisabled:true},
      {name: 'CCTelefon', location: 'zoom link...', tower:false, textfieldDisabled:true}
    ]
    return {
      selectedItem: cctLocations[0],
      towerLocation: cctLocations[1],
      cctLocations: cctLocations
    }
  },

  created() {
    if (this.tower) {
      this.selectedItem = this.towerLocation
    } else {
      if (this.location == this.cctLocations[2].location) this.selectedItem = this.cctLocations[2]
      else this.selectedItem = this.cctLocations[0]
    }
    this.changed()
  },

  methods: {
    changed() {
      this.location = this.selectedItem.location
      this.tower = this.selectedItem.tower
    },
  },

  computed: {
    location: {
      get() {
        return this.value.location
      },
      set(value) {
        this.value.location = value
        this.$emit('change', this.value)
      }
    },

    tower: {
      get() {
        return this.value.tower
      },
      set(value) {
        this.value.tower = value
        this.$emit('change', this.value)
      }
    }
  }

}
</script>

<style scoped>
.CalendarLocationContainer {
  display:flex; 
  width:100%;
  justify-content: flex-start;
}
</style>