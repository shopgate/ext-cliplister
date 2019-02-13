import { connect } from 'react-redux';
import { getBaseProduct } from '@shopgate/pwa-common-commerce/product/selectors/product';

/**
 * Maps state to props.
 * @param {Object} state Current state.
 * @param {Object} props Props.
 * @returns {Object}
 */
const mapStateToProps = (state, props) => ({
  productData: getBaseProduct(state, props),
});

export default connect(mapStateToProps);
