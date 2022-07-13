import { IDocumentType } from '@/interfaces';
import { getDayOfYear, getTime, isDate, isEqual, isSameDay, parseISO, startOfDay } from 'date-fns';
import { format, utcToZonedTime, formatInTimeZone } from 'date-fns-tz';
import de from 'date-fns/locale/de';
import { debounce } from './utils';

export { debounce }
export { format, formatInTimeZone, parseISO, de, utcToZonedTime };

export const RESSORTS = [
  'Kein Ressort', 'Juniter', 'Public Affairs', 'Human Resources', 'Quality Management', 'International Networks', 'Board', 'Vorstand', 'Projektmanager'
]

export const FINANCE_REQUEST_STATUS = [
  'created', 'request_rejected', 'request_accepted', 'file_uploaded', 'file_rejected', 'file_accepted'
]

export const STUDYLEVELS = [
  'Bachelor', 'Master', 'Promotion', 'Staatsexamen'
]

export const MEMBERSTATUS = [
  'Trainee', 'Junior Consultant', 'Consultant', 'Senior Consultant'
]

export const BEZIRKE = [
  'Charlottenburg', 'Wilmersdorf', 'Friedrichshain', 'Kreuzberg', 'Lichtenberg', 'Marzahn-Hellersdorf', 'Moabit', 'Mitte', 'Wedding', 'Neukölln', 'Pankow', 'Prenzlauer-Berg', 'Reinickendorf', 'Spandau', 'Steglitz-Zehlendorf', 'Tempelhof', 'Schöneberg', 'Treptow', 'Köpenick', 'Brandenburg', 'Potsdam', 'Sonstige'

]

export const UNIVERSITIES = [
  'Technische Universität Berlin', 'Freie Universität Berlin', 'Humboldt-Universität zu Berlin', 'Beuth Hochschule für Technik Berlin', 'Charité', 'Hochschule für Wirtschaft und Recht Berlin', 'Sonstiges'
];

export const SCHULUNGSMAPPING = [
  { type: 'Pflichtschulung', topics: ['BDSU-Schulung', 'Corporate Design', 'Finanzen & Recht', 'Internes Schulung', 'Präsentationstechniken', 'Projektschulung', 'Qualitätsmanagement'] },
  { type: 'Zusatzschulung', topics: ['Human Resources', 'Information Technology', 'Marketing & Strategy', 'Quality & Operations', 'Softskills', 'EDV-Fertigkeiten', 'Diversity', 'Sustainability'] },
  { type: 'Organisatorische Schulung', topics: ['MP-Schulungen', 'Sonstige', 'AC-Schulung'] },
];

export const MEETINGMAPPING = [
  { type: 'Donnerstagssitzung' },
  { type: 'Mitgliederversammlung'}
];

export const KOSTENART = [
  { name: 'Topf Mitgliederförderung', associations: [] },
  { name: 'Topf Mitgliedergewinnung', associations: [] },
  { name: 'Topf Außendarstellung', associations: [] },
  { name: 'Workend', associations: [] },
  { name: 'Schulung (Pflicht)', associations: [] },
  { name: 'Schulung (Zusatz)', associations: [] },
  { name: 'Workingsession', associations: ['Board', 'RL Runde', 'PM', 'Woman @CCT', 'Diversity @CCT', 'Sustainability @CCT', 'IT', 'HR', 'QM', 'PA', 'IN'] },
  { name: 'OOE', associations: ['IT', 'HR', 'QM', 'PA', 'IN'] },
  { name: 'Verpflegung ISO audit QM', associations: [] },
  { name: 'Verpflegung BDSU audit QM', associations: [] },
  { name: 'Andere', associations: [] },
];

export const GENDER = [
  'männlich', 'weiblich', 'nicht binär', 'keine Angabe'
]

export const PROJECT_POSITIONS = [
  'Angebot',
  'Projektmitarbeiter',
  'Projektleiter',
  'Projektcontroller',
];

export const PASSIVE_CAUSES = [
  'Auslandssemester',
  'Praktikum',
  'Sonstiges',
]

export const CONTACT_OPTIONS = [
  'Alumni Newsletter / Hinweise zu CCT Events',
  'Einladungen zu Events',
  'Get Togethers',
  'Persönliche Kontaktaufnahme',
  'Alumni Networking 4.0 Gruppe LinkedIn',
  'Facebook Gruppe'
]

const LINKED_IN_REGEX = /^(https:\/\/)?([a-z]{2,3}\.)?linkedin\.com\/in\//;

export const linkedInRegex = LINKED_IN_REGEX;

export const isLinkedIn = (url: string) => {
  return LINKED_IN_REGEX.test(url);
}

export const required = (v: string) => !!v || 'Dieses Feld wird benötigt.';

export const isNumber = (v: string) => (v && !!v.match(/^[0-9]+$/)) || 'Dies ist keine Zahl.';

export const isEmail = (v: string) => (v && !!v.match(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)) || 'Dies ist keine E-Mail.';

export const isCurrency = (v: string) => (v && !!v.match(/^\d+$|^\d+,\d{2}$/) || 'Dies ist kein gültiger Geldbetrag.')

export const isIBAN = (v: string) => (!v || !!v.match(/[A-Z]{2}[0-9]{2}(?:[ ]?[0-9]{4}){4}(?!(?:[ ]?[0-9]){3})(?:[ ]?[0-9]{1,2})?/)) || 'Dies ist keine IBAN.';

export const isTodayBirthday = (date: Date | string) => {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  const now = new Date();
  return getDayOfYear(date) === getDayOfYear(now);
}

export const formatRange = (date_from: string, date_to: string): string => {
  const from = new Date(date_from);
  const to = new Date(date_to);
  if (isSameDay(from, to)) {
    return format(from, 'dd.MM.yyyy HH:mm \'bis\' ') + format(to, 'HH:mm')
  }
  return format(from, 'dd.MM.yyyy HH:mm \'bis\' ') + format(to, 'dd.MM.yyyy HH:mm')
}


export const DOCUMENT_TYPES: { name: string; value: IDocumentType }[] = [
  {
    name: 'Mitgliedswerdegang',
    value: 'member-progression',
  },
  {
    name: 'Recruiting',
    value: 'recruiting',
  },
  {
    name: 'Archiv',
    value: 'archive',
  },
  {
    name: 'Öffentlichkeitsarbeit',
    value: 'public-affairs',
  },
  {
    name: 'Quality Management',
    value: 'quality-management',
  },
  {
    name: 'Projektarbeit',
    value: 'project-work',
  }
]