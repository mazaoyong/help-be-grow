import React from 'react';
import { NumberInput } from 'zent';
import { EasyList } from '@youzan/ebiz-components';
import ExportActions from 'components/export-actions';
import { FilterConfigType, IOption } from '@youzan/ebiz-components/es/types/easy-list';
import EduCourseSelector from '@ability-center/common/edu-course-selector';
import EduClassSelector from '@ability-center/common/edu-class-selector';
import StaffSelector from '@ability-center/common/staff-selector';
import { EXPORT_RECORD_TYPES } from '@ability-center/ump/export-record';
import {
  queriesMarshall,
  dropEmptyLikeValue,
  dropNullableTimeRange,
} from 'fns/format/queries-marshall';
import { useChainSettings } from '@hooks';
import { formatQueries } from './format-queries';
import { wrapNotify } from 'pages/edu-admin/course-summary/components/wrap-notify';

import { exportApplyList } from 'pages/student/api/student-apply-list';
import { findListAllCampus } from 'pages/student/api';
import { isInStoreCondition } from 'fns/chain';

interface IProps {
  onSearch: (values?: Record<string, any>) => void;
  defaultValues: Record<string, any>;
}

export type IGetFilterConfigs = (params: {
  defaultValues: Record<string, any>;
  defaultClassOption: IOption;
  setDefaultClassOption: (option: IOption) => any;
  defaultCourseOption: IOption;
  setDefaultCourseOption: (option: IOption) => any;
  defaultStaffOption: IOption;
  setDefaultStaffOption: (option: IOption) => any;
  schoolOptions: IOption[];
}) => FilterConfigType;

const { Filter } = EasyList;

const getFormFieldConf: IGetFilterConfigs = ({
  defaultValues = {},
  defaultClassOption,
  setDefaultClassOption,
  defaultCourseOption,
  setDefaultCourseOption,
  defaultStaffOption,
  setDefaultStaffOption,
  schoolOptions,
}) => [
  [
    {
      name: 'query',
      label: '学员：',
      inheritProps: {
        placeholder: '学员姓名/联系方式',
        width: '185px',
      },
      type: 'Input',
      defaultValue: defaultValues.name,
    },
    {
      name: 'courseName',
      label: '线下课：',
      inheritProps: {
        placeholder: '请输入线下课名称',
        width: '185px',
      },
      type: 'Input',
      defaultValue: defaultValues.courseName,
    },
    {
      type: 'Custom',
      label: '适用课程：',
      name: 'applyCourseId',
      renderField: (props) => {
        return (
          <EduCourseSelector
            defaultOption={defaultCourseOption}
            setDefaultOption={setDefaultCourseOption}
            {...props}
          />
        );
      },
    },
  ],
  [
    {
      name: 'courseSellType',
      label: '收费方式：',
      options: [
        { value: '', text: '全部收费方式' },
        { value: '1', text: '按课时' },
        { value: '2', text: '按时段' },
        { value: '3', text: '按期' },
        { value: '0', text: '按自定义' },
      ],
      type: 'Select',
      inheritProps: {
        width: '185px',
      },
      defaultValue: defaultValues.courseSellType,
    },
    {
      name: 'courseStatus',
      label: '课程状态：',
      options: [
        { value: '', text: '全部状态' },
        { value: '2', text: '未开始' },
        { value: '3', text: '进行中' },
        { value: '1', text: '已学完' },
        { value: '4', text: '已退课' },
      ],
      type: 'Select',
      inheritProps: {
        width: '185px',
      },
      defaultValue: defaultValues.courseStatus,
    },
    {
      name: 'enrollmentType',
      label: '报名类型：',
      options: [
        { value: '', text: '全部类型' },
        { value: '1', text: '新报' },
        { value: '2', text: '转课' },
        // { value: '3', text: '续费' },
      ],
      type: 'Select',
      inheritProps: {
        width: '185px',
      },
      defaultValue: defaultValues.enrollmentType,
    },
  ],
  [
    {
      type: 'Custom',
      label: '所在班级：',
      name: 'eduClassId',
      renderField: (props) => {
        return (
          <EduClassSelector
            defaultOption={defaultClassOption}
            setDefaultOption={setDefaultClassOption}
            {...props}
          />
        );
      },
    },
    {
      name: 'staff',
      type: 'Custom',
      label: '课程顾问',
      renderField: (props) => {
        return (
          <StaffSelector
            defaultOption={defaultStaffOption}
            setDefaultOption={setDefaultStaffOption}
            {...props}
          />
        );
      },
    },
    {
      name: 'remainTime',
      label: '剩余课时：',
      type: 'Custom',
      renderField: ({ value, onChange }) => {
        return (
          <>
            <NumberInput
              width="81px"
              decimal={2}
              min={0}
              inline
              value={value[0]}
              onChange={(min) => onChange([min, value[1]])}
            />
            &nbsp; - &nbsp;
            <NumberInput
              width="81px"
              decimal={2}
              min={0}
              inline
              value={value[1]}
              onChange={(max) => onChange([value[0], max])}
            />
          </>
        );
      },
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
      // 先全线禁用该查询条件，目前后端不支持
      visible: isInStoreCondition({ supportHqStore: true }),
      options: schoolOptions,
    },
  ],
];

