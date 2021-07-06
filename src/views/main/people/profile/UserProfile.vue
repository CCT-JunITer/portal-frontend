<template>
  <v-container v-if="userProfile">
    <div class="d-flex flex-column flex-sm-row align-stretch align-sm-start">
      <div class="ma-3 text-center">
        <employee-profile-picture 
          size="112" 
          :employee="userProfile">
        </employee-profile-picture>
      </div>
      <div class="flex flex-shrink-0 mx-3 mt-3">
        <div class="text-h5">
          {{ userProfile.full_name || 'Kein Name' }}
          <v-icon v-if="hasBirthday" color="cctOrange">mdi-cake-variant</v-icon>  
        </div>
        <div class="text-subtitle-1 text--secondary mb-1">{{ userProfile.ressort || 'Kein Ressort' }} - {{ userProfile.memberstatus }}</div>

        <div class="text-body-2 text--secondary mb-1">
          <v-icon left>
            place
          </v-icon>{{ userProfile.district }}
        </div>
        <div class="text-body-2 text--secondary mb-1" v-if="userProfile.linkedin">
          <v-icon left class="mt-n2">
            mdi-linkedin
          </v-icon>
          <a class="text--secondary text-decoration-none" :href="`${userProfile.linkedin}`"  target="_blank">{{ strippedLinkedIn }}</a>
        </div>
      </div>
      <div class="d-flex flex-wrap justify-end align-content-end my-1">
        <v-btn text :href="`mailto:${userProfile.email}`" outlined class="ma-2 flex-grow-1" small>
          <v-icon left small>
            mdi-email
          </v-icon>
          Nachricht
        </v-btn>
        <v-btn text :href="`tel:${userProfile.phonenumber}`" outlined class="ma-2 flex-grow-1" small>
          <v-icon left small>
            mdi-phone
          </v-icon>
          Anrufen
        </v-btn>


        <v-dialog width="700px" transition="dialog-bottom-transition" v-model="showSignatureDialog">
          
          <template v-slot:activator="{ on, attrs }">
            <v-btn  v-bind="attrs" v-on="on" color="cctGreen" small outlined v-if="isMe" class="ma-2 flex-grow-1">
              <v-icon left small>
                mdi-fingerprint
              </v-icon>
              Signatur erstellen
            </v-btn>
          </template>
          
          <v-card>
            <v-card-title>
              Deine persönliche Signatur
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <div>
                <p style="margin-top: 15px;">
                  <a target="_blank" href="https://wiki.cct-ev.de/index.php/Signatur_erstellen">Hier</a> findest du den Wiki-Eintrag zur Einrichtung der Signatur im Email Programm.<br/>
                </p>
                <p style="background-color: #F5F5F5; padding: 10px; border-radius: 5px; font-style: italic;" id="code-to-copy">
                  <span id="signature-html-code">{{ userSignature }}</span>
                </p>
              </div>
            </v-card-text>
            <v-card-subtitle>
              Vorschau der Signatur:
            </v-card-subtitle>
            <v-card-text>
              <div>
                <div id="preview" v-html="`${userSignature}`"/>
              </div>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="cctBlue" text @click="showSignatureDialog = false">
                Fenster schließen
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>


        <v-btn to="/main/people/profile/edit" color="cctOrange" small outlined v-if="isMe" class="ma-2 flex-grow-1">
          <v-icon left small>
            mdi-pencil
          </v-icon>
          Profil bearbeiten
        </v-btn>
      </div>
    </div>
    <div>
      <v-tabs background-color="transparent" slider-color="cctOrange" color="cctGrey">
        <v-tab :ripple="false" :to="{name: 'profile-about'}">
          Über mich
        </v-tab>
        <v-tab :ripple="false" :to="{name: 'profile-skills'}" disabled>
          Skills
        </v-tab>
        <v-tab :ripple="false" :to="{name: 'profile-projects'}" disabled>
          Projekte
        </v-tab>
      </v-tabs>
      <v-divider></v-divider>
    </div>

    <div class="mt-4">
      <router-view></router-view>
    </div>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { readIsMe, readRouteUser } from '@/store/main/getters';
import { dispatchGetUsers } from '@/store/main/actions';
import EmployeeProfilePicture from '@/components/employee/EmployeeProfilePicture.vue';
import EmployeeCard from '@/components/employee/EmployeeCard.vue';


@Component({
  components: {EmployeeCard, EmployeeProfilePicture}
})
export default class UserProfile extends Vue {

  showSignatureDialog = false;

  get userSignature() {
    const name = this.userProfile?.full_name;
    const email = this.userProfile?.email;
    const ressort = this.userProfile?.ressort;
    const tel = this.userProfile?.phonenumber;

    return `<table cellpadding="0" cellspacing="0" border="0" id="backgroundTable"><tr>
    <td valign="top">
    <table border="0" cellspacing="0" cellpadding="0" align="left">
    <tr>
    <td style="border-bottom: 1px dotted; border-top: 1px solid #757070; color: #44546a; margin-top: 10px; font-family: Calibri, sans-serif; font-size: 12.5px;" valign="top" width="460">
    <p style="margin: 8px 0;"><span><strong id="name">`+ name + `</strong></span>
    <br /><span id="ressort">`+ ressort +`</span>
    </p><p style="margin: 8px 0;"><span>Mobil: <span id="mobil">`+ tel + `</span></span>
    <br /><span>E-Mail: <a id="maillink" style="color: #44546a; font-family: Calibri, sans-serif; text-decoration: underline;" href="mailto:`+ email + `">
    <span id="mail">`+ email + `</span>
    </a></span></p></td></tr><tr>
    <td style="color: #757070; border-bottom: 1px solid #757070; font-family: Calibri, sans-serif; font-size: 12.5px;" valign="top" width="460">
    <p style="margin: 8px 0;">Company Consulting Team e.V.
    <br /> Berlins studentische Unternehmensberatung<br /> c/o TU Berlin EB 512 | Stra&szlig;e des 17. Juni 145 | 10623 Berlin
    <br /><a style="font-family: Calibri, sans-serif; color: #757070; text-decoration: underline;" href="https://www.cct-ev.de/">www.cct-ev.de</a>
    | <a style="font-family: Calibri, sans-serif; color: #757070; text-decoration: underline;" href="https://www.facebook.com/CompanyConsultingTeam">facebook</a>
    | <a style="font-family: Calibri, sans-serif; color: #757070; text-decoration: underline;" href="https://www.instagram.com/cct_ev">Instagram</a>
    | <a style="font-family: Calibri, sans-serif; color: #757070; text-decoration: underline;" href="https://www.linkedin.com/company/company-consulting-team">LinkedIn</a>
    </p><p style="margin: 1em 0; font-size: 11px;">Registergericht: Amtsgericht Berlin Charlottenburg
    <br /> Registernummer: VR 14304 B<br /> Vertretungsberechtigter Vorstand gemäß § 26 BGB:
    <br />Dominik Schultze-Wolters, Marlene Warstat, Linus Pfoch, Robin Pose
    <br />Beisitzerin: Luisa Scharff
    <p style="margin: 8px 0; font-size: 11px;">Das Company Consulting Team ist Mitglied
    <br /> des Bundesverband Deutscher Studentischer Unternehmensberatungen e.V. <a style="color: #757070; font-family: Calibri, sans-serif; text-decoration: none;" href="http://www.bdsu.de">(www.bdsu.de)</a>
    <br /> und des Junior Enterprise Europe Netzwerks <a style="color: #757070; font-family: Calibri, sans-serif; text-decoration: none;" href="https://juniorenterprises.eu/">(www.juniorenterprises.eu)</a>
    </p> </td> </tr></table></td></tr></table>`
  }

  get isMe() {
    return readIsMe(this.$store)(this.$route);
  }

  get hasBirthday() {
    if (!this.userProfile) {
      return false;
    }
    return this.$common.isTodayBirthday(this.userProfile.birthdate);
  }

  get strippedLinkedIn() {
    return decodeURI(`/in/${this.userProfile?.linkedin?.replace(this.$common.linkedInRegex, '')}`);
  }

  get userProfile() {
    return readRouteUser(this.$store)(this.$route);
  }

  public goToEdit() {
    this.$router.push('/main/people/profile/edit');
  }

  public goToPassword() {
    this.$router.push('/main/people/profile/password');
  }

  public async mounted() {
    await dispatchGetUsers(this.$store);
  }

  public copySignatureToClipboard() {
    const text = document.querySelector('#signature-html-code');
    const content = String(text?.innerHTML);
    const el = document.createElement('textarea');
    el.value = content;
    document.body.appendChild(el);
    el.select();
    try {
      document.execCommand('copy');
      alert('Success')
    } catch(err) {
      alert(err);
    }
    document.body.removeChild(el);
  }
}
</script>
