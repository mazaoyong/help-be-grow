import { visAjax } from 'fns/new-ajax';
import { IActivityDetail } from '../types';

// 活动列表
export function getReferralList(data) {
  return visAjax('GET', '/pct/referral/list.json', data);
}

// 数据列表 X
export function getReferralEffectList(data) {
  return visAjax('GET', '/pct/referral/effectList.json', data);
}

// 删除活动
export function deleteReferralActive(data: { activityId: number }) {
  return visAjax('DELETE', '/pct/referral/active.json', data);
}

// 结束活动
export function endReferralActive(data) {
  return visAjax('PUT', '/pct/referral/endActive.json', data);
}

export function getDetailByActivityId(data) {
  return visAjax<IActivityDetail>('GET', '/pct/referral/getDetailByActivityId.json', data);
}

// 获取二维码
export function getQrcode(url: string, options: any = {}) {
  return visAjax('GET', '/pct/biz/getWscQrcode.json', {
    url: url,
    width: 280,
    height: 280,
    ...options,
  });
}