const collapseFilter = (defaultValues: Record<string, any>): FilterConfigType => [
  {
    name: 'validBegin',
    label: '有效期开始时间：',
    type: 'DateRangePicker',
    defaultValue: defaultValues.validBegin,
  },
  {
    name: 'validEnd',
    label: '有效期结束时间：',
    type: 'DateRangePicker',
    defaultValue: defaultValues.validEnd,
  },
  {
    name: 'applyDateRange',
    label: '报名时间：',
    type: 'DateRangePicker',
    defaultValue: defaultValues.applyDateRange,
  },
  {
    name: 'recentStudyRange',
    label: '最近上课时间：',
    type: 'DateRangePicker',
    defaultValue: defaultValues.dateRange,
  },
];

const defaultOption = {
  text: '',
  value: '',
};
const timeRangeFieldKeys = ['validBegin', 'validEnd', 'applyDateRange', 'recentStudyRange'];
const ApplyListFilter: React.FC<IProps> = ({ onSearch, defaultValues }) => {
  const [defaultClassOption, setDefaultClassOption] = React.useState(defaultOption);
  const [defaultCourseOption, setDefaultCourseOption] = React.useState(defaultOption);
  const [defaultStaffOption, setDefaultStaffOption] = React.useState(defaultOption);
  const [schoolOptions, setSchoolSelectOpts] = React.useState([
    {
      value: '',
      text: '全部',
    },
  ]);
  const { studentListExportability } = useChainSettings({});

  const handleExport = React.useCallback((filter) => {
    const queries = filter.getCurrentValues();
    const simplifyQueries = queriesMarshall.queriesDropper(queries, [
      dropEmptyLikeValue,
      dropNullableTimeRange(timeRangeFieldKeys),
    ]);
    return exportApplyList(formatQueries(simplifyQueries));
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

  React.useEffect(() => fetchChainShopList(), [fetchChainShopList]);

  return (
    <div className="student-list-filter">
      <Filter
        onReset={onSearch}
        onSubmit={onSearch}
        actionsOption={{
          beforeReset(filter) {
            if (studentListExportability === 'invisible') return null;
            return (
              <ExportActions
                withAgreementConfirm
                onExport={() => handleExport(filter)}
                type={EXPORT_RECORD_TYPES.APPLY_LIST}
                disabled={studentListExportability === 'disabled'}
              />
            );
          },
        }}
        collapseConfig={collapseFilter(defaultValues)}
        config={getFormFieldConf({
          defaultClassOption,
          defaultCourseOption,
          defaultStaffOption,
          defaultValues,
          schoolOptions,
          setDefaultClassOption,
          setDefaultCourseOption,
          setDefaultStaffOption,
        })}
      />
    </div>
  );
};

export default ApplyListFilter;
