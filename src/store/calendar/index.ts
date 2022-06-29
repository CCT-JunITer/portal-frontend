import { mutations } from './mutations';
import { getters } from './getters';
import { actions } from './actions';
import { CalendarState } from './state';
import { ICalendar } from '@/interfaces';

const defaultState: CalendarState = {
  calendars: [
  //   {
  //   name: 'test',
  //   events:[],
  //   color:'red',
  //   active:false
  // }
  ],
  selectedEvent: undefined,
  towerCalendar: undefined
};
  
export const calendarModule = {
  state: defaultState,
  mutations,
  actions,
  getters,
};