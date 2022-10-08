import { bootstrap, getTestUser} from '@tests/utils';
import EmployeeCard from '@/components/employee/EmployeeCard.vue'

describe('EmployeeCard.vue', () => {
  const { customMount } = bootstrap();

  it('should match snapshot', () => {
    
    const wrapper = customMount(EmployeeCard, {
      propsData: { 
        employee: getTestUser()
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})