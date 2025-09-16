<template>
  <v-tooltip bottom content-class="tooltip" :disabled="!hasStreak">
    <template v-slot:activator="{ on, attrs }">
      <v-icon
        color="cctGrey"
        size="20"           
        v-bind="attrs"
        v-on="on"
        v-show="hasStreak"
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
    const list = this.streaks || [];
    // Avoid mutating props; sort a shallow copy for predictable reactivity
    const parseTs = (d: string | number | Date) => {
      const ts = new Date(d).getTime();
      return Number.isFinite(ts) ? ts : 0;
    };
    return [...list].sort((a, b) => parseTs(b.streak_start) - parseTs(a.streak_start));
  }

  get lastDoSi() {
    return readLastDoSi(this.$store);
  }

  get hasStreak() {
    if (!this.lastDoSi) {
      return false;
    }
    if (!this.streaksSorted?.length) {
      return false;
    }
    const latest = this.streaksSorted[0];
    // Compare timestamps instead of Date object identity
    const latestEndTs = new Date(latest.streak_end).getTime();
    const lastDoSiTs = new Date(this.lastDoSi.date_from).getTime();
    return latestEndTs === lastDoSiTs && latest.streak_length >= 3;
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