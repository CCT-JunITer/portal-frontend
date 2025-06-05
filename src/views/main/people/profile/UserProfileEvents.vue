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
    <event-table :items="leadEvents" :type="type">
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>
            Gehaltene {{ typeName }}s
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
import { dispatchGetAllEventsFor } from '@/store/event/actions';
import EventTable from '../../event/EventTable.vue';
import { IEventType, IUserProfile } from '@/interfaces';
 
 
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
      'meeting': 'Meeting',
    }[this.type];
  }
 
  
  private isLeader(leaders: IUserProfile[]) {
    const userProfile = this.userProfile
    if (!userProfile) {
      return [];
    }
    return leaders?.some(leader => leader.id === userProfile.id);
  }
 
  private isTraining(type: IEventType) {
    return type === this.type;
  }
 
  get filterredEvents() {
    return this.events.filter(event => {
      return !this.isLeader(event.leaders) && this.isTraining(event.type);
    });
  }
 
  get leadEvents() {
    return this.events.filter(event => {
      return this.isLeader(event.leaders) && this.isTraining(event.type);
    });
  }
 
  get events() {
    return readEventsForRoute(this.$store)(this.$route);
  }
 
  async mounted() {
    await dispatchGetAllEventsFor(this.$store, Number(this.userProfile?.id));
  }
 
 
  get userProfile() {
    return readRouteUser(this.$store)(this.$route);
  }
}
</script>
 
 