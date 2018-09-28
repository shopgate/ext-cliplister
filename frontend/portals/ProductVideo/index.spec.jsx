jest.mock('@shopgate/pwa-common-commerce/product/selectors/product', () => ({
  getCurrentBaseProduct: () => 'MOCKED_RETURN',
}));

const mockedConnect = jest.fn();
const mockedConnected = jest.fn();
jest.mock('react-redux', () => ({
  connect: (...args) => {
    mockedConnect(...args);
    return mockedConnected;
  },
}));

describe('Connected ProductVideo', () => {
  it('should export connected component', () => {
    // eslint-disable-next-line global-require
    require('./index');
    expect(mockedConnect).toHaveBeenCalled();
    expect(mockedConnected).toHaveBeenCalled();

    expect(typeof mockedConnect.mock.calls[0][0]).toBe('function');
    expect(mockedConnect.mock.calls[0][0]()).toEqual({
      productData: 'MOCKED_RETURN',
    });
    expect(typeof mockedConnected.mock.calls[0][0]).toBe('function');
    expect(mockedConnected.mock.calls[0][0].name).toBe('ProductVideo');
  });
});
