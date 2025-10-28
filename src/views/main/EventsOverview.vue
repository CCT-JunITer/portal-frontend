<!-- eslint-disable vue/valid-v-for -->
<template>
  <div>
    <!-- Page Header -->
    <v-toolbar flat>
      <v-btn icon @click="$router.back()">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-toolbar-title>CCTermine</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon :loading="loading" @click="refresh">
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
    </v-toolbar>

    <v-progress-linear
      v-if="loading"
      indeterminate
      color="primary"
      height="3"
    ></v-progress-linear>

    <v-container fluid class="pa-4 pa-sm-8">
      <!-- Empty State -->
      <div
        v-if="!loading && groupedEvents.length === 0"
        class="empty-state text-center pa-12"
      >
        <v-icon size="64" color="grey lighten-2">mdi-calendar-blank-outline</v-icon>
        <div class="text-h6 grey--text mt-4">Keine bevorstehenden Termine</div>
      </div>

      <!-- Events Content -->
      <div v-else class="agenda-container">
        <div
          v-for="group in groupedEvents"
          :key="group.dateKey"
          class="date-group mb-6 mb-sm-8"
        >
          <!-- Date header -->
          <div class="date-header d-flex align-center mb-3 mb-sm-4">
            <v-chip
              label
              :color="getDateChipColor(group)"
              :text-color="getDateChipTextColor(group)"
              class="font-weight-bold px-3 px-sm-4"
              small
            >
              <v-icon left x-small>mdi-calendar</v-icon>
              {{ group.label }}
            </v-chip>
            <div class="ml-2 ml-sm-3 text-caption grey--text d-none d-sm-block">
              {{ group.weekday }}
            </div>
          </div>

          <!-- Events for this date -->
          <v-timeline dense align-top>
            <v-timeline-item
              v-for="(ev, idx) in group.events"
              :key="idx"
              :color="getEventColor(ev)"
              small
              fill-dot
            >
              <template v-slot:icon>
                <v-icon small color="white">{{ getEventIcon(ev) }}</v-icon>
              </template>

              <v-card class="event-card elevation-2" :class="getEventClass(ev)">
                <v-card-text class="pa-3 pa-sm-4">
                  <!-- Time Badge -->
                  <v-chip
                    x-small
                    :color="getEventColor(ev)"
                    text-color="white"
                    class="mb-2 font-weight-medium"
                    label
                  >
                    <v-icon x-small left>{{ getEventIcon(ev) }}</v-icon>
                    {{ ev.timeDisplay }}
                  </v-chip>

                  <!-- Multi-day Badge -->
                  <v-chip
                    v-if="ev.isMultiDay"
                    x-small
                    :color="ev.isAllDay ? 'cctPurple' : 'cctGreen'"
                    text-color="white"
                    class="mb-2 ml-1"
                    label
                  >
                    <v-icon x-small left>mdi-calendar-range</v-icon>
                    Mehrtägig
                  </v-chip>

                  <!-- Title -->
                  <div class="text-h6 text-sm-h5 font-weight-bold mb-2 event-title">
                    {{ ev.summary || "Ohne Titel" }}
                  </div>

                  <!-- Category -->
                  <div v-if="ev.category" class="d-flex align-center mb-2">
                    <v-icon small color="grey darken-1" class="mr-2">mdi-tag-outline</v-icon>
                    <span class="text-body-2 grey--text text--darken-2">{{ ev.category }}</span>
                  </div>

                  <!-- Location -->
                  <div v-if="ev.location && ev.location !== 'None'" class="d-flex align-center mb-2">
                    <v-icon small color="grey darken-1" class="mr-2">mdi-map-marker</v-icon>
                    <span class="text-body-2 grey--text text--darken-2">{{ ev.location }}</span>
                  </div>

                  <!-- Description -->
                  <div v-if="ev.description && ev.description !== 'None'" class="event-description mt-3">
                    <div
                      class="text-body-2 grey--text text--darken-1 description-content"
                      :class="{ expanded: isExpanded(ev) }"
                      v-html="formatDescription(ev.description)"
                    ></div>
                    <v-btn
                      v-if="ev.description.length > 150"
                      text
                      x-small
                      color="primary"
                      class="mt-1 px-0"
                      @click="toggleDescription(ev)"
                    >
                      {{ isExpanded(ev) ? "Weniger" : "Mehr" }}
                      <v-icon right x-small>
                        {{ isExpanded(ev) ? "mdi-chevron-up" : "mdi-chevron-down" }}
                      </v-icon>
                    </v-btn>
                  </div>
                </v-card-text>
              </v-card>
            </v-timeline-item>
          </v-timeline>
        </div>
      </div>
    </v-container>
  </div>
</template>

<script>
import { dispatchGetInklEvents } from '@/store/event/actions';
import { DateTime } from 'luxon';

