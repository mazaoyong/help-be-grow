/* !
 * 商品推荐组件
 * @author: yugang <yugang@youzan.com>
 */
import Editor from './GoodsRecommendEditor';
import { isWscShop } from '../common/utils/shop-type';

import './style/index.scss';

const appendable = isWscShop();

export default {
  type: Editor.designType,
  editor: Editor,
  limit: 1,
  // TODO
  appendable,
};
