import HelloWorldView from '../views/HelloWorldView.vue';
import { bootstrap } from '@tests/utils';

describe('HelloWorldView.vue', () => {
  const { customMount } = bootstrap();

  it('should match snapshot', () => {
    
    const wrapper = customMount(HelloWorldView, {})

    expect(wrapper.find('h1').text()).toBe('Hello World')
  })
})