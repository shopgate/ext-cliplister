import ReactCliplister from './index';

/**
 * Mocked React Cliplister.
 * For unit testing purposes only.
 */
class MockedReactCliplister extends ReactCliplister {
  /**
   * @inheritDoc
   */
  constructor(props) {
    super(props);
    this.namespace = 'MockedCliplister';
  }

  /**
   * Override of default componentDidMount.
   */
  componentDidMount() {
    // Do nothing.
  }

  /**
   * Override of default componentWillUnmount.
   */
  componentWillUnmount() {
    // Do nothing.
  }
}

export default MockedReactCliplister;
