import { withPageProductId } from '@shopgate/pwa-extension-kit/connectors';
import connect from './connector';
import ProductVideo from './component';

export default withPageProductId(connect(ProductVideo));
