import React from 'react';
import { mount } from 'enzyme';
import ReactCliplister from './index';

const mockedViewerDestruct = jest.fn();
const mockedViewerConstruct = jest.fn();
/**
 * Mocked viewer promise resolver.
 */
let mockedViewerResolver = () => {};

jest.mock('../cliplister/viewer', () => () => new Promise((resolve, reject) => {
  mockedViewerResolver(resolve, reject);
}));

const mockedLoggerError = jest.fn();
jest.mock('@shopgate/pwa-core/helpers', () => ({
  logger: {
    error: (...args) => mockedLoggerError(...args),
  },
}));

describe('ReactCliplister', () => {
  describe('Optimistic workflow', () => {
    beforeAll(() => {
      jest.clearAllMocks();
      mockedViewerResolver = resolve => resolve({
        Viewer: (...args) => {
          mockedViewerConstruct(...args);

          return {
            destroy: () => mockedViewerDestruct(),
          };
        },
      });
    });

    // Order matters in this test!
    let component;
    it('should render the component', () => {
      component = mount((
        <ReactCliplister
          customerNumber={100}
          assetKey="ASSET_KEY"
          assetType={ReactCliplister.assetTypes.EAN}
          slot={1}
        />
      ));
      const namespaceArr = component.find('div').props().id.split('-');
      expect(namespaceArr.length).toBe(3);
      expect(mockedLoggerError).not.toHaveBeenCalled();
    });

    it('should always return false for shouldComponentUpdate', () => {
      expect(component.instance().shouldComponentUpdate({ customerNumer: 101 })).toBe(false);
      expect(mockedLoggerError).not.toHaveBeenCalled();
    });

    it('should handle Viewer lifecycle', () => {
      expect(mockedViewerConstruct).toHaveBeenCalledWith(expect.objectContaining({
        customer: 100,
        assetKeys: [
          'ASSET_KEY',
        ],
        keyType: 0,
        slot: 1,
      }));
      component.unmount();
      expect(mockedViewerDestruct).toHaveBeenCalled();
      expect(mockedLoggerError).not.toHaveBeenCalled();
    });
  });

  describe('Failed viewer scenario', () => {
    beforeAll(() => {
      jest.clearAllMocks();
      mockedViewerResolver = (resolve, reject) => {
        reject(new Error('Could not init.'));
      };
    });

    it('should render component and fail gracefully', (done) => {
      const component = mount((<ReactCliplister
        customerNumber={100}
        assetKey="ASSET_KEY"
        assetType={ReactCliplister.assetTypes.PRODUCT_NUMBER}
      />));
      setTimeout(() => {
        expect(mockedLoggerError).toHaveBeenCalled();
        // No viewer, would throw if .destroy is called.
        component.unmount();
        done();
      }, 0);
    });
  });
});
