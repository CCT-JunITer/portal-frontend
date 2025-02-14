<template>
  <v-tooltip bottom content-class="tooltip">
    <template v-slot:activator="{ on, attrs }">
      <v-icon
        color="cctGrey"
        size="20"           
        v-bind="attrs"
        v-on="on"
        v-if="hasStreak"
      >
        mdi-fire
      </v-icon>
    </template>
    <span>
      <span v-if="hasStreak">
        <v-icon color="cctOrange" size="20">mdi-fire</v-icon>
        Streak der Länge {{ streaksSorted[0].streak_length }}
      </span>
      <span v-else>Keine Streak</span>
    </span>
  </v-tooltip>
</template>

<script lang="ts">
import { UserStreak } from '@/interfaces';
import { Vue, Component, Prop } from 'vue-property-decorator'
import { readLastDoSi } from '@/store/event/getters';
import { dispatchGetEvents } from '@/store/event/actions';

@Component({})
export default class StreakIcon extends Vue {

  @Prop()
  public streaks!: UserStreak[];

  get streaksSorted() {
    return this.streaks?.sort((a, b) => new Date(b.streak_start).getTime() - new Date(a.streak_start).getTime()) || [];
  }

  get lastDoSi() {
    return readLastDoSi(this.$store);
  }

  get hasStreak() {
    if (!this.lastDoSi) {
      return false;
    }

    return this.streaksSorted?.length > 0 && 
      new Date(this.streaksSorted[0].streak_end) === new Date(this.lastDoSi.date_from)
      && this.streaksSorted[0].streak_length >= 3;
  }

  public async mounted() {
    if (this.lastDoSi != null) {
      return;
    }

    await dispatchGetEvents(this.$store, 'meeting')
  }
}
</script>

<style lang="scss" scoped>

.tooltip {
  padding: 2px 7px;
  font-size: unset;
}

.zero-lineheight {
  line-height: 0;
}

</style>