import omit from 'lodash/omit';
import addDays from 'date-fns/add_days';
import assign from 'lodash/assign';
import { calculateImage } from './utils';
import Env from './env';
import appCache from './app-cache';

// 处理提交前的数据
export default function parseRequest(formModel, extra, originData) {
  let shipment = +formModel.shipment;
  let isOuter = +formModel.shop_method === 0;
  let isReal = shipment === 0;
  let isVirtual = shipment === 2;
  // let isEcard = shipment === 3;
  let isHotel = +formModel.goods_type === 35 || shipment === 4;
  let isCake = shipment === 5;
  let isFresh = shipment === 7;
  let isNew = !formModel.id > 0;

  // 上架时间只能为 0 和 1，为 2 时表示下架
  if (formModel.sold_time > 1) {
    formModel.sold_time = 0;
    formModel.is_display = 0;
    extra.is_display = 0;
  } else {
    formModel.is_display = 1;
  }

  // 如果商品详情是锁定的，使用缓存的内容
  if (Env.isActivityLock()) {
    formModel.content = originData.content;
  }

  // 对于多 sku 商品， 不传 cost_price 参数
  let stock = formModel.stock;
  if (stock && stock.length > 0) {
    formModel.cost_price = '';
  }

  // java 接口取 class1 和 class2
  formModel.class1 = formModel.class_1;
  formModel.class2 = formModel.class_2;

  // 服务器校验 quota 不能为空
  if (formModel.quota < 1) {
    formModel.quota = 0;
  }

  // 当视频删除时，video_id 为 0
  if (!formModel.video_id > 0) {
    formModel.video_id = 0;
  }

  // 计算图片高度
  if (formModel.picture && formModel.picture.length > 0) {
    formModel.picture_height = calculateImage(formModel.picture);
  }

  // 预售切换不同的状态，清空相应的数据
  if (+formModel.etd_type === 0) {
    formModel.etd_days = '';
  } else {
    formModel.etd_start = '';
  }

  // 对于外部商品，提交前清空 sku、stock 相关数据
  if (isOuter) {
    formModel = assign(formModel, {
      cost_price: '',
      total_stock: 0,
      sold_time: 0,
      start_sold_time: '',
    });

    if (isNew) {
      formModel.stock = [];
      delete formModel.sku_name_1;
      delete formModel.sku_name_1_value;
      delete formModel.sku_name_2;
      delete formModel.sku_name_2_value;
      delete formModel.sku_name_3;
      delete formModel.sku_name_3_value;
    }
  } else {
    formModel.buy_url = '';
  }

  // 忽略非实物信息
  let preSaleEmpty = {
    pre_sale_type: -1,
    etd_type: 0,
    etd_start: '',
    etd_days: '',
    deposit_ratio: '',
    pre_sale_end: '',
    balance_due_start: '',
    balance_due_end: '',
  };

  if (isOuter || (!isReal && !isFresh)) {
    formModel = assign(formModel, preSaleEmpty, {
      postage: '',
      delivery_template_id: 0,
      sku_weight: [],
      item_weight: '',
    });
  }

  if (isFresh) {
    formModel = assign(formModel, preSaleEmpty);
  }

  // 忽略非虚拟信息
  if (!isVirtual) {
    delete formModel.is_support_virtual_refund;
  }

  if (formModel.item_validity_start && formModel.item_validity_end) {
    formModel.item_validity_end = addDays(formModel.item_validity_end * 1000, 1).getTime() / 1000;
  }

  // 忽略非酒店信息
  if (!isHotel) {
    formModel = assign(formModel, {
      service_tel_code: '',
      service_tel: '',
    });
  }

  // 忽略非蛋糕烘焙信息
  if (!isCake) {
    formModel = assign(formModel, {
      cake_baking: null,
    });
  }

  // 如果详情内容跟初始的完成一致，则清空
  if (formModel.content === appCache.get('initialContent')) {
    formModel.content = '';
  }

  // 提交忽略的字段
  const ignoreFields =
    '' +
    ' _ignore_item_weight _ignore_stock_price selectedMarkCode' +
    ' _ignore_stock_num _ignore_stock_code _ignore_cost_price' +
    ' sku disableShipment hasNewSkuAdded selectedGoodsType is_quota' +
    ' goods_type_extra basic_info_extra sku_extra others_extra' +
    ' delivery delivery_template_type delivery_weight_type delivery_weight' +
    ' habitsMap storageCacheMap city_delivery self_pick need_prepare_time' +
    ' prepare_time sku_prepare_time prepare_time_type common_prepare_time' +
    ' fx_delivery_template_id fx_delivery_template_type';
  formModel = omit(formModel, ignoreFields.split(' '));

  return formModel;
}
