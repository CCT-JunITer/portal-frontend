<template>
  <div v-if="userProfile">
    <event-table :items="filterredEvents" :type="type">
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>
            Besuchte {{ typeName }}s
          </v-toolbar-title>
        </v-toolbar>
      </template>
    </event-table>      

  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { readRouteUser } from '@/store/main/getters';
import { readEventsForRoute } from '@/store/event/getters';
import { dispatchGetEventsFor } from '@/store/event/actions';
import EventTable from '../../event/EventTable.vue';
import { IEventType } from '@/interfaces';


@Component({
  components: { EventTable }
})
export default class UserProfileEvents extends Vue {
  public get type() {
    return this.$route.meta?.event_type as IEventType;
  }

  public get typeName() {
    return {
      'training': 'Training',
      'meeting': 'Meeting'
    }[this.type];
  }

  get filterredEvents() {
    return this.events.filter(event => event.type === this.type);
  }

  get events() {
    return readEventsForRoute(this.$store)(this.$route);
  }

  async mounted() {
    await dispatchGetEventsFor(this.$store, Number(this.userProfile?.id));
  }


  get userProfile() {
    return readRouteUser(this.$store)(this.$route);
  }
}
</script>
