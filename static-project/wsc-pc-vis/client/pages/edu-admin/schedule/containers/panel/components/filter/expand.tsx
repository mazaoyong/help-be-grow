
import { Select, Form } from '@zent/compat';
import React, { Component } from 'react';
import { Button, Notify } from 'zent';
import { debounce, get } from 'lodash';
import { showWrapper } from 'fns/chain';
import { StateType, DispatchType } from '../../store';
import AsyncSelectField from 'components/valuntary-async-select';
import { Button as SamButton } from '@youzan/sam-components';
import { date } from '@youzan/utils';
import { ShopChooseControll } from '@ability-center/shop/shop-choose';
import { chainSupportOnlyHq, chainSupportOnlySingle } from '../../../../chain';
import { formatQuery } from '../../format';
import ExportRecordLink, { getExportRecordUrl, EXPORT_RECORD_TYPES } from '@ability-center/ump/export-record';

import {
  findPage,
  getStoreListAPI,
  getClassroomsAPI,
  getEduClassListAPI,
  exportSchedulesAPI,
  exportRecord,
} from '../../../../api';
import { startOfDay, endOfDay } from 'date-fns';

const { createForm, Field, FormInputField, FormSelectField } = Form as any;

const ChainHqField = showWrapper(chainSupportOnlyHq, Field);
const ChainSingleSelectField = showWrapper(chainSupportOnlySingle, FormSelectField);

interface IFilterExpandProps {
  store: StateType;
  dispatch: DispatchType;
  onSearch: (params: any) => void;
  zentForm: any;
  handleSubmit: any;
  project?: string;
  selectComponent: any;
}

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

const appointRuleOptions = [
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
    value: 0,
  },
];
const scheduleOptions = [
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
    value: 0,
  },
];

class FilterExpand extends Component<IFilterExpandProps, any> {
  readonly state = {
    classes: [{ text: '全部', value: '' }],
    teacherList: [{ text: '全部', value: '' }],
    storeList: [{ text: '全部', value: '' }],
    kdtId: this.props.store.kdtId || _global.kdtId,
  };

  componentDidMount() {
    this.initialFormValue();
    this.getStoreList();
    // this.getTeacherList();
  }

  initialFormValue() {
    const {
      eduCourseName,
      lessonName,
      classNo,
      teacherNo,
      addressId,
      classroomNo,
      appointRule,
      isTrial,
      kdtId,
    } = this.props.store;

    this.props.zentForm.initialize({
      eduCourseName,
      lessonName,
      classNo,
      teacherNo,
      addressId,
      classroomNo,
      appointRule,
      kdtId,
      isTrial,
    });
  }