export default {
  name: 'EventsOverview',
  data() {
    return {
      events: [],
      loading: false,
      expandedDescriptions: {}, // Track expanded state by event UID
    };
  },
  computed: {
    groupedEvents() {
      if (!this.events || this.events.length === 0) return [];

      const today = DateTime.local().startOf('day');
      const groups = {};

      this.events.forEach((event) => {
        const startDT = DateTime.fromISO(event.start);
        const endDT = DateTime.fromISO(event.end);
        const dateKey = startDT.toFormat('yyyy-LL-dd');

        if (!groups[dateKey]) {
          const isToday = startDT.hasSame(today, 'day');
          const isTomorrow = startDT.hasSame(today.plus({ days: 1 }), 'day');

          let label;
          if (isToday) label = 'Heute';
          else if (isTomorrow) label = 'Morgen';
          else label = startDT.toFormat('dd. MMMM yyyy', { locale: 'de' });

          groups[dateKey] = {
            dateKey,
            label,
            weekday: startDT.toFormat('cccc', { locale: 'de' }),
            isToday,
            isTomorrow,
            date: startDT,
            events: [],
          };
        }

        const isAllDay = event.all_day === true;
        const isMultiDay = !startDT.hasSame(endDT, 'day');
        let timeDisplay;

        if (isAllDay && isMultiDay) {
          // All-day event spanning multiple days
          timeDisplay = `${startDT.toFormat('dd.MM')} - ${endDT.toFormat(
            'dd.MM'
          )}`;
        } else if (isAllDay) {
          // Single-day all-day event
          timeDisplay = 'Ganztägig';
        } else if (isMultiDay) {
          // Regular multi-day event with specific times
          timeDisplay = `${startDT.toFormat('dd.MM HH:mm')} - ${endDT.toFormat(
            'dd.MM HH:mm'
          )}`;
        } else {
          // Regular single-day event
          timeDisplay = `${startDT.toFormat('HH:mm')} - ${endDT.toFormat(
            'HH:mm'
          )}`;
        }

        groups[dateKey].events.push({
          ...event,
          startDT,
          endDT,
          isAllDay,
          isMultiDay,
          timeDisplay,
        });
      });

      // Sort groups by date and events within groups by time
      return Object.values(groups)
        .sort((a, b) => a.date.toMillis() - b.date.toMillis())
        .map((group) => ({
          ...group,
          events: group.events.sort((a, b) => {
            // All-day events come first
            if (a.isAllDay && !b.isAllDay) return -1;
            if (!a.isAllDay && b.isAllDay) return 1;
            // Then sort by start time
            return a.startDT.toMillis() - b.startDT.toMillis();
          }),
        }));
    },
  },
  methods: {
    async refresh() {
      this.loading = true;
      try {
        const inklEvents = await dispatchGetInklEvents(this.$store);
        this.events = Array.isArray(inklEvents) ? inklEvents : [];
      } catch (error) {
        console.error('Fehler beim Laden der Termine:', error);
        this.events = [];
      } finally {
        this.loading = false;
      }
    },

    getDateChipColor(group) {
      if (group.isToday) return 'primary';
      if (group.isTomorrow) return 'cctOrange';
      return 'grey lighten-3';
    },

    getDateChipTextColor(group) {
      return (group.isToday || group.isTomorrow) ? 'white' : 'grey darken-2';
    },

    getEventColor(event) {
      if (event.isAllDay) return 'cctPurple';
      if (event.isMultiDay) return 'cctGreen';
      return 'primary';
    },

    getEventIcon(event) {
      if (event.isAllDay) return 'mdi-calendar-blank';
      if (event.isMultiDay) return 'mdi-calendar-range';
      return 'mdi-clock-outline';
    },

    getEventClass(event) {
      const classes = [];
      if (event.isMultiDay) classes.push('multi-day');
      if (event.isAllDay) classes.push('all-day');
      return classes;
    },

    formatDescription(desc) {
      if (!desc || desc === 'None') return '';
      return desc
        .replace(/&nbsp;/g, ' ')
        .replace(/\n/g, '<br>')
        .replace(/<br\s*\/?>/gi, '<br>');
    },

    isExpanded(event) {
      const key = event.uid || `${event.summary}-${event.start}`;
      return !!this.expandedDescriptions[key];
    },

    toggleDescription(event) {
      const key = event.uid || `${event.summary}-${event.start}`;
      this.$set(this.expandedDescriptions, key, !this.expandedDescriptions[key]);
    },
  },
  mounted() {
    this.refresh();
  },
};
</script>

<style scoped lang="scss">
.agenda-container {
  max-width: 900px;
  margin: 0 auto;
}

.date-header {
  position: sticky;
  top: 0;
  z-index: 2;
  padding: 8px 0;
}

.event-card {
  border-radius: 4px !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-left: 4px solid var(--v-primary-base);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12) !important;
  }

  &.multi-day {
    border-left-color: var(--v-cctGreen-base);
  }

  &.all-day {
    border-left-color: var(--v-cctPurple-base);
    background: linear-gradient(to right, rgba(123, 31, 162, 0.02) 0%, white 100%);
  }
}

.event-title {
  color: var(--v-cctBlue-base);
  line-height: 1.3;
  word-break: break-word;
}

.description-content {
  max-height: 4.5em;
  overflow-y: auto;
  transition: max-height 0.3s ease-in-out;
  word-break: break-word;
  
  &.expanded {
    max-height: 18em;
  }

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    
    &:hover {
      background: rgba(0, 0, 0, 0.3);
    }
  }
}

.event-description {
  padding-top: 8px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

</style>
