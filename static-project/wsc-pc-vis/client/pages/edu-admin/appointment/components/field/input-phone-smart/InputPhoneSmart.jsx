
import { Form } from '@zent/compat';
import React, { Component } from 'react';
import PopNoTrigger from '../../pop-no-trigger';
import { Input, Notify } from 'zent';
import omit from 'lodash/omit';
import debounce from 'lodash/debounce';
import { searchCustomerByPhoneNum, getCustomerStudentList } from '../../../api/reserve';
import chinaMobile from 'zan-utils/validate/chinaMobile';

const { getControlGroup, unknownProps } = Form;

class InputPhoneSmart extends Component {
  state = {
    popData: [],
    showPop: false,
  };
  onSelectChange = data => {
    const { onChange, changeCustomerNameDisable } = this.props;
    if (!data) return this.setState({ showPop: false });
    onChange(data);
    this.getCustomerStudentList(data.customerUserId); // 学员联动
    changeCustomerNameDisable(true); // 禁用用户名
    this.setState({ popData: [] });
  };

  onInputClick = e => {
    e.nativeEvent.stopPropagation();
    this.debounceSearchCustomerByPhoneNumFn(e.target.value);
  };

  onInputChange = e => {
    const { onChange } = this.props;
    const phoneNum = e.target.value;
    onChange({ phoneNum });
    this.debounceSearchCustomerByPhoneNumFn(phoneNum);
    chinaMobile(phoneNum) && this.props.changeCustomerNameDisable(false);
  };

  getCustomerByPhoneNum = (phoneNum, data = []) => {
    for (let i = 0; i < data.length; i++) {
      if (data[i].phoneNum === phoneNum) return data[i];
    }

    return {};
  };

  searchCustomerByPhoneNum = phoneNum => {
    if (!phoneNum) {
      return this.setState({ popData: [], showPop: false });
    }
    const isChinaMobile = chinaMobile(phoneNum);
    searchCustomerByPhoneNum({ phoneNum })
      .then((data = []) => {
        if (isChinaMobile) {
          const customer = this.getCustomerByPhoneNum(phoneNum, data);
          this.getCustomerStudentList(customer.customerUserId);
          this.props.changeCustomerNameDisable(!!customer.customerUserId);
          chinaMobile(this.props.value.phoneNum) && this.props.onChange({ phoneNum, ...customer });
        } else {
          this.props.changeCustomerNameDisable(false);
        }
        this.setState({ popData: data, showPop: !!data.length });
      })
      .catch(msg => {
        Notify.error(msg);
      })
      .finally(() => {
        // todo 收尾
      });
  };

  debounceSearchCustomerByPhoneNumFn = debounce(this.searchCustomerByPhoneNum, 300);

  // 这个方法可以外面传进来使用
  getCustomerStudentList = customerUserId => {
    const { changeStudentData } = this.props;
    if (!customerUserId) return changeStudentData([]);
    getCustomerStudentList({ customerUserId })
      .then((data = []) => {
        changeStudentData(data);
      })
      .catch(msg => {
        Notify.error(msg);
      })
      .finally(() => {
        // todo 收尾
      });
  };

  render() {
    const { showPop } = this.state;
    const { type = 'text', value, copyValue, ...rest } = this.props;
    delete rest['changeStudentData']; // 删除无关属性
    delete rest['changeCustomerNameDisable']; // 删除无关属性
    const passableProps = omit(rest, unknownProps);
    return (
      <div className="input-phone-smart">
        <Input
          type={type}
          {...passableProps}
          onClick={this.onInputClick}
          onChange={this.onInputChange}
          value={copyValue.phoneNum || ''}
        />
        {showPop && (
          <PopNoTrigger popData={this.state.popData} onSelectChange={this.onSelectChange} />
        )}
      </div>
    );
  }
}

const InputPhoneSmartField = getControlGroup(InputPhoneSmart);

export default InputPhoneSmartField;
