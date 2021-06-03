import { ajax } from '@youzan/vis-ui';

const Api = {
  /**
   * 获取签到列表
   */
  getLessons(data) {
    return ajax({
      url: '/wscvis/edu/signIn/getLessons.json',
      data,
      errorMsg: '获取可签到列表数据失败',
    });
  },

  /**
   * @param {Object} data
   * @description 签到
   */
  postSignIn(data) {
    return ajax({
      method: 'POST',
      url: '/wscvis/edu/signIn/signIn.json',
      data,
      errorMsg: '签到失败',
    });
  },

  // 资产签到
  postSignInWithAssets(data) {
    return ajax({
      method: 'POST',
      url: '/wscvis/edu/signIn/signInWithAssets.json',
      data,
      errorMsg: '签到失败',
    });
  },

  /**
   * @description 签到结果数据
   * @param {Object} data data.studentLessonNo 学员课表的编号
   */
  getSignedResult(data) {
    return ajax({
      url: '/wscvis/edu/signIn/signInResult.json',
      data,
      errorMsg: '获取签到数据失败',
    });
  },

  /**
   * @description 返回推广二维码
   * @param {Object} data
   */
  getPromoteResult(data) {
    return ajax({
      url: '/wscvis/edu/signIn/signInResultQrcode.json',
      data,
      errorMsg: '获取推广二维码失败',
    });
  },

  // 返回签到课节对应的资产信息
  findUserAssetsForSignIn(data) {
    return ajax({
      url: '/wscvis/edu/signIn/findUserAssetsForSignIn.json',
      data,
    });
  },
};

export default Api;
