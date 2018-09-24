function inject() {
  const script = document.createElement('script');
  script.src = "https://mycliplister.com/merge?cliplister=1.4&clviewer=1.6&videostage=1.3&innercontrols=1.3&clickablevideo=1.1&playbutton=1.1&previewimage=1.2";
  document.body.appendChild(script);
}

function tryCliplister(resolve) {
  if (window.Cliplister) {
    resolve(window.Cliplister);
    return;
  }
  setTimeout(() => {
    tryCliplister(resolve);
  }, 100);
}

function cliplisterPromise() {
  inject();
  return new Promise((resolve) => {
    tryCliplister(resolve);
  });
}

let promise;

function getCliplister() {
  if (!promise) {
    promise = cliplisterPromise();
  }
  return promise;
}

export default getCliplister;
