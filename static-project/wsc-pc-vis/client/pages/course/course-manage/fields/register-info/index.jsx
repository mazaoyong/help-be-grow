
import { Pop, Form } from '@zent/compat';
import React, { Component } from 'react';
import { Checkbox, LayoutRow as Row } from 'zent';
import merge from 'lodash/merge';
import cx from 'classnames';
import { isInStoreCondition, ShowWrapper } from 'fns/chain';
import { checkEduHqStore, checkChainStore } from '@youzan/utils-shop';
import './index.scss';
import openDemoImg from '../../../components/demo-image';
import VersionWrapper from 'fns/version';

const { FormCheckboxGroupField, getControlGroup } = Form;

const defultObj = {
  intentTime: 0,
  intentAddress: 0,
};

const shopInfo = _global.shopInfo;
const isEduHeadquarter = checkEduHqStore(shopInfo);
const isChainStore = checkChainStore(shopInfo);
const modifyUnavailable = isChainStore ? !isEduHeadquarter : false;

const SIGNUPINFO = {
  EXPERIENCE: ['上课时间', '上课地点'],
  EXPERIENCECHAIN: ['上课时间'],
  OFFICIALRESERVTION: ['下单时预约上课', '上课地点'],
  OFFICIALRESERVTIONCHAIN: ['下单时预约上课', '上课地点'],
  OFFICIALCUSTOM: ['', '上课地点'],
  OFFICIALCUSTOMCHAIN: [],
};

const DEMO = {
  IMG: 'https://img.yzcdn.cn/public_files/2019/07/18/f753790765da889d7bc16992bf991e9d.png',
  TEXT: '',
};

let EXTRATEXT = '用户下单时需要填上课地点。';

const reservtionInfo = isReservtion => isReservtion ? (
  <div className="help-tip">
    用户下单时可查看课程安排和剩余预约名额。
    <Pop
      trigger="click"
      content={openDemoImg(DEMO.IMG, DEMO.TEXT)}
      position="right-bottom"
    >
      <a href="javascript:;">查看示例</a>
    </Pop>
  </div>
) : null;

const scrollToAnchor = anchorName => {
  if (anchorName) {
    // 找到锚点
    let anchorElement = document.getElementsByClassName(anchorName);
    // 如果对应id的锚点存在，就跳转到锚点
    if (anchorElement.length) {
      anchorElement[0].scrollIntoView();
    }
  }
};

const relateToAttendPlace = addressList => (
  <span className={cx('intent-address-tip', { hide: addressList.length > 0 })}>
    勾选前需关联上课地点。
    <a href="javascript: 0;" onClick={() => scrollToAnchor('store-list')}>
      去关联
    </a>
  </span>
);

const extraText = (isExperience, isReservtion) => {
  if (isChainStore) {
    EXTRATEXT = '用户下单时需要填上课时间。';
  }
  if (isExperience) {
    return <p style={{ marginLeft: '25px' }} className="help-tip">{EXTRATEXT}</p>;
    // return isChainStore ? <p className="help-tip">{EXTRATEXT}</p> : (
    //   <div className="help-tip">
    //     如果要收集学员的基础信息，可在
    //     <a href={`https:${_global.url.v4}/scrm/setting/diyCustomerInfo`}>学员资料项</a>
    //     里设置
    //   </div>
    // );
  }
  return isReservtion ? null : <p style={{ marginLeft: '25px' }} className="help-tip">{EXTRATEXT}</p>;
};

// 外层控制是否显示报名信息
let showSignupInfo = true;

class RegisterInfo extends Component {
  getChecked() {
    const checked = [];
    let { registerInfo } = this.props;
    Object.keys(registerInfo).forEach(key => {
      registerInfo[key] && checked.push(registerInfo[key]);
    });
    return checked;
  }

  onCheckboxChange = val => {
    let result = {};
    val.forEach(key => {
      result[key] = 1;
    });
    this.props.onChange(merge({}, defultObj, result));
  };

  render() {
    let { label, addressList, courseSellType, courseType, applyCourse = {} } = this.props;
    const isExperience = courseType === 0;
    const isReservtion = !isExperience && courseSellType > 0 && courseSellType < 3;
    // 添加选用枚举值后缀
    const suffix = isChainStore ? 'CHAIN' : '';
    // 添加选用枚举值前缀
    const prefix = isExperience ? 'EXPERIENCE' : 'OFFICIAL';
    // 只有正式课有售卖方式
    const saleWay = !isExperience ? (isReservtion ? 'RESERVTION' : 'CUSTOM') : '';
    const enumKey = prefix + saleWay + suffix;
    const signupInfo = SIGNUPINFO[enumKey] || [];
    // 在连锁环境下是正式课且是按期/自定义售卖方式，隐藏报名信息
    if (isChainStore && !isExperience && !isReservtion) {
      showSignupInfo = false;
      return null;
    }
    const showIntentTime = isExperience || (applyCourse.isRelatedEduCourse && courseSellType > 0 && courseSellType < 3);
    showSignupInfo = true;
    return (
      <>
        <FormCheckboxGroupField
          name="registerInfo"
          className="no-control-label register-type-group"
          label={label}
          value={this.getChecked()}
        >
          <Row>
            <VersionWrapper name='course-manage-register-info' downgrade={{ from: isExperience }}>
              {showIntentTime ? <Checkbox disabled={modifyUnavailable} value="intentTime">{signupInfo[0]}</Checkbox> : null}
            </VersionWrapper>
          </Row>
          {ShowWrapper({
            children: (
              <Row>
                <Checkbox value="intentAddress" disabled={modifyUnavailable || addressList.length === 0}>
                  {signupInfo[1]}
                  {relateToAttendPlace(addressList)}
                </Checkbox>
              </Row>
            ),
            // 单店都显示上课地点
            isInStoreCondition:
              isInStoreCondition({
                // 单店
                supportEduSingleStore: true,
              }),
          })}
        </FormCheckboxGroupField>
        <VersionWrapper name='course-manage-register-text'>
          {reservtionInfo(isReservtion)}
          {extraText(isExperience, isReservtion)}
        </VersionWrapper>
      </>
    );
  }
}

export default getControlGroup(RegisterInfo);
export { showSignupInfo };
