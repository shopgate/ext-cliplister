import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TaggedLogger } from '@shopgate/pwa-extension-kit/helpers';
import getCliplister from '../cliplister/viewer';
import isiOSPlatform from '../../helpers/isiOSPlatform';

const typeEAN = 'EAN'; // Cliplister id = 0 => Also, default identifier
const typeProductNumber = 'PRODUCT_NUMBER'; // Cliplister id = 10000 => Custom identifier.

const logger = new TaggedLogger('ReactCliplister');
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
        this.viewer = new Cliplister.Viewer({
          parentId: this.namespace,
          customer: this.props.customerNumber,
          assetKeys: [this.props.assetKey],
          keyType: this.constructor.typeToId(this.props.assetType),
          stage: {
            width: '100%',
            aspectRatio: 'asset',
          },
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

        this.viewer.onPlay(this.handlePlay);
        this.viewer.onStop(this.handleStop);
        this.viewer.onPause(this.handleStop);
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
    this.viewer.stop();
    this.viewer.destroy();
  }

  /**
   * The onPlay callback. It does two things:
   * 1. Makes sure the <video> parent div is above the controls container. Otherwise on iOS it's
   * impossible to use any native controls on second render, because the controls container has some
   * js/css problem and constantly flickers on top of the video blocking user input.
   * 2. Unmutes the video. This works around the issue that there is no "mute" button on ios native
   * video element.
   */
  handlePlay = () => {
    try {
      // Non iOS devices show Cliplister controls. Workaround only for iOS.
      if (!isiOSPlatform()) {
        return;
      }
      this.viewer.unmute();
      document.getElementById(this.namespace)
        .querySelector('div.cliplister-viewer > div:last-child').style.zIndex = 1;
    } catch (err) {
      logger.error('HandlePlay error', err);
    }
  }

  /**
   * Cleans up after handlePlay workarounds.
   */
  handleStop = () => {
    try {
      // Non iOS devices show Cliplister controls. Workaround only for iOS.
      if (!isiOSPlatform()) {
        return;
      }
      this.viewer.mute();
      document.getElementById(this.namespace)
        .querySelector('div.cliplister-viewer > div:last-child').style.zIndex = 0;
    } catch (err) {
      logger.error('HandleStop error', err);
    }
  };

  /**
   * Renders.
   * @returns {JSX}
   */
  render() {
    return <div id={this.namespace} />;
  }
}

export default ReactCliplister;
