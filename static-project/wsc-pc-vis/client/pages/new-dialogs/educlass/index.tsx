import { Pop, Form } from '@zent/compat';
import React, { Component } from 'react';
import { BlockLoading, Button, Notify } from 'zent';
import _findIndex from 'lodash/findIndex';
import { ValuntaryAsyncSelect } from 'components/valuntary-async-select/ValuntaryAsyncSelect';

import { getCourseList, createClass, updateClass } from './api';
import { findPageByEduCourse } from '../../edu-admin/api/educourse';
import parseDate from 'zan-utils/date/parseDate';
import formatDate from 'zan-utils/date/formatDate';

import { chainSupportOnlyHqShowWrapper } from './chain';
import { getShopList } from '@ability-center/shop/shop-choose';
import { IEduClassProps, IEduClassState } from './types';
import './index.scss';

const {
  createForm,
  getControlGroup,
  FormInputField,
  FormDatePickerField,
  Field,
  FormNumberInputField,
} = Form;
const AsyncSelectField = getControlGroup(ValuntaryAsyncSelect);
const CSAddEduclassClassInputField: any = chainSupportOnlyHqShowWrapper(Field);
// const dayMs = 1 * 24 * 60 * 60 * 1000;

class EduClassDialogContent extends Component<IEduClassProps, IEduClassState> {
  static defaultProps = {
    defaultData: {},
    callback: () => {},
  };

  constructor(props) {
    super(props);

    this.state = {
      isEdit: false,
      submitLoading: false,
      eduClassName: '',
      kdtId: 0,
      eduCourseId: '',
      eduCourseName: '',
      startTime: '',
      endTime: '',
      maxStuNum: '',
      currentStuNum: 0,
      shopName: '',
    };

    this.initDefaultData(props);
  }
  onSubmit = values => {
    const { close, callback, defaultData, onClassCallback } = this.props;
    const { isEdit } = this.state;
    const { eduClass } = defaultData;
    this.setState({ submitLoading: true });
    if (isEdit) {
      const { startTime, endTime } = values;
      const description = startTime + '至' + endTime;
      const nextClass = {
        id: eduClass.id,
        eduClassName: values.eduClassName,
        endTime: values.endTime + ' 23:59:59',
        maxStuNum: values.maxStuNum && Math.round(values.maxStuNum),
        kdtId: values.kdtId || _global.kdtId,
      };
      const nextClassInfo = {
        ...nextClass,
        endTime: new Date(nextClass.endTime).getTime(),
        eduCourseId: values.eduCourseId,
        description,
      };
      updateClass(nextClass)
        .then(() => {
          this.setState({ submitLoading: false });
          Notify.success('修改班级成功');
          close();
          callback();
          onClassCallback && onClassCallback(nextClassInfo);
        })
        .catch(error => {
          this.setState({ submitLoading: false });
          Notify.error(error);
        });
    } else {
      createClass({
        eduClassName: values.eduClassName,
        eduCourseId: values.eduCourseId,
        startTime: values.startTime + ' 00:00:00',
        endTime: values.endTime + ' 23:59:59',
        maxStuNum: values.maxStuNum && Math.round(values.maxStuNum),
        kdtId: values.kdtId || _global.kdtId,
      })
        .then(() => {
          this.setState({ submitLoading: false });
          Notify.success('新建班级成功');
          close();
          callback();
        })
        .catch(error => {
          this.setState({ submitLoading: false });
          Notify.error(error);
        });
    }
  };

  onChange = (value, key: keyof IEduClassState) => {
    if (key === 'eduCourseId') {
      this.setState({
        kdtId: '',
      });
    }

    this.setState({ [key]: value } as Pick<IEduClassState, keyof IEduClassState>);
  };

  getEduCourseOptions = (query, pageRequest) => {
    const { eduCourseId, eduCourseName } = this.state;

    return getCourseList({
      query: { name: query, isTrial: 0 },
      pageRequest,
    }).then(({ content = [] }) => {
      const options = content.map(item => {
        return {
          text:
            item.name.length >= 9 ? (
              <Pop trigger="hover" content={item.name}>
                <span className="course-name">{item.name}</span>
              </Pop>
            ) : (
              item.name
            ),
          value: item.id,
        };
      });

      const findCurrentEduCourseId =
        _findIndex(options, (o: any) => {
          return o.value === eduCourseId;
        }) > -1;

      // 为了回显创建班级情况下的 课程信息
      if (!findCurrentEduCourseId && eduCourseId) {
        return [
          ...options,
          {
            text: eduCourseName,
            value: eduCourseId,
          },
        ];
      }

      return options;
    });
  };

  getShopNameList = (query, pageRequest) => {
    const { kdtId, shopName } = this.state;
    return getShopList({
      query,
      pageRequest,
      addAll: false,
      fetchApi: () => {
        return findPageByEduCourse({
          eduCourseShopQuery: {
            id: this.state.eduCourseId,
            name: query,
            kdtId: _global.kdtId,
          },
          pageRequest,
        });
      },
      cb: options => {
        const findCurrentId =
          _findIndex(options, (o: any) => {
            return o.value === kdtId;
          }) > -1;

        // 为了回显创建班级情况下的 课程信息
        if (!findCurrentId && kdtId) {
          options.push({
            text: shopName,
            value: kdtId,
          });
        }
      },
    });
  };

