
import { Form } from '@zent/compat';
import React, { Component } from 'react';
import { hashHistory } from 'react-router';
import { Button, Notify } from 'zent';
import { Button as SamButton } from '@youzan/sam-components';
import { switchWrapper } from 'fns/chain';
import DateRangeQuickPickerField from '../../../../components/date-range-quick-picker';
import { ShopChooseControll } from '@ability-center/shop/shop-choose';
import { RESERVE_ORIGIN, PAGE_URL_MAP, COURSE_TYPE_OPTION } from '../../../../constants';
import { getCourseList } from '../../../../api/index';
import VersionWrapper from 'fns/version';

const { createForm, Field, FormInputField, FormSelectField } = Form;

let weekDay = new Date().getDay();
if (weekDay === 0) weekDay = 7; // 周日的时候为0重置下

class ReserveSearch extends Component {
  onSubmit = () => {
    this.props.onSearch(this.genSearchParam());
    this.pushQuery();
  };

  pushQuery() {
    const { filter } = this.props;
    const location = hashHistory.getCurrentLocation();
    const query = location.query;
    if (filter.teacherName && filter.teacherName !== query.teacherName) {
      location.query = { ...location.query, teacherName: filter.teacherName };
    }
    const courseType = parseInt(filter.courseType);
    if (courseType >= 0 && courseType !== parseInt(query.courseType)) {
      location.query = { ...location.query, courseType };
    }
    if (filter.startTime && filter.startTime !== query.startTime) {
      location.query = { ...location.query, startTime: filter.startTime };
    }
    if (filter.endTime && filter.endTime !== query.endTime) {
      location.query = { ...location.query, endTime: filter.endTime };
    }

    hashHistory.replace(location);
  }

  exportClick = () => {
    const { zentForm } = this.props;
    if (!zentForm.isValid) return;
    const param = this.genSearchParam();
    if (!param.startTime || !param.endTime) {
      return Notify.error('请选择需要导出的开始和结束时间');
    }
    this.props.onSearch(param);
    this.props.exportData(param);
  };

  genSearchParam = () => {
    const { zentForm } = this.props;
    const values = zentForm.getFormValues();
    const { time = [], kdtId } = values;
    const param = { ...values, startTime: +time[0] || '', endTime: +time[1] || '', kdtId: kdtId || _global.kdtId };
    delete param.time;
    return param;
  };

  getEduCourseOptions = (query, pageRequest) => {
    return getCourseList({
      query: { name: query },
      pageRequest,
    }).then(({ content = [], total, pageable }) => {
      const options = content.map(item => {
        return {
          text: item.name,
          value: item.id,
        };
      });
      if (pageRequest.pageNumber === 1) {
        // options.unshift({ text: '全部', value: '' });
      }

      return options;
    });
  };

  renderSchoolField = () => {
    return switchWrapper({
      supportBranchStore: (isBranchStore) => {
        return null;
      },
      supportHqStore: (isHqStore) => {
        return <Field
          className="inline-block"
          name="kdtId"
          label="上课校区："
          component={ShopChooseControll}
          width="155px"
          create={false}
          refresh={false}
          placeholder={'请选择校区'}
        />;
      },
      defaultCpn: () => {
        return <FormInputField
          className="inline-block"
          name="address"
          type="text"
          label="上课地点:"
        />;
      },
    });
  };

  render() {
    const { loading, handleSubmit, exportLoading, filter,
      onTeacherChange,
      onCourseTypeChange, onTimeChange, disableReserveTime = false, disableExport = false } = this.props;

    return (
      <div className="reserve-search">
        <div className="reserve-search__wrapper">
          <Form horizontal onSubmit={handleSubmit(this.onSubmit)}>
            {!disableReserveTime && <Field
              name="time"
              label="预约时间:"
              component={DateRangeQuickPickerField}
              value={[filter?.startTime, filter?.endTime]}
              onChange={onTimeChange}
              dateFormat="YYYY-MM-DD HH:mm:ss"
              preset={[
                {
                  text: '今',
                  value: [0, 1],
                },
                {
                  text: '明',
                  value: [1, 2],
                },
                {
                  text: '本周',
                  value: [1 - weekDay, 8 - weekDay],
                },
                {
                  text: '下周',
                  value: [8 - weekDay, 15 - weekDay],
                },
              ]}
            />}
            <div className="form-field-wrap">
              <FormSelectField
                className="inline-block"
                name="appointmentSource"
                label="预约来源:"
                placeholder="全部"
                width="169px"
                autoWidth
                data={RESERVE_ORIGIN}
              />
              {!disableReserveTime && <FormInputField
                className="inline-block"
                name="studentName"
                type="text"
                label="学员姓名:"
              />}
              <FormInputField
                className="inline-block"
                name="customerName"
                type="text"
                label="学员家长:"
              />
              <FormInputField
                className="inline-block"
                name="phoneNo"
                value={filter?.phoneNo}
                type="text"
                label="手机号码:"
                validations={{
                  isNumeric: true,
                }}
                validationErrors={{
                  isNumeric: '手机号码格式不正确',
                }}
              />
              <FormSelectField
                className="inline-block"
                name="courseType"
                label="线下课类型:"
                placeholder="全部"
                width="169px"
                autoWidth
                value={filter?.courseType || ''}
                onChange={onCourseTypeChange}
                data={COURSE_TYPE_OPTION}
              />
              <FormInputField
                className="inline-block"
                name="courseName"
                type="text"
                label="线下课名称:"
              />
              <VersionWrapper name="appointment-list-action">
                <FormInputField
                  className="inline-block"
                  name="teacherName"
                  type="text"
                  label="老师姓名:"
                  value={filter?.teacherName || ''}
                  onChange={onTeacherChange}
                />
              </VersionWrapper>
              { this.renderSchoolField() }
              <FormInputField
                className="inline-block"
                name="contractName"
                type="text"
                label="课节内容:"
              />
              <FormInputField
                className="inline-block"
                name="originData"
                type="text"
                label="预约人:"
              />
            </div>
            <div className="form-actions">
              <Button type="primary" htmlType="submit" loading={loading}>
                筛选
              </Button>
              {!disableExport && <><SamButton name="导出报表" onClick={this.exportClick} loading={exportLoading}>
                导出报表
              </SamButton>
              <SamButton name="导出报表" onClick={() => window.open(PAGE_URL_MAP.exportDataPage)}>
                查看已生成的报表
              </SamButton></>}
              <span className="operation" onClick={() => {
                this.props.zentForm && this.props.zentForm.resetFieldsValue();
                this.props.onSearch();
              }}>
                重置筛选条件
              </span>
            </div>
          </Form>
        </div>
      </div>
    );
  }
}

const WrappedForm = createForm()(ReserveSearch);

export default WrappedForm;
