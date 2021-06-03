/**
 * 家庭帐号邀请主页相关接口
 */
import { ajax } from '@youzan/vis-ui';

const baseUrl = '/wscvis/edu/family-account';

// 接受邀请
export function confirm(data) {
  return ajax({
    method: 'POST',
    url: `${baseUrl}/confirm.json`,
    data,
    rawResponse: true,
  });
}

// 获取家庭成员信息
export function getInvitationInfo(data) {
  return ajax({
    url: `${baseUrl}/getInvitationInfo.json`,
    data,
  });
}

// 获取倒计时
export function getInvitationByCode(data) {
  return ajax({
    url: `${baseUrl}/getInvitationByCode.json`,
    data,
  });
}

// 公众号
export function getMpAccount(data) {
  return ajax({
    url: `${baseUrl}/getMpAccount.json`,
    data,
    loading: false,
  });
}

// 获取店铺id
export function getShopName() {
  return ajax({
    url: `${baseUrl}/getShopName.json`,
    loading: false,
  });
}

// 获取邀请壮体
export function getInviteState(data) {
  return ajax({
    url: `${baseUrl}/getInviteState.json`,
    data,
  });
}
