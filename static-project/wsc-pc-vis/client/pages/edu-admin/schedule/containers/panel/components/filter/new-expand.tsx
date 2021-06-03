import React, { useMemo } from 'react';

import {
  findPage,
  getStoreListAPI,
  getClassroomsAPI,
  getEduClassListAPI,
  exportSchedulesAPI,
  exportRecord,
  findAssistantPage,
} from '../../../../api';
import { date } from '@youzan/utils';
import { StateType, DispatchType } from '../../store';
import { chainSupportOnlyHq, chainSupportOnlySingle } from '../../../../chain';
import { formatQuery } from '../../format';

import { EasyList, Select } from '@youzan/ebiz-components';
import { FilterConfigType } from '@youzan/ebiz-components/es/types/easy-list';
import { Button as SamButton } from '@youzan/sam-components';
import { ShopChoose } from '@ability-center/shop/shop-choose';
import ExportRecordLink, {
  getExportRecordUrl,
  EXPORT_RECORD_TYPES,
} from '@ability-center/ump/export-record';
import { Notify } from 'zent';

import { get } from 'lodash';
import { startOfDay, endOfDay } from 'date-fns';
import { IEbizSelectProps } from '@youzan/ebiz-components/es/types/select';

const selectOptions = [
  {
    text: '自然日',
    value: 'day',
  },
  {
    text: '自然周',
    value: 'week',
  },
  {
    text: '自然月',
    value: 'month',
  },
  {
    text: '自定义',
    value: 'custom',
  },
];

const getEduClassList = (keyword = '', page) => {
  const kdtId = _global.kdtId;

  const query = {} as any;
  if (keyword !== '') {
    query.eduClassName = keyword;
  }

  query.kdtId = kdtId;
  page.pageNumber = page.current;

  return getEduClassListAPI({
    query,
    page,
  }).then(res => {
    const options = res.content.map(item => {
      return {
        text: get(item, 'eduClass.eduClassName'),
        value: get(item, 'eduClass.eduClassNo'),
      };
    });

    if (page && page.current === 1) {
      options.unshift({ text: '全部', value: -1 });
    }

    return {
      options,
      pageInfo: {
        current: get(res, 'pageable.pageNumber', 1),
        pageSize: get(res, 'pageable.pageSize', 1),
        total: get(res, 'total', 1),
      },
    };
  });
};

const getTeacherList = (keyword: string, pageRequest: any) => {
  const kdtId = _global.kdtId;
  pageRequest.pageNumber = pageRequest.current;
  return findPage({ query: { keyword, kdtId }, pageRequest }).then(res => {
    const options = res.content.map(item => {
      const teacherShowName = item.teacherName
        ? `${item.staffName}(${item.teacherName})`
        : item.staffName;
      return {
        text: teacherShowName,
        value: get(item, 'resource.resourceNo'),
      };
    });

    return {
      options,
      pageInfo: {
        current: get(res, 'pageable.pageNumber', 1),
        pageSize: get(res, 'pageable.pageSize', 1),
        total: get(res, 'total', 1),
      },
    };
  });
};

const getAssistantList = (keyword: string, pageRequest: any) => {
  const kdtId = _global.kdtId;
  pageRequest.pageNumber = pageRequest.current;

  return findAssistantPage({ query: { keyword, kdtId }, pageRequest }).then(res => {
    const options = res.content.map(item => {
      const teacherShowName = item.teacherName
        ? `${item.staffName}(${item.teacherName})`
        : item.staffName;
      return {
        text: teacherShowName,
        value: get(item, 'resource.resourceNo'),
      };
    });

    return {
      options,
      pageInfo: {
        current: get(res, 'pageable.pageNumber', 1),
        pageSize: get(res, 'pageable.pageSize', 1),
        total: get(res, 'total', 1),
      },
    };
  });
};

