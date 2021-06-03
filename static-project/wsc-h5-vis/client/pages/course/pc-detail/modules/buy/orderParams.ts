import { GOODS_TYPE_TO_OWL_TYPE } from '@/constants/course/goods-type';
import { GOODS_TYPE } from '@/constants/course/goodsType';

let orderParams = {};

export function createBaseParams(goodsData: any, goodsType: GOODS_TYPE, selectedSku?: any) {
  orderParams = {
    productInfoList: [{
      alias: goodsData.alias,
      id: goodsData.goodsId,
      // 线下课无 sku 时，以 collectionId 作为 skuId，知识付费时为 undefined
      skuId: selectedSku ? selectedSku.id : goodsData.sku.collectionId,
      num: 1,
      owlType: GOODS_TYPE_TO_OWL_TYPE[goodsType],
    }],
    umpInfo: {},
  };

  return orderParams;
}
