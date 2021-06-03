import { ajax } from '@youzan/vis-ui';
import { IInstanceInfo, ITemplateInfo } from './types/activity';
export { getVuePoster } from '@/common/apis/poster';

const BASE_URI = '/wscvis/ump/tuition';

export interface IDetailData {
  hasInstance: boolean;
  tuitionActivity: ITemplateInfo;
  tuitionInstance: IInstanceInfo;
}

/**
 * 获取攒学费活动信息，包括模板信息/活动实例信息
 *
 * @param {string} alias - 攒学费活动模板 alias
 * @return {Promise} 攒学费活动信息
 */
export function getDetailJson(alias: string): Promise<IDetailData> {
  return ajax({
    url: `${BASE_URI}/getDetail.json`,
    data: {
      alias,
    },
    loading: false,
  });
}

/**
 * 获取攒学费活动弹幕信息
 *
 * @param {string} alias - 攒学费活动模板 alias
 * @return {Promise} 攒学费活动信息
 */
export function getListLatestRollingTextJson(alias: string) {
  return ajax({
    url: `${BASE_URI}/listLatestRollingText.json`,
    data: {
      // query: { alias },
      alias,

      pageSize: 10,
      // pageRequest: {
      //   pageNumber: 1,
      // },
    },
    loading: false,

  });
}

/**
 * 获取攒学费活动信息，包括模板信息/活动实例信息
 *
 * @param {string} alias - 攒学费活动模板 alias
 * @return {Promise} 攒学费活动信息
 */
export function getListHelperPagedJson(instanceId: number, page:number = 1, pageSize: number = 10):Promise<any> {
  return ajax({
    url: `${BASE_URI}/listHelperPaged.json`,
    method: 'GET',
    data: {
      query: {
        instanceId,
      },
      pageRequest: {
        pageSize,
        pageNumber: page,
      },
    },
    loading: false,

  });
}

/**
 * 获取攒学费活动信息，包括模板信息/活动实例信息
 *
 * @param {string} alias - 攒学费活动模板 alias
 * @return {Promise} 攒学费活动信息
 */
export function getListGoodsPagedJson(alias: string) {
  return ajax({
    url: `${BASE_URI}/listGoodsPaged.json`,
    method: 'POST',
    data: {
      alias,
    },
    loading: false,

  });
}

/**
 * 获取信息采集资料项目
 *
 * @param {Array} attributeIds - 攒学费活动模板 alias
 * @return {Promise} 攒学费活动信息
 */
export function listAttributeByIdList(attributeIds: number[]): Promise<Record<string, any>[]> {
  return ajax({
    url: `${BASE_URI}/listAttributeByIdList.json`,
    method: 'POST',
    data: {
      attributeIds,
    },
  });
}

interface IPayload {
  alias: string;
  attributeItems?:any;
  verifyCode?:string;
  fromInstanceId?: string;
}

/** 发起攒学费活动（生成活动实例） */
export function postParticipateJson(payload: IPayload): Promise<boolean> {
  return ajax({
    url: `${BASE_URI}/participate.json`,
    method: 'POST',
    data: payload,
  });
}

/**
 * 帮助好友助力
 *
 * @param {number} id - 帮助好友助力的活动实例 id
 * @return {Promise<boolean>} 是否助力成功
 */
export function postCollectZanJson(id: string): Promise<boolean> {
  return ajax({
    url: `${BASE_URI}/collectZan.json`,
    method: 'POST',
    data: {
      fromInstanceId: id,
    },
  });
}
/**
 * 帮助好友助力

 */
export function sendVerifyCode(alias:string, mobile:string): Promise<any> {
  return ajax({
    url: `${BASE_URI}/sendVerifyCode.json`,
    method: 'POST',
    data: {
      alias, mobile,
    },
  });
}

/**
 * 获取信息采集资料项目
 *
 * @param {Array} attributeIds - 攒学费活动模板 alias
 * @return {Promise} 攒学费活动信息
 */
export function getUserHelpStatus(alias: string, fromInstanceId:string): Promise<any> {
  return ajax({
    url: `${BASE_URI}/getUserHelpStatus.json`,
    method: 'GET',
    data: {
      alias, fromInstanceId,
    },
    loading: false,

  });
}

/**
 * 获取信息采集资料项目
 *
 * @param {Array} attributeIds - 攒学费活动模板 alias
 * @return {Promise} 攒学费活动信息
 */
export function findGoodsByPage(activityId: number, page:number = 1, pageSize: number = 3): Promise<any> {
  return ajax({
    url: `${BASE_URI}/findGoodsByPage.json`,
    method: 'GET',
    data: {
      query: {
        activityId,
      },
      pageRequest: {
        pageSize,
        pageNumber: page,
      },
    },
    loading: false,
  });
}