const getStoreList = (keyword: string = '', pageRequest: any) => {
  pageRequest.pageNumber = pageRequest.current;
  return getStoreListAPI({ keyword, pageRequest }).then((res = []) => {
    const options = res.map(item => {
      return {
        text: item.name,
        value: item.id,
      };
    });

    if (pageRequest && pageRequest.current === 1) {
      options.unshift({
        text: '全部',
        value: -1,
      });
    }

    return {
      options,
      pageInfo: {
        current: get(res, 'pageable.pageNumber', 1),
        pageSize: get(res, 'pageable.pageSize', 1),
        total: get(res, 'total', 1),
      },
    };
  });
};

const getClassrooms = (keyword = '', pageRequest) => {
  const kdtId = _global.kdtId;

  const query = {} as any;
  if (keyword !== '') {
    query.classroomName = keyword;
  }

  query.kdtId = kdtId;
  pageRequest.pageNumber = pageRequest.current;
  return getClassroomsAPI({
    query,
    pageRequest,
  }).then(res => {
    const options = res.content.map(item => {
      return {
        text: item.classroomName,
        value: get(item, 'classroomNo'),
      };
    });

    if (pageRequest && pageRequest.current === 1) {
      options.unshift({ text: '全部', value: -1 });
    }

    return {
      options,
      pageInfo: {
        current: get(res, 'pageable.pageNumber', 1),
        pageSize: get(res, 'pageable.pageSize', 1),
        total: get(res, 'total', 1),
      },
    };
  });
};

const exportSigninRecord = (store: StateType) => {
  const sort = get(store, 'tableData.pageable.sort') || { orders: [] };
  let query = formatQuery(store);
  const time = store.startTime;
  query = {
    ...query,
    ...{
      sort: sort,
      startTime: startOfDay(time).getTime(),
      endTime: endOfDay(time).getTime(),
    },
  };
  exportRecord({
    query,
  })
    .then(resp => {
      if (resp) {
        Notify.success('导出成功');
        window.open(getExportRecordUrl({ type: EXPORT_RECORD_TYPES.SCHEDULE_SIGNED_LIST }));
      }
    })
    .catch(e => {
      Notify.error(e);
    });
};

const exportSchedule = (store: StateType) => {
  const { type, data: viewData, tableData: listData } = store;
  if ((type === 'view' && !Object.keys(viewData).length) || (type === 'list' && !listData.total)) {
    Notify.error('暂无日程，请重新选择再导出课表');
    return;
  }

  const query = formatQuery(store);
  const notifyId = Notify.success('正在申请导出....');
  exportSchedulesAPI(query)
    .then(() => {
      Notify.clear(notifyId);
      Notify.success('导出请求成功!');
      window.open(getExportRecordUrl({ type: EXPORT_RECORD_TYPES.SCHEDULE_COURSE_LIST }));
    })
    .catch(e => {
      Notify.clear(notifyId);
      Notify.error(e || '导出请求失败！');
    });
};

