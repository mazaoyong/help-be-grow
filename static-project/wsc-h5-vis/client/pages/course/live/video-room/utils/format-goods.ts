import { get } from 'lodash';
import format from '@youzan/utils/money/format';

import markUnavailable from './mark-unavailable';
import type { ILiveItemDTO } from 'definitions/api/owl/api/LiveItemFacade/findPage';

export interface ILegalGoods {
  id: number;
  alias: string;
  owlType: ILiveItemDTO['owlType'];
  isDelete: boolean;
  /** 因为包含实物商品和知识付费商品，所以需要手动拼接url */
  url: string;
  /** 商品类型，用于渲染图片右下角的图标，必须要传一个 */
  courseType?: ILiveItemDTO['courseType'];
  mediaType?: ILiveItemDTO['mediaType'];
  img: string;
  title: string;
  price: number;
  buttonText: '去报名' | '去购买';
}

function formatGoods(goodsData: ILiveItemDTO): ILegalGoods {
  const { alias, itemId, owlType, title, courseType, mediaType, price, images, liveFlowId } = goodsData;
  const isEduGoods = owlType !== 0;
  const traceInfo = `edu=LIVE_ROOM::${liveFlowId}`;
  const targetUrl = !isEduGoods
  /** 跳转链接需要带上直播间的信息 */
  /** 非教育商品 */? `/wscgoods/detail/${alias}?kdt_id=${_global.kdt_id}`
  /** 教育商品 */: `/wscvis/course/detail/${alias}?kdt_id=${_global.kdt_id}`;
  const btnText: ILegalGoods['buttonText'] = isEduGoods ? '去报名' : '去购买';

  return {
    title,
    alias,
    owlType,
    mediaType,
    courseType,
    id: itemId,
    buttonText: btnText,
    img: get(images, '[0].url'),
    url: targetUrl + `&${traceInfo}`,
    price: Number(format(price, false, false)),
    isDelete: markUnavailable.markGoods(goodsData),
  };
}

export default formatGoods;
