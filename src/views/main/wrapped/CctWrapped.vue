<template>
  <v-container fluid class="pa-6 wrapped-page" v-if="isVorstand">
    <div class="wrapped-hero" :style="heroStyle">
      <div class="hero-content">
        <div class="eyebrow">CCT Wrapped</div>
        <h1 class="text-h3 font-weight-bold mb-2">{{ year }} Highlights</h1>
        <div class="text-subtitle-1 mb-4">Das Beste aus unseren Projekten, Mitgliedern und Events.</div>
        <div class="d-flex align-center wrap-actions">
          <v-btn dark outlined class="mr-3 refresh-btn" @click="reload" :loading="loading">
            <v-icon left small>mdi-refresh</v-icon>
            Aktualisieren
          </v-btn>
          <div class="year-chip">{{ year }}</div>
        </div>
      </div>
    </div>

    <div class="carousel-wrapper mt-8">
      <v-carousel
        v-if="metricSlides.length"
        v-model="activeSlide"
        height="360"
        hide-delimiter-background
        show-arrows-on-hover
        cycle
        :interval="5200"
        class="carousel-full"
      >
        <v-carousel-item v-for="(slide, idx) in metricSlides" :key="slide.key">
          <div class="carousel-card" :style="getSlideStyle(idx)">
            <div class="carousel-inner">
              <div class="badge">CCT Wrapped {{ year }}</div>
              <div class="category">{{ slide.title }}</div>
              <div class="value" :class="valueAnimation(idx)" :style="valueAnimStyle">{{ slide.value }}</div>
              <div class="subtitle">{{ slide.subtitle }}</div>
            </div>
          </div>
        </v-carousel-item>
      </v-carousel>
      <div v-else class="text-center pa-6 text--secondary">Keine Daten</div>
    </div>

    <div v-if="showGrid && gridCards.length" class="grid-wrapper mt-10">
      <div class="grid-title">Alle Highlights im Überblick</div>
      <v-row dense>
        <v-col cols="12" sm="6" md="4" v-for="card in gridCards" :key="card.key">
          <div class="grid-card">
            <div class="grid-label">{{ card.title }}</div>
            <div class="grid-value">{{ card.value }}</div>
            <div class="grid-sub">{{ card.subtitle }}</div>
          </div>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { readIsVorstand, readToken } from '@/store/main/getters';
import { api } from '@/api';
import { IWrappedResponse } from '@/interfaces';

@Component
export default class CctWrapped extends Vue {
  data: IWrappedResponse | null = null;
  loading = false;
  year: number = new Date().getFullYear();
  activeSlide = 0;
  showGrid = false;
  previousSlide = 0;

  // CCT Blue (#214788) and CCT Purple (#713FBF) based gradients
  gradients = [
    'linear-gradient(135deg, #214788 0%, #713FBF 100%)',
    'linear-gradient(135deg, #1a3a6e 0%, #5c32a0 100%)',
    'linear-gradient(135deg, #2d5298 0%, #8a52d6 100%)',
    'linear-gradient(135deg, #713FBF 0%, #214788 100%)',
    'linear-gradient(135deg, #1e4070 0%, #6b3db5 100%)',
  ];

