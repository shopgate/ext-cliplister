import isiOSPlatform from './isiOSPlatform';

let mockedNavigator = {
  vendor: 'Something else',
};

jest.mock('./getNavigator', () => () => mockedNavigator);

describe('isiOSPlatform', () => {
  it('should return false for Android', () => {
    mockedNavigator = {
      vendor: 'Something else.',
    };
    expect(isiOSPlatform()).toBe(false);
  });

  it('should return true for ios', () => {
    mockedNavigator = {
      vendor: 'Apple Computer, Inc.',
    };
    expect(isiOSPlatform()).toBe(true);
  });
});
