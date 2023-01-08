import { bootstrap, getTestUser} from '@tests/utils';
import DetailView from '@/components/crud/DetailView.vue'

describe('DetailView.vue', () => {
  const { customMount } = bootstrap();

  it('should mount', () => {
    
    const wrapper = customMount(DetailView, {
      propsData: {},
    })

    console.log(wrapper.element)

  })
})