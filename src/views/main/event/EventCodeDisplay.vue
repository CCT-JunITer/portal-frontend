<template>

  <v-dialog v-model="openQr" v-if="isRunning() && canGenerateOTP" max-width="576px">
    <template v-slot:activator="{ on, attrs }">
      <div class="event-code-display" v-bind="attrs" v-on="on" style="width: 225px;">
        <qrcode-vue :value="link" :size="200" level="H" @click="openQr = true"/>
        <v-progress-linear :value="percentLeft()" :key="link"></v-progress-linear>
        <span class="text-overline text-center">
          {{ timeLeftFormatted() }}
        </span>
        <span class="text-h5 leighter">
          {{ otp }}
        </span>
      </div>
    </template>
    <v-card>
      <v-card-title>
      </v-card-title>
      <v-card-text>
        <div class="event-code-display" style="width: 525px;">
          <qrcode-vue :value="link" :size="500" level="H" @click="openQr"/>
          <v-progress-linear :value="percentLeft()" :key="link"></v-progress-linear>
          <span class="text-overline text-center">
            {{ timeLeftFormatted() }}
          </span>
          <span class="text-h2">
            {{ otp }}
          </span>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          text
          @click="openQr = false"
        >
          Schließen
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <div class="event-code-display" style="width: 225px;" v-else-if="isInFuture()">
    <span class="text-overline text-center">
      {{ timeToEventStartFormatted() }}
    </span>
    <p class="text-subtitle-2">bis zum Event</p>
    <span class="text-overline text-center">
      {{ timeToEventCheckinFormatted() }}
    </span>
    <p class="text-subtitle-2">bis zum Checkin</p>
  </div>
  <div class="event-code-display" style="width: 225px;" v-else-if="isRunning() && !canGenerateOTP">
    <span class="text-overline text-center">
      Scanne jetzt den QR-Code ein
    </span>
    <div class="ma-auto" style="max-width: 300px; position: relative;">

      <v-otp-input
        v-if="!inputOtpValid"
        label="Code"
        color="red"
        v-model="inputOtp"
        filled
        @finish="doCheckin"
      >
      </v-otp-input>
      <event-checkmark-animation v-if="inputOtpValid">
      </event-checkmark-animation>
      <v-alert v-else-if="inputOtpValid === false" color="red" text dense type="error">
        Anmeldung nicht erfolgreich
      </v-alert>
      <v-overlay absolute :value="inputOtpLoading">
        <v-progress-circular
          indeterminate
          color="primary"
        ></v-progress-circular>
      </v-overlay>
    </div>

  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'

import QrcodeVue from 'qrcode.vue'
import { api } from '@/api';
import { IEvent } from '@/interfaces';
import { formatDistanceStrict } from 'date-fns';
import { isBefore, isWithinInterval } from 'date-fns';
import { readHasAnyPermission, readUserProfile } from '@/store/main/getters';
import EventCheckmarkAnimation from './EventCheckmarkAnimation.vue';


@Component({
  components: {QrcodeVue, EventCheckmarkAnimation}
})
export default class EventCodeDisplay extends Vue {

  @Prop()
  public event!: IEvent;

  @Watch('event', { immediate:true })
  public async onEventChange(newEvent?: IEvent, oldEvent?: IEvent) {
    if (newEvent !== oldEvent) {
      await this.getTOTP();
      this.startTimer();
    }
  }

  public otp: string | null = null;
  public inputOtp: string | null = null;
  public inputOtpValid: boolean | null = null;
  public inputOtpLoading = false;
  public end_date: Date | null = null;
  public timeout: number | null = null;
  public openQr = false;

  async doCheckin() {
    if (!this.inputOtp) {
      return;
    }
    try {
      this.inputOtpLoading = true;
      const response = await api.updateParticipants(this.$store.state.main.token, this.event.id, +this.inputOtp);
      this.inputOtpValid = response.data;
    } catch(e) {
      this.inputOtpValid = false;
    }
    this.inputOtpLoading = false;
    this.inputOtp = '';
  }

  get link() {
    return `${window.location.origin}/main/events/check-in/${this.event.id}?otp=${this.otp}`
  }

  get canGenerateOTP() {
    const userId = readUserProfile(this.$store)?.id;
    return readHasAnyPermission(this.$store)(['portal.event.check-in']) 
      && ( 
        userId === this.event.author.id
        || this.event.leaders.find(u => u.id === userId) 
      )
  }

  startTimer() {
    let running = this.isRunning();
    const setTimer = () => window.setInterval(() => {
      this.$forceUpdate();
      if(this.isRunning() !== running) {
        running = this.isRunning();
        this.getTOTP();
      }
    }, 100);
    this.timeout && clearInterval(this.timeout);
    if (this.isRunning() || this.isInFuture()) {
      this.timeout = setTimer();
    }
  }


  destroyed() {
    this.timeout && clearInterval(this.timeout);
  }

  isRunning() {
    if (!this.event || !this.event.date_checkin_from) {
      return false;
    }
    return isWithinInterval(new Date(), {
      start: new Date(this.event.date_checkin_from),
      end: new Date(this.event.date_checkin_to)
    })
  }
  isInFuture() {
    return isBefore(new Date(), new Date(this.event.date_checkin_from))
  }

  percentLeft() {
    if (!this.end_date) {
      return null;
    }
    return (this.end_date.getTime() - new Date().getTime()) / 30000 * 100;
  }


  timeToEventCheckinFormatted() {
    if (!this.event.date_from) {
      return null;
    }
    return formatDistanceStrict(new Date(), new Date(this.event.date_checkin_from), { locale: this.$common.de })
  }

  timeToEventStartFormatted() {
    if (!this.event.date_from) {
      return null;
    }
    return formatDistanceStrict(new Date(), new Date(this.event.date_from), { locale: this.$common.de })
  }

  timeLeftFormatted() {
    if (!this.end_date) {
      return null;
    }
    return formatDistanceStrict(new Date(), this.end_date, { locale: this.$common.de })
  }

  public async getTOTP() {
    if (!this.isRunning() || !this.canGenerateOTP) {
      return;
    }
    const response = await api.getTOTP(this.$store.state.main.token, +this.$route.params.id);
    const { totp, time_remaining } = response.data;
    this.otp = totp;
    this.end_date = new Date(new Date().getTime() + +time_remaining * 1000 + 1000)
    console.log(this.end_date)
    console.log(totp, time_remaining);
    // get new code after time_remaining seconds
    const event = this.event;
    setTimeout(() => {
      if (this.event === event) {
        this.getTOTP();
      }
    }, time_remaining * 1000);
  }
}
</script>

<style lang="scss">
.event-code-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px dashed rgb(54, 54, 54);
  padding: 8px;
  border-radius: 12px;
}
</style>