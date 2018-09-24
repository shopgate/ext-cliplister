import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config/index';

const { colors, variables } = themeConfig;

const wrapper = css({
  margin: `${variables.gap.small}px 0`,
}).toString();

export default {
  wrapper,
}