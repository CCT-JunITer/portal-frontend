<template>
  <div class="CalendarLocationContainer">
    <v-icon class="mr-3">mdi-map-marker</v-icon>

    <v-text-field
      v-model="location"
      label="Ort"
      full-width
      :disabled="disabled"
      :readonly="readonly"
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
      :disabled="disabled"
      :readonly="readonly"
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
  props: ['value', 'disabled', 'readonly'],
  
  model: {
    prop:'value',
    event: 'change'
  },

  data() {
    const cctLocations = [
      {name: 'Benutzerdefiniert', location: '', locationId:undefined, textfieldDisabled:false},
      {name: 'Tower', location: 'Erweiterungsbau der TU Berlin, Str. des 17. Juni 145, 10623 Berlin, Raum 512', locationId:'tower', textfieldDisabled:true},
      {name: 'CCTelefon', location: 'https://zoom.us/j/2814954064?pwd=ME1GbWNjV3ptemVHL3Y3cGE2VWRHQT09', locationId:'cctelefon', textfieldDisabled:true}
    ]
    const cctLocationsDict = {}
    cctLocations.forEach(obj => {cctLocationsDict[obj.locationId] = obj})

    return {
      selectedItem: cctLocations[0],
      towerLocation: cctLocations[1],
      cctLocations: cctLocations,
      cctLocationsDict:cctLocationsDict
    }
  },

  created() {
    // if (this.tower) {
    //   this.selectedItem = this.towerLocation
    // } else {
    //   if (this.location == this.cctLocations[2].location) this.selectedItem = this.cctLocations[2]
    //   else this.selectedItem = this.cctLocations[0]
    // }
    this.selectedItem = this.cctLocationsDict[this.locationId]
    this.changed()
  },

  methods: {
    changed() {
      this.location = this.selectedItem.location
      this.locationId = this.selectedItem.locationId
    },
  },

  computed: {
    location: {
      get() {
        return this.value.location
      },
      set(value) {
        const newValue = this.value;
        // const newValue = {...this.value};
        newValue.location = value
        this.$emit('change', newValue);
      }
    },

    tower() {return this.locationId == 'tower'},

    locationId: {
      get() {
        return (this.value.locationId) ? this.value.locationId : undefined
      },
      set(value) {
        const newValue = this.value;
        // const newValue = {...this.value};
        newValue.locationId = value
        this.$emit('change', newValue);
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