<template>
  <v-container>
    <v-form
      v-model="valid"
      ref="form"
      lazy-validation
    >


      <avatar-cropper-dialog
        :input-avatar="inputAvatar"
        :value="inputAvatar"
        @avatar="onAvatarCropped"
        @close="inputAvatar = null"
      >
      </avatar-cropper-dialog>

      <v-alert
        v-if="userProfile && !userProfile.full_name"
        color="cctGreen"
        border="left"
        type="info"
        text
        class="mb-10"
      >
        <b>Herzlich Willkommen</b> im Portal! <br>
        Dein Account wurde soeben in unserem Benutzerverzeichnis angelegt.
        <b>Bitte fülle deine Daten hier aus</b>, bevor du mit dem Entdecken des Portals starten kannst.<br>
      </v-alert>

      <v-row>
        <v-col cols="12" md="4" class="px-5">
          <h4 class="text-h4 text--primary mb-3">Avatar</h4>
          <p class="text-body-2 text--secondary">Ändere dein Avatar</p>
        </v-col>

        <v-col cols="12" md="8">
          <employee-profile-picture
            :src="avatar"
            :employee="userProfile"
            size="128"
            class="mr-5 float-left">
          </employee-profile-picture>
          <div class="text-subtitle-2 mb-2">Neues Avatar hochladen</div>
          <upload-button
            outlined
            class="my-1"
            color="primary"
            accept="image/jpeg,image/png"
            @files="onFileChanged">
            <v-icon left>
              cloud_upload
            </v-icon>
            Avatar setzen
          </upload-button>
          <div class="text-caption">
            Die Datei darf nicht über 2 MB groß sein
          </div>
          <v-btn color="error" outlined icon @click="avatar = null">
            <v-icon>
              mdi-delete
            </v-icon>
          </v-btn>
        </v-col>
      </v-row>

      <v-divider class="my-5"></v-divider>

      <v-row>
        <v-col cols="12" md="4" class="px-5">
          <h4 class="text-h4 text--primary mb-3">Account</h4>
          <p class="text-body-2 text--secondary">
            Diese Informationen sind für das Accountmanagement notwendig
          </p>
        </v-col>

        <v-col cols="12" md="8">  
          <v-text-field
            label="Vorname"
            class="input-lg"
            :rules="[$common.required]"
            v-model="firstName"
            required
          ></v-text-field>
          <v-text-field
            label="Nachname"
            class="input-lg"
            :rules="[$common.required]"
            v-model="lastName"
            required
          ></v-text-field>
          <v-text-field
            disabled
            label="E-mail"
            type="email"
            v-model="email"
            class="input-lg"
            :rules="[$common.required, $common.isEmail]"
          ></v-text-field>
          <v-text-field
            label="Private E-mail"
            type="email"
            v-model="privateEmail"
            class="input-lg"
            :rules="[$common.required, $common.isEmail]"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-divider class="my-5"></v-divider>

      <v-row>
        <v-col cols="12" md="4" class="px-5">
          <h4 class="text-h4 text--primary mb-3">Profil</h4>
          <p class="text-body-2 text--secondary">Diese Informationen sind in deinem Profil sichtbar</p>
        </v-col>

        <v-col cols="12" md="8">
          <date-picker-menu
            v-model="birthdate"
            defaultPicker="YEAR"
            :pickerProps="{
              min: '1950-01-01',
              max: new Date().toISOString().substr(0, 10),
              'no-title': true
            }"
          >
            <template v-slot:activator="{ on, attrs, }">
              <v-text-field
                label="Geburtstag"
                class="input-lg"
                v-bind="attrs"
                v-on="on"
                required
                :rules="[$common.required,...attrs.rules]"
              ></v-text-field>
            </template>
          </date-picker-menu>

          <vue-tel-input-vuetify
            label="Handynummer"
            v-model="phonenumber"
            class="input-lg"
            mode="international"
            default-country="DE"
            :preferred-countries="['DE', 'AT', 'CH', 'FR']"
            required
            :rules="[
              $common.required,
              v => /^([0-9\(\)\/\+ \-]*)$/.test(v) || 'Dies ist keine gültige Telefonnummer']"
          ></vue-tel-input-vuetify>

          <date-picker-menu
            v-model="entrydate"
            defaultPicker="MONTH"
            :pickerProps="{
              min: '1950-01-01',
              max: new Date().toISOString().substr(0, 10),
            }"
          >
            <template v-slot:activator="{on, attrs}">
              <v-text-field
                label="Eintrittsdatum"
                class="input-lg"
                required
                v-bind="attrs"
                v-on="on"
                :rules="[$common.required,...attrs.rules]"
              >
                <template v-slot:append="">
                  <v-tooltip right>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon v-bind="attrs" v-on="on">mdi-help-circle</v-icon>
                    </template>
                    <span>
                      <ul>Das Eintrittsdatum ist der Tag des Onboarding Days. <br>(Bei JunITer der Tag der entgültigen Zusage.)
                      </ul>
                    </span>
                  </v-tooltip>
                </template>
              </v-text-field>
            </template>
          </date-picker-menu>
           
          <v-text-field
            label="Studiengang"
            v-model="major"
            class="input-lg"
            required
            :rules="[$common.required]"
          ></v-text-field>
          <v-select
            label="Universität"
            v-model="university"
            :items="$common.UNIVERSITIES"
            class="input-lg"
            required
            :rules="[$common.required]"
          ></v-select>
          <v-select
            label="Hochschulgrad des Studiums"
            v-model="studylevel"
            :items="$common.STUDYLEVELS"
            class="input-lg"
            required
            :rules="[$common.required]"
          ></v-select>
          <v-select
            label="Bezirk"
            v-model="district"
            class="input-lg"
            :items="$common.BEZIRKE"
            required
            :rules="[$common.required]"
          ></v-select>
          <v-text-field
            label="LinkedIn"
            v-model="linkedin"
            class="input-lg"
            required
            hint="(Format: https://www.linkedin.com/in/name)"
            :rules="[v => !v || $common.isLinkedIn(v) || 'Dies ist keine gültige LinkedIn-URL']"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-divider class="my-5"></v-divider>

      <v-row>
        <v-col cols="12" md="4" class="px-5">
          <h4 class="text-h4 text--primary mb-3">Dashboard Einstellungen</h4>
          <p class="text-body-2 text--secondary">
            Diese Einstellungen werden im PM Dashboard verwendet
          </p>
        </v-col>

        <v-col cols="12" md="8">
          <v-slider
            label="Aktuelle Auslastung (%)"
            v-model="utilizationPercent"
            class="input-lg"
            :min="0"
            :max="100"
            :step="5"
            thumb-label="always"
            hint="Deine aktuelle Arbeitsauslastung"
            persistent-hint
          ></v-slider>

          <v-slider
            label="Zielauslastung (%)"
            v-model="targetUtilizationPercent"
            class="input-lg mt-6"
            :min="0"
            :max="100"
            :step="5"
            thumb-label="always"
            hint="Deine angestrebte Arbeitsauslastung"
            persistent-hint
          ></v-slider>

          <div class="mt-6">
            <div class="text-subtitle-2 mb-2">Verfügbare Wochentage</div>
            <div class="text-caption grey--text mb-3">Wähle die Tage aus, an denen du für Projekte verfügbar bist</div>
            <v-chip-group
              v-model="availabilityWeekdays"
              column
              multiple
              active-class="primary--text"
            >
              <v-chip
                v-for="day in weekdayOptions"
                :key="day.value"
                :value="day.value"
                filter
                outlined
                label
                class="mr-2 mb-2"
              >
                {{ day.text }}
              </v-chip>
            </v-chip-group>
          </div>
          
        </v-col>
      </v-row>
      <v-divider class="my-5"></v-divider>

      <v-row>
        <v-col cols="12" md="4" class="px-5">
          <h4 class="text-h4 text--primary mb-3">Personales</h4>
          <p class="text-body-2 text--secondary">
            Diese Informationen sind für das Personalmanagement notwendig und können nur von der Ressortleitungsrunde eingesehen werden
          </p>
        </v-col>

        <v-col cols="12" md="8">
          <v-select
            v-model="contact"
            class="input-lg"
            :items="$common.CONTACT_OPTIONS"
            label="Kontaktmöglichkeit bei Alumnisierung"
            multiple
            chips
            deletable-chips
          ></v-select>
          <v-select
            v-model="gender"
            class="input-lg"
            :items="$common.GENDER"
            label="Gender"
            :rules="[$common.required]"
          ></v-select>

          <v-row dense>
            <v-col cols="12">
              <v-text-field
                label="Straße"
                class="input-lg"
                v-model="street"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="PLZ"
                class="input-lg"
                v-model="postcode"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="Stadt"
                class="input-lg"
                v-model="city"
              >
              </v-text-field>
            </v-col>
          </v-row>
          

          <v-text-field
            label="Matrikelnummer"
            class="input-lg"
            v-model="matriculationNumber"
          >
          </v-text-field>

          <v-row dense>
            <v-col cols="12">
              <v-text-field
                label="Bank"
                class="input-lg"
                v-model="bank"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="IBAN"
                class="input-lg"
                v-model="iban"
                :rules="[$common.isIBAN]"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="BIC"
                class="input-lg"
                v-model="bic"
              >
              </v-text-field>
            </v-col>

          </v-row>

          <v-select
            label="Höchste Projektposition"
            class="input-lg"
            :items="$common.PROJECT_POSITIONS"
            v-model="highestProjectPosition"
          >
          </v-select>

        </v-col>
      </v-row>

      <v-divider class="my-5"></v-divider>

      <v-row>
        <v-col cols="12" md="4" class="px-5">
          <h4 class="text-h4 text--primary mb-3">Berufserfahrung</h4>
          <p class="text-body-2 text--secondary">Füge deine bisherige Berufserfahrung hinzu</p>
        </v-col>
        <v-col cols="12" md="8">
          <v-btn color="primary" outlined class="mb-4" @click="addWorkExperience">
            <v-icon left>mdi-plus</v-icon>
            Berufserfahrung hinzufügen
          </v-btn>

          <v-card v-for="(exp, index) in workExperiences" :key="'id' in exp && exp.id ? exp.id : `new-${index}`" outlined class="mb-3">
            <v-card-text>
              <v-row dense>
                <v-col cols="12" md="6">
                  <v-text-field
                    label="Unternehmen"
                    v-model="exp.company_name"
                    :rules="[$common.required]"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    label="Position"
                    v-model="exp.position_title"
                    :rules="[$common.required]"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    label="Beschreibung (optional)"
                    v-model="exp.description"
                    rows="2"
                    auto-grow
                  ></v-textarea>
                </v-col>
                <v-col cols="12" md="6">
                  <date-picker-menu
                    v-model="exp.start_date"
                    defaultPicker="MONTH"
                    :pickerProps="{
                      min: '1950-01-01',
                      max: new Date().toISOString().substr(0, 10),
                    }"
                  >
                    <template v-slot:activator="{on, attrs}">
                      <v-text-field
                        label="Startdatum"
                        v-bind="attrs"
                        v-on="on"
                        :rules="[$common.required,...attrs.rules]"
                        required
                      ></v-text-field>
                    </template>
                  </date-picker-menu>
                </v-col>
                <v-col cols="12" md="6">
                  <date-picker-menu
                    v-model="exp.end_date"
                    defaultPicker="MONTH"
                    :pickerProps="{
                      min: '1950-01-01',
                      max: new Date().toISOString().substr(0, 10),
                    }"
                  >
                    <template v-slot:activator="{on, attrs}">
                      <v-text-field
                        label="Enddatum (leer lassen falls aktuell)"
                        v-bind="attrs"
                        v-on="on"
                        :rules="attrs.rules"
                        clearable
                      ></v-text-field>
                    </template>
                  </date-picker-menu>
                </v-col>
                <v-col cols="12">
                  <v-select
                    label="Beschäftigungsart"
                    v-model="exp.employment_type"
                    :items="employmentTypes"
                    :rules="[$common.required]"
                    required
                  ></v-select>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text color="error" @click="removeWorkExperience(index)">
                <v-icon left>mdi-delete</v-icon>
                Entfernen
              </v-btn>
            </v-card-actions>
          </v-card>

          <div v-if="!workExperiences.length" class="text-caption grey--text">
            Noch keine Berufserfahrung hinzugefügt
          </div>
        </v-col>
      </v-row>

      <v-divider class="my-5"></v-divider>

      <v-row>
        <v-col cols="12" md="4" class="px-5">
          <h4 class="text-h4 text--primary mb-3">Fähigkeiten</h4>
          <p class="text-body-2 text--secondary">Füge deine Fähigkeiten und Kenntnisse hinzu</p>
        </v-col>
        <v-col cols="12" md="8">
          <v-btn color="primary" outlined class="mb-4" @click="addSkill">
            <v-icon left>mdi-plus</v-icon>
            Fähigkeit hinzufügen
          </v-btn>

          <v-row dense>
            <v-col v-for="(skill, index) in userSkills" :key="'id' in skill && skill.id ? skill.id : `new-skill-${index}`" cols="12" sm="6">
              <v-card outlined>
                <v-card-text class="pb-0">
                  <v-text-field
                    label="Fähigkeit"
                    v-model="skill.skill_name"
                    :rules="[$common.required]"
                    dense
                    required
                  ></v-text-field>
                  <v-select
                    label="Niveau"
                    v-model="skill.skill_level"
                    :items="skillLevels"
                    :rules="[$common.required]"
                    dense
                    required
                  ></v-select>
                  <v-text-field
                    label="Kategorie (optional)"
                    v-model="skill.category"
                    dense
                    hint="z.B. Technisch, Sprachen, etc."
                  ></v-text-field>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn icon small color="error" @click="removeSkill(index)">
                    <v-icon small>mdi-delete</v-icon>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>

          <div v-if="!userSkills.length" class="text-caption grey--text">
            Noch keine Fähigkeiten hinzugefügt
          </div>
        </v-col>
      </v-row>

      <v-divider class="my-5"></v-divider>

      <v-row>
        <v-col cols="12" md="4" class="px-5">
          <h4 class="text-h4 text--primary mb-3">Gruppen</h4>
          <p class="text-body-2 text--secondary">Gruppenzuweisung</p>
        </v-col>
        <v-col cols="12" md="8">

          <v-row v-for="[type, groups] in Object.entries(sortedGroups)" :key="type">
            <p class="text-overline text--primary px-5">{{ type }}</p>

            <v-col cols="12" v-for="group in groups" :key="group.id">
              <user-group-card :group="group">
                <template v-slot:actions>
                  <v-btn text small color="primary" @click="setPrimaryGroup(group.group)" v-if="!group.is_primary">
                    <v-icon left>mdi-account-check</v-icon>
                    primäre Gruppe für {{ group.group.type }} setzen
                  </v-btn>
                </template>
              </user-group-card>
            </v-col> 
          </v-row>

        </v-col>
      </v-row>
      <v-card-actions>
        <v-alert
          v-if="showValidationError"
          type="error"
          dense
          outlined
          class="mb-0 mr-3 flex-grow-1"
        >
          Bitte überprüfen Sie Ihre Eingaben. Einige Pflichtfelder sind nicht korrekt ausgefüllt.
        </v-alert>
        <v-spacer></v-spacer>
        <v-btn @click="cancel" raised>Abbrechen</v-btn>
        <v-btn
          @click="submit"
          color="primary"
          raised
          :disabled="!valid"
        >
          Profil speichern
        </v-btn>
      </v-card-actions>

    </v-form>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Group, IUserProfileUpdate, UserGroup, WorkExperience, WorkExperienceCreate, UserSkill, UserSkillCreate, EmploymentType, SkillLevel } from '@/interfaces';
