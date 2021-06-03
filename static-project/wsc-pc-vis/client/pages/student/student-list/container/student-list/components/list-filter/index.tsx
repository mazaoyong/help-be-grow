import React, { FC } from 'react';
import { isInStoreCondition } from 'fns/chain';
import { EasyList } from '@youzan/ebiz-components';
import ExportActions from 'components/export-actions';
import { EXPORT_RECORD_TYPES } from '@ability-center/ump/export-record';
import { useChainSettings } from '@hooks';
import {
  dropEmptyLikeValue,
  dropNullableTimeRange,
  dropSelectAllValue,
  queriesMarshall,
} from 'fns/format/queries-marshall';
import { wrapNotify } from 'pages/edu-admin/course-summary/components/wrap-notify';

import { IHeaderProps, IGetFilterConfigs } from './types';
import { LIST_TYPE } from '../../../../constant';
import StatisticTabs from '../statistic-tabs';
import { formatQueries } from './format-queries';

import { findListAllCampus } from 'pages/student/api';
import { exportStudentList } from 'pages/student/api/student-list';

import type { FilterRefType } from '@youzan/ebiz-components/es/types/easy-list';

const { Filter } = EasyList;

const getFormFieldConf: IGetFilterConfigs = ({ options, defaultValues = {} }) => [
  [
    {
      name: 'keyword',
      label: '学员：',
      inheritProps: {
        placeholder: '学员姓名/联系方式',
      },
      type: 'Input',
      defaultValue: defaultValues.keyword,
    },
    {
      name: 'studentNo',
      label: '学员编号：',
      inheritProps: {
        placeholder: '请输入学员编号',
      },
      type: 'Input',
      defaultValue: defaultValues.studentNo,
    },
    {
      name: 'customerName',
      label: '家庭帐号：',
      inheritProps: {
        placeholder: '搜索家长姓名',
      },
      type: 'Input',
      defaultValue: defaultValues.customerName,
    },
  ],
  [
    {
      name: 'hasSubMp',
      label: '关注公众号：',
      options: [
        { value: '0', text: '全部' },
        { value: '1', text: '已关注' },
        { value: '2', text: '未关注' },
      ],
      type: 'Select',
      defaultValue: defaultValues.hasSubMp || '0',
    },
    {
      name: 'dateRange',
      label: '最近上课时间：',
      type: 'DateRangePicker',
      defaultValue: defaultValues.dateRange,
    },
  ],
  [
    {
      name: 'targetKdtId',
      label: '所属校区：',
      inheritProps: {
        filter(item, keyword) {
          return item.text.includes(keyword);
        },
      },
      type: 'Select',
      defaultValue: defaultValues.targetKdtId || 'all',
      visible: isInStoreCondition({ supportHqStore: true }),
      options,
    },
  ],
];
const tabsConf = (total: number, study: number, finish: number) => [
  { value: '0', label: `全部 ${total || 0}` },
  { value: '1', label: `在读 ${study || 0}` },
  { value: '2', label: `结业 ${finish || 0}` },
];
const timeRangeFieldKeys = ['dateRange'];
const Header: FC<IHeaderProps> = (props) => {
  const { category, total, onSearch, defaultValues, statistic } = props;
  const { studentListExportability } = useChainSettings({});
  const [schoolSelectOpts, setSchoolSelectOpts] = React.useState([
    {
      value: '',
      text: '全部',
    },
  ]);

  const handleExport = React.useCallback((filter: FilterRefType) => {
    const queries = filter.getCurrentValues();
    const simplifyQueries = queriesMarshall.queriesDropper(queries, [
      dropEmptyLikeValue,
      dropNullableTimeRange(timeRangeFieldKeys),
      dropSelectAllValue(['targetKdtId']),
    ]);
    return exportStudentList(formatQueries(simplifyQueries));
  }, []);

  const fetchChainShopList = React.useCallback(() => {
    findListAllCampus()
      .then((res) => {
        const schoolSelectOpts = res.map((item) => ({ value: item.kdtId, text: item.shopName }));
        schoolSelectOpts.unshift({
          value: 'all',
          text: '全部',
        });
        setSchoolSelectOpts(schoolSelectOpts);
      })
      .catch(wrapNotify.error);
  }, []);

  React.useEffect(() => {
    fetchChainShopList();
  }, [fetchChainShopList]);

  return (
    <div className="student-list__header">
      {category && (
        <h2 className="customer-total">
          <span>{LIST_TYPE[category].title}</span>
          <span>({total}人)</span>
        </h2>
      )}
      {!category && (
        <div className="student-list__filter">
          <Filter
            onReset={onSearch}
            onSubmit={onSearch}
            config={getFormFieldConf({
              options: schoolSelectOpts,
              defaultValues: defaultValues,
            })}
            actionsOption={{
              beforeReset(filter) {
                if (studentListExportability === 'invisible') return null;
                return (
                  <ExportActions
                    withAgreementConfirm
                    onExport={() => handleExport(filter)}
                    type={EXPORT_RECORD_TYPES.STUDENT_LIST}
                    disabled={studentListExportability === 'disabled'}
                  />
                );
              },
            }}
          />
          <StatisticTabs
            tabs={tabsConf(statistic.total, statistic.study, statistic.finish)}
            defaultValues={defaultValues}
            onChange={onSearch}
          />
        </div>
      )}
    </div>
  );
};

export default Header;