  get metricSlides() {
    if (!this.data) return [];
    const slides = [
      {
        key: 'members',
        title: 'Neue Mitglieder',
        value: this.formatNumber(this.data.new_members),
        subtitle: 'Menschen, die gestartet sind',
      },
      {
        key: 'projects',
        title: 'Abgeschlossene Projekte',
        value: this.formatNumber(this.completedExtStaffTotal),
        subtitle: `Extern ${this.formatNumber(this.completedExternal)} · Staffing ${this.formatNumber(this.completedStaffing)}`,
      },
      {
        key: 'revenue',
        title: 'Projektumsatz',
        value: this.formatCurrency(this.data.revenue_projects || 0),
        subtitle: 'Extern + Staffing · inkl. Zuschläge',
      },
      {
        key: 'consultant_days',
        title: 'Beratertage',
        value: `${this.formatNumber(Math.round(this.data.consultant_days || 0))} BT`,
        subtitle: 'Abgeschlossene Projekte',
      },
    ];

    if (this.data.top_dosi_attendee) {
      slides.push({
        key: 'top_dosi',
        title: 'Meiste DoSi-Teilnahmen',
        value: this.formatNumber(this.data.top_dosi_attendee.value),
        subtitle: this.data.top_dosi_attendee.full_name || 'Unbekannt',
      });
    }

    if (this.data.longest_dosi_streak) {
      slides.push({
        key: 'dosi_streak',
        title: 'Längste DoSi-Streak',
        value: `${this.formatNumber(this.data.longest_dosi_streak.value)}x`,
        subtitle: this.data.longest_dosi_streak.full_name || 'Unbekannt',
      });
    }

    if (this.data.most_projects) {
      slides.push({
        key: 'most_projects',
        title: 'Meiste Projekte',
        value: this.formatNumber(this.data.most_projects.value),
        subtitle: this.data.most_projects.full_name || 'Unbekannt',
      });
    }

    if (this.data.most_finance_requests) {
      slides.push({
        key: 'most_finance',
        title: 'Meiste Finanzanträge',
        value: this.formatNumber(this.data.most_finance_requests.value),
        subtitle: this.data.most_finance_requests.full_name || 'Unbekannt',
      });
    }

    return slides;
  }

  get heroStyle() {
    return {
      background: 'linear-gradient(135deg, #214788 0%, #713FBF 100%)',
    };
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);
  }

  formatNumber(value: number): string {
    return new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 }).format(value ?? 0);
  }

  private notifyError(message: string) {
    (this as any).$notify?.({ type: 'error', text: message });
  }

  async mounted() {
    if (!this.isVorstand) {
      this.notifyError('Kein Zugriff. Diese Seite ist nur für den Vorstand sichtbar.');
      this.$router.replace({ path: '/main/homepage' });
      return;
    }
    await this.reload();
  }

  async reload() {
    if (!this.isVorstand) return;
    this.loading = true;
    const token = readToken(this.$store);
    try {
      const response = await api.getWrapped(token, this.year);
      this.data = response.data;
    } catch (err) {
      console.error('Failed to load wrapped', err);
      this.notifyError('Wrapped konnte nicht geladen werden.');
    } finally {
      this.loading = false;
    }
  }

  get completedExternal() {
    return this.data?.completed_projects.external ?? 0;
  }

  get completedStaffing() {
    return this.data?.completed_projects.staffing ?? 0;
  }

  get completedExtStaffTotal() {
    return this.completedExternal + this.completedStaffing;
  }

  getSlideStyle(idx: number) {
    return { background: this.gradients[idx % this.gradients.length] };
  }

  valueAnimation(idx: number) {
    const classes = [
      'anim-rise-blur',
      'anim-scale-pop',
      'anim-flip-y',
      'anim-slide-rotate',
      'anim-bounce-soft',
      'anim-tilt-in',
    ];
    return classes[idx % classes.length];
  }

  get gridCards() {
    return this.metricSlides.map((s) => ({
      key: s.key,
      title: s.title,
      value: s.value,
      subtitle: s.subtitle,
    }));
  }

  get valueAnimStyle() {
    return {
      animationDelay: '0.35s',
      animationFillMode: 'both',
    } as Record<string, string>;
  }

  get isVorstand() {
    return readIsVorstand(this.$store);
  }

  @Watch('activeSlide')
  onSlideChange() {
    const lastIndex = (this.metricSlides.length || 1) - 1;
    if (this.previousSlide === lastIndex && this.activeSlide === 0 && this.metricSlides.length > 0) {
      this.showGrid = true;
    }
    this.previousSlide = this.activeSlide;
  }

  @Watch('data')
  onDataChange() {
    this.activeSlide = 0;
    this.previousSlide = 0;
    this.showGrid = false;
  }
}
</script>

