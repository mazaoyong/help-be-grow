import get from 'lodash-es/get';

export const URL_MAP = get(window, '_global.url', {});

/**
 * SKU 前缀常量（历史遗留，保持一致）
 */
export const SKU_PREFIX = 'IFWEN2234_N3K_32R2';

export const KDT_ID = get(window, '_global.kdtId', 0) || get(window, '_global.kdt_id', 0);

/**
 * 渠道 key 和数字对应关系
 */
export const CHANNEL_NUMBER_MAPPING = {
  online: 0,
  offline: 1,
};

/**
 * 渠道名称映射
 */
export const CHANNEL_TEXT_MAPPING = {
  online: '网店自营',
  offline: '门店自营',
  distribute: '分销商品',
};

/**
 * 渠道名称映射（赠品）
 */
export const CHANNEL_PRESENT_TEXT_MAPPING = {
  online: '网店赠品',
  offline: '门店赠品',
};
