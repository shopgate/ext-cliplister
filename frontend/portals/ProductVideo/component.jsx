import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { logger } from '@shopgate/pwa-core/helpers';
import ReactCliplister from '../../vendor/react-cliplister';
import styles from './style';
import getConfig from '../../helpers/getConfig';

const { customerNumber, assetType, slot } = getConfig();

/**
 * Product video component.
 */
class ProductVideo extends Component {
  /**
   * Prop types.
   * @returns {Object}
   */
  static get propTypes() {
    return {
      productData: PropTypes.shape({
        id: PropTypes.string.isRequired,
        identifiers: PropTypes.shape({
          ean: PropTypes.string,
        }),
      }),
    };
  }

  /**
   * Default props
   * @returns {Object}
   */
  static get defaultProps() {
    return {
      productData: {
        id: null,
        identifiers: {},
      },
    };
  }

  /**
   * Gets an asset key depenending on configured asset type (EAN or product id)
   * @returns {string|number}
   */
  getAssetKey() {
    if (assetType === ReactCliplister.assetTypes.PRODUCT_NUMBER) {
      return this.props.productData.id;
    }

    return this.props.productData.identifiers.ean;
  }

  /**
   * Renders component.
   * @returns {JSX}
   */
  render() {
    if (!this.getAssetKey()) {
      logger.warn('Shopgate cliplister: no asset key provided.', assetType);
      return null;
    }
    return (
      <div className={styles.wrapper}>
        <ReactCliplister
          customerNumber={customerNumber}
          assetKey={this.getAssetKey()}
          assetType={assetType}
          slot={slot}
        />
      </div>
    );
  }
}

export default ProductVideo;
