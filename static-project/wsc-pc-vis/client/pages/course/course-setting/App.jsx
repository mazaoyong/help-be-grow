import { Form } from '@zent/compat';
import React, { Component } from 'react';

import { BlockLoading, Notify } from 'zent';
import { Button as SamButton } from '@youzan/sam-components';
import { isEduHqStore, isEduSingleStore } from '@youzan/utils-shop';
import { arrayWrapper } from 'fns/chain';

import './style.scss';
import FieldSwitch from './components/FieldSwitch';
import getCourseSettingConfigs from './conf';
import buttonConf from './buttonconf';
import tradeCarouselConf from './trade-carousel-conf';
import get from 'lodash/get';
import { ArthurContainer, useArthurModel, model2filter } from '@youzan/arthur-scheduler-react';
import courseSettingFilter from '@arthur/filters/course/course-setting-filter';
import courseSettingFilters from '@arthur/filters/course-setting';
import { saveCourseSettings, findCourseSettings } from './api';
import { useCheckInfoHidden } from '@ability-center/course';

const { createForm, Field, FormInputField } = Form;

const getChainSettingConf = (overrideConfigs) => arrayWrapper(
  {
    1: isEduSingleStore || isEduHqStore,
  },
  getCourseSettingConfigs(overrideConfigs),
);

// 将后端传来的自定义按钮配置array转化为object
const getbuttonCustomDescMap = (customDescList) => {
  const buttonCustomDescMap = {};
  customDescList.forEach((item) => {
    if (item.coursePriceType === 'ZERO') {
      buttonCustomDescMap['ZERO'] = item.desc;
    } else if (item.coursePriceType === 'NON_ZERO') {
      buttonCustomDescMap['NON_ZERO'] = item.desc;
    }
  });
  return buttonCustomDescMap;
};

class CourseSettings extends Component {
  state = {
    loading: false,
    data: {},
    buttonCustomDescMap: {},
  };

  componentDidMount() {
    // 初始化默认选项
    const defaultData = {};
    this.props.chainSettingConf.forEach((item) => {
      defaultData[item.key] = item.value;
    });
    defaultData[buttonConf.key] = buttonConf.value; // 初始化自定义按钮选项
    defaultData[tradeCarouselConf.key] = tradeCarouselConf.value; // 初始化跑马灯选项
    this.setState({ data: defaultData });
    this.setState({ buttonCustomDescMap: getbuttonCustomDescMap(buttonConf.customDescList) }); // 初始化按钮文本设置

    // 获取课程设置
    findCourseSettings()
      .then((data) => {
        if (!data || data.length === 0) {
          return;
        }
        data.forEach((item) => {
          if (get(item, 'courseBuyOperationSwitch.customDescList').length !== 0) {
            // 获取自定义按钮设置
            this.setState({
              buttonCustomDescMap: getbuttonCustomDescMap(
                get(item, 'courseBuyOperationSwitch.customDescList'),
              ),
            });
          }
          defaultData[item.settingIdentity] = item.status;
        });
        this.setState({ data: defaultData });
      })
      .catch((err) => Notify.error(err || '获取数据失败'));
  }

  handleSubmit = (data) => {
    const submitData = [];
    Object.keys(data).forEach((key) => {
      if (key === buttonConf.key) {
        submitData.push({
          settingIdentity: key,
          status: data[key],
          courseBuyOperationSwitch: {
            customDescList: [
              {
                coursePriceType: 'ZERO',
                desc: data.zeroField,
              },
              {
                coursePriceType: 'NON_ZERO',
                desc: data.nonZeroField,
              },
            ],
            buyBtnConfig: data[key],
          },
        });
      } else if (key !== 'zeroField' && key !== 'nonZeroField') {
        submitData.push({
          settingIdentity: key,
          status: data[key],
        });
      }
    });
    this.setState({ loading: true });
    // fix: change post data to plain object for pass csrf check
    saveCourseSettings({ settingData: submitData })
      .then(() => Notify.success('保存成功'))
      .catch((err) => Notify.error(err))
      .finally(() => this.setState({ loading: false }));
  };

