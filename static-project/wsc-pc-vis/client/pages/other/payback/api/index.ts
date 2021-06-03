import { visAjax } from 'fns/new-ajax';
import { IAjaxOptionsWithoutUrl } from 'zan-ajax';
import {
  ISecuredInfoResult,
  ICheckApplyResult,
} from '../definitions';

interface IAjaxOptions extends IAjaxOptionsWithoutUrl {
  // 是否把null undefined params 干掉
  cleanEmptyKey?: boolean;
}

interface ajaxParams {
  method?: any,
  url: string,
  data?: { [key: string]: any },
  options?: IAjaxOptions,
}

function ajax(params: ajaxParams): Promise<any> {
  return visAjax(params.method || 'GET', params.url, params.data || {}, params.options);
}

// 查询课程回款服务
export function queryInfo(page: number): Promise<ISecuredInfoResult> {
  return ajax({
    url: '/edu/payback/listRecordsWithService.json',
    data: { page }
  });
}

// 检查店铺是否符合开通条件
export function checkApply(): Promise<ICheckApplyResult> {
  return ajax({
    url: '/edu/payback/serviceCheck.json',
  });
}

// 提交申请
export function apply(): Promise<boolean> {
  return ajax({
    url: '/edu/payback/applyQuickSettleService.json',
    method: 'POST',
  });
}

// 撤销申请
export function cancelApply(): Promise<boolean> {
  return ajax({
    url: '/edu/payback/cancelQuickSettleService.json',
    method: 'POST',
  });
}

// 有赞教育资质查询
export function queryUnitedQualStatus() {
  return ajax({
    url: '/edu/payback/queryUnitedQualStatus.json',
    method: 'GET',
  });
}
