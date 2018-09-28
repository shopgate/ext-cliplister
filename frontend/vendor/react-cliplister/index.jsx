import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { logger } from '@shopgate/pwa-core/helpers';
import getCliplister from '../cliplister/viewer';

const typeEAN = 'EAN'; // Cliplister id = 0 => Also, default identifier
const typeProductNumber = 'PRODUCT_NUMBER'; // Cliplister id = 10000 => Custom identifier.

/**
 * Cliplister viewer react wrapper.
 */
class ReactCliplister extends Component {
  /**
   * Converts assetType to Cliplister asset id.
   * @param {string} type Human readable asset type.
   * @returns {number}
   */
  static typeToId(type) {
    return type === typeEAN ? 0 : 10000;
  }

  /**
   * Prop types
   * @returns {Object}
   */
  static propTypes = {
    assetKey: PropTypes.string.isRequired,
    assetType: PropTypes.oneOf([
      typeEAN,
      typeProductNumber,
    ]).isRequired,
    customerNumber: PropTypes.number.isRequired,
    slot: PropTypes.number,
  };

  /**
   * Possible asset types.
   * @returns {Object}
   */
  static assetTypes = {
    EAN: typeEAN,
    PRODUCT_NUMBER: typeProductNumber,
  };

  /**
   * Default props.
   * @returns {Object}
   */
  static defaultProps = {
    slot: 0,
  };

  /**
   * @inheritDoc
   */
  constructor(props) {
    super(props);
    this.viewer = undefined;
    this.namespace = `Cliplister-${Date.now()}-${Math.random()}`;
  }

  /**
   * Prepares the viewer which injects the cliplister DOM into the namespaced container.
   */
  componentDidMount() {
    getCliplister()
      .then((Cliplister) => {
        this.viewer = Cliplister.Viewer({
          parentId: this.namespace,
          customer: this.props.customerNumber,
          assetKeys: [this.props.assetKey],
          keyType: this.constructor.typeToId(this.props.assetType),
          stage: {
            width: '100%',
            aspectRatio: 'asset',
          },
          slot: this.props.slot,
          plugins: {
            ClickableVideo: {
              layer: 1,
            },
            InnerControls: {
              layer: 2,
              id: 'controls',
              blacklist: ['share', 'quality', 'playback-speed'],
              template: {
                type: 'external',
                source: 'https://mycliplister.com/static/viewer/assets/skins/default/controls.html',
              },
            },
            PreviewImage: {
              layer: 4,
            },
            PlayButton: {
              id: 'playButton',
              layer: 5,
              image: 'https://mycliplister.com/static/viewer/assets/skins/default/playButton.png',
              width: 100,
              height: 100,
            },
          },
        });
      })
      .catch((err) => {
        logger.error('Could not get Cliplister.Viewer', err);
      });
  }

  /**
   * Component should never update.
   * @returns {boolean}
   */
  shouldComponentUpdate() {
    return false;
  }

  /**
   * Cleaning up.
   */
  componentWillUnmount() {
    if (!this.viewer) {
      return;
    }
    this.viewer.destroy();
  }

  /**
   * Renders.
   * @returns {JSX}
   */
  render() {
    return <div id={this.namespace} />;
  }
}

export default ReactCliplister;
