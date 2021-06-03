
import { Form } from '@zent/compat';
import React, { Component } from 'react';
import { Radio } from 'zent';

import CoverField from 'components/field/cover';
import VideoField from 'components/field/video';
import AudioField from 'components/field/audio';
import TextAreaField from 'components/field/text-area';
import { chainDisableForm } from 'fns/chain';
import { chainSupportHqAndSingle } from '../chain';

import get from 'lodash/get';

import { canShowFactoryHOC } from '../utils';

import SelecterItems from '../components/fields/SelecterItems';

const {
  Field,
  // FormInputField,
  createForm,
  FormRadioGroupField,
  FieldArray,
} = Form;
const FieldCanShow = canShowFactoryHOC(Field);
const FormRadioGroupFieldCanShow = canShowFactoryHOC(FormRadioGroupField);
const ChainForm = chainDisableForm(chainSupportHqAndSingle, Form);

class TitleSettingForm extends Component {
  state = {
    loading: /edit/.test(this.props.route.path),
  };

  $validateForm = cb => {
    const { zentForm } = this.props;
    zentForm.setFormDirty(true);
    zentForm.validateForm(true, ev => {
      cb && cb(zentForm.isValid() && this.checkItemListFilled());
    });
  };

  submit = (values, value) => {
    this.props.handleSubmit(values => {
      this.checkItemListFilled() && this.props.onSubmit(values);
    })();
  };

  checkItemListFilled = () => {
    const { formData: values } = this.props;
    const itemStyleIsImage = +values.itemStyle === 2;
    const choosedLength = values.itemList.filter(item => item.score === 1).length;
    const filledLength = values.itemList.filter(item =>
      itemStyleIsImage ? get(item, 'itemPic.cover') : item.detail
    ).length;

    let passed;
    // 只在内容填充完毕才判断是否选择了答案
    if (filledLength === values.itemList.length && choosedLength === 0) {
      passed = false;
    } else {
      passed = true;
    }
    return passed;
  };

  render() {
    const { handleSubmit, formData, onFieldChange, titleIndex, unchangable } = this.props;

    if (!formData) {
      return null;
    }
    return (
      <ChainForm horizontal className="exam-basis-wrap__form" onSubmit={handleSubmit(this.submit)}>
        <FormRadioGroupField
          required
          label="题目格式："
          name="mediaType"
          value={formData.mediaType}
          validations={{
            required: true,
          }}
          validationErrors={{
            required: '请输入测试简介',
          }}
          onChange={ev => {
            onFieldChange('mediaType', {
              data: ev.target.value,
            });
          }}
        >
          <Radio value={0}>文本</Radio>
          <Radio value={1}>图片</Radio>
          <Radio value={2}>视频</Radio>
          <Radio value={3}>音频</Radio>
        </FormRadioGroupField>

        {/* 题目文本 */}
        <Field
          name="description"
          label="题目："
          required={+formData.mediaType === 0}
          value={formData.description}
          maxLength={500}
          style={{
            width: '381px',
            height: '91px',
          }}
          showCount
          component={TextAreaField}
          placeholder={`${+formData.mediaType === 0 ? '' : '（选填）'}请填写题目内容，500个字以内`}
          validations={{
            required(values, value) {
              if (!value && +formData.mediaType === 0) {
                return false;
              }
              return true;
            },
            maxSize(values, value) {
              return value.length <= 500;
            },
          }}
          validationErrors={{
            required: '请填写题目内容',
            maxSize: '题目字数小于500',
          }}
          onChange={ev => {
            onFieldChange('description', {
              data: ev.target.value,
            });
          }}
        />

        {/* 图片 */}
        <FieldCanShow
          canShow={+formData.mediaType === 1}
          name="media.cover"
          label="图片："
          required
          detail={true}
          value={get(formData, 'media.cover')}
          component={CoverField}
          showRemove
          maxSize={300 * 1024}
          uploadCls="content-upload"
          helpDesc="支持JPG、PNG格式，图片小于300KB"
          validations={{
            required(values, value) {
              return !!value.cover;
            },
            maxSize(values, value) {
              return get(value, 'picture.attachment_size', 0) < 300 * 1024;
            },
          }}
          validationErrors={{
            required: '请上传图片',
            maxSize: '图片大小请小于300kb',
          }}
          onChange={ev => {
            onFieldChange('media.cover', {
              data: ev,
            });
          }}
        />

        {/* 视频 */}
        <FieldCanShow
          canShow={+formData.mediaType === 2}
          name="media.video"
          label="视频："
          required
          value={get(formData, 'media.video', {})}
          component={VideoField}
          helpDescs={
            <span>
              视频大小不超过200M，宽高比16:9
              <br />
              支持mp4，mov，m4v，flv，x-flv，mkv，wmv，avi，rmvb，3gp格式
            </span>
          }
          validations={{
            required(values, value) {
              return !!(value && value.video_id);
            },
            maxSize(values, value) {
              return !!(value && (value.video_size <= 200 * 1024 * 1024 || !value.video_size));
            },
          }}
          validationErrors={{
            required: '请上传视频',
            maxSize: '视频大小不超过200M',
          }}
          onChange={ev => {
            onFieldChange('media.video', {
              data: ev,
            });
          }}
        />

        {/* 音频 */}
        <FieldCanShow
          canShow={+formData.mediaType === 3}
          name="media.audio"
          label="音频："
          required
          value={get(formData, 'media.audio', {})}
          component={AudioField}
          helpDescs="支持amr、 mp3、 mpeg格式，音频大小不超过80.0MB"
          validations={{
            required(values, value) {
              return !!(value && value.name);
            },
            maxSize(values, value) {
              return !!(value && value.size <= 500 * 1024 * 1024);
            },
          }}
          validationErrors={{
            required: '请上传音频',
            maxSize: '音频大小不超过500MB',
          }}
          onChange={ev => {
            onFieldChange('media.audio', {
              data: ev,
            });
          }}
        />

        {/* 选项格式 */}
        <FormRadioGroupField
          required
          label="选项格式："
          name="itemStyle"
          onChange={ev => {
            onFieldChange('itemStyle', {
              data: ev.target.value,
            });
          }}
          value={+formData.itemStyle}
          disabled={unchangable}
        >
          <Radio value={1}>文本</Radio>
          <Radio value={2}>图片</Radio>
        </FormRadioGroupField>

        {/* 选项列表 */}
        <FormRadioGroupFieldCanShow
          canShow={+formData.itemStyle === 2}
          required
          label="选项列表："
          name="itemRowNum"
          onChange={ev => {
            onFieldChange('itemRowNum', {
              data: ev.target.value,
            });
          }}
          value={+formData.itemRowNum || 1}
        >
          <Radio value={1}>一行1个</Radio>
          <Radio value={2}>一行2个</Radio>
        </FormRadioGroupFieldCanShow>

        <FieldArray
          name="itemList"
          component={SelecterItems}
          onFieldArrayChange={(ev, index) => {
            onFieldChange('itemList', {
              data: ev,
              index,
            });
          }}
          onDeleteItem={this.props.onDeleteItem}
          value={formData.itemList}
          formData={formData}
          titleIndex={titleIndex}
          unchangable={unchangable}
        />

        {/* 题目背景 */}
        <Field
          name="backgroundPic"
          label="题目背景："
          detail={true}
          value={formData.backgroundPic}
          component={CoverField}
          showRemove
          maxSize={400 * 1024}
          uploadCls="content-upload"
          helpDesc={
            <span>
              仅对这道题目的背景有效，建议尺寸：750*1334像素，
              <br />
              小于400KB，支持JPG、PNG格式
            </span>
          }
          validations={{
            maxSize(values, value) {
              return get(value, 'picture.attachment_size', 0) < 400 * 1024;
            },
          }}
          validationErrors={{
            maxSize: '图片大小请小于400kb',
          }}
          onChange={ev => {
            onFieldChange('backgroundPic', {
              data: ev,
            });
          }}
        />
      </ChainForm>
    );
  }
}

export default createForm({ scrollToError: true })(TitleSettingForm);
