<template>
  <v-container fluid class="pa-6 wrapped-page" v-if="isVorstand">
    <div class="wrapped-hero" :style="heroStyle">
      <div class="hero-content">
        <div class="eyebrow">CCT Wrapped</div>
        <h1 class="text-h3 font-weight-bold mb-2">{{ year }} Highlights</h1>
        <div class="text-subtitle-1 mb-4">Das Beste aus unseren Projekten, Mitgliedern und Events – visuell und animiert.</div>
        <div class="d-flex align-center wrap-actions">
          <v-btn color="cctGreen" class="mr-3" @click="reload" :loading="loading" large>
            <v-icon left>mdi-refresh</v-icon>
            Aktualisieren
          </v-btn>
          <div class="year-chip">Jahr {{ year }}</div>
        </div>
      </div>
      <div class="hero-visual">
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="orb orb-3"></div>
      </div>
    </div>

    <div class="carousel-wrapper mt-8">
      <v-card class="elevation-0 pa-4 carousel-shell">
        <v-carousel
          v-if="metricSlides.length"
          v-model="activeSlide"
          height="380"
          hide-delimiter-background
          show-arrows-on-hover
          cycle
          :interval="5200"
        >
          <v-carousel-item v-for="(slide, idx) in metricSlides" :key="slide.key">
            <div class="carousel-card" :style="getSlideStyle(idx)">
              <div class="carousel-inner">
                <div class="badge">CCT Wrapped {{ year }}</div>
                <div class="category">{{ slide.title }}</div>
                <transition name="fade-up">
                  <div class="value" :class="valueAnimation(idx)" :style="valueAnimStyle">{{ slide.value }}</div>
                </transition>
                <div class="subtitle">{{ slide.subtitle }}</div>
              </div>
            </div>
          </v-carousel-item>
        </v-carousel>
        <div v-else class="text-center pa-6 text--secondary">Keine Daten</div>
      </v-card>
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
  gradients = [
    'linear-gradient(135deg, #ff7eb6 0%, #ffb347 100%)',
    'linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)',
    'linear-gradient(135deg, #22c55e 0%, #a855f7 100%)',
    'linear-gradient(135deg, #f97316 0%, #0ea5e9 100%)',
    'linear-gradient(135deg, #ec4899 0%, #facc15 100%)',
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
        subtitle: 'Alle Rollen außer Ausschuss',
      },
      {
        key: 'workshops',
        title: 'Workshops',
        value: this.formatNumber(this.data.workshops_count || 0),
        subtitle: 'Trainings & Workshops im Jahr',
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
      background: 'linear-gradient(135deg, #e8f0ff 0%, #d7f2e9 60%, #ffe9d6 100%)',
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
    const slides = this.metricSlides;
    return slides.map((s) => ({
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
  background: #f6f8fb;
  color: #0f172a;
  min-height: 100vh;
}

.wrapped-hero {
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  padding: 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 240px;
  box-shadow: 0 12px 40px rgba(0,0,0,0.25);
}

.hero-content .eyebrow {
  text-transform: uppercase;
  letter-spacing: 1.5px;
  font-size: 0.8rem;
  opacity: 0.85;
}

.wrap-actions {
  flex-wrap: wrap;
}

.hero-visual {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 45%;
  pointer-events: none;
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(0px);
  mix-blend-mode: screen;
  opacity: 0.75;
  animation: float 10s ease-in-out infinite;
}

.orb-1 {
  width: 260px;
  height: 260px;
  background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9), rgba(77,153,255,0.25));
  top: -40px;
  right: -60px;
}

.orb-2 {
  width: 200px;
  height: 200px;
  background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.85), rgba(72,187,120,0.28));
  top: 80px;
  right: 80px;
  animation-delay: 2s;
}

.orb-3 {
  width: 140px;
  height: 140px;
  background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.85), rgba(255,196,140,0.35));
  bottom: -20px;
  right: 20px;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); opacity: 0.7; }
  50% { transform: translateY(-10px); opacity: 0.9; }
}

