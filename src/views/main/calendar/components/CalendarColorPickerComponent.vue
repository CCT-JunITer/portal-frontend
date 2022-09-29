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
    <v-card>
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
        ['#FF0000', '#AA0000', '#550000'],
        ['#FFFF00', '#AAAA00', '#555500'],
        ['#00FF00', '#00AA00', '#005500'],
        ['#00FFFF', '#00AAAA', '#005555'],
        ['#0000FF', '#0000AA', '#000055'],
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