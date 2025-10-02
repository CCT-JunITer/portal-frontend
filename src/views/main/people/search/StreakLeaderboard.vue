<template>
  <backdrop :height="this.$vuetify.breakpoint.mdAndUp ? '100px' : '50px'" color="grey lighten-4">
    <v-container>
      <div class="d-flex align-center justify-center flex-column mb-5">
        <h1 class="text-h3 text--primary mt-md-10 mb-3">
          <v-icon large color="cctOrange" class="mr-2">mdi-fire</v-icon>
          Streak Leaderboard
        </h1>
        <p class="text-body-1 text--secondary">Die fleißigsten DoSi-Besucher</p>
      </div>

      <v-container>
        <v-btn
          to="/main/people/search"
          outlined
          color="cctBlue"
          class="mb-4">
          <v-icon left>mdi-arrow-left</v-icon>
          Zurück zur Mitgliedersuche
        </v-btn>
        
        <v-row>
          <v-col cols="12" md="6">
            <v-card outlined>
              <v-card-title class="cctOrange--text">
                <v-icon left color="cctOrange">mdi-fire</v-icon>
                Längste aktuelle Streak
              </v-card-title>
              <v-card-subtitle class="text--secondary">
                Wer ist gerade am aktivsten?
              </v-card-subtitle>
              <v-divider></v-divider>
              <v-list v-if="currentStreakLeaderboard.length">
                <v-list-item
                  v-for="(item, index) in currentStreakLeaderboard"
                  :key="item.user.id"
                  :to="`/main/people/profile/view/${item.user.id}`"
                >
                  <v-list-item-avatar>
                    <v-chip
                      :color="getRankColor(index)"
                      dark
                      small
                      class="font-weight-bold"
                    >
                      {{ index + 1 }}
                    </v-chip>
                  </v-list-item-avatar>

                  <employee-profile-picture
                    :employee="item.user"
                    component="v-list-item-avatar"
                    size="40"
                  ></employee-profile-picture>

                  <v-list-item-content>
                    <v-list-item-title>{{ item.user.full_name }}</v-list-item-title>
                    <v-list-item-subtitle>{{ item.user.ressort }}</v-list-item-subtitle>
                  </v-list-item-content>

                  <v-list-item-action>
                    <div class="d-flex align-center">
                      <v-icon color="cctOrange" class="mr-1">mdi-fire</v-icon>
                      <span class="text-h6 font-weight-bold">{{ item.streak.streak_length }}</span>
                    </div>
                    <div class="text-caption text--secondary">
                      {{ formatDateRange(item.streak.streak_start, item.streak.streak_end) }}
                    </div>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
              <v-card-text v-else class="text-center text--secondary">
                <v-icon large color="grey">mdi-emoticon-sad-outline</v-icon>
                <p>Keine aktiven Streaks vorhanden</p>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" md="6">
            <v-card outlined>
              <v-card-title class="cctBlue--text">
                <v-icon left color="cctBlue">mdi-trophy</v-icon>
                Längste Streak aller Zeiten
              </v-card-title>
              <v-card-subtitle class="text--secondary">
                Die Legenden unseres Vereins
              </v-card-subtitle>
              <v-divider></v-divider>
              <v-list v-if="longestStreakLeaderboard.length">
                <v-list-item
                  v-for="(item, index) in longestStreakLeaderboard"
                  :key="item.user.id"
                  :to="`/main/people/profile/view/${item.user.id}`"
                >
                  <v-list-item-avatar>
                    <v-chip
                      :color="getRankColor(index)"
                      dark
                      small
                      class="font-weight-bold"
                    >
                      {{ index + 1 }}
                    </v-chip>
                  </v-list-item-avatar>

                  <employee-profile-picture
                    :employee="item.user"
                    component="v-list-item-avatar"
                    size="40"
                  ></employee-profile-picture>

                  <v-list-item-content>
                    <v-list-item-title>{{ item.user.full_name }}</v-list-item-title>
                    <v-list-item-subtitle>{{ item.user.ressort }}</v-list-item-subtitle>
                  </v-list-item-content>

                  <v-list-item-action>
                    <div class="d-flex align-center">
                      <v-icon color="cctBlue" class="mr-1">mdi-trophy</v-icon>
                      <span class="text-h6 font-weight-bold">{{ item.streak.streak_length }}</span>
                    </div>
                    <div class="text-caption text--secondary">
                      {{ formatDateRange(item.streak.streak_start, item.streak.streak_end) }}
                    </div>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
              <v-card-text v-else class="text-center text--secondary">
                <v-icon large color="grey">mdi-emoticon-sad-outline</v-icon>
                <p>Keine Streaks vorhanden</p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-container>
  </backdrop>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Backdrop from '@/components/Backdrop.vue';
import { IUserProfile, UserStreak } from '@/interfaces';
import EmployeeProfilePicture from '@/components/employee/EmployeeProfilePicture.vue';
import { readUsers } from '@/store/main/getters';
import { dispatchGetUsers } from '@/store/main/actions';
import { dispatchGetEvents } from '@/store/event/actions';
import { readLastDoSi } from '@/store/event/getters';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

interface StreakLeaderboardItem {
  user: IUserProfile;
  streak: UserStreak;
}

@Component({
  components: { Backdrop, EmployeeProfilePicture }
})
export default class StreakLeaderboard extends Vue {
  get users() {
    return readUsers(this.$store);
  }

  get lastDoSi() {
    return readLastDoSi(this.$store);
  }

  get currentStreakLeaderboard(): StreakLeaderboardItem[] {
    if (!this.lastDoSi) {
      return [];
    }

    const items: StreakLeaderboardItem[] = [];
    const lastDoSiTs = new Date(this.lastDoSi.date_from).getTime();

    for (const user of this.users) {
      if (!user.user_streaks || user.user_streaks.length === 0) {
        continue;
      }

      // Find the most recent streak
      const sortedStreaks = [...user.user_streaks].sort((a, b) => {
        const tsA = new Date(a.streak_start).getTime();
        const tsB = new Date(b.streak_start).getTime();
        return tsB - tsA;
      });

      const latestStreak = sortedStreaks[0];
      const latestEndTs = new Date(latestStreak.streak_end).getTime();

      // Check if this streak is current (ends at the last DoSi and has at least 3)
      if (latestEndTs === lastDoSiTs && latestStreak.streak_length >= 3) {
        items.push({
          user,
          streak: latestStreak
        });
      }
    }

    // Sort by streak length descending
    return items.sort((a, b) => b.streak.streak_length - a.streak.streak_length);
  }

  get longestStreakLeaderboard(): StreakLeaderboardItem[] {
    const items: StreakLeaderboardItem[] = [];

    for (const user of this.users) {
      if (!user.user_streaks || user.user_streaks.length === 0) {
        continue;
      }

      // Find the longest streak ever
      const longestStreak = user.user_streaks.reduce((longest, current) => {
        return current.streak_length > longest.streak_length ? current : longest;
      });

      if (longestStreak.streak_length >= 3) {
        items.push({
          user,
          streak: longestStreak
        });
      }
    }

    // Sort by streak length descending
    return items.sort((a, b) => b.streak.streak_length - a.streak.streak_length);
  }

  getRankColor(index: number): string {
    switch (index) {
    case 0:
      return '#FFD700'; // Gold
    case 1:
      return '#C0C0C0'; // Silver
    case 2:
      return '#CD7F32'; // Bronze
    default:
      return 'grey';
    }
  }

  formatDateRange(start: string, end: string): string {
    const startDate = format(new Date(start), 'dd.MM.yy', { locale: de });
    const endDate = format(new Date(end), 'dd.MM.yy', { locale: de });
    return `${startDate} - ${endDate}`;
  }

  public async mounted() {
    await dispatchGetUsers(this.$store);
    
    // Load meeting events to get the last DoSi
    if (this.lastDoSi == null) {
      await dispatchGetEvents(this.$store, 'meeting');
    }
  }
}
</script>

<style lang="scss" scoped>
.v-list-item {
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }
}
</style>
