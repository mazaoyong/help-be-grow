import { isSame, diffSku, ignoreEmptySku } from './utils';
import SKU from './SKU';

import './style.scss';

SKU.isSame = isSame;
SKU.diffSku = diffSku;
SKU.ignoreEmptySku = ignoreEmptySku;

export default SKU;
