import { COM_STATUS } from '../common/constants';

export const info = {
  icon: 'https://img.yzcdn.cn/public_files/2019/02/12/e2364ce837893b27e065e449e06489cc.png',
  type: 'ump_limitdiscount',
  name: '限时折扣',
  maxNum: 5,
  usedNum: 0,
  status: COM_STATUS.NORMAL,
};

export function getInitialValue() {
  return {
    activity: { id: 0 },
    activity_id: 0,
    goods: [],
    size: '2',
    ratio: '3,2',
    show_title: '1',
    show_origin_price: '1',
    show_buy_btn: '1',
    buy_btn_type: '0',
    show_count_down: '1',
    show_time_limit: '1',
    show_stock_num: '1',
    image_fill_style: '2',
    default_image_url: '',
    type: 'ump_limitdiscount',
  };
}
