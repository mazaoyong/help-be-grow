
import { Form } from '@zent/compat';
/* eslint-disable camelcase */
import React, { Component } from 'react';
import { Button, Notify, Radio } from 'zent';
import cx from 'classnames';
import TextAreaField from 'components/field/text-area';
import CoverField from 'components/field/cover';
import RichTextField from 'components/field/rich-text';
import { VisButton } from 'fns/router';
import { BRANCH_STORE_NAME } from 'constants/chain';
import { ShowWrapper, isInStoreCondition, chainDisableForm } from 'fns/chain';
import VipCardSelectField from '../vip-card-select-field';
import { saveBenefit, getBenefitDetail, checkBenefitPkgStatus } from '../../api';
import './style.scss';
import safeGoBack from 'fns/router/safe-go-back';
import { chainSupportHqAndSingleShowWrapper, chainSupportHqAndSingle, chainSupportBranch } from '../../chain';

const v4 = window._global.url.v4;
const { createForm, Field, InputField, FormRadioGroupField } = Form;
const errMsg = '网络错误';
const ChainForm = chainDisableForm(chainSupportHqAndSingle, Form);
const ChainSubmitBtn = chainSupportHqAndSingleShowWrapper(VisButton);

const Step1 = [
  {
    name: 'name',
    label: '会员权益名称:',
    placeholder: '最多输入10个字',
    className: 'field-size-320',
    component: InputField,
    autoComplete: 'off',
    validations: {
      required: true,
      maxLength: 10,
    },
    validationErrors: {
      required: '会员权益名称必须填写',
      maxLength: '会员权益名称最多10个字',
    },
    required: true,
  },
  {
    name: 'summary',
    label: '会员权益简介:',
    placeholder: '最多输入36个字',
    helpDesc: '微信分享给好友时会显示此文案',
    className: 'summary-textarea',
    component: TextAreaField,
    validations: {
      required: true,
      maxLength: 36,
    },
    validationErrors: {
      required: '会员权益简介必须填写',
      maxLength: '会员权益简介最多36个字',
    },
    required: true,
  },
  {
    name: 'cover',
    label: '会员权益封面:',
    className: 'column-upload cover-scale-16-9',
    helpDesc: '建议尺寸：750*420像素，小于1MB，支持jpg、png、jpeg格式',
    component: CoverField,
    detail: true,
    validations: {
      validData(values, value) {
        return !!(value && value.cover);
      },
    },
    validationErrors: {
      validData: '必须上传一张图片作为会员权益封面',
    },
    required: true,
  },
  {
    name: 'description',
    label: '会员权益介绍:',
    component: RichTextField,
    editorConfig: {
      initialFrameHeight: 330,
      wordCount: false,
    },
    asyncValidation: (values, value) => {
      if (!value) {
        return Promise.reject('会员权益介绍必须填写');
      }
      return Promise.resolve();
    },
    required: true,
  },
];
const Step2 = [
  {
    name: 'vip_card',
    label: '关联会员卡:',
    isUseAttr: true,
    component: VipCardSelectField,
  },
];

class BenefitForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      benefit_id: 0,
      alias: '',
      name: '',
      summary: '',
      cover: {
        cover: '',
        picture: {},
      },
      description: '',
      vip_card: {},
      isLoading: false,
      isUse: false,
      applicableCampusType: '1',
    };
  }
  componentDidMount() {
    const { alias, isFast } = this.props;
    if (alias && !isFast) {
      getBenefitDetail({
        alias: alias,
      })
        .then(data => {
          const {
            id,
            name,
            summary,
            cover,
            description,
            /* vip_card_id,
            vip_card_name,
            vip_card_alias,
            vip_card_cover,
            vip_card_color, */
            card = {},
          } = data;
          this.setState({
            benefit_id: id,
            // benefit_alias: vip_card_alias,
            name,
            summary,
            cover: {
              cover,
              picture: {},
            },
            description,
            vip_card: {
              id: card && card.id,
              name: card && card.name,
              cover: card && card.cover,
              color: card && card.color,
            },
          });
          this.checkBenefitPkgStatus(alias);
        })
        .catch(msg => {
          Notify.error(msg || errMsg);
        });
    }
  }
  checkBenefitPkgStatus = alias => {
    checkBenefitPkgStatus({
      alias,
    })
      .then(data => {
        if (data === 3) {
          this.setState({
            isUse: true,
          });
        }
      })
      .catch(msg => {
        Notify.error(msg || errMsg);
      });
  };
  save = data => {
    // 表单值
    const formData = this.getFormatData(data);
    this.setState({
      isLoading: true,
    });
    saveBenefit(formData)
      .then(res => {
        if (!res) {
          Notify.error('该权益被会员使用中不能更换');
          return;
        }
        if (formData.cardId) {
          Notify.success('保存成功');
        } else {
          Notify.success('会员权益包创建成功，但未关联权益卡，消费者无法购买，建议及时关联');
        }
        safeGoBack(`${v4}/vis/pct/page/benefit`);
      })
      .catch(msg => {
        Notify.error(msg || errMsg);
      })
      .finally(() => {
        this.freezing = false;
        this.setState({
          isLoading: false,
        });
      });
  };
  getFormatData(data) {
    const { alias } = this.props;
    const { name, summary, description, vip_card, cover, applicableCampusType } = data;
    const isHqStore = isInStoreCondition({ supportHqStore: true });
    const formatData = {
      name,
      summary,
      description,
      cover: cover.cover,
      cardId: vip_card.id || 0,
      alias,
    };
    isHqStore && (formatData.applicableCampusType = applicableCampusType);
    return formatData;
  }
  onStepChange = async nextStep => {
    const { step, zentForm, onStepChange } = this.props;
    try {
      await zentForm.asyncValidateForm();
      let hasError = false;
      if (nextStep > step) {
        Step1.forEach(one => {
          const res = zentForm.getFieldError(one.name);
          if (res) {
            hasError = true;
          }
        });
      }
      if (hasError) {
        this.props.handleSubmit(this.save)();
        return;
      }
      onStepChange(nextStep);
    } catch (error) {
      // do nothing
    }
  };
  getBottomBtn = () => {
    const { step, isFast } = this.props;
    const { isLoading } = this.state;
    console.log('getBottomBtn');
    if (isFast) {
      return (
        <div className="form-actions new-actions text-center">
          <ChainSubmitBtn
            pctCheck
            loading={isLoading}
            onClick={() => {
              if (this.freezing) {
                return;
              }
              this.freezing = true;
              this.props.handleSubmit(this.save)();
            }}
            type="primary"
          >
            保存
          </ChainSubmitBtn>
          {/* <VisButton
            pctCheck
            loading={isLoading}
            onClick={() => {
              if (this.freezing) {
                return;
              }
              this.freezing = true;
              this.props.handleSubmit(this.save)();
            }}
            type="primary"
          >
            保存
          </VisButton> */}
          <Button href="#/list/benefit">取消</Button>
        </div>
      );
    }
    if (step === 1) {
      return (
        <div className="form-actions new-actions text-center">
          <span className='button-like-primary__span' onClick={() => {
            this.onStepChange(2);
          }}>
            下一步
          </span>
          <span className='button-like-outline__span' onClick={() => safeGoBack(`${v4}/vis/pct/page/benefit`)}>取消</span>
        </div>
      );
    }
    return (
      <div className="form-actions new-actions text-center">
        <span className='button-like-outline__span' onClick={() => this.onStepChange(1)}>上一步</span>
        <Button
          pctCheck
          loading={isLoading}
          onClick={() => {
            if (this.freezing) {
              return;
            }
            this.freezing = true;
            this.props.handleSubmit(this.save)();
          }}
          type="primary"
        >
            保存
        </Button>
        {chainSupportBranch && <span className='button-like-outline__span' onClick={() => safeGoBack(`${v4}/vis/pct/page/benefit`)}>取消</span>}
        {/* <VisButton
          pctCheck
          loading={isLoading}
          onClick={() => {
            if (this.freezing) {
              return;
            }
            this.freezing = true;
            this.props.handleSubmit(this.save)();
          }}
          type="primary"
        >
          保存
        </VisButton> */}
      </div>
    );
  };
  renderSchoolField = () => {
    return (
      <FormRadioGroupField
        name="applicableCampusType"
        label={`适用${BRANCH_STORE_NAME}：`}
        value={this.state.applicableCampusType}
        required
      >
        <Radio value="1">全部{BRANCH_STORE_NAME}</Radio>
        <span className="school-tip">会员权益归属总部，适配所有{BRANCH_STORE_NAME}</span>
      </FormRadioGroupField>);
  };
  render() {
    const { step, alias } = this.props;
    Step1.forEach(one => {
      one.value = this.state[one.name];
    });
    Step2.forEach(one => {
      one.value = this.state[one.name];
    });
    return (
      <ChainForm className="benefit-form" horizontal>
        <div
          className={cx({
            'benefit-form__step--step1': true,
            'benefit-form-field--hide': step !== 1,
          })}
        >
          <h3 className="new-title">基本信息</h3>
          {Step1.map(props => {
            if (props.name === 'description' && alias && !this.state.description) {
              return null;
            }
            return <Field key={props.name} {...props} />;
          })}
          <ShowWrapper
            isInStoreCondition={isInStoreCondition({ supportHqStore: true })}
          >
            {this.renderSchoolField()}
          </ShowWrapper>
        </div>
        <div
          className={cx({
            'benefit-form__step--step2': true,
            'benefit-form-field--hide': step !== 2,
          })}
        >
          {Step2.map(props => {
            if (props.isUseAttr) {
              props.isUse = this.state.isUse;
            }
            return <Field key={props.name} {...props} />;
          })}
        </div>
        <div className="app-design">
          <div className="app-actions">{this.getBottomBtn()}</div>
        </div>
      </ChainForm>
    );
  }
}

export default createForm({ scrollToError: true })(BenefitForm);
