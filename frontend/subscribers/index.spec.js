import { appDidStart$ } from '@shopgate/pwa-common/streams/app';
import subscribers from './index';

const mockedGetCliplister = jest.fn();

jest.mock('../vendor/cliplister/viewer/index', () => (...args) => mockedGetCliplister(...args));
describe('Subscribers', () => {
  it('should subscribe to appDidStart$', () => {
    const subscribe = jest.fn();
    subscribers(subscribe);
    const [first] = subscribe.mock.calls;
    const [stream, func] = first;

    expect(stream).toBe(appDidStart$);
    func();
    expect(mockedGetCliplister).toHaveBeenCalled();
  });
});