import { readUserProfile } from '@/store/main/getters';
import { 
  dispatchRouteLoggedIn, 
  dispatchSetPrimaryGroupMe, 
  dispatchUpdateUserProfile, 
  dispatchUploadFile,
  dispatchCreateWorkExperience,
  dispatchUpdateWorkExperience,
  dispatchDeleteWorkExperience,
  dispatchCreateUserSkill,
  dispatchUpdateUserSkill,
  dispatchDeleteUserSkill
} from '@/store/main/actions';
import EmployeeProfilePicture from '@/components/employee/EmployeeProfilePicture.vue';
import UploadButton from '@/components/UploadButton.vue';
import VueTelInputVuetify from 'vue-tel-input-vuetify/lib/vue-tel-input-vuetify.vue';
import AvatarCropperDialog from '@/components/AvatarCropperDialog.vue';
import DatePickerMenu from '@/components/DatePickerMenu.vue';
import UserGroupCard from '@/components/user-group/UserGroupCard.vue';
import { compareAsc } from 'date-fns';


@Component({
  components: {AvatarCropperDialog, UploadButton, EmployeeProfilePicture,VueTelInputVuetify, DatePickerMenu, UserGroupCard},
})
export default class UserProfileEdit extends Vue {
  public valid = true;
  public showValidationError = false;
  public avatar: string | Blob | null = '';
  public inputAvatar: Blob | null = null;
  public contact: string[] = [];
  public firstName = '';
  public lastName = '';
  public email = '';
  public birthdate = '';
  public phonenumber = '';
  public entrydate = '';
  public major = '';
  public university = '';
  public studylevel = '';
  public district = '';
  public linkedin = '';
  public gender = '';
  public privateEmail = '';
  public street = '';
  public postcode = '';
  public city = '';
  public highestProjectPosition = '';
  public matriculationNumber = '';
  public iban = '';
  public bic = '';
  public bank = '';