  render() {
    const { handleSubmit, chainSettingConf } = this.props;
    const { loading, data, buttonCustomDescMap } = this.state;
    return (
      <BlockLoading loading={loading}>
        <div className="course-settings">
          <Form horizontal onSubmit={handleSubmit(this.handleSubmit)}>
            {
              // 如果没有订购信息隐藏，就过滤掉信息隐藏的配置
              chainSettingConf.map((item) => (
                <Field
                  key={item.key}
                  name={item.key}
                  label={item.title}
                  value={data[item.key]}
                  helpDesc={
                    !data[item.key] && item.helpCloseDesc ? item.helpCloseDesc : item.helpDesc
                  }
                  component={FieldSwitch}
                  disabled={item.disabled}
                  data={item}
                  onChange={(value) => {
                    this.setState({
                      data: Object.assign(this.state.data, { [item.key]: value }),
                    });
                  }}
                />
              ))
            }
            {/* 自定义按钮 */}
            <ArthurContainer name="offlineCourseManage">
              <Field
                key={buttonConf.key}
                name={buttonConf.key}
                label={buttonConf.title}
                value={data[buttonConf.key]}
                helpDesc={data[buttonConf.key] === 0 ? buttonConf.helpDesc.default : null}
                component={FieldSwitch}
                disabled={buttonConf.disabled}
                data={buttonConf}
                onChange={(value) => {
                  this.setState({
                    buttonData: Object.assign(this.state.data, { [buttonConf.key]: value }),
                  });
                }}
              />
              {data[buttonConf.key] === 1 ? (
                <>
                  <div className="zent-form__control-group">
                    <FormInputField
                      name="zeroField"
                      label="0元课程："
                      type="text"
                      validateOnChange={false}
                      validations={{
                        required: true,
                        maxLength: 6,
                      }}
                      validationErrors={{
                        required: '请输入自定义名称',
                        maxLength: '最多可输入6个字',
                      }}
                      disabled={buttonConf.disabled}
                      value={buttonCustomDescMap['ZERO']}
                    />
                  </div>
                  <div className="zent-form__control-group">
                    <FormInputField
                      name="nonZeroField"
                      label="非0元课程："
                      className="nonZeroButtonConf"
                      type="text"
                      helpDesc={buttonConf.helpDesc.customised}
                      validateOnChange={false}
                      validations={{
                        required: true,
                        maxLength: 6,
                      }}
                      validationErrors={{
                        required: '请输入自定义名称',
                        maxLength: '最多可输入6个字',
                      }}
                      disabled={buttonConf.disabled}
                      value={buttonCustomDescMap['NON_ZERO']}
                    />
                  </div>
                </>
              ) : null}

              {/* 跑马灯配置 */}
              <Field
                key={tradeCarouselConf.key}
                name={tradeCarouselConf.key}
                label={tradeCarouselConf.title}
                value={data[tradeCarouselConf.key]}
                helpDesc={tradeCarouselConf.helpDesc}
                component={FieldSwitch}
                disabled={tradeCarouselConf.disabled}
                data={tradeCarouselConf}
                onChange={(value) => {
                  this.setState({
                    data: Object.assign(this.state.data, { [tradeCarouselConf.key]: value }),
                  });
                }}
              />
            </ArthurContainer>
            <div className="edu-bottom_fixed">
              <SamButton name="编辑" type="primary" htmlType="submit" loading={loading}>
                保存
              </SamButton>
            </div>
          </Form>
        </div>
      </BlockLoading>
    );
  }
}

const CourseSettingsWrapper = (props) => {
  const offlineCourseModelRes = useArthurModel('offlineCourseManage.courseSettingFilter', 'course');
  const { infoHiddenAvailable, infoHiddenModel } = useCheckInfoHidden(
    'offlineCourseManage.infoHidden',
    'course',
  );
  const offlineCourseFilter = React.useCallback(
    (data, opts) => {
      const [, filter] = model2filter(offlineCourseModelRes.model, {
        microClassroom: courseSettingFilter,
      });
      return filter(data, opts);
    },
    [offlineCourseModelRes.model],
  );
  const infoHiddenFilter = React.useCallback(
    (data, opts) => {
      const [, filter] = model2filter(infoHiddenModel, courseSettingFilters);
      return filter(data, opts);
    },
    [infoHiddenModel],
  );

  const filterPipe = React.useCallback(
    (data) => {
      let courseSettings = offlineCourseFilter(data, ['courseTypeShow']);
      if (!infoHiddenAvailable) {
        courseSettings = infoHiddenFilter(courseSettings);
      }
      return courseSettings;
    },
    [infoHiddenAvailable, infoHiddenFilter, offlineCourseFilter],
  );

  const courseSettingConfigs = React.useMemo(
    // 在微课堂版本中，课程订购数中的文案只能展示线上课而没有线下课
    () => {
      const labels = (infoHiddenModel.labels || '').split(',');
      const originData = getChainSettingConf({ labels });
      return filterPipe(originData);
    },
    [filterPipe, infoHiddenModel.labels],
  );
  return <CourseSettings {...props} chainSettingConf={courseSettingConfigs} />;
};

export default createForm({ scrollToError: true })(CourseSettingsWrapper);