  // 搜索老师
  getTeacherList = (keyword: string, pageRequest: any) => {
    const { kdtId } = this.state;
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

      if (pageRequest && pageRequest.pageNumber === 1) {
        options.unshift({
          text: '全部',
          value: -1,
        });
      }

      return options;
    });
  };

  // 搜索上课地点
  getStoreList = debounce((keyword?: string) => {
    getStoreListAPI({ keyword }).then((res = []) => {
      const options = res.map(item => {
        return {
          text: item.name,
          value: item.id,
        };
      });

      options.unshift({
        text: '全部',
        value: -1,
      });

      this.setState({
        storeList: options,
      });
    });
  }, 300);

  // 搜索班级
  getEduClassList = (keyword = '', page) => {
    const { kdtId } = this.state;

    const query = {} as any;
    if (keyword !== '') {
      query.eduClassName = keyword;
    }

    query.kdtId = kdtId;

    return getEduClassListAPI({
      query,
      page,
    }).then(({ content = [] }) => {
      const options = content.map(item => {
        return {
          text: get(item, 'eduClass.eduClassName'),
          value: get(item, 'eduClass.eduClassNo'),
        };
      });

      if (page.pageNumber === 1) {
        options.unshift({ text: '全部', value: -1 });
      }

      return options;
    });
  };

  // 搜索教室
  getClassrooms = (keyword = '', pageRequest) => {
    const { kdtId } = this.state;
    const query = {} as any;
    if (keyword !== '') {
      query.classroomName = keyword;
    }

    query.kdtId = kdtId;

    return getClassroomsAPI({
      query,
      pageRequest,
    }).then(({ content = [] }) => {
      const options = content.map(item => {
        return {
          text: item.classroomName,
          value: get(item, 'classroomNo'),
        };
      });

      if (pageRequest.pageNumber === 1) {
        options.unshift({ text: '全部', value: -1 });
      }

      return options;
    });
  };

  // 触发筛选
  onSearch = data => {
    this.props.onSearch(data);
  };

  onReset = () => {
    const init = {
      eduCourseName: '',
      addressId: -1,
      appointRule: -1,
      isTrial: -1,
      classNo: -1,
      classroomNo: -1,
      lessonName: '',
      teacherNo: -1,
      kdtId: _global.kdtId,
    };

    const { zentForm } = this.props;
    zentForm.resetFieldsValue(init);
    // reset 是异步的，需要手动初始化查询
    this.props.onSearch(init);
  };

  // 切换 / 清空上课校区
  handleKdtId = (_, val) => {
    // 清空时将 kdtId 赋值成总部
    const kdtId = val || _global.kdtId;

    this.setState({
      kdtId: kdtId,
    });

    const init = {
      classNo: -1,
      classroomNo: -1,
      teacherNo: -1,
      kdtId: kdtId,
    };

    const { zentForm } = this.props;

    const originValue = zentForm.getFormValues();

    zentForm.resetFieldsValue(Object.assign({}, originValue, init));
  };

  exportSigninRecord = () => {
    const { store } = this.props;
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

  exportSchedule = () => {
    const { store } = this.props;
    const { type, data: viewData, tableData: listData } = store;
    if (
      (type === 'view' && !Object.keys(viewData).length) ||
      (type === 'list' && !listData.total)
    ) {
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

  render() {
    const { storeList } = this.state;
    const { handleSubmit, store, dispatch, selectComponent } = this.props;
    return (
      <div className="panel__filter__expand">
        {store.type === 'list' && (
          <div className="panel__filter__expand-time">
            <label>上课时间：</label>
            <Select
              className="panel__filter__expand-time-select"
              value={store.scheduleType}
              onChange={e =>
                dispatch({
                  type: 'setFilter',
                  value: {
                    scheduleType: e.target.value,
                    data: {},
                    endTime: date.travel(30, store.startTime, 'day'),
                    pageNumber: 1,
                  } as any,
                })
              }
              data={selectOptions}
            ></Select>
            {selectComponent[store.scheduleType]}
          </div>
        )}
        <Form inline disableEnterSubmit={false} onSubmit={handleSubmit(this.onSearch)}>
          <FormInputField
            name="eduCourseName"
            type="text"
            width="160px"
            label="课程名称："
            placeholder=""
            autoComplete="off"
          />
          <FormInputField
            name="lessonName"
            type="text"
            width="160px"
            label="课节名称："
            placeholder=""
            value=""
            autoComplete="off"
          />
          {this.props.project !== 'educlass' && (
            <Field
              name="classNo"
              label="班级："
              width="160px"
              create={false}
              refresh={false}
              fetchOnLoad={true}
              hideClose
              component={AsyncSelectField}
              getOptions={this.getEduClassList}
            />
          )}

          <Field
            name="teacherNo"
            label="老师："
            width="160px"
            create={false}
            refresh={false}
            fetchOnLoad={true}
            hideClose
            placeholder="全部"
            component={AsyncSelectField}
            getOptions={this.getTeacherList}
          />

          <ChainSingleSelectField
            name="addressId"
            label="上课地点："
            placeholder="全部"
            width="160px"
            data={storeList}
            onAsyncFilter={this.getStoreList}
          />

          {this.props.project !== 'educlass' && (
            <ChainHqField
              name="kdtId"
              label="上课校区："
              width="160px"
              create={false}
              refresh={false}
              hideClose
              fetchOnLoad={true}
              component={ShopChooseControll}
              valueChange={this.handleKdtId}
            />
          )}

          <Field
            name="classroomNo"
            label="教室："
            create={false}
            hideClose
            refresh={false}
            fetchOnLoad={true}
            width="160px"
            component={AsyncSelectField}
            getOptions={this.getClassrooms}
          />
          <FormSelectField
            name="appointRule"
            label="预约规则："
            width="160px"
            data={appointRuleOptions}
            onChange={val =>
              this.props.dispatch({
                type: 'setFilter',
                value: { appointRule: val },
              })
            }
          />
          <FormSelectField
            name="isTrial"
            label="日程类型："
            width="160px"
            data={scheduleOptions}
            onChange={val =>
              this.props.dispatch({
                type: 'setFilter',
                value: { isTrial: val },
              })
            }
          />
          <div className="operatot">
            <Button type="primary" htmlType="submit">
              筛选
            </Button>
            {store.scheduleType === 'day' && (
              <SamButton name="编辑" outline onClick={() => this.exportSigninRecord()}>
                导出签到表
              </SamButton>
            )}
            {store.scheduleType === 'week' && (
              <SamButton name="编辑" outline onClick={() => this.exportSchedule()}>
                导出课表
              </SamButton>
            )}
            {store.scheduleType !== 'month' && (
              <ExportRecordLink
                exportType={
                  store.scheduleType === 'day' ? EXPORT_RECORD_TYPES.SCHEDULE_SIGNED_LIST : EXPORT_RECORD_TYPES.SCHEDULE_COURSE_LIST
                }
                className="cursor-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                查看已导出列表
              </ExportRecordLink>
            )}
            <span className="cursor-link" onClick={this.onReset}>
              重置筛选条件
            </span>
          </div>
        </Form>
      </div>
    );
  }
}

export default createForm()(FilterExpand);
