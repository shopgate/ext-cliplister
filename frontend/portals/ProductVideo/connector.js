import { connect } from 'react-redux';
import { getCurrentBaseProduct } from '@shopgate/pwa-common-commerce/product/selectors/product';

/**
 * Maps state to props.
 * @param {Object} state Current state.
 * @returns {Object}
 */
const mapStateToProps = state => ({
  productData: getCurrentBaseProduct(state),
});

export default connect(mapStateToProps);
