/**
 * 家庭帐号主页相关接口
 */
import { ajax } from '@youzan/vis-ui';

// 邀请海报
export function getInvitePoster(data) {
  return ajax({
    url: '/wscvis/edu/family-account/getInvitePoster.json',
    method: 'POST',
    data,
    loading: false,
  });
}

// 根据redisKey获取海报图片
export function getSnopshotByKey(data) {
  return ajax({
    url: '/wscvis/cert/getSnopshotByKey.json',
    data,
    loading: false,
  });
}

// 获取学员列表
export function findSimpleByUserId(data) {
  return ajax({
    url: '/wscvis/edu/family-account/findSimpleByUserId.json',
    data,
  });
}

// 查询当前用户的家庭帐号信息
export function getAccount() {
  return ajax({
    url: '/wscvis/edu/family-account/getAccount.json',
  });
}

// 取消邀请家庭成员
export function cancel(data) {
  return ajax({
    method: 'POST',
    url: '/wscvis/edu/family-account/cancel.json',
    data,
    rawResponse: true,
  });
}

// 移除家庭成员
export function remove(data) {
  return ajax({
    method: 'POST',
    url: '/wscvis/edu/family-account/remove.json',
    data,
  });
}

// 发起邀请
export function invite(data) {
  return ajax({
    method: 'POST',
    url: '/wscvis/edu/family-account/invite.json',
    data,
  });
}
