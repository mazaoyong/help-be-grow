
import { Form } from '@zent/compat';
import React, { PureComponent } from 'react';
import { Dialog, Checkbox, Notify } from 'zent';

import BtnGroup from '../btn-group';
import { createTransferReason, updateTransferReason } from '../../api';

import './styles.scss';

const { openDialog, closeDialog } = Dialog;
const { createForm, FormInputField, FormNumberInputField, FormCheckboxGroupField } = Form;
const dialogId = 'add-dialog';

export default function openAddDialog({ afterAdd, value }) {
  const outputFormat = data =>
    Object.keys(data).reduce((obj, key) => {
      let item = data[key];
      if (key === 'config') {
        item = item.reduce(
          (configObj, configItem) => Object.assign(configObj, { [configItem]: 1 }),
          {},
        );
      }
      if (key === 'serialNo') {
        item = Number(item) || 0;
      }
      return Object.assign(obj, { [key]: item });
    }, {});

  const inputFormat = data =>
    Object.keys(data).reduce((obj, key) => {
      const item = data[key];
      switch (key) {
        case 'applyGiveUpClue':
        case 'applyDeleteClue':
        case 'applyTransferClue':
          if (item) {
            obj.config = (obj.config || []).concat(key);
          }
          break;
        default:
          obj[key] = item;
          break;
      }
      return obj;
    }, {});

  const confirmFormat = data => {
    if (value) {
      data.reasonId = value.reasonId;
    }
    return data;
  };

  class AddForm extends PureComponent {
    render() {
      const initialValue = this.props.initialValue || {};
      return (
        <Form
          horizontal
          className="clue_add-dialog"
          onSubmit={this.props.handleSubmit(this.onSubmit)}
        >
          <FormInputField
            name="reason"
            type="text"
            label="流转原因："
            value={initialValue.reason || ''}
            required
            asyncValidation={(values, value) => {
              if (!value) {
                return Promise.reject('请输入流转原因');
              }
              if (value.length > 10) {
                return Promise.reject('流转原因不超过10个字');
              }
              return Promise.resolve();
            }}
          />
          <FormCheckboxGroupField
            name="config"
            label="适用操作："
            value={initialValue.config || []}
            required
            asyncValidation={(values, value) => {
              if (!value || value.length === 0) {
                return Promise.reject('请至少选择一个可适用的操作');
              }
              return Promise.resolve();
            }}
          >
            <Checkbox value="applyGiveUpClue">放弃线索</Checkbox>
            <Checkbox value="applyTransferClue">转让线索</Checkbox>
            <Checkbox value="applyDeleteClue">删除线索</Checkbox>
          </FormCheckboxGroupField>
          <FormNumberInputField
            name="serialNo"
            type="number"
            label="序号："
            value={initialValue.serialNo || 0}
            min={0}
            required
            asyncValidation={(values, value) => {
              if (+value > 99999999) {
                return Promise.reject('序号不能超过最大限制99999999');
              }
              return Promise.resolve();
            }}
          />
          <BtnGroup />
        </Form>
      );
    }

    onSubmit = (data = {}) => {
      const submit = this.props.initialValue ? updateTransferReason : createTransferReason;
      const command = this.props.initialValue
        ? confirmFormat(outputFormat(data))
        : outputFormat(data);
      const { zentForm } = this.props;
      zentForm.asyncValidateForm(() => {
        submit({ command })
          .then(() => {
            closeDialog(dialogId);
            if (this.props.afterAdd) {
              this.props.afterAdd();
            }
          })
          .catch(err => {
            Notify.error(err);
          });
      });
    };
  }

  const WrappedForm = createForm()(AddForm);
  const initialValue = value ? inputFormat(value) : null;
  openDialog({
    dialogId,
    title: '添加流转原因',
    children: <WrappedForm afterAdd={afterAdd} initialValue={initialValue} />,
  });
}
