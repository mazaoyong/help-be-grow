
import { EXPORT_RECORD_TYPES } from './constants';

interface IGetExportRecordListParams {
  type: EXPORT_RECORD_TYPES;
}

/**
 * 获取前往导出记录的链接
 *
 * @param {Object} data - 参数
 * @param {number} data.type - 导出的类型
 * @return {string} 导出记录的链接
 */
export function getExportRecordUrl(data: IGetExportRecordListParams): string {
  return `${_global.url.v4}/vis/pct/page/record#/export/${data?.type}`;
}
