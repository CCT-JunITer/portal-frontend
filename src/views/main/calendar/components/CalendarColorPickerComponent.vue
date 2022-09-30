<template>
  <v-menu 
    v-model="show"
    offset-y
    mode="hexa"
    :close-on-content-click="false"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        class="ml-2"
        v-bind="attrs"
        v-on="on"
        elevation="0"
        icon
        :color="color"
      >
        <v-icon>mdi-circle</v-icon>
      </v-btn>
    </template>
    <v-card
    >
      <v-card-text>
        <v-color-picker
          v-model="colorInternal"
          hide-mode-switch
          show-swatches
          hide-inputs
          :swatches="swatches"
        ></v-color-picker>
      </v-card-text>
      <v-spacer></v-spacer>
      <v-card-actions>
        <v-btn @click="close">Abbrechen</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="success" @click="save">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script>
export default {
  props: ['value', 'disabled', 'readonly'],

  model: {
    prop:'value',
    event: 'change'
  },

  data() {
    return {
      colorInternal: '',
      show:false,
      swatches: [
        // those colors are from the google calendar
        ['#d50000', '#e67c73', '#f4511e'],
        ['#f6bf26', '#33b679', '#0b8043'],
        ['#039be5', '#3f51b5', '#7986cb'],
        ['#8e24aa', '#616161', '#795548'],
      ],
    }
  },

  methods: {
    close() {
      this.show = false
    },
    save() {
      this.color = this.colorInternal
      this.close()
    }
  },

  watch: {
    show: function(changed) {
      this.colorInternal = this.color
    }
  },

  mounted() {
    this.colorInternal = this.color
  },

  computed: {
    color: {
      get() {
        return this.value
      },

      set(val) {
        this.$emit('change', val);
      }
    }
  }
}
</script>

<style>

</style>