import { isInStoreCondition } from 'fns/chain';
import { isUnifiedPartnerStore, isRetailMinimalistPartnerStore } from '@youzan/utils-shop';
import { BRANCH_STORE_NAME } from 'constants/chain';
import { findListAllCampus } from 'common/api/shop';
import { Select } from '@youzan/ebiz-components';

import type { FilterConfigType } from '@youzan/ebiz-components/es/types/easy-list/types/filter';
import type { IEbizSelectProps } from '@youzan/ebiz-components/es/types/select';

const chainSupportHqStore = isInStoreCondition({
  supportHqStore: true,
});

const chainSupportPartnerStore = isUnifiedPartnerStore || isRetailMinimalistPartnerStore;
const enableStore = chainSupportHqStore || chainSupportPartnerStore;
interface IOption {
  text: string;
  value: number;
}
// 获取校区列表
async function filterCampusList() {
  const data = await findListAllCampus({});
  let campusList: IOption[] = chainSupportPartnerStore ? [] : [{ value: 0, text: '全部' }];
  if (data.length === 0) {
    campusList = [{ value: -1, text: `暂无${BRANCH_STORE_NAME}` }];
  }
  campusList = campusList.concat(
    data.map((campus: any) => ({ value: campus.kdtId, text: campus.shopName })),
  );
  return {
    options: campusList,
    pageInfo: {
      current: 1,
      total: campusList.length,
    },
  };
}

const RECORDS_OPTIONS: FilterConfigType = [
  {
    type: 'DateRangePicker',
    name: 'date',
    label: '订购时间：',
  },
  {
    type: 'Input',
    name: 'keyword',
    label: '交易单号：',
    inheritProps: {
      width: '185px',
    },
  },
  {
    // 合并零售店铺和多校区总部的校区选择组件
    type: 'Custom',
    name: 'selectedKdtIdList',
    label: `所属${BRANCH_STORE_NAME}：`,
    inheritProps: <IEbizSelectProps>{
      width: '185px',
      mode: 'async',
      fetchOptions: filterCampusList,
    },
    renderField: Select,
    visible: chainSupportHqStore || chainSupportPartnerStore,
  },
];

export { RECORDS_OPTIONS, chainSupportHqStore, enableStore, chainSupportPartnerStore };