const getFilterConfig = (project: string = ''): FilterConfigType => {
  let options = [
    {
      name: 'eduCourseName',
      label: '课程名称：',
      type: 'Input',
    },
    {
      name: 'lessonName',
      label: '课节名称：',
      type: 'Input',
    },
    {
      name: 'classNo',
      label: '班级：',
      type: 'Custom',
      renderField: Select,
      defaultValue: -1,
      inheritProps: {
        filter: true,
        mode: 'async',
        fetchOnMounted: true,
        fetchOptions: getEduClassList,
      },
    },
    {
      name: 'teacherNos',
      label: '老师：',
      type: 'Custom',
      renderField: Select,
      defaultValue: [],
      inheritProps: {
        filter: true,
        mode: 'async',
        fetchOnMounted: true,
        tags: true,
        fetchOptions: getTeacherList,
        placeholder: '请选择',
        displayNum: 2,
      } as IEbizSelectProps,
    },
    {
      name: 'assistantNos',
      label: '助教：',
      type: 'Custom',
      renderField: Select,
      defaultValue: [],
      inheritProps: {
        filter: true,
        mode: 'async',
        fetchOnMounted: true,
        tags: true,
        fetchOptions: getAssistantList,
        placeholder: '请选择',
        displayNum: 2,
      } as IEbizSelectProps,
    },
    {
      name: 'addressId',
      label: '上课地点：',
      type: 'Custom',
      renderField: Select,
      defaultValue: -1,
      inheritProps: {
        filter: true,
        mode: 'async',
        fetchOnMounted: true,
        fetchOptions: getStoreList,
      },
    },
    {
      name: 'kdtId',
      label: '上课校区：',
      type: 'Custom',
      renderField: ShopChoose,
      inheritProps: {
        create: false,
        refresh: false,
        placeholder: '全部',
      },
    },
    {
      name: 'classroomNo',
      label: '教室：',
      type: 'Custom',
      renderField: Select,
      defaultValue: -1,
      inheritProps: {
        filter: true,
        mode: 'async',
        fetchOnMounted: true,
        fetchOptions: getClassrooms,
      },
    },
    {
      name: 'appointRule',
      label: '预约规则：',
      type: 'Custom',
      renderField: Select,
      defaultValue: -1,
      inheritProps: {
        options: [
          {
            text: '全部',
            value: -1,
          },
          {
            text: '需预约',
            value: 1,
          },
          {
            text: '无需预约',
            value: '0',
          },
        ],
      },
    },
    {
      name: 'isTrial',
      label: '日程类型：',
      type: 'Custom',
      renderField: Select,
      defaultValue: -1,
      inheritProps: {
        options: [
          {
            text: '全部',
            value: -1,
          },
          {
            text: '试听课日程',
            value: 1,
          },
          {
            text: '正式课日程',
            value: '0',
          },
        ],
      },
    },
  ];

  if (!chainSupportOnlySingle) {
    const idx = options.findIndex(v => v.name === 'addressId');
    if (idx !== -1) {
      options.splice(idx, 1);
    }
  }

  if (project === 'educlass' || !chainSupportOnlyHq) {
    const idx = options.findIndex(v => v.name === 'kdtId');
    if (idx !== -1) {
      options.splice(idx, 1);
    }
  }

  if (project === 'educlass') {
    const idx = options.findIndex(v => v.name === 'classNo');
    if (idx !== -1) {
      options.splice(idx, 1);
    }
  }

  return options as FilterConfigType;
};

export interface IScheduleFilterProps {
  store: StateType;
  dispatch: DispatchType;
  onSearch: (params: any) => void;
  project?: string;
  selectComponent: any;
}

export default (props: IScheduleFilterProps) => {
  const { project, store, onSearch, dispatch, selectComponent } = props;

  const filterConfig = useMemo(() => getFilterConfig(project), [project]);
  return (
    <div className="panel__filter__expand">
      {store.type === 'list' && (
        <div className="panel__filter__expand-time">
          <label>上课时间：</label>
          <Select
            className="panel__filter__expand-time-select"
            value={store.scheduleType}
            onChange={value => dispatch({
              type: 'setFilter',
              value: {
                scheduleType: value[0],
                data: {},
                endTime: date.travel(30, store.startTime, 'day'),
                pageNumber: 1,
              } as any,
            })
            }
            options={selectOptions}
          ></Select>
          {selectComponent[store.scheduleType]}
        </div>
      )}
      <EasyList.Filter
        config={filterConfig}
        actionsOption={{
          beforeReset: (
            <>
              {store.scheduleType === 'day' && (
                <SamButton name="编辑" outline onClick={() => exportSigninRecord(store)}>
                  导出签到表
                </SamButton>
              )}
              {store.scheduleType === 'week' && (
                <SamButton name="编辑" outline onClick={() => exportSchedule(store)}>
                  导出课表
                </SamButton>
              )}

              {store.scheduleType !== 'month' && (
                <ExportRecordLink
                  exportType={
                    store.scheduleType === 'day'
                      ? EXPORT_RECORD_TYPES.SCHEDULE_SIGNED_LIST
                      : EXPORT_RECORD_TYPES.SCHEDULE_COURSE_LIST
                  }
                  className="exported-list-view"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  查看已导出列表
                </ExportRecordLink>
              )}
            </>
          ),
        }}
        onSubmit={onSearch}
      />
    </div>

  );
};
