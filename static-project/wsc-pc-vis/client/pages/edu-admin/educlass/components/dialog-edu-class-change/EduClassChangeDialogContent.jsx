
import { Form } from '@zent/compat';
import React, { Component } from 'react';
import { BlockLoading, Button, Notify, Radio } from 'zent';
import { ValuntaryAsyncSelect } from 'components/valuntary-async-select/ValuntaryAsyncSelect';
import { deleteEmptyProperty } from '../../utils';

import Option from './Option';

import { getClassList, changeStudent, addStudent, removeClassStu } from '../../api';

import { getAssetClassUpdateInfo } from './api';
import parseDate from 'zan-utils/date/parseDate';

import { OperatorField } from '@ability-center/common/operator';

const { createForm, Field, getControlGroup, FormRadioGroupField, FormInputField, FormSelectField } = Form;

const AsyncSelectField = getControlGroup(ValuntaryAsyncSelect);
const userInfo = window._global.userInfo || {};

class EduClassChangeDialogContent extends Component {
  state = {
    submitLoading: false,
    info: { student: {}, eduClass: {}, userAssert: {}, transoutClassOptions: [], eduClassList: [], assetClassList: [] },
  };
  onSubmit = values => {
    const { closeDialog, callback = () => { } } = this.props;
    const { type } = values;
    this.setState({ submitLoading: true });
    let funcName = '';
    let tip = '';
    switch (type) {
      case 'current':
        funcName = 'adjustCurrent';
        tip = '调班成功';
        break;
      case 'join':
        funcName = 'joinClass';
        tip = '分入新班级成功';
        break;
      case 'remove':
        funcName = 'removeClass';
        tip = '从班级移出成功';
        break;
      default:
        return;
    }
    this[funcName](values).then((res) => {
      const { failedNum = 0, failedStudents = [] } = res;
      if (failedNum) {
        if (failedStudents[0]) {
          Notify.error(failedStudents[0].msg);
        } else {
          Notify.error('调班失败');
        }
        closeDialog();
        this.setState({ submitLoading: false });
        return;
      }
      this.setState({ submitLoading: false });
      Notify.success(tip);
      callback();
      closeDialog();
    }).catch(error => {
      this.setState({ submitLoading: false });
      Notify.error(error);
    });
  };
  // 调整当前班级
  adjustCurrent = (values) => {
    const { defaultData } = this.props;
    const { info } = this.state;
    const { kdtId = '' } = defaultData;
    const { student = {}, eduClass = {} } = info;
    const { eduClassId, comment } = values;
    const param = deleteEmptyProperty({
      fromEduClassId: eduClass.id,
      toEduClassId: eduClassId,
      studentId: student.id,
      operator: {
        userId: userInfo.id,
        nickName: userInfo.nickName,
      },
      remark: comment,
      kdtId: kdtId || eduClass.kdtId || _global.kdtId,
    });
    return changeStudent(param);
  }

  // 加入新班级
  joinClass = (values) => {
    const { defaultData } = this.props;
    const { info } = this.state;
    const { kdtId = '' } = defaultData;
    const { student = {}, eduClass = {}, userAssert = {} } = info;
    const { eduClassId, comment } = values;
    return addStudent({
      addStudents: [
        {
          studentId: student.id,
          assetNo: userAssert.assetNo
        }
      ],
      eduClassId: eduClassId,
      kdtId: kdtId || eduClass.kdtId || _global.kdtId,
      remark: comment
    });
  }

  // 移出班级
  removeClass = (values) => {
    const { defaultData } = this.props;
    const { info } = this.state;
    const { kdtId = '' } = defaultData;
    const { student = {}, eduClass = {} } = info;
    const { comment } = values;
    return removeClassStu({
      stuId: student.id,
      classId: eduClass.id,
      kdtId: kdtId || eduClass.kdtId || _global.kdtId,
      remark: comment
    });
  }

  getEduClassStateByStudent = (eduClass = {}, classStat = {}) => {
    const { info } = this.state;
    const { userAssert = {}, eduClassList = [] } = info;
    // 状态优先级 已结班 已满员 资产情况
    const stateInfo = {
      tip: '',
      see: false,
      disabled: false,
      eduClass: {
        eduClassId: eduClass.id,
        eduCourseId: eduClass.eduCourseId,
      },
    };
    if (Date.now() > eduClass.endTime) {
      stateInfo.disabled = true;
      stateInfo.tip = '已结班';
      return stateInfo;
    }

    if (classStat.currentStuNum >= eduClass.maxStuNum) {
      stateInfo.disabled = true;
      stateInfo.tip = '已满员';
      return stateInfo;
    }

    // 3 按期购买的资产
    if (+userAssert.courseSellType === 3) {
      return stateInfo;
    }

    if (userAssert.endTime && +parseDate(userAssert.endTime, 'YYYY-MM-DD HH:mm:ss') < eduClass.startTime) {
      stateInfo.disabled = true;
      stateInfo.tip = '学员课程在开班日期前到期';
      stateInfo.see = true;
      return stateInfo;
    }

    if (userAssert.startTime && +parseDate(userAssert.startTime, 'YYYY-MM-DD HH:mm:ss') > eduClass.endTime) {
      stateInfo.disabled = true;
      stateInfo.tip = '学员课程在结班日期前未生效';
      stateInfo.see = true;
      return stateInfo;
    }

    if (eduClassList.findIndex(item => item.id === eduClass.id) !== -1) {
      stateInfo.disabled = true;
      stateInfo.tip = '学员已在本班';
      stateInfo.see = true;
      return stateInfo;
    }

    return stateInfo;
  };

  getEduClassOptions = (query, pageRequest) => {
    const { defaultData } = this.props;
    const { kdtId = '' } = defaultData;
    const { info } = this.state;
    const { userAssert = {}, eduClass = {} } = info;
    const nowEduClassNo = eduClass.eduClassNo;
    const param = {
      eduClassName: query,
      kdtId: kdtId || eduClass.kdtId || _global.kdtId,
    };

    // 判断是否是通用课时包
    if (+userAssert.type !== 1) {
      param.eduCourseId = eduClass.eduCourseId;
    }

    return getClassList({
      filter: deleteEmptyProperty(param),
      pageRequest,
    }).then(({ content = [], total, pageable }) => {
      const options = [];
      content.map(({ eduClass = {}, classStat = {} }) => {
        const stateInfo = this.getEduClassStateByStudent(eduClass, classStat);
        if (eduClass.eduClassNo === nowEduClassNo) return;
        stateInfo.title = eduClass.eduClassName;
        const option = {
          text: <Option stateInfo={stateInfo} kdtId={kdtId} />,
          value: eduClass.id,
        };
        if (stateInfo.disabled) {
          option.disabled = { state: 'disabled' };
        }
        options.push(option);
      });
      if (pageRequest.pageNumber === 1) {
        // options.unshift({ text: '全部', value: '' });
      }

      return options;
    });
  };

  getClassinfo = () => {
    const { defaultData = {} } = this.props;
    const { studentId, assetNo, kdtId, eduClassId } = defaultData;
    getAssetClassUpdateInfo({
      studentId,
      assetNo,
      kdtId
    })
      .then(data => {
        const dataStudent = data.student || {};
        const eduClassList = data.eduClassList || [];
        const assetClassList = data.assetClassList || [];
        const student = {
          id: dataStudent.id,
          name: dataStudent.name,
        };
        const transoutClassOptions = assetClassList.map(item => {
          return {
            value: item.id,
            text: item.eduClassName
          };
        });

        const userAssert = {
          courseSellType: data.courseSellType,
          endTime: data.endTime,
          startTime: data.startTime,
          type: data.type,
          assetNo
        };

        this.setState({
          info: { student, userAssert, eduClassList, assetClassList, transoutClassOptions, eduClass: {} },
        }, () => {
          if (eduClassId) {
            this.transoutClassChange(eduClassId);
          } else {
            assetClassList[0] && this.transoutClassChange(assetClassList[0].id);
          }
        });
      });
  }

  componentDidMount() {
    this.getClassinfo();
  }

  transoutClassChange = (classId) => {
    const { assetClassList } = this.state.info;
    let classItem = assetClassList.find(item => item.id === classId);
    this.setState({
      info: {
        ...this.state.info,
        eduClass: {
          eduClassName: classItem.eduClassName,
          id: classItem.id,
          kdtId: classItem.kdtId,
          eduCourseId: classItem.eduCourseId,
          endTime: classItem.endTime,
          maxStuNum: classItem.maxStuNum,
          startTime: classItem.startTime,
          eduClassNo: classItem.eduClassNo,
        }
      }
    });
  }

  render() {
    const { handleSubmit, closeDialog, zentForm } = this.props;
    const { submitLoading, info } = this.state;
    const { eduClass = {}, transoutClassOptions, userAssert } = info;
    const { type } = zentForm.getFormValues();
    return (
      <BlockLoading>
        <div className="class-change-dialog-content">
          <Form
            horizontal
            onSubmit={handleSubmit(this.onSubmit)}
            className="class-change-dialog-content__form"
          >
            <FormRadioGroupField
              name="type"
              label="调整类型："
              autoWidth={true}
              value={transoutClassOptions.length > 0 ? 'current' : 'join'}
            >
              <Radio value="current" disabled={transoutClassOptions.length === 0}>调整当前班级</Radio>
              <Radio value="join" disabled={userAssert.courseSellType === 3}>分入新班级</Radio>
              <Radio value="remove" disabled={transoutClassOptions.length === 0}>从班级移出</Radio>
            </FormRadioGroupField>
            {type !== 'join' && transoutClassOptions.length > 0 &&
              <FormSelectField
                name="eduClassIdOut"
                label="调出班级："
                width="240px"
                required
                disabled={transoutClassOptions.length <= 1}
                value={eduClass.id}
                onChange={this.transoutClassChange}
                data={transoutClassOptions}
              />
            }
            {type !== 'remove' &&
              <Field
                name="eduClassId"
                label="调入班级："
                width="240px"
                popupClassName='class-select-popup'
                component={AsyncSelectField}
                getOptions={this.getEduClassOptions}
                create={false}
                refresh={false}
                placeholder="请选择班级"
                autoWidth={true}
                required
                validations={{ required: true }}
                validationErrors={{
                  required: '请选择班级',
                }}
              />
            }
            <Field
              name="operator"
              label="操作人："
              component={OperatorField}
            />
            <FormInputField
              label="备注："
              name="comment"
              width="426px"
              type="textarea"
              className="class-change-dialog-content__mark"
              placeholder="修改原因，100字以内"
              helpDesc="商家备注用户不可见"
              validations={{ maxLength: 100 }}
              validationErrors={{
                maxLength: '最多输入100字',
              }}
            />
            <div className="class-dialog-form__actions">
              <Button outline onClick={closeDialog}>
                取消
              </Button>
              <Button type="primary" loading={submitLoading} htmlType="submit">
                确定
              </Button>
            </div>
          </Form>
        </div>
      </BlockLoading>
    );
  }
}

const wrapped = createForm()(EduClassChangeDialogContent);

export default wrapped;
