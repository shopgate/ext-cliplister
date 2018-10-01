import getNavigator from './getNavigator';

describe('navigator', () => {
  it('should be an object', () => {
    expect(typeof getNavigator()).toBe('object');
  });
});
