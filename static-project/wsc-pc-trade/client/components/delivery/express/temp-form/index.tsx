import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';
import { Radio, Button, Notify, BlockLoading } from 'zent';
import { Form } from '@zent/compat';
import keys from 'lodash/keys';
import get from 'lodash/get';
import { isRetailChainStore } from '@youzan/utils-shop';

import DeliveryTable from './DeliveryTable';
import { createTemp, updateTemp, getTemplateDetail } from '../apis';
import { getTemplateUrl } from '../utils';

import './style.scss';

interface IProps {
  type: string;
  templateId: number;
}

interface IState {
  loading: boolean;
  valuationType: number;
}

const { createForm, FormInputField, FormRadioGroupField, Field } = Form;

const VALUATION_TYPE = [
  { value: 1, text: '按件数' },
  { value: 2, text: '按重量' },
];

class FormContent extends Component<ZENTFORM<IProps>, IState> {
  constructor(props) {
    super(props);

    this.state = {
      valuationType: 1,
      loading: props.type === 'edit',
    };
  }

  get valuationMap() {
    const { valuationType } = this.state;
    return {
      firstFee: '运费',
      additionalFee: '续费',
      firstAmount: valuationType === 1 ? '首件' : '首重',
      additionalAmount: valuationType === 1 ? '续件' : '续重',
    };
  }

  handleSubmit = values => {
    const { type, templateId } = this.props;
    const { valuationRules = [] } = values;

    if (!valuationRules.length) {
      return Notify.error('你必须要选择一个可配送区域');
    }

    for (let i = 0; i < valuationRules.length; i++) {
      const valuationRule = valuationRules[i];
      for (const key in this.valuationMap) {
        if (valuationRule[key] === '') {
          return Notify.error(`${this.valuationMap[key]}不能为空`);
        }
      }

      // 修改模板信息时，需要检查是否还有未修改的过期地址
      if (valuationRule.compatMap) {
        const compatRegionIds = keys(valuationRule.compatMap);
        if (compatRegionIds.some(id => valuationRule.regions.indexOf(parseInt(id)) !== -1)) {
          return Notify.error('保存失败，有失效地址未更新');
        }
      }
    }

    const requestFunction = type === 'edit' ? updateTemp : createTemp;

    if (type === 'edit') {
      values.templateId = templateId;
    }

    requestFunction(values).then(this.goBackUrl, error => {
      Notify.error(error);
    });
  };

  goBackUrl = () => {
    if (isRetailChainStore) {
      window.location.href = '/v2/order/delivery#/';
      return;
    }

    const link = this.getBackUrl();
    browserHistory.push(link);
  };

  getBackUrl = () => {
    const templateType = get(_global, 'templateType', 3);
    const prefix = getTemplateUrl(templateType);
    return `${prefix}${window.location.search}`;
  };

  render() {
    const { valuationType, loading } = this.state;
    const { handleSubmit, type } = this.props;

    if (loading) {
      return <BlockLoading loading />;
    }

    return (
      <Form horizontal onSubmit={handleSubmit(this.handleSubmit)}>
        <FormInputField
          name="name"
          type="text"
          label="模板名称: "
          required
          validations={{ required: true }}
          validationErrors={{ required: '请填写模板名称' }}
        />
        <FormRadioGroupField
          name="valuationType"
          label="计费方式: "
          value={1}
          disabled={type === 'edit'}
          onChange={e => this.setState({ valuationType: e.target.value })}
        >
          {VALUATION_TYPE.map(({ value, text }) => (
            <Radio key={value} value={value}>
              {text}
            </Radio>
          ))}
        </FormRadioGroupField>
        <Field name="valuationRules" component={DeliveryTable} valuationType={valuationType} />
        <div className="zent-form__form-actions">
          <Button type="primary" htmlType="submit">
            保存
          </Button>
          {isRetailChainStore ? (
            <Button type="primary" outline onClick={() => window.history.go(-1)}>
              返回
            </Button>
          ) : (
            <Link to={this.getBackUrl()} className="temp-form__btn">
              <Button type="primary" outline>
                返回
              </Button>
            </Link>
          )}
        </div>
      </Form>
    );
  }

  componentDidMount() {
    const { type, templateId, zentForm } = this.props;

    try {
      if (type === 'edit' && templateId) {
        getTemplateDetail({ templateId }).then(formValue => {
          this.setState({ loading: false, valuationType: formValue.valuationType });
          zentForm.setFieldsValue(formValue);
        });
      }
    } catch (error) {
      Notify.error(error);
      this.setState({ loading: false });
    }
  }
}

export default createForm()(FormContent);
