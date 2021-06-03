import { visAjax } from 'fns/new-ajax';

export interface CustomHolidayData {
  /** 节假日结束时间 */
  endTime: string;
  /** 节假日ID */
  id: number;
  /** 店铺ID */
  kdtId: number;
  /** 节假日名称 */
  name: string;
  /** 节假日开始时间 */
  startTime: string;
  /** 创建来源 （店铺名称） */
  source: string;
}

/**
 * 按年查询法定节假日
 */
export function listAllLegalHolidayByYear(payload) {
  return visAjax('GET', '/edu-admin/holiday/list-all-by-year.json', payload);
}

/**
 * 根据ID查询节假日
 */
export function getHolidayById(payload) {
  return visAjax('GET', '/edu-admin/holiday/get-by-id.json', payload);
}

/**
 * 创建自定义节假日
 */
export function createHoliday(payload) {
  return visAjax('POST', '/edu-admin/holiday/create.json', payload);
}

/**
 * 修改自定义节假日
 */
export function updateHoliday(payload) {
  return visAjax('PUT', '/edu-admin/holiday/update.json', payload);
}

/**
 * 删除自定义节假日
 */
export function deleteHoliday(payload) {
  return visAjax('DELETE', '/edu-admin/holiday/delete.json', payload);
}

/**
 * 分页查询节假日
 */
export function findHolidayPage(payload) {
  return visAjax('GET', '/edu-admin/holiday/find-page.json', payload);
}

/**
 * 查询节假日
 */
export function findHoliday(payload) {
  return visAjax('GET', '/edu-admin/holiday/find.json', payload);
}