  public utilizationPercent = 0;
  public targetUtilizationPercent = 75;

  public availabilityWeekdays: string[] = [];

  // Weekday options for availability
  public weekdayOptions = [
    { text: 'Montag', value: 'monday' },
    { text: 'Dienstag', value: 'tuesday' },
    { text: 'Mittwoch', value: 'wednesday' },
    { text: 'Donnerstag', value: 'thursday' },
    { text: 'Freitag', value: 'friday' },
    { text: 'Samstag', value: 'saturday' },
    { text: 'Sonntag', value: 'sunday' },
  ];

  public workExperiences: (WorkExperience | WorkExperienceCreate)[] = [];
  public userSkills: (UserSkill | UserSkillCreate)[] = [];
  public workExperiencesToDelete: number[] = [];
  public skillsToDelete: number[] = [];

  // Employment type options
  public employmentTypes = [
    { text: 'Praktikum', value: EmploymentType.INTERNSHIP },
    { text: 'Werkstudent', value: EmploymentType.WORKING_STUDENT },
    { text: 'Vollzeit', value: EmploymentType.FULL_TIME },
    { text: 'Teilzeit', value: EmploymentType.PART_TIME },
    { text: 'Freiberuflich', value: EmploymentType.FREELANCE },
    { text: 'Ehrenamtlich', value: EmploymentType.VOLUNTEER },
  ];

