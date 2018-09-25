import { appDidStart$ } from '@shopgate/pwa-common/streams/app';
import getCliplister from '../vendor/cliplister/viewer/index';

/**
 * Subscribers
 * @param {function} subscribe Subscribe function.
 */
function subscribers(subscribe) {
  subscribe(appDidStart$, () => {
    // Creating a Cliplister promise on app start so it is ready when PDP is opened
    // It's done here to make the first render a little bit faster.
    getCliplister();
  });
}

export default subscribers;
