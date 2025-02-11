<template>
  <v-container v-if="error" class="d-flex flex-column align-center">
    <v-alert type="error">{{ error }}</v-alert>
    <v-row v-if="wmsLink">
      <v-col>
        <v-btn :href="wmsLink" target="_blank" large color="cctPurple" dark class="d-flex">In altem WMS öffnen</v-btn>
      </v-col>
    </v-row>
  </v-container>
  <loading-page v-else></loading-page>
</template>

<script lang="ts">
import { api } from '@/api';
import LoadingPage from '@/components/loading-cct/LoadingPage.vue';
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { Route } from 'vue-router';

@Component({components: {LoadingPage}})
export default class LegacyWMSRedirect extends Vue {
  error = '';
  wmsLink = '';

  @Watch('$route', { immediate: true })
  async onRouteChange(nextRoute?: Route, prevRoute?: Route) {
    if (prevRoute?.query.link === nextRoute?.query.link) {
      return;
    }
    const link = nextRoute?.query.link as string;
    const match = /(https:\/\/wms.cct-ev.de\/(node\/[0-9]+))\/{0,1}.*/.exec(link);
    if (!match || !match[1]) {
      this.error = 'Ungültiger WMS Link';
      return;
    }
    const wmsLink = match[1];
    const response = await api.getSearchResults(this.$store.state.main.token, wmsLink);
    const results = response.data.results as {[type: string]: {id: number, search_type: string}[]};

    const searchResults = Object.entries(results).flatMap(([type, arr]) => arr.map(c => ({...c, type}))).filter(c => c.search_type === 'wms_link');
    const firstResult = searchResults[0];
    if (firstResult) {
      const location = this.$common.findRouteForId(firstResult.type, firstResult.id);
      if (location) {
        this.$router.replace(location);
        return;
      }
      this.error = 'No route found for ' + firstResult.type;
      return;
    }
    this.error = `${link} nicht gefunden`;
    this.wmsLink = `https://oldwms.cct-ev.de/${match[2]}`;
  }

}
</script>

<style lang="scss">

</style>