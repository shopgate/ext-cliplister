import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TaggedLogger } from '@shopgate/pwa-extension-kit/helpers';
import ReactCliplister from '../../vendor/react-cliplister';
import styles from './style';
import getConfig from '../../helpers/getConfig';

const logger = new TaggedLogger('ShopgateCliplister');

/**
 * Product video component.
 */
class ProductVideo extends Component {
  /**
   * Prop types.
   * @returns {Object}
   */
  static propTypes = {
    productData: PropTypes.shape({
      id: PropTypes.string.isRequired,
      identifiers: PropTypes.shape({
        ean: PropTypes.string,
      }),
    }),
  }

  /**
   * Default props
   * @returns {Object}
   */
  static defaultProps = {
    productData: {
      id: null,
      identifiers: {},
    },
  }

  /**
   * @inheritDoc
   */
  constructor(props) {
    super(props);

    const { customerNumber, assetType } = getConfig();
    // Keeping this here for testing purposes.
    this.customerNumber = customerNumber;
    this.assetType = assetType;
  }

  /**
   * Gets an asset key depending on configured asset type (EAN or product id)
   * @returns {string|number}
   */
  getAssetKey() {
    if (!this.props.productData) {
      return null;
    }
    if (this.assetType === ReactCliplister.assetTypes.PRODUCT_NUMBER) {
      return this.props.productData.id || null;
    }

    return this.props.productData.identifiers.ean || null;
  }

  /**
   * Renders component.
   * @returns {JSX}
   */
  render() {
    if (!this.getAssetKey()) {
      logger.warn('No asset key provided.', this.assetType);
      return null;
    }
    const assetKey = this.getAssetKey();
    logger.log('Trying to init with params', {
      customerNumber: this.customerNumber,
      assetType: this.assetType,
      assetKey,
    });

    return (
      <div className={styles.wrapper}>
        <ReactCliplister
          customerNumber={this.customerNumber}
          assetKey={assetKey}
          assetType={this.assetType}
        />
      </div>
    );
  }
}

export default ProductVideo;
