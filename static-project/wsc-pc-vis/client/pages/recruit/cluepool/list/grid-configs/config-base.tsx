import { findListAllCampusAPI, getStaffListAPI, createClueExportTask, IBaseFetchListQuery } from '../../api/list';
import { IOption } from '@youzan/ebiz-components/es/types/easy-list';
import { CluePageType } from '../utils/use-fetch-list';

export type ICampusOption = IOption<number>;
export type IStaffOption = IOption<string>;
export const getCampusList = (): Promise<ICampusOption[]> => {
  return findListAllCampusAPI().then((content) => {
    if (Array.isArray(content) && content.length) {
      return content.map((item) => ({
        text: item.shopName,
        value: item.kdtId,
      }));
    }
    return [];
  });
};
export const getStaffList = (): Promise<IStaffOption[]> => {
  return getStaffListAPI().then((content) => {
    if (Array.isArray(content) && content.length) {
      return content.map((staff) => ({
        text: staff.name,
        value: String(staff.adminId),
      }));
    }
    return [];
  });
};

const DEFAULT_ERROR_MSG = '系统开小差了，请稍后再试';
// 导出线索
export const exportClue = (filterOptions: IBaseFetchListQuery['clueInfoQuery'], pageType: CluePageType): Promise<boolean> => {
  const query = {
    ...filterOptions,
    // 用于给后端标示是来自全部线索还是公海池
    type: pageType === 'all' ? 0 : 1
  };
  return createClueExportTask({ query }).then((res) => {
    if (!res) {
      return Promise.reject(DEFAULT_ERROR_MSG);
    }
    return true;
  });
};
