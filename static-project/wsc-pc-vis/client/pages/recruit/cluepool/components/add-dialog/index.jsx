
import { Form } from '@zent/compat';
import React, { PureComponent } from 'react';
import { Button, Dialog, Notify, Radio, BlockLoading } from 'zent';
import get from 'lodash/get';

import { isInStoreCondition, ShowWrapper } from 'fns/chain';

import { isEduShop } from '@youzan/utils-shop';

import InfoTip from '@ability-center/student/info-tip';
import { ModifyStudentForm } from '@ability-center/student';

import SourceField from './components/source-field';

import { createClue, updateClueAPI, findListAllCampusAPI, findPagePowerStaffs } from '../../api';
import './styles.scss';
import Affix from './components/affix';

const { createForm, FormSelectField, FormRadioGroupField, Field } = Form;
const { openDialog, closeDialog } = Dialog;

const dialogId = 'add-dialog';

const isEduChainMaster = isInStoreCondition({ supportEduHqStore: true });
const isEduChainBranch = isInStoreCondition({ supportEduBranchStore: true });

class AddForm extends PureComponent {
  state = {
    followers: [],
    campus: [],
    submiting: false,
    formData: null,
    refreshSignal: 0,
    submitSignal: 0,
  };

  componentDidMount() {
    Promise.all([
      findPagePowerStaffs(),
    ])
      .then(([staff]) => {
        const followers = staff.map(item => ({
          value: item.adminId,
          text: item.name,
        }));
        this.setState({ followers });
      })
      .catch(err => Notify.error(err));
    if (isEduChainMaster) {
      findListAllCampusAPI().then(data => {
        const campus = [{
          value: window._global.kdtId,
          text: '总部',
        }].concat(data.map(item => ({
          value: item.kdtId,
          text: item.shopName,
        })));
        this.setState({ campus });
      });
    }
  }

  handleCancel = () => {
    closeDialog(dialogId);
  };

  handleFormSubmit = formData => {
    this.props.zentForm.asyncValidateForm(() => {
      this.setState({
        submitSignal: Date.now(),
        formData,
      });
    });
  }

  onSubmit = data => {
    const form = data.map(field => {
      let { attributeKey, attributeId, value } = field;
      return {
        attributeKey,
        attributeId,
        attributeValue: String(value || ''),
      };
    });

    const { type } = this.props;
    const { formData = {} } = this.state;

    let userId;
    let receiveType = formData.receiveType;
    switch (type) {
      case 'mine':
        userId = window._global.userId;
        break;
      case 'pool':
      case 'all':
        userId = formData.userId || undefined;
        break;
      default:
    }
    if (receiveType === undefined) {
      receiveType = userId ? 1 : 0;
    }

    let targetKdtId = formData.targetKdtId;
    if (!targetKdtId) {
      targetKdtId = window._global.kdtId;
    }

    let kdtType = 1;
    if (targetKdtId !== window._global.kdtId) {
      kdtType = 2;
    }
    if (isEduChainBranch) {
      kdtType = 3;
    }

    const stuName = data.find(item => item.attributeKey === 'edu_stuName').value;
    const phone = data.find(item => item.attributeKey === 'edu_stuContractPhone').value;
    // 更新
    const promise = get(this.props, 'data.isEdit') ? updateClueAPI({
      clueId: get(this.props, 'data.clueId'),
      attributes: form,
      name: stuName,
      telephone: phone,
    }) : createClue({
      attributes: form,
      clueAddDistribute: {
        kdtType,
        receiveType,
        userId,
        targetKdtId: formData.targetKdtId || window._global.kdtId,
      },
      name: stuName,
      sourceId: formData.source && formData.source[1],
      telephone: String(phone),
    });

    this.setState({ submiting: true });

    promise
      .then(data => {
        closeDialog(dialogId);
        const clueId = data && data.clueId;
        this.props.afterAdd(clueId, userId);
      })
      .catch(err => {
        this.setState({ submiting: false });
        Notify.error(err);
      });
  };

  renderFollower = () => {
    const { type } = this.props;
    const { receiveType, targetKdtId, campus, followers } = this.state;
    if (isEduChainMaster) {
      switch (type) {
        case 'all':
        case 'pool':
          return (
            <>
              <FormSelectField
                name="targetKdtId"
                label="所属校区："
                width="200px"
                data={campus}
                onChange={targetKdtId => {
                  this.setState({ targetKdtId });
                  setTimeout(this.props.zentForm.asyncValidateForm);
                }}
                asyncValidation={(values, value) => {
                  if (value) return Promise.resolve();
                  return Promise.reject('请选择所属校区');
                }}
                required
              />
              {
                targetKdtId === window._global.kdtId ? (
                  <FormRadioGroupField
                    name="receiveType"
                    label="分配方式："
                    value={0}
                    onChange={e => this.setState(
                      { receiveType: e.target.value },
                      this.props.zentForm.asyncValidateForm,
                    )}
                  >
                    <div className="edu-clue-radio-block">
                      <Radio value={0}>分配到总部公海池</Radio>
                    </div>
                    <div>
                      <Radio value={1}>分配给总部员工</Radio>
                      <FormSelectField
                        name="userId"
                        className="edu-clue-inline-field"
                        disabled={receiveType !== 1}
                        data={followers}
                        filter={(item, keyword) => item.text.includes(keyword)}
                        asyncValidation={(values, value) => {
                          if (receiveType && (!value)) {
                            return Promise.reject('请选择员工');
                          }
                          return Promise.resolve();
                        }}
                      />
                    </div>
                  </FormRadioGroupField>
                ) : null
              }
            </>
          );
        case 'mine':
          return (
            <div className="cluepool-field">
              <div className="cluepool-field_label">课程顾问：</div>
              <div className="cluepool-field_text">手动新增的线索，默认分配给自己</div>
            </div>
          );
        default:
          return null;
      }
    }
    switch (type) {
      case 'all':
        return (
          <FormSelectField
            name="userId"
            label="课程顾问："
            data={followers}
            filter={(item, keyword) => item.text.includes(keyword)}
            asyncValidation={(values, value) => {
              if (value) return Promise.resolve();
              return Promise.reject('请选择课程顾问');
            }}
            required
          />
        );
      case 'pool':
        return (
          <FormSelectField
            name="userId"
            label="课程顾问："
            data={followers}
            filter={(item, keyword) => item.text.includes(keyword)}
          />
        );
      case 'mine':
        return (
          <div className="cluepool-field">
            <div className="cluepool-field_label">课程顾问：</div>
            <div className="cluepool-field_text">手动新增的线索，默认分配给自己</div>
          </div>
        );
      default:
        return null;
    }
  }

  renderSource = isEdit => {
    if (isEdit) {
      return null;
    }

    return (
      <>
        <div className="edu-clue-vertical-line"></div>
        <Field
          name="source"
          label="来源："
          width="200px"
          component={SourceField}
          value={[]}
          required
          asyncValidation={(values, value) => {
            if (value && value.length > 0) return Promise.resolve();
            return Promise.reject('请选择线索来源');
          }}
        />
        {this.renderFollower()}
      </>
    );
  }

  render() {
    // const { FieldWrapper } = this;
    const { data: { identityNo }, handleSubmit } = this.props;
    const { submiting, refreshSignal, submitSignal } = this.state;
    const isEdit = this.props.data && this.props.data.isEdit;

    return (
      <BlockLoading className="add-dialog__loading">
        <ModifyStudentForm
          applicableScene={2}
          studentNo={identityNo}
          refreshSignal={refreshSignal}
          submitSignal={submitSignal}
          onSubmit={this.onSubmit}
        />
        <ShowWrapper isInStoreCondition={isEduShop}>
          <div className="cluepool-info-tip">
            <InfoTip onRefresh={() => {
              this.setState({
                refreshSignal: Date.now(),
              });
            }} />
          </div>
        </ShowWrapper>
        <Form className="edupool-add-dialog" horizontal onSubmit={handleSubmit(this.handleFormSubmit)}>
          {this.renderSource(isEdit)}
          <Affix scrollClassName="zent-dialog-r">
            <div className="cluepool-add-button-group">
              <Button type="primary" outline onClick={this.handleCancel}>取消</Button>
              <Button type="primary" htmlType="submit" loading={submiting}>{isEdit ? '更新' : '保存'}</Button>
            </div>
          </Affix>
        </Form>
      </BlockLoading>
    );
  }
}

const WrappedForm = createForm({ scrollToError: true })(AddForm);
export default function openAddDialog(type, afterAdd, data = {}) {
  openDialog({
    dialogId,
    title: data.isEdit ? '编辑线索' : '添加线索',
    className: 'clue-add-dialog-wrap',
    children: <WrappedForm type={type} afterAdd={afterAdd} data={data} />,
  });
}