  // Skill level options
  public skillLevels = [
    { text: 'Grundkenntnisse', value: SkillLevel.BEGINNER },
    { text: 'Fortgeschritten', value: SkillLevel.INTERMEDIATE },
    { text: 'Sehr gut', value: SkillLevel.ADVANCED },
    { text: 'Experte', value: SkillLevel.EXPERT },
  ];

  public async onFileChanged(files: File[]) {
    this.inputAvatar = files[0];
  }

  public onAvatarCropped(avatar) {
    this.avatar = avatar;
    this.inputAvatar = null;
  }

  public created() {
    this.reset();
  }

  get userProfile() {
    return readUserProfile(this.$store);
  }

  public reset() {
    const userProfile = readUserProfile(this.$store);
    if (userProfile) {
      this.firstName = userProfile.first_name;
      this.lastName = userProfile.last_name;
      this.privateEmail = userProfile.private_email;
      this.email = userProfile.email;
      this.birthdate = userProfile.birthdate;
      this.phonenumber = userProfile.phonenumber;
      this.entrydate = userProfile.entrydate;
      this.major = userProfile.major;
      this.university = userProfile.university;
      this.studylevel = userProfile.studylevel;
      this.district = userProfile.district;
      this.linkedin = userProfile.linkedin;
      this.gender = userProfile.gender;
      this.street = userProfile.street;
      this.city = userProfile.city;
      this.postcode = userProfile.postcode;
      this.highestProjectPosition = userProfile.highest_project_position;
      this.matriculationNumber = userProfile.matriculation_number;
      this.iban = userProfile.iban;
      this.bic = userProfile.bic;
      this.bank = userProfile.bank;
      this.contact = userProfile.contact;

      this.utilizationPercent = userProfile.utilization ? userProfile.utilization * 100 : 0;
      this.targetUtilizationPercent = userProfile.target_utilization ? userProfile.target_utilization * 100 : 75;
      this.availabilityWeekdays = userProfile.availability_weekdays ? [...userProfile.availability_weekdays] : [];

      this.workExperiences = userProfile.work_experiences ? [...userProfile.work_experiences] : [];
      this.userSkills = userProfile.user_skills ? [...userProfile.user_skills] : [];
      this.workExperiencesToDelete = [];
      this.skillsToDelete = [];
    }
  }

  public cancel() {
    this.$router.back();
  }

  public async submit() {
    this.showValidationError = false;
    if ((this.$refs.form as HTMLFormElement).validate()) {
      try {
        const updatedProfile: IUserProfileUpdate = {
          first_name: this.firstName,
          last_name: this.lastName,
          email: this.email,
          birthdate: this.birthdate,
          phonenumber: this.phonenumber,
          entrydate: this.entrydate,
          major: this.major,
          university: this.university,
          studylevel: this.studylevel,
          district: this.district,
          linkedin: this.linkedin,
          gender: this.gender,
          street: this.street,
          city: this.city,
          postcode: this.postcode,
          matriculation_number: this.matriculationNumber,
          highest_project_position: this.highestProjectPosition,
          iban: this.iban,
          bic: this.bic,
          bank: this.bank,
          private_email: this.privateEmail,
          contact: this.contact,
          utilization: this.utilizationPercent / 100,
          target_utilization: this.targetUtilizationPercent / 100,
          availability_weekdays: this.availabilityWeekdays,
          last_active_at: new Date().toISOString(),
        };

        if(this.avatar) {
          const upload = await dispatchUploadFile(this.$store, {
            file: this.avatar,
          });
          updatedProfile.profile_picture = upload?.filename;
        }
        // explicitly set profile_picture to null
        // to remove current avatar
        if (this.avatar === null) {
          updatedProfile.profile_picture = '';
        }
        await dispatchUpdateUserProfile(this.$store, updatedProfile);

        for (const exp of this.workExperiences) {
          if ('id' in exp && exp.id) {
            // Update existing
            await dispatchUpdateWorkExperience(this.$store, { id: exp.id, data: exp });
          } else {
            // Create new
            await dispatchCreateWorkExperience(this.$store, exp as WorkExperienceCreate);
          }
        }
        // Delete removed work experiences
        for (const id of this.workExperiencesToDelete) {
          await dispatchDeleteWorkExperience(this.$store, id);
        }

        for (const skill of this.userSkills) {
          if ('id' in skill && skill.id) {
            // Update existing
            await dispatchUpdateUserSkill(this.$store, { id: skill.id, data: skill });
          } else {
            // Create new
            await dispatchCreateUserSkill(this.$store, skill as UserSkillCreate);
          }
        }
        // Delete removed skills
        for (const id of this.skillsToDelete) {
          await dispatchDeleteUserSkill(this.$store, id);
        }

        await dispatchRouteLoggedIn(this.$store);
      } catch (error) {
        // Error notification is already shown by apiCallNotify
        console.error('Failed to update user profile:', error);
      }
    } else {
      this.showValidationError = true;
    }
  }

  get sortedGroups(): { [key: string]: UserGroup[] } {
    return this.userProfile?.groups
      .sort((a,b) => compareAsc(new Date(a.date_from), new Date(b.date_from)))
      .reduce((prev, curr) => {
        if(!prev[curr.group.type]){
          prev[curr.group.type] = []
        }
        prev[curr.group.type].push(curr)
        return prev;
      }, {}) as {[key: string]: UserGroup[]}
  }

  async setPrimaryGroup(group: Group) {
    await dispatchSetPrimaryGroupMe(this.$store, group.id);
  }

  public addWorkExperience() {
    this.workExperiences.push({
      company_name: '',
      position_title: '',
      description: null,
      start_date: '',
      end_date: null,
      employment_type: EmploymentType.FULL_TIME,
    });
  }

  public removeWorkExperience(index: number) {
    const exp = this.workExperiences[index];
    // If it has an ID, mark for deletion
    if ('id' in exp && exp.id) {
      this.workExperiencesToDelete.push(exp.id);
    }
    // Remove from list
    this.workExperiences.splice(index, 1);
  }

  public addSkill() {
    this.userSkills.push({
      skill_name: '',
      skill_level: SkillLevel.INTERMEDIATE,
      category: null,
    });
  }

  public removeSkill(index: number) {
    const skill = this.userSkills[index];
    // If it has an ID, mark for deletion
    if ('id' in skill && skill.id) {
      this.skillsToDelete.push(skill.id);
    }
    // Remove from list
    this.userSkills.splice(index, 1);
  }
}


</script>

<style lang="sass">
@import '~vuetify/src/styles/styles.sass'

@media #{map-get($display-breakpoints, 'md-and-up')}
  .input-lg
    max-width: 340px!important


</style>
