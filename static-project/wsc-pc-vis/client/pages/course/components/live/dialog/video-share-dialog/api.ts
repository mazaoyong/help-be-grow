import { visAjax } from 'fns/new-ajax';
import { ILiveAndAssistantLinkDTO, IAddAssistantOrGuestParams, IDeleteAssistantOrGuestParams, IUpdateAssistantOrGuestParams } from './types';

const livePrefix = '/course/live';

// 获取进入直播间信息
export function getLiveEnterInfo(data) {
  return visAjax<ILiveAndAssistantLinkDTO>(
    'GET',
    `${livePrefix}/video/getLiveEnterInfo.json`,
    data,
  );
}

// 新增助教，嘉宾
export function addAssistant(data: IAddAssistantOrGuestParams) {
  return visAjax('POST', `${livePrefix}/video/addRole.json`, data);
}

// 删除助教，嘉宾
export function deleteAssistant(data: IDeleteAssistantOrGuestParams) {
  return visAjax('POST', `${livePrefix}/video/deleteRole.json`, data);
}

// 更新助教，嘉宾
export function updateAssistant(data: IUpdateAssistantOrGuestParams) {
  return visAjax('POST', `${livePrefix}/video/updateRole.json`, data);
}
