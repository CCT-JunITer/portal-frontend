import { getDayOfYear, getMonth } from 'date-fns';

export const RESSORTS = [
  'Kein Ressort', 'Juniter','Public Affairs','Human Resources', 'Quality Management', 'International Networks','Board','Vorstand','Projektmanager'
]

export const STUDYLEVELS = [
  'Bachelor', 'Master', 'Promotion', 'Staatsexamen'
]

export const MEMBERSTATUS = [
  'Trainee', 'Junior Consultant', 'Consultant', 'Senior Consultant'
]

export const BEZIRKE = [
  'Charlottenburg','Wilmersdorf', 'Friedrichshain','Kreuzberg', 'Lichtenberg', 'Marzahn-Hellersdorf','Moabit', 'Mitte','Wedding', 'Neukölln', 'Pankow','Prenzlauer-Berg', 'Reinickendorf', 'Spandau', 'Steglitz-Zehlendorf','Tempelhof','Schöneberg', 'Treptow','Köpenick','Brandenburg','Potsdam','Sonstige'

]

export const UNIVERSITIES = [
  'Technische Universität Berlin', 'Freie Universität Berlin', 'Humboldt-Universität zu Berlin', 'Beuth Hochschule für Technik Berlin', 'Charité', 'Hochschule für Wirtschaft und Recht Berlin', 'Sonstiges'
];

const LINKED_IN_REGEX = /^(https:\/\/)?([a-z]{2,3}\.)?linkedin\.com\/in\//;

export const linkedInRegex = LINKED_IN_REGEX;

export const isLinkedIn = (url: string) => {
  return LINKED_IN_REGEX.test(url);
}

export const required = (v) => !!v || 'Dieses Feld wird benötigt.';

export const isTodayBirthday = (date: Date | string) => {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  const now = new Date();
  return getMonth(date) === getMonth(now) && getDayOfYear(date) === getDayOfYear(now);
}