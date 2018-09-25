/**
 * Injects Cliplister script into the body.
 */
function inject() {
  const script = document.createElement('script');
  script.src = 'https://mycliplister.com/merge?cliplister=1.4&clviewer=1.6&videostage=1.3&innercontrols=1.3&clickablevideo=1.1&playbutton=1.1&previewimage=1.2';
  document.body.appendChild(script);
}

/**
 * Tries to get Cliplister from window object. If not yet available, tries again.
 *
 * @param {function} resolve Promise.resolve function.
 */
function tryCliplister(resolve) {
  if (window.Cliplister) {
    resolve(window.Cliplister);
    return;
  }
  setTimeout(() => {
    tryCliplister(resolve);
  }, 100);
}

/**
 * Injects the Cliplister script and returns promise of giving the Cliplister object.
 *
 * @returns {Promise<Object>}
 */
function cliplisterPromise() {
  inject();
  return new Promise((resolve) => {
    tryCliplister(resolve);
  });
}

/**
 * @type {Promise}
 */
let promise;

/**
 * Get's the Cliplister object.
 *
 * @returns {Promise}
 */
function getCliplister() {
  if (!promise) {
    promise = cliplisterPromise();
  }
  return promise;
}

export default getCliplister;
