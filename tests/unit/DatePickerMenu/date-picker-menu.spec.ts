import DatePickerMenu from '@/components/DatePickerMenu.vue';
import { bootstrap } from '../../utils';
import TestDatePicker from './TestDatePicker.vue';

describe('DatePickerMenu.vue', () => {
  const { customMount } = bootstrap();

  it('should match snapshot', async () => {

    const wrapper = customMount(TestDatePicker, {
      propsData: { pickerProps: {} },
    })

    expect(wrapper).toMatchSnapshot()
  })


  it('should display localized date from ISO string', async () => {

    const wrapper = customMount(TestDatePicker, {
      propsData: { pickerProps: {} },
    })


    await wrapper.setData({ date: '2014-04-22' });

    const datePicker = wrapper.findComponent(DatePickerMenu);
    expect((datePicker.vm as any).dateFormatted).toBe('22.04.2014');

  })


  it('should set model value to null when invalid date is inserted', () => {

    const wrapper = customMount(TestDatePicker, {
      propsData: { pickerProps: {} },
    })

    const datePicker = wrapper.findComponent(DatePickerMenu);
    (datePicker.vm as any).onInputChange('123asd');

    expect(wrapper.vm.$data.date).toBe(null);
  });


  it('should return correct ISO date when passing localized date', () => {

    const wrapper = customMount(TestDatePicker, {
      propsData: { pickerProps: {} },
    })

    const datePicker = wrapper.findComponent(DatePickerMenu);

    (datePicker.vm as any).onInputChange('09.09.2019');
    expect(wrapper.vm.$data.date).toBe('2019-09-09');
  });

})