import React from 'react';
import { mount } from 'enzyme';
import MockedReactCliplister from '../../vendor/react-cliplister/mock';

const mockedCustomerNumber = 1000;
let mockedAssetType = 'EAddN';

jest.mock('../../config', () => ({
  get assetType() {
    return mockedAssetType;
  },
  customerNumber: mockedCustomerNumber,
}));

const mockedLoggerLog = jest.fn();
const mockedLoggerWarn = jest.fn();
const mockedLoggerError = jest.fn();

jest.mock('@shopgate/pwa-extension-kit/helpers', () => ({
  TaggedLogger: class TaggedLogger {
    log = (...args) => mockedLoggerLog(...args);
    warn = (...args) => mockedLoggerWarn(...args);
    error = (...args) => mockedLoggerError(...args);
  },
}));

describe('ProductVideo', () => {
  jest.doMock('../../vendor/react-cliplister', () => MockedReactCliplister);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // eslint-disable-next-line global-require
  const ProductVideo = require('./component').default;

  /**
   * Tests optimistic scenario.
   * @param {string} assetType Asset type.
   */
  function testOptimistic(assetType) {
    mockedAssetType = assetType;
    const productData = {
      id: 'productId',
      identifiers: {
        ean: 'EAN-NUMBER',
      },
    };
    const component = mount(<ProductVideo productData={productData} />);

    expect(component.find('MockedReactCliplister').props()).toEqual({
      customerNumber: mockedCustomerNumber,
      assetKey: assetType === 'EAN' ? 'EAN-NUMBER' : 'productId',
      assetType: mockedAssetType,
    });
    expect(mockedLoggerLog).toHaveBeenCalled();
    expect(mockedLoggerWarn).not.toHaveBeenCalled();
    expect(mockedLoggerError).not.toHaveBeenCalled();
  }
  it('should render in optimistic approach (EAN)', () => {
    testOptimistic('EAN');
  });

  it('should render in optimistic approach (PRODUCT_NUMBER)', () => {
    testOptimistic('PRODUCT_NUMBER');
  });

  it('should return null when assetKey is not available', () => {
    mockedAssetType = 'EAN';
    const productData = {
      id: 'productId',
      identifiers: {},
    };

    const component = mount(<ProductVideo productData={productData} />);

    expect(component.html()).toBe(null);
    expect(mockedLoggerLog).not.toHaveBeenCalled();
    expect(mockedLoggerWarn).toHaveBeenCalled();
    expect(mockedLoggerError).not.toHaveBeenCalled();
  });
});
