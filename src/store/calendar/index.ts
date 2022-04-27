import { mutations } from './mutations';
import { getters } from './getters';
import { actions } from './actions';
import { CalendarState } from './state';

const defaultState: CalendarState = {
  calendars: [
  //   {
  //   name: 'test',
  //   events:[],
  //   color:'red',
  //   active:false
  // }
  ],
  selectedEvent: undefined
};
  
export const calendarModule = {
  state: defaultState,
  mutations,
  actions,
  getters,
};