<template>
  <v-container class="UserSettings">
    <v-row>
      <v-col cols="12" md="4" class="px-5">
        <h4 class="text-h4">Einstellungen</h4>
      </v-col>
      <v-col cols="12" md="8" class="d-flex">
        <v-spacer></v-spacer>
        <v-btn color="cctBlue lighten-2" small outlined class="ma-2 flex-grow-1" @click="downloadDebitMandate">
          <v-icon left small>
            mdi-file-document-edit-outline
          </v-icon>
          Lastschriftmandat generieren
        </v-btn>
      </v-col>
    </v-row>

    <v-divider class="my-5"></v-divider>
  
    <v-row>
      <v-col cols="12" md="4" class="px-5">
        <h5 class="text-h5 text--primary mb-3">Deine persönliche Signatur</h5>
        <p class="text-body-2 text--secondary">Erstelle deine persönliche Signatur</p>
      </v-col>

      <v-col cols="12" md="8">
        <v-alert border="left" dark type="warning" dense text>
          Das Einfügen einer persönlichen Signatur am Ende einer gesendeten E-Mail ist bei der Kommunikation mit externen Parteien Pflicht. Bestehende Signaturen müssen zu jedem Vorstandswechsel entsprechend aktualisiert werden.
        </v-alert>
        <v-alert border="left" type="info" dense text>
          <a target="_blank" href="https://wiki.cct-ev.de/index.php/Signatur_erstellen">Hier</a> findest du den Wiki-Eintrag zur Einrichtung der Signatur im Email Programm.
        </v-alert>
        <v-btn class="ma-2" color="cctOrange" dark @click="codeSignatureOpen = !codeSignatureOpen" outlined small>
          <v-icon left>
            mdi-filter-variant
          </v-icon>
          Code anzeigen
        </v-btn>
        <v-btn class="ma-2" color="cctBlue" dark @click="copySignatureToClipboard" outlined small>
          <v-icon left small>
            mdi-content-copy
          </v-icon>
          In Zwischenablage kopieren
        </v-btn>
        <v-btn class="ma-2" color="cctGreen" dark @click="resetFields" outlined small>
          <v-icon left small>
            mdi-account
          </v-icon>
          Felder aus Profil übernehmen
        </v-btn>
        <v-form lazy-validation @submit="() => {}" class="pa-2">
          <v-text-field
            label="Name"
            v-model="name"
            filled
            required
            class="input-lg"
            :rules="[$common.required]"
          >
          </v-text-field>
          <v-text-field
            label="Email"
            v-model="email"
            filled
            required
            class="input-lg"
            :rules="[$common.required]"
          >
          </v-text-field>
          <v-text-field
            label="Telefon"
            v-model="tel"
            filled
            required
            class="input-lg"
            :rules="[$common.required]"
          >
          </v-text-field>
          <v-text-field
            label="Titelbezeichnung"
            v-model="ressort"
            filled
            required
            class="input-lg"
            :rules="[$common.required]"
          >
          </v-text-field>
        </v-form>
        <v-expand-transition>
          <div v-show="codeSignatureOpen">
            <p style="background-color: #F5F5F5; padding: 10px; border-radius: 5px; font-style: italic;" id="code-to-copy">
              {{ this.userSignature }}
            </p>
          </div>
        </v-expand-transition>
        <div>
          <v-sheet outlined rounded class="pa-5" id="preview" v-html="`${userSignature}`"/>
        </div>
      </v-col>
    </v-row>
      
    <v-divider class="my-5"></v-divider>

    <v-row>
      <v-col cols="12" md="4" class="px-5">
        <h5 class="text-h5 text--primary mb-3">Speicherplatz</h5>
        <p class="text-body-2 text--secondary"></p>
      </v-col>

      <v-col cols="12" md="8" v-if="userSettings">
        <div style="max-width: 200px;">
          <p class="text-subtitle-2"><v-icon left small>email</v-icon> Email-Speichernutzung</p>
          <v-progress-linear :value="spaceUsed" class="mb-2" rounded height="7px"></v-progress-linear>
          <p class="text-caption"><b>{{ (userSettings.used_mailaccount_space / 1024).toFixed(2).replace(".", ",") }} MB </b> belegt</p>
        </div>
      </v-col>
    </v-row>

    <v-divider class="my-5"></v-divider>

    <v-form
      v-model="valid"
      ref="form"
      lazy-validation
    >
      <v-row>
        <v-col cols="12" md="4" class="px-5">
          <h5 class="text-h5 text--primary mb-3">Email&shy;kopie</h5>
          <p class="text-body-2 text--secondary">Bei Erhalt einer E-Mail wird diese an gegebene E-Mail Adressen weitergeleitet.</p>
        </v-col>

        <v-col cols="12" md="8" v-if="userSettings">
          <v-combobox
            ref="combobox"
            v-model="copyAdress"
            chips
            clearable
            deletable-chips
            multiple
            color="cctGreen"
            outlined
          >
          </v-combobox>
        </v-col>
      </v-row>
      <v-divider class="my-5"></v-divider>
      <v-row>
        <v-col cols="12" md="4" class="px-5">
          <h5 class="text-h5 text--primary mb-3">Automatische Abwesenheits&shy;notiz</h5>
          <p class="text-body-2 text--secondary">Bei Erhalt einer E-Mail kann eine automatische Abwesenheitsemail an den Sender konfiguriert werden.</p>
        </v-col>

        <v-col cols="12" md="8" v-if="userSettings">
          <v-switch
            v-model="userSettings.is_responder"
            label="automatische Abwesenheitsnotiz aktiviert"
            color="cctGreen"
            :rules=[]
          >
          </v-switch>

          <div v-if="userSettings.is_responder">

            <date-picker-menu
              v-model="userSettings.responder_from"
              :pickerProps="{
                min: new Date().toISOString().substr(0, 10),
                'no-title': true
              }"
            >
              <template v-slot:activator="{ on, attrs, }">
                <v-text-field
                  label="Abwesenheitsemail von"
                  class="input-lg"
                  :disabled="!userSettings.is_responder"
                  v-bind="attrs"
                  v-on="on"
                  required
                  :rules="[$common.required]"
                ></v-text-field>
              </template>
            </date-picker-menu>

            <date-picker-menu
              v-model="userSettings.responder_to"
              :pickerProps="{
                min: userSettings.responder_from,
                'no-title': true
              }"
            >
              <template v-slot:activator="{ on, attrs, }">
                <v-text-field
                  label="Abwesenheitsemail bis"
                  class="input-lg"
                  :disabled="!userSettings.is_responder"
                  v-bind="attrs"
                  v-on="on"
                  required
                  :rules="[$common.required]"
                ></v-text-field>
              </template>
            </date-picker-menu>

            <v-textarea
              v-model="userSettings.responder_html"
              label="Antwortnachricht"
              hint="Du kannst auch HTML verwenden"
              :rules="[$common.required]"
            >
            </v-textarea>

            <v-sheet rounded outlined class="pa-5" id="preview" v-if="userSettings.responder_html" v-html="`${userSettings.responder_html}`"/>
          </div>
        </v-col>
        <v-col cols="12" md="8" v-else class="centered">
          <v-progress-circular indeterminate></v-progress-circular>
        </v-col>
      </v-row>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="$router.back()" raised>Abbrechen</v-btn>
        <v-btn
          @click="submit"
          color="primary"
          raised
          :valid="valid"
        >
          Profil speichern
        </v-btn>
      </v-card-actions>

    </v-form>
  </v-container>
</template>

<script lang="ts">
import DatePickerMenu from '@/components/DatePickerMenu.vue';
import { dispatchCopyTextToClipboard, dispatchDownloadDebitMandate, dispatchGetUserSettingsMe, dispatchRemoveNotification, dispatchUpdateUserSettingsMe } from '@/store/main/actions';
import { readUserProfile, readUserSettings } from '@/store/main/getters';
import { Vue, Component } from 'vue-property-decorator'


@Component({
  components: { DatePickerMenu }
})
export default class UserProfileSettings extends Vue {

  public valid = false;
  public codeSignatureOpen = false;

  public name = '';
  public email = '';
  public ressort = '';
  public tel = '';

  public async submit() {
    if ((this.$refs.form as HTMLFormElement).validate()) {
      await dispatchUpdateUserSettingsMe(this.$store, this.userSettings!);
    }
  }

  get spaceUsed() {
    return this.userSettings!.used_mailaccount_space / (1024 * 1024) * 100;
  }

  get copyAdress() {
    return this.userSettings!.copy_adress;
  }

  set copyAdress(emails: string[]) {
    if (!this.userSettings) {
      return;
    }
    this.userSettings.copy_adress = emails.filter(this.$common.isEmail);
  }

  public resetFields() {
    if (!this.userProfile) {
      return;
    }
    this.name = this.userProfile.full_name || '';
    this.email = this.userProfile.email || '';
    this.ressort = this.userProfile.ressort || '';
    this.tel = this.userProfile.phonenumber || '';
  }

  get userSignature() {

    return `<table cellpadding="0" cellspacing="0" border="0" id="backgroundTable"><tr>
    <td valign="top">
    <table border="0" cellspacing="0" cellpadding="0" align="left">
    <tr>
    <td style="border-bottom: 1px dotted; border-top: 1px solid #757070; color: #44546a; margin-top: 10px; font-family: Calibri, sans-serif; font-size: 12.5px;" valign="top" width="460">
    <p style="margin: 8px 0;"><span><strong id="name">`+ this.name + `</strong></span>
    <br /><span id="ressort">`+ this.ressort +`</span>
    </p><p style="margin: 8px 0;"><span>Mobil: <span id="mobil">`+ this.tel + `</span></span>
    <br /><span>E-Mail: <a id="maillink" style="color: #44546a; font-family: Calibri, sans-serif; text-decoration: underline;" href="mailto:`+ this.email + `">
    <span id="mail">`+ this.email + `</span>
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

  async mounted() {
    this.resetFields();
    await dispatchGetUserSettingsMe(this.$store);
  }

  get userProfile() {
    return readUserProfile(this.$store);
  }

  get userSettings() {
    return readUserSettings(this.$store);
  }


  public async copySignatureToClipboard() {
    await dispatchCopyTextToClipboard(this.$store, this.userSignature);
  }

  public async downloadDebitMandate() {
    const fileBlob = await dispatchDownloadDebitMandate(this.$store);
    const fileUrl = URL.createObjectURL(fileBlob);

    // rename to original name
    const link = document.createElement('a');
    document.body.appendChild(link);
    link.href = fileUrl;
    link.setAttribute('type', 'hidden');
    link.setAttribute('download', `Lastschriftmandat_${this.userProfile?.full_name.replaceAll(' ', '_')}.pdf`);
    link.click();

    URL.revokeObjectURL(fileUrl);
  }

}
</script>

<style lang="scss">

</style>