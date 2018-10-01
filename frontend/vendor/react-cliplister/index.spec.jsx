import React from 'react';
import { mount } from 'enzyme';
import ReactCliplister from './index';

const mockedViewerDestruct = jest.fn();
const mockedViewerStop = jest.fn();
const mockedViewerOnPlay = jest.fn();
const mockedViewerOnStop = jest.fn();
const mockedViewerOnPause = jest.fn();
const mockedViewerMute = jest.fn();
const mockedViewerUnmute = jest.fn();
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

let mockedIsiOS = true;
jest.mock('../../helpers/isiOSPlatform', () => () => mockedIsiOS);

describe('ReactCliplister', () => {
  describe('Optimistic workflow', () => {
    beforeAll(() => {
      jest.clearAllMocks();
      mockedViewerResolver = resolve => resolve({
        Viewer: (...args) => {
          mockedViewerConstruct(...args);

          return {
            destroy: () => mockedViewerDestruct(),
            stop: () => mockedViewerStop(),
            mute: () => mockedViewerMute(),
            unmute: () => mockedViewerUnmute(),
            // eslint-disable-next-line no-shadow
            onPause: (...args) => mockedViewerOnPause(...args),
            // eslint-disable-next-line no-shadow
            onStop: (...args) => mockedViewerOnStop(...args),
            // eslint-disable-next-line no-shadow
            onPlay: (...args) => mockedViewerOnPlay(...args),
          };
        },
      });
    });

    beforeEach(() => {
      mockedLoggerError.mockClear();
      mockedViewerMute.mockClear();
      mockedViewerUnmute.mockClear();
    });

    // Order matters in this test!
    let component;
    it('should render the component', () => {
      component = mount((
        <ReactCliplister
          customerNumber={100}
          assetKey="ASSET_KEY"
          assetType={ReactCliplister.assetTypes.EAN}
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

    it('should manipulate the video on play/pause/stop and log error since there is no DOM', () => {
      const instance = component.instance();
      instance.handlePlay();
      expect(mockedViewerUnmute).toHaveBeenCalled();
      instance.handleStop();
      expect(mockedViewerMute).toHaveBeenCalled();

      expect(mockedLoggerError).toHaveBeenCalledTimes(2);
    });

    it('should NOT manipulate video when platform is not iOS', () => {
      const instance = component.instance();
      mockedIsiOS = false;
      instance.handlePlay();
      expect(mockedViewerUnmute).not.toHaveBeenCalled();
      instance.handleStop();
      expect(mockedViewerMute).not.toHaveBeenCalled();

      expect(mockedLoggerError).not.toHaveBeenCalled();
    });

    it('should handle Viewer lifecycle', () => {
      expect(mockedViewerConstruct).toHaveBeenCalledWith(expect.objectContaining({
        customer: 100,
        assetKeys: [
          'ASSET_KEY',
        ],
        keyType: 0,
      }));

      // Binds to <video> callbacks.
      expect(mockedViewerOnPlay).toHaveBeenCalledWith(component.instance().handlePlay);
      expect(mockedViewerOnStop).toHaveBeenCalledWith(component.instance().handleStop);
      expect(mockedViewerOnPause).toHaveBeenCalledWith(component.instance().handleStop);

      // Unmount the component.
      component.unmount();

      // Clean up called.
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
