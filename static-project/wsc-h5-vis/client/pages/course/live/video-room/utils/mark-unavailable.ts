import type { ILiveItemDTO } from 'definitions/api/owl/api/LiveItemFacade/findPage';

const markUnavailable = {
  markGoods(goods: ILiveItemDTO) {
    return goods.state === 0;
  },
};

export default markUnavailable;
