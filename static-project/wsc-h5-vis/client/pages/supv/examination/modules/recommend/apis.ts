import { ajax } from '@youzan/vis-ui';
export { getRecommendList } from 'supv/examination/apis';

interface IGoodsList {
  goodsList: Array<{
    alias: string;
    buyUrl: string;
    isVirtual: boolean;
    imageUrl: string;
    origin: string;
    price: number;
    preSale: boolean;
    soldStatus: number;
    subTitle: string;
    totalSoldNum: number;
    totalStock: number;
    title: string;
    url: string;
  }>
}
export function getRecommendGoods(): Promise<IGoodsList> {
  return ajax({
    url: '/wscvis/order/getRecommendGoods.json',
    loading: false,
  });
};