<style scoped lang="scss">
.wrapped-page {
  background: linear-gradient(180deg, #f1f5f9 0%, #e2e8f0 100%);
  min-height: 100vh;
  padding-bottom: 48px;
}

.wrapped-hero {
  position: relative;
  overflow: hidden;
  border-radius: 4px;
  padding: 40px 48px;
  min-height: 180px;
  box-shadow: 0 2px 16px rgba(33, 71, 136, 0.12);
}

.hero-content {
  position: relative;
  z-index: 1;
}

.hero-content .eyebrow {
  text-transform: uppercase;
  letter-spacing: 2px;
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 8px;
}

.hero-content h1 {
  color: #ffffff;
}

.hero-content .text-subtitle-1 {
  color: rgba(255, 255, 255, 0.9);
}

.wrap-actions {
  flex-wrap: wrap;
  gap: 12px;
}

.year-chip {
  background: rgba(255, 255, 255, 0.95);
  color: #214788;
  padding: 8px 16px;
  border-radius: 2px;
  font-weight: 700;
  font-size: 0.85rem;
  letter-spacing: 0.5px;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.refresh-btn {
  border-color: rgba(255, 255, 255, 0.7) !important;
  color: #ffffff !important;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  font-size: 0.75rem;

  &:hover {
    background: rgba(255, 255, 255, 0.1) !important;
  }
}

.carousel-wrapper {
  width: 100%;
}

.carousel-full {
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 16px rgba(33, 71, 136, 0.12);
}

.carousel-card {
  height: 100%;
  border-radius: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 56px 32px;
}

.carousel-inner {
  text-align: center;
  max-width: 600px;
  width: 100%;
}

.badge {
  display: inline-block;
  padding: 6px 14px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.85);
  font-weight: 600;
  letter-spacing: 1.5px;
  margin-bottom: 20px;
  text-transform: uppercase;
  font-size: 0.65rem;
}

.category {
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 2px;
  color: rgba(255, 255, 255, 0.75);
  text-transform: uppercase;
  margin-bottom: 12px;
}

.value {
  font-size: 4.5rem;
  font-weight: 300;
  color: #ffffff;
  margin: 20px 0;
  line-height: 1;
  letter-spacing: -2px;
  animation-fill-mode: both;
  animation-duration: 1s;
}

.subtitle {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 400;
  letter-spacing: 0.5px;
}

/* Animations */
.anim-rise-blur {
  animation: rise-blur 1s ease-out;
}

.anim-scale-pop {
  animation: scale-pop 1s ease-out;
}

.anim-flip-y {
  animation: flip-y 1s ease-out;
}

.anim-slide-rotate {
  animation: slide-rotate 1s ease-out;
}

.anim-bounce-soft {
  animation: bounce-soft 1.2s ease-out;
}

.anim-tilt-in {
  animation: tilt-in 1s ease-out;
}

@keyframes rise-blur {
  0% { opacity: 0; filter: blur(8px); transform: translateY(40px); }
  100% { opacity: 1; filter: blur(0); transform: translateY(0); }
}

@keyframes scale-pop {
  0% { opacity: 0; transform: scale(0.7); }
  70% { transform: scale(1.05); }
  100% { opacity: 1; transform: scale(1); }
}

@keyframes flip-y {
  0% { opacity: 0; transform: rotateY(90deg); }
  100% { opacity: 1; transform: rotateY(0deg); }
}

@keyframes slide-rotate {
  0% { opacity: 0; transform: translateY(40px) rotate(-5deg); }
  100% { opacity: 1; transform: translateY(0) rotate(0deg); }
}

@keyframes bounce-soft {
  0% { opacity: 0; transform: translateY(40px); }
  60% { transform: translateY(-8px); }
  100% { opacity: 1; transform: translateY(0); }
}

@keyframes tilt-in {
  0% { opacity: 0; transform: translateY(30px) rotate(-3deg); }
  100% { opacity: 1; transform: translateY(0) rotate(0deg); }
}

/* Grid */
.grid-wrapper {
  max-width: 1200px;
  margin: 0 auto;
}

.grid-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: #475569;
  margin-bottom: 20px;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.grid-card {
  background: #ffffff;
  border-radius: 2px;
  padding: 28px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  border: 1px solid #e2e8f0;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
  transition: box-shadow 0.2s ease, border-color 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(33, 71, 136, 0.1);
    border-color: #cbd5e1;
  }
}

.grid-label {
  font-size: 0.7rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  font-weight: 500;
  margin-bottom: 4px;
}

.grid-value {
  font-size: 2rem;
  font-weight: 300;
  color: #1e293b;
  line-height: 1.1;
  letter-spacing: -0.5px;
}

.grid-sub {
  font-size: 0.8rem;
  color: #94a3b8;
  margin-top: 2px;
}
</style>
