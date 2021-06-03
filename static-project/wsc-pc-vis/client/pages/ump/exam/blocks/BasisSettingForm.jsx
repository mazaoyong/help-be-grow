
import { Form } from '@zent/compat';
import React, { Component } from 'react';
import { Radio, Dialog, Button } from 'zent';

import CoverField from 'components/field/cover';
import RichTextField from 'components/field/rich-text';
import ShopSelector from 'components/field/shop-selector';

import get from 'lodash/get';
import getTime from 'date-fns/get_time';
import { isInStoreCondition, ShowWrapper, chainDisableForm, isEduHqStore } from 'fns/chain';
import { chainSupportHqAndSingle } from '../chain';

import { canShowFactoryHOC } from '../utils';

const { Field, FormInputField, createForm, FormDateRangePickerField, FormRadioGroupField } = Form;
const { openDialog, closeDialog } = Dialog;
const dialogId = 'example_dialog';

const FieldCanShow = canShowFactoryHOC(Field);
const ChainForm = chainDisableForm(chainSupportHqAndSingle, Form);

class BasisSettingForm extends Component {
  state = {
    loading: /edit/.test(this.props.route.path),
  };

  submit = (values, value) => {
    this.props.handleSubmit(values => {
      this.props.onSubmit(values);
    })();
  };

  openExample = () => {
    openDialog({
      dialogId: dialogId, // id is used to close the dialog
      title: '示例',
      children: (
        <div className="exam-basis__examples">
          <img
            className="exam-basis__examples-img"
            src="//b.yzcdn.cn/public_files/2018/11/12/668e8e821d253cba347cd6b76bb23918.png"
            alt="示例"
          />
        </div>
      ),
      footer: (
        <Button type="primary" onClick={() => closeDialog(dialogId)}>
          知道了
        </Button>
      ),
    });
  };

  render() {
    const { handleSubmit, formData, onFieldChange, isEdit, id, unchangable = false } = this.props;

    return (
      <ChainForm horizontal className="exam-basis-wrap__form" onSubmit={handleSubmit(this.submit)}>
        <FormRadioGroupField
          name="style"
          label="测试主页："
          required
          value={+formData.style}
          onChange={ev => {
            onFieldChange('style', {
              data: ev.target.value,
            });
          }}
        >
          <Radio value={1}>默认模板</Radio>
          <Radio value={2}>自定义</Radio>
        </FormRadioGroupField>

        <FormInputField
          name="title"
          value={formData.title}
          type="text"
          label="测试标题："
          required
          width={300}
          placeholder="请填写测试的标题，20个字以内"
          validations={{
            required(values, value) {
              return !!value;
            },
            maxSize(values, value) {
              return value.length <= 20;
            },
          }}
          validationErrors={{
            required: '请填写测试标题',
            maxSize: '标题文字不超过20个字',
          }}
          spellCheck={false}
          onChange={ev => {
            onFieldChange('title', {
              data: ev.target.value,
            });
          }}
          disabled={unchangable}
        />

        <FieldCanShow
          canShow={+formData.style === 1}
          name="coverPic"
          label="测试封面："
          required
          detail={true}
          value={formData.coverPic}
          component={CoverField}
          showRemove
          maxSize={300 * 1024}
          uploadCls="content-upload"
          helpDesc="封面尺寸建议750*420，小于300kb，支持JPG、PNG格式"
          validations={{
            required(values, value) {
              return !!value.cover;
            },
          }}
          validationErrors={{
            required: '请上传封面',
          }}
          onChange={ev => {
            onFieldChange('coverPic', {
              data: ev,
            });
          }}
        />

        {/* RichTextField 是一个非受控组件，传入的 value 不会更新，所以要确保有 summary 时才渲染此组件 */}
        <FieldCanShow
          canShow={+formData.style === 1}
          name="summary"
          label="测试简介："
          required
          className="field-no-label"
          component={RichTextField}
          value={formData.summary}
          editorConfig={{
            initialFrameHeight: 348,
            initialFrameWidth: 390,
            wordCount: false,
          }}
          validations={{
            required: true,
            maxSize(values, value) {
              return value.length <= 2000;
            },
          }}
          validationErrors={{
            required: '请填写测试简介',
            maxSize: '简介文字不超过2000个字',
          }}
          onChange={(ev, newValue, oldValue, preventSetValue) => {
            if (newValue === oldValue) {
              preventSetValue();
            }
            onFieldChange('summary', {
              data: ev,
            });
          }}
        />

        {/* 自定义 页面图 */}
        <FieldCanShow
          canShow={+formData.style === 2}
          name="backgroundPic"
          label="自定义页面图："
          required
          detail={true}
          value={formData.backgroundPic}
          component={CoverField}
          showRemove
          maxSize={450 * 1024}
          uploadCls="content-upload"
          helpDesc="建议尺寸750x1334px或16:9比例尺寸，支持JPG、PNG格式，小于450KB"
          validations={{
            required(values, value) {
              return !!value.cover;
            },
            maxSize(values, value) {
              return get(value, 'picture.attachment_size', 0) < 450 * 1024;
            },
          }}
          validationErrors={{
            required: '请上传自定义页面',
            maxSize: '图片大小请小于450KB',
          }}
          onChange={ev => {
            onFieldChange('backgroundPic', {
              data: ev,
            });
          }}
        />

        {/* 自定义 开始测试按钮 */}
        <FieldCanShow
          canShow={+formData.style === 2}
          name="startMenuPic"
          label="开始测试按钮："
          required
          detail={true}
          value={formData.startMenuPic}
          component={CoverField}
          showRemove
          maxSize={100 * 1024}
          uploadCls="content-upload"
          helpDesc={
            <span>
              支持JPG、PNG格式，建议小于100KB&nbsp;&nbsp;&nbsp;&nbsp;
              <a href="javascript:;" onClick={this.openExample}>
                查看示例
              </a>
            </span>
          }
          validations={{
            required(values, value) {
              return !!value.cover;
            },
            maxSize(values, value) {
              return get(value, 'picture.attachment_size', 0) < 100 * 1024;
            },
          }}
          validationErrors={{
            required: '请上传开始测试按钮',
            maxSize: '图片大小请小于100kb',
          }}
          onChange={ev => {
            onFieldChange('startMenuPic', {
              data: ev,
            });
          }}
        />

        {/* 自定义 下一题按钮 */}
        <FieldCanShow
          canShow={+formData.style === 2}
          name="nextQuestionMenuPic"
          label="下一题按钮："
          required
          detail={true}
          value={formData.nextQuestionMenuPic}
          component={CoverField}
          showRemove
          maxSize={100 * 1024}
          uploadCls="content-upload"
          helpDesc={
            <span>
              建议宽度小于750px，高度小于96px；支持JPG、PNG格式
              <br />
              大小小于50KB&nbsp;&nbsp;&nbsp;&nbsp;
              <a href="javascript:;" onClick={this.openExample}>
                查看示例
              </a>
            </span>
          }
          validations={{
            required(values, value) {
              return !!value.cover;
            },
            maxSize(values, value) {
              return get(value, 'picture.attachment_size', 0) < 100 * 1024;
            },
          }}
          validationErrors={{
            required: '请上传开始测试按钮',
            maxSize: '图片大小请小于100kb',
          }}
          onChange={ev => {
            onFieldChange('nextQuestionMenuPic', {
              data: ev,
            });
          }}
        />

        <FormDateRangePickerField
          name="rangeTime"
          showTime
          required
          min={new Date()}
          validateOnChange={false}
          validateOnBlur={false}
          label="生效日期："
          dateFormat="YYYY-MM-DD HH:mm:ss"
          value={formData.rangeTime}
          validations={{
            required(values, value) {
              const length = value.reduce((all, curr) => {
                if (curr) {
                  return [...all, curr];
                }
                return all;
              }, []).length;
              return length === 2;
            },
            bigger(_, value) {
              if (getTime(value[1]) > getTime(value[0])) {
                return true;
              }
              return false;
            },
          }}
          validationErrors={{
            required: '请选择开始及结束时间',
            bigger: '结束时间大于开始时间',
          }}
          onChange={ev => {
            onFieldChange('rangeTime', {
              data: ev,
            });
          }}
          disabled={unchangable}
        />
        {/* 适用校区 */}
        {ShowWrapper(
          { children:
            <ShopSelector
              id={id}
              shopInfo={formData.shopInfo}
              isEdit={isEdit}
              label={isEduHqStore ? '适用校区：' : '适用店铺：'}
              isCheckRemove={false}
              isCanDelete={true}
              required={true}>
            </ShopSelector>,
          isInStoreCondition: isInStoreCondition({
            supportHqStore: true, // todo: add privilege check
            supportMinifyRetailHqShop: true,
          }),
          })}

        <Field
          name="questionBackgroundPic"
          label="题目背景："
          detail={true}
          value={formData.questionBackgroundPic}
          component={CoverField}
          showRemove
          maxSize={400 * 1024}
          uploadCls="content-upload"
          helpDesc={
            <span>
              上传后将设为所有题目页的背景。
              <br />
              建议尺寸：750*1334像素，小于150KB，支持JPG、PNG格式
            </span>
          }
          validations={{
            maxSize(values, value) {
              return !value || get(value, 'picture.attachment_size', 0) < 400 * 1024;
            },
          }}
          validationErrors={{
            maxSize: '图片大小请小于400kb',
          }}
          onChange={ev => {
            onFieldChange('questionBackgroundPic', {
              data: ev,
            });
          }}
        />
      </ChainForm>
    );
  }
}

export default createForm({ scrollToError: true })(BasisSettingForm);