.year-chip {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  color: #0f172a;
  padding: 10px 14px;
  border-radius: 10px;
  font-weight: 600;
  box-shadow: 0 6px 16px rgba(15, 23, 42, 0.08);
}

.carousel-shell {
  background: transparent;
}

.carousel-wrapper {
  max-width: 1100px;
  margin: 0 auto;
}

.carousel-card {
  min-height: 320px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0b1021;
  padding: 32px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 45px rgba(0,0,0,0.15);
}

.carousel-inner {
  text-align: center;
  color: #0b1021;
  max-width: 640px;
  width: 100%;
}

.badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(255,255,255,0.82);
  color: #0b1021;
  font-weight: 700;
  letter-spacing: 0.6px;
  margin-bottom: 12px;
  text-transform: uppercase;
  font-size: 0.8rem;
}

.category {
  font-size: 1.6rem;
  font-weight: 800;
  letter-spacing: 0.2px;
  color: #0b1021;
}

.value {
  font-size: 3.4rem;
  font-weight: 900;
  margin: 10px 0;
  animation-fill-mode: both;
  animation-duration: 1.3s;
}

.subtitle {
  font-size: 1.05rem;
  color: #0b1021;
  opacity: 0.9;
}

.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 1.2s cubic-bezier(0.2, 0.9, 0.15, 1);
}

.fade-up-enter {
  opacity: 0;
  transform: translateY(34px);
}

.anim-rise-blur {
  animation: rise-blur 1.35s cubic-bezier(0.22, 1, 0.36, 1);
}

.anim-scale-pop {
  animation: scale-pop 1.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.anim-flip-y {
  animation: flip-y 1.4s cubic-bezier(0.25, 0.85, 0.4, 1.2);
}

.anim-slide-rotate {
  animation: slide-rotate 1.3s cubic-bezier(0.25, 1, 0.3, 1);
}

.anim-bounce-soft {
  animation: bounce-soft 1.45s cubic-bezier(0.2, 1, 0.22, 1);
}

.anim-tilt-in {
  animation: tilt-in 1.2s cubic-bezier(0.2, 0.9, 0.2, 1.1);
}

@keyframes rise-blur {
  0% { opacity: 0; filter: blur(8px); transform: translateY(50px); }
  40% { opacity: 1; filter: blur(2px); }
  100% { opacity: 1; filter: blur(0); transform: translateY(0); }
}

@keyframes scale-pop {
  0% { opacity: 0; transform: scale(0.6); }
  60% { opacity: 1; transform: scale(1.05); }
  100% { transform: scale(1); }
}

@keyframes flip-y {
  0% { opacity: 0; transform: rotateY(80deg) scale(0.8); }
  50% { opacity: 1; }
  100% { transform: rotateY(0deg) scale(1); }
}

@keyframes slide-rotate {
  0% { opacity: 0; transform: translateY(60px) rotate(-6deg); }
  70% { opacity: 1; }
  100% { transform: translateY(0) rotate(0deg); }
}

@keyframes bounce-soft {
  0% { opacity: 0; transform: translateY(50px) scale(0.9); }
  60% { opacity: 1; transform: translateY(-10px) scale(1.02); }
  85% { transform: translateY(6px) scale(0.99); }
  100% { transform: translateY(0) scale(1); }
}

@keyframes tilt-in {
  0% { opacity: 0; transform: translateY(40px) rotate(-4deg) scale(0.9); }
  70% { opacity: 1; }
  100% { transform: translateY(0) rotate(0deg) scale(1); }
}

.grid-wrapper {
  max-width: 1200px;
  margin: 0 auto;
}

.grid-title {
  font-size: 1.4rem;
  font-weight: 800;
  margin-bottom: 12px;
}

.grid-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 12px 32px rgba(0,0,0,0.08);
  border: 1px solid #e5e7eb;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.grid-label {
  font-size: 0.95rem;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.6px;
}

.grid-value {
  font-size: 2rem;
  font-weight: 900;
  color: #0f172a;
}

.grid-sub {
  font-size: 0.95rem;
  color: #64748b;
}
</style>