  initDefaultData = props => {
    const { defaultData = {} } = props;

    // createDefault 新建页面时传入的默认数据
    const { eduClass = {}, classStat = {}, shopName, kdtId, createDefault = {} } = defaultData;
    if (eduClass.eduClassName) {
      // eslint-disable-next-line react/no-direct-mutation-state
      this.state = Object.assign(this.state, {
        isEdit: true,
        eduClassName: eduClass.eduClassName,
        eduCourseId: eduClass.eduCourseId,
        shopName: shopName, // 回显使用
        kdtId,
        eduCourseName: eduClass.eduCourseName, // 回显使用
        startTime: formatDate(eduClass.startTime, 'YYYY-MM-DD'),
        endTime: formatDate(eduClass.endTime, 'YYYY-MM-DD'),
        maxStuNum: eduClass.maxStuNum,
        currentStuNum: classStat.currentStuNum,
      });
    }

    if (createDefault.eduCourseId) {
      // eslint-disable-next-line react/no-direct-mutation-state
      this.state = Object.assign(this.state, {
        eduCourseId: +createDefault.eduCourseId,
        eduCourseName: createDefault.eduCourseName, // 回显使用
        shopName: createDefault.shopName, // 回显使用
        kdtId: createDefault.kdtId,
      });
    }
  };

  componentDidMount() {
    // this.initDefaultData();
  }

  render() {
    const {
      isEdit,
      eduClassName,
      eduCourseId,
      eduCourseName,
      shopName,
      startTime,
      endTime,
      maxStuNum,
      currentStuNum,
      submitLoading,
      kdtId,
    } = this.state;
    const { handleSubmit, close } = this.props;

    return (
      <BlockLoading>
        <div className="class-dialog-form">
          <Form horizontal onSubmit={handleSubmit(this.onSubmit)}>
            <FormInputField
              name="eduClassName"
              type="text"
              label="班级名称："
              value={eduClassName}
              width="180px"
              required
              validations={{ required: true, maxLength: 20 }}
              validationErrors={{
                required: '班级名称必须填写，最多20个字',
                maxLength: '班级名称必须填写，最多20个字',
              }}
            />
            <Field
              name="eduCourseId"
              label="所属课程："
              component={AsyncSelectField}
              value={eduCourseId}
              disabled={isEdit}
              fetchOnLoad
              width="180px"
              getOptions={this.getEduCourseOptions}
              placeholder={isEdit ? eduCourseName : '请选择课程'}
              autoWidth={true}
              required
              onAdd={() => window.open('//www.youzan.com/v4/vis/edu/page/educourse#/add')}
              validations={{ required: true }}
              validationErrors={{
                required: '请选择课程',
              }}
              onChange={value => this.onChange(value.target.value, 'eduCourseId')}
            />
            <CSAddEduclassClassInputField
              name="kdtId"
              label="上课校区："
              component={AsyncSelectField}
              fetchOnLoad
              value={kdtId}
              disabled={isEdit || !eduCourseId}
              width="180px"
              getOptions={this.getShopNameList}
              create={false}
              refresh={false}
              placeholder={isEdit ? shopName : '请选择校区'}
              autoWidth={true}
              required
              asyncValidation={(_, value) => {
                if (value) return Promise.resolve();
                return Promise.reject('请选择校区');
              }}
              onChange={value => this.onChange(value.target.value, 'kdtId')}
            />

            <FormDatePickerField
              name="startTime"
              label="开班日期："
              value={startTime}
              disabled={isEdit}
              onChange={value => this.onChange(value, 'startTime')}
              width="180px"
              validations={{ required: true }}
              validationErrors={{
                required: '请选择开班日期',
              }}
              required
            />
            <FormDatePickerField
              name="endTime"
              label="结班日期："
              value={endTime}
              disabled={!startTime && !isEdit}
              onChange={value => this.onChange(value, 'endTime')}
              width="180px"
              validations={{
                required: true,
                min: (_, value) =>
                  +parseDate(value, 'YYYY-MM-DD') >= +parseDate(startTime, 'YYYY-MM-DD'),
              }}
              validationErrors={{
                required: '请选择结班日期',
                min: '结班日期必须大于开班日期',
              }}
              min={
                isEdit
                  ? new Date(+parseDate(endTime, 'YYYY-MM-DD'))
                  : new Date(+parseDate(startTime, 'YYYY-MM-DD'))
              }
              required
            />
            <FormNumberInputField
              name="maxStuNum"
              label="人数上限："
              min={1}
              max={99999}
              showStepper
              value={maxStuNum}
              width="180px"
              validations={{
                required: true,
                range: (_, value) => value > 0 && value < 100000,
                min: (_, value) => !isEdit || value >= currentStuNum,
              }}
              validationErrors={{
                required: '人数必须填写，最大不能超过99999',
                range: '人数不能为0，最大不能超过99999',
                min: `人数上限不能小于当前人数${currentStuNum}`,
              }}
              required
            />
            <div className="class-dialog-form__actions">
              <Button type="primary" outline onClick={close}>
                取消
              </Button>
              <Button type="primary" htmlType="submit" loading={submitLoading}>
                保存
              </Button>
            </div>
          </Form>
        </div>
      </BlockLoading>
    );
  }
}

const wrapped = createForm()(EduClassDialogContent);

export default wrapped;