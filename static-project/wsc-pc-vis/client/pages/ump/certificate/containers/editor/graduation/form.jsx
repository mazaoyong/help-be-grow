
import { Pop, Form } from '@zent/compat';
import React, { PureComponent } from 'react';
import { Checkbox, Icon, Radio } from 'zent';
import ShopSelector from 'components/field/shop-selector';
import { isInStoreCondition, ShowWrapper } from 'fns/chain/index';

import CourseSelectField from '../../../components/course-select-field';
import StyleSelectField from '../../../components/style-select-field';
import TimingSelectField from '../../../components/timing-select-field';
import imageUploadField from '../../../components/image-upload-field';
import ButtonGroup from '../../../components/btn-group';

const { Field, FormInputField, FormCheckboxGroupField, FormRadioGroupField } = Form;

export default class GraduationForm extends PureComponent {
  render() {
    const { initialValue, value, editing, issueLimit, handleSubmit, onSubmit } = this.props;
    const issueType = value.course && value.course.issueType;
    return (
      <Form className="certificate-editor-form" horizontal onSubmit={handleSubmit(onSubmit)}>
        <Field
          name="course"
          value={initialValue.course}
          component={CourseSelectField}
          label="选择线下课："
          required
          helpDesc="证书暂时只能发放给活动创建后才购买课程的学员"
          asyncValidation={(values, value) => new Promise((resolve, reject) => {
            if (!value || !value.sourceId) {
              return reject('请选择线下课');
            }
            resolve();
          })}
          disabled={editing}
          ext="2"
        />
        <div className="certificate-editor-title">证书设置</div>
        <FormInputField
          name="name"
          value={initialValue.name}
          type="text"
          width="260px"
          label="证书名称："
          required
          disabled={editing}
          placeholder="请输入证书名称，不超过10个字"
          helpDesc="名称用于证书管理，在用户端不展示"
          asyncValidation={(values, value) => new Promise((resolve, reject) => {
            if (!value) {
              return reject('请输入证书名称');
            }
            if (value.length > 10) {
              return reject('证书名称不超过10个字');
            }
            resolve();
          })}
        />
        <FormInputField
          name="title"
          value={initialValue.title}
          type="text"
          width="260px"
          label="证书标题："
          required
          placeholder="请输入证书标题，不超过5个字"
          helpDesc="标题展示在证书中"
          asyncValidation={(values, value) => new Promise((resolve, reject) => {
            if (!value) {
              return reject('请输入证书标题');
            }
            if (value.length > 5) {
              return reject('证书标题不超过5个字');
            }
            resolve();
          })}
        />
        <Field
          name="style"
          value={initialValue.style}
          component={StyleSelectField}
          label="风格："
          required
          type="graduation"
        />
        <FormCheckboxGroupField
          name="show"
          value={initialValue.show}
          label="展示数据："
        >
          <Checkbox value="showConsumeCount">
            <Pop
              trigger="hover"
              content="上课次数 = 总消课次数 (单位: 次)"
            >
              <span>
                上课次数
                <Icon type="help-circle" className="certificate-editor-icon" />
              </span>
            </Pop>
          </Checkbox>
          <Checkbox value="showCheckinDays">
            <Pop
              trigger="hover"
              content="统一根据用户上课签到天数计数"
            >
              <span>
                学习时长
                <Icon type="help-circle" className="certificate-editor-icon" />
              </span>
            </Pop>
          </Checkbox>
        </FormCheckboxGroupField>
        <FormInputField
          name="praiseText"
          value={initialValue.praiseText}
          placeholder="请输入证书中需要展示的鼓励文案，如恭喜毕业，文字50字以内。"
          type="textarea"
          label="鼓励文案："
          width="360px"
          asyncValidation={(values, value) => new Promise((resolve, reject) => {
            if (value.length > 50) {
              return reject('鼓励文案不超过50个字');
            }
            resolve();
          })}
        />
        <FormInputField
          name="signatureText"
          value={initialValue.signatureText}
          placeholder="请输入证书中需要展示的落款文案，如有赞学院，文字15字以内。"
          type="textarea"
          label="落款文案："
          width="360px"
          asyncValidation={(values, value) => new Promise((resolve, reject) => {
            if (value.length > 15) {
              return reject('落款文案不超过15个字');
            }
            resolve();
          })}
        />
        <FormRadioGroupField
          name="qrType"
          value={initialValue.qrType}
          label="底部二维码："
          required
        >
          <Radio value={0}>线下课二维码</Radio>
          <Radio value={1}>自定义上传</Radio>
        </FormRadioGroupField>
        {
          value.qrType ? (
            <Field
              name="qrUrl"
              value={initialValue.qrUrl}
              component={imageUploadField}
              label="风格："
              required
            />
          ) : null
        }
        <FormInputField
          name="shareText"
          value={initialValue.shareText}
          placeholder="请输入二维码右侧需要展示的分享语，如课程名师团等你来约，文字14字以内。"
          type="textarea"
          label="分享语："
          width="360px"
          required
          asyncValidation={(values, value) => new Promise((resolve, reject) => {
            if (!value) {
              return reject('请输入分享语');
            }
            if (value.length > 14) {
              return reject('分享语不超过14个字');
            }
            resolve();
          })}
        />
        {
          issueType !== undefined ? (
            <>
              <div className="certificate-editor-title">发放节点设置</div>
              <Field
                name="issue"
                value={initialValue.issue}
                label="发放节点："
                required
                issueType={issueType}
                issueLimit={issueLimit}
                disabled={editing}
                component={TimingSelectField}
                asyncValidation={(values, value) => new Promise((resolve, reject) => {
                  switch (issueType) {
                    case 1:
                      if (value.issuePercentage > 100 || value.issuePercentage < 80) {
                        return reject('填写范围 80% - 100% 的数据');
                      }
                      break;
                    case 2:
                    case 3:
                      if (value.beforeDays < 0 || (issueLimit && value.beforeDays > issueLimit)) {
                        return reject(`请填写范围 0-${issueLimit} 之间的数据`);
                      }
                      break;
                  }
                  resolve();
                })}
              />
            </>
          ) : null}
        {ShowWrapper({
          children: (
            <ShopSelector
              shopInfo={{
                applicableCampusList: initialValue.campusShopList || [],
                applicableCampusType: initialValue.applyType || 0,
              }}
              isEdit={editing}
              label={'适用校区：'}
              isCheckRemove={false}
              isCanDelete={!editing}
              required={true}
            />
          ),
          isInStoreCondition: isInStoreCondition({
            supportEduHqStore: true,
          }),
        })}
        <ButtonGroup />
      </Form>
    );
  }
}
