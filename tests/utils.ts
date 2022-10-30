import { IUserProfile } from '@/interfaces';
import VueRouter from 'vue-router';
import { createLocalVue, mount, ThisTypedMountOptions } from '@vue/test-utils'
import { VueClass } from 'vue-class-component/lib/declarations'
import Vuetify from 'vuetify'
import store from '@/store';

export const getTestUser = <T extends Partial<IUserProfile>>(options?: T): Partial<IUserProfile> & T => ({
  birthdate: '01-01-1999',
  district: 'Mitte',
  email: 'test@cct-ev.de',
  entrydate: '01-01-1999',
  full_name: 'Test',
  id: 1,
  is_active: true,
  is_alumni: false,
  is_superuser: false,
  linkedin: '',
  major: 'Bachelor',
  memberstatus: 'Consultant',
  phonenumber: '+49 1231234123',
  ressort: 'Juniter',
  studylevel: 'Bachelor',
  university: 'Technische Universität Berlin',
  ...(options || {} as T)
});


export const bootstrap = () => {
  const localVue = createLocalVue()
  const router = new VueRouter();
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  const customMount = (component: VueClass<Vue>, options: ThisTypedMountOptions<Vue>) => {
    return mount(component, {
      localVue,
      vuetify,
      store,
      router,
      ...options,
    })
  }

  return {
    customMount
  }
}