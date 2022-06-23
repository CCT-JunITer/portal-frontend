<template>
  <v-container v-if="this.accepted">
    <event-checkmark-animation></event-checkmark-animation>
    <v-alert text dense type="success">
      Erfolgreich angemeldet
    </v-alert>
  </v-container>
  <v-container v-else>
    <v-alert text dense type="error">
      Anmeldung nicht erfolgreich. Bitte erneut versuchen
    </v-alert>
  </v-container>
</template>

<script lang="ts">
import { api } from '@/api';
import { Vue, Component } from 'vue-property-decorator';
import EventCheckmarkAnimation from './EventCheckmarkAnimation.vue';

@Component({
  components: {
    EventCheckmarkAnimation
  }
})
export default class EventCheckin extends Vue{

  public accepted: boolean | null = false;

  public async mounted(){
    const response = await api.updateParticipants(this.$store.state.main.token, +this.$route.params.id, +this.$route.query.otp);
    const accepted = response.data;
    this.accepted = accepted;
  }

}
</script>

<style lang="scss">
  

  
</style>