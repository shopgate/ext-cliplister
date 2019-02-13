import getCliplister from './index';

const mockedCliplister = {};
let promise;

describe('Cliplister Viewer - dependency injection', () => {
  const mockedCreateElement = jest.fn();
  beforeAll(() => {
    Object.defineProperty(window, 'document', {
      value: {
        body: {
          appendChild: jest.fn(),
        },
        createElement: (...args) => {
          mockedCreateElement(...args);

          return {};
        },
        addEventListener: () => {},
      },
    });
  });

  it('should inject script', (done) => {
    // Setting up a flag that tells us that promise was not fulfilled (as expected).
    let promiseDone = false;
    // Call the function to start everything. Keep the promise ref for later test.
    promise = getCliplister();

    promise.then((value) => {
      promiseDone = true;
      // The returned value should be a reference of what we defined in previous tick.
      expect(value).toBe(mockedCliplister);

      done();
    });

    // There should be immediate script injection.
    expect(mockedCreateElement).toHaveBeenCalled();
    expect(document.body.appendChild).toHaveBeenCalled();

    // Force the next tick, to make it actually fail if the promise was resolved too soon.
    setTimeout(() => {
      // Promise should not be resolved at this point (no Cliplister global).
      expect(promiseDone).toBe(false);
      // Defining the Cliplister global (goto: promise.then).
      Object.defineProperty(window, 'Cliplister', {
        value: mockedCliplister,
      });
    }, 0);
  });

  it('should return same promise as before', () => {
    const secondPromise = getCliplister();

    expect(promise === secondPromise).toBe(true);
  });
});
