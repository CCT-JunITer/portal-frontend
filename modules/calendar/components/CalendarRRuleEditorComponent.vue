<template>
  <v-select
    v-model="rrule"
    filled
    dense
    hide-details
    :items="types"
    :item-text="objectToText"
    return-object
    :readonly="readonly"
    :disabled="disabled"
  >

  </v-select>
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
      freqToName:{
        undefined: 'Einmalig',
        'DAILY':'Täglich',
        'WEEKLY': 'Wöchentlich',
        'MONTHLY': 'Monatlich',
        'YEARLY': 'Jährlich',
        'custom': 'Benutzerdefiniert'
      },
      freqToNamePlural: {
        'DAILY':'Tägig',
      },
      types: [
        {freq:undefined},
        {freq:'DAILY'},
        {freq:'WEEKLY'},
        {freq:'MONTHLY'},
        {freq:'YEARLY'},
        // {freq:'custom'}, TODO: add editing of this component
      ]
    }
  },

  methods: {
    objectToText(obj) {
      const freq = (obj) ? obj.freq : undefined

      let text = this.freqToName[freq]
      if (freq && obj.interval && obj.interval > 1) {
        text = obj.interval + ' ' + ((freq in this.freqToNamePlural) ? this.freqToNamePlural[freq] : this.freqToName[freq])
      }
      
      // console.log(typeName + '  ' + ((obj) ? obj.freq : 'object undefined'))
      if (obj.end && obj.endtype) {
        if (obj.endtype == 'COUNT') {
          text += ', ' + obj.end + ' Mal'
        } else if (obj.endtype == 'UNTIL') {
          const end = new Date(obj.end)
          text += ' bis zum ' + end.getDate() + '.' + end.getMonth() + '.' + end.getFullYear()
        }
      }

      return text
    },

    rruleChanged(val) {
      const rruleText = this.objectToText(val)

      if (this.rruleTexts.indexOf(rruleText) == -1) {
        this.types.push({...val})
      }
    }
  },

  created() {
    this.rruleChanged(this.rrule)
  },

  watch: {
    rrule(val) {
      this.rruleChanged(val)
    }
  },

  computed: {
    rrule: {
      get: function() {
        if (!this.value) return this.types[0];
        return this.value
      },

      set: function(val) {
        if (val.freq === undefined) val = undefined
        this.$emit('change', {...val});
      }
    },

    rruleTexts: function() {
      const l = []
      this.types.forEach(element => {
        l.push(this.objectToText(element))
      });
      return l
    }
  }
}
</script>

<style>

</style>