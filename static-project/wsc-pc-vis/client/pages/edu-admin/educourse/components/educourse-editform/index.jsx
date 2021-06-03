
import { Form } from '@zent/compat';
import React, { PureComponent, Component } from 'react';
import { BlockLoading, Notify, Dialog, Button } from 'zent';
import { Button as SamButton } from '@youzan/sam-components';
import CourseSuitAge from '../../fields/course-suitage';
import { hashHistory } from 'react-router';
import SchoolSelector from 'components/field/shop-selector';
import { checkCourseName } from '../../../api/educourse';
import { isInStoreCondition, ShowWrapper } from 'fns/chain';
import throttle from 'lodash/throttle';
import uuid from 'uuid';
import './index.scss';
const { createForm, FormInputField } = Form;
const { openDialog, closeDialog } = Dialog;

const pushState = throttle(() => {
  window.history.pushState({ name: 'browserBack' }, 'on browser back click', window.location.href);
  window.history.pushState({ name: 'browserBack' }, 'on browser back click', window.location.href);
}, 1000);

class EduCourseEditForm extends (PureComponent || Component) {
  componentDidMount() {
    window.addEventListener('beforeunload', this.handleWindowClose);
    window.addEventListener('popstate', this.handleGoBack);
  }

  componentDidUpdate() {
    pushState();
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.handleWindowClose);
    window.removeEventListener('popstate', this.handleGoBack);
  }

  handleWindowClose = async (e) => {
    e.returnValue = '确认';
  }

  handleGoBack = e => {
    if (e.state) {
      this.openGoBackDialog();
    };
  }

  openGoBackDialog = () => {
    const dialogId = uuid.v4();
    openDialog({
      dialogId,
      children: <div>
        <p>此时离开将丢失已编辑的内容，是否离开？</p>
      </div>,
      footer: <>
        <Button onClick={() => {
          closeDialog(dialogId);
          window.history.pushState({ name: 'browserBack' }, 'on browser back click', window.location.href);
        }} >
          取消
        </Button>
        <Button onClick={() => {
          closeDialog(dialogId);
          hashHistory.push('/list');
        }} type="primary">
          确定
        </Button>
      </>,
    });
  }

  validateCourseName = (_, value) => {
    const { id } = this.props;
    const finalValue = value.trimStart().trimEnd();
    return new Promise((resolve, reject) => {
      if (!finalValue) {
        reject('请输入课程名称');
      } else {
        checkCourseName({ eduCourseName: finalValue, eduCourseId: id }).then(resp => {
          if (!resp) {
            resolve();
          } else {
            reject('已存在同名课程，课程名称不可重复');
          }
        }).catch(err => {
          Notify.error(err);
          reject('校验课程名称失败，请重新输入');
        });
      }
    });
  }

  render() {
    const { handleSubmit, handleSave, className, ...props } = this.props;
    return (
      <div className={className}>
        <BlockLoading loading={props.loading}>
          <Form horizontal onSubmit={handleSubmit(handleSave)}>
            <div className="educourse-fieldgroup">
              <FormInputField
                name="eduCourseName"
                className="educourse-name"
                label="课程名称:"
                disabled={isInStoreCondition({
                  supportEduBranchStore: true,
                })}
                maxLength={20}
                placeholder="最多输入20个字"
                value={props.eduCourseName}
                required
                validateOnChange={false}
                asyncValidation={this.validateCourseName}
              />
              {/* <FormRadioGroupField
                name="eduCourseType"
                label="授课方式:"
                value={props.eduCourseType}
                disabled={isInStoreCondition({
                  supportEduBranchStore: true,
                })}
              >
                <Radio value={1}>班课</Radio>
                <Pop trigger="hover" content="暂不支持">
                  <Radio disabled={true} value={2}>
                    1对1
                  </Radio>
                </Pop>
              </FormRadioGroupField> */}
              <CourseSuitAge
                label="适用年龄:"
                name="courseSuitAge"
                disabled={isInStoreCondition({
                  supportEduBranchStore: true,
                })}
                onChange={props.onAgeRangeChange}
                value={props.courseSuitAge}
                validations={{
                  format(formValues, fieldValue) {
                    if (fieldValue.maxApply !== '' && parseInt(fieldValue.minApply) > parseInt(fieldValue.maxApply)) {
                      return '请输入正确的年龄范围';
                    } else if (fieldValue.minApply === '' && fieldValue.maxApply !== '') {
                      return '请输入最小年龄';
                    } else {
                      return true;
                    }
                  },
                }}
              />
              {ShowWrapper(
                { children:
                  <SchoolSelector id={props.id} isEdit={props.isEdit} shopInfo={props.shopInfo}>
                  </SchoolSelector>,
                isInStoreCondition: isInStoreCondition({
                  supportEduHqStore: true, // todo: add privilege check
                }),
                })}
            </div>
            <div className="app-design">
              <div className="app-action">
                <SamButton onClick={_ => this.openGoBackDialog()}>取消</SamButton>
                <SamButton type="primary" loading={false} htmlType="submit">
                  保存
                </SamButton>
              </div>
            </div>
          </Form>
        </BlockLoading>
      </div>
    );
  }
}
export default createForm()(EduCourseEditForm);
