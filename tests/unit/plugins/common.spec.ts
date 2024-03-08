
import * as common from '@/common'

describe('common-plugin.ts', () => {
  it('should be april fools', () => {
    expect(common.isAprilFools(new Date('2021-04-01'))).toBeTruthy();
    expect(common.isAprilFools(new Date('2021-04-02'))).toBeFalsy(); 
    expect(common.isAprilFools(new Date('2021-03-30'))).toBeFalsy(); 
  });
})