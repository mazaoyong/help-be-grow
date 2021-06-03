import React from 'react';
import { Dialog, Radio, Button, Input, Notify, FormControl, FormError } from 'zent';
import { Dialog as EbizDialog } from '@youzan/ebiz-components';
import accAdd from '@youzan/utils/number/accAdd';
import accSub from '@youzan/utils/number/accSub';
import accMul from '@youzan/utils/number/accMul';
import accDiv from '@youzan/utils/number/accDiv';
import cx from 'classnames';
import CommonLink from 'components/common-link';
import { checkCourseTime } from '../../../../../api/student-detail';
import './style.scss';
import { IEditCourseTimeProps, IModifyTypeTipsProps, IOpenDoubleCheckProps, IEditCourseTimeReturns, IAssetCourseTimeUpdateInfoReturns, IEditCourseTimeState } from './types';
import { IDialogChildrenProps } from '@youzan/ebiz-components/es/types/dialog';
import { EDIT_TYPE, EDIT_REMOVE_TYPE } from './constants';
import { getAssetCourseTimeUpdateInfo } from './api';
import { IEduAssetBriefQuery } from 'definitions/api/owl/pc/AssetFacade/getAssetCourseTimeUpdateInfo';

const RadioGroup = Radio.Group;
const { openDialog, closeDialog } = Dialog;
const { DialogBody, DialogFooter: EbizDialogFooter } = EbizDialog;

const ModifyTypeTips: React.FC<IModifyTypeTipsProps> = props => {
  let el = <></>;
  if (props.type === EDIT_TYPE.REMOVE) {
    el = (
      <div className="modify-type-tips">建议只作为纠错使用，若因消课需要扣减课时，请使用签到功能；若因退课需
      要扣减课时，请使用退课功能</div>
    );
  }
  return (
    el
  );
};

const openDoubleCheck = (props: IOpenDoubleCheckProps) => {
  const id = 'doubleCheck';
  const changeActionWord = props.type === EDIT_TYPE.SEND ? '免费获赠' : '被扣减';
  const remainNum = props.type === EDIT_TYPE.SEND
    ? accAdd(props.changedNum, props.remainNum) : accSub(props.remainNum, props.changedNum);
  const totalNum = props.type === EDIT_TYPE.SEND ? accAdd(props.totalNum, props.changedNum) : props.totalNum;

  const courseDesc = props.type === EDIT_TYPE.SEND ? ''
    : (props.reduceType === EDIT_REMOVE_TYPE.BUY ? '购买' : '赠送');

  return new Promise<void>((resolve, reject) => {
    openDialog({
      dialogId: id, // id is used to close the dialog
      title: '提示',
      children: (
        <div>
          <p>
      调整后，学员将{ changeActionWord }{ accDiv(props.changedNum, 100) }个{courseDesc}课时。
最终课时为：剩余课时 { accDiv(remainNum, 100) } / 总课时 { accDiv(totalNum, 100) }
          </p>
          <p>是否确认修改？</p>
        </div>
      ),
      footer: (
        <DialogFooter
          onCancel={() => {
            closeDialog(id);
            reject();
          }}
          onOk={() => {
            closeDialog(id);
            resolve();
          }}
        />
      ),
      onClose() {
      },
    });
  });
};

const checkSmallerThanCent = (money: number | string) => {
  return (accMul(Number(money), 100)).toString().search(/\./) > -1;
};

class EditCourseTime extends
  React.Component<IDialogChildrenProps<IEditCourseTimeReturns, IEditCourseTimeProps>, IEditCourseTimeState> {
  state = {
    type: EDIT_TYPE.SEND,
    reduceType: EDIT_REMOVE_TYPE.BUY, // 扣减课时类型
    number: 0,
    mark: '',
    inputCheckErrorMsg: '',
    inputMarkErrorMsg: '',

    localData: {} as IEditCourseTimeState['localData'],
  }

  // 关闭对话窗
  handleCloseDialog = () => {
    this.props.dialogref.close();
  };

  handleOk = () => {
    const { dialogref, data } = this.props;
    const { type, number, localData, reduceType, mark } = this.state;
    const { courseTime } = localData;
    this.proxyCheckInput()
      .then(passCheck => {
        if (passCheck) {
          return this.checkMarkInput();
        } else {
          return Promise.reject();
        }
      })
      .then(() => {
        openDoubleCheck({
          type: type,
          changedNum: accMul(number, 100),
          remainNum: courseTime.remaining,
          totalNum: courseTime.total,
          reduceType: reduceType,
        })
          .then(() => {
            dialogref.submit({
              ...data,
              type: type,
              number,
              reduceType,
              mark,
            });
          });
      });
  };

  proxyCheckInput = () => {
    return this.firstCheckInput()
      .then(this.checkInput);
  };

  firstCheckInput = () => {
    const { type, number } = this.state;
    return new Promise<void>((resolve, reject) => {
      if (type === EDIT_TYPE.SEND) {
        if (!number) {
          this.setState({ inputCheckErrorMsg: '请填写赠送课时数' });
          reject();
        } else if (Number(number) <= 0 || checkSmallerThanCent(number)) {
          this.setState({ inputCheckErrorMsg: '请填写大于0的数字，支持2位小数' });
          reject();
        }
      } else if (type === EDIT_TYPE.REMOVE) {
        if (!number) {
          this.setState({ inputCheckErrorMsg: '请填写扣减课时数' });
          reject();
        } else if (Number(number) <= 0 || checkSmallerThanCent(number)) {
          this.setState({ inputCheckErrorMsg: '请填写大于0的数字，支持2位小数' });
          reject();
        }
      }
      resolve();
    });
  };

  checkInput = () => {
    const { data } = this.props;
    const { studentId, kdtId, assetNo } = data;
    const { reduceType, mark, type, number } = this.state;
    return checkCourseTime({
      kdtId,
      assetNo: assetNo,
      studentId: studentId,
      updateCourse: accMul(number, 100),
      updateType: type,
      changeType: reduceType,
      remark: mark,
    })
      .then(data => {
        if (!data.success) {
          this.setState({ inputCheckErrorMsg: data.failedMessage });
        }
        return data.success;
      })
      .catch(err => err && Notify.error(err));
  }

  handleMarkChange = (e) => {
    this.setState({ mark: e.target.value }, this.checkMarkInput);
  }

  checkMarkInput = () => {
    const { mark } = this.state;
    console.log('mark', mark);

    return new Promise<void>((resolve, reject) => {
      if (mark && mark.length > 100) {
        this.setState({
          inputMarkErrorMsg: '最多输入100字'
        });
        reject();
      } else {
        this.setState({
          inputMarkErrorMsg: ''
        });
        resolve();
      }
    });
  }

  getShowData = () => {
    const { inputCheckErrorMsg, type, inputMarkErrorMsg, mark, localData, reduceType } = this.state;
    const { operator = { operatorName: '-', operatorPhone: '-' } } = window._global;

    const { courseName, eduCourseName, courseTime, assetNo } = localData;

    if (assetNo) {
      const courseContent = `剩余课时${accDiv(courseTime.remaining, 100)} / 总课时${accDiv(courseTime.total, 100)}`;
      const courseContentGift = `（含赠送${accDiv(courseTime.reward, 100)}课时）`;
      const courseContentWithGift = courseTime.reward ? `${courseContent}${courseContentGift}` : `${courseContent}`;

      return [
        {
          label: '线下课',
          content: courseName,
          isContentShow: true,
        },
        {
          label: '适用课程',
          content: eduCourseName,
          isContentShow: true,
        },
        {
          label: '课时',
          content: courseContentWithGift,
          isContentShow: true,
        },
        {
          label: '修改类型',
          content: (
            <div>
              <RadioGroup
                className="dialog-radio"
                onChange={e => this.setState({ type: e.target.value as number, inputCheckErrorMsg: '' })}
                value={type}
              >
                <Radio value={EDIT_TYPE.SEND}>赠送课时</Radio>
                <Radio value={EDIT_TYPE.REMOVE}>扣减剩余课时</Radio>
              </RadioGroup>
              <ModifyTypeTips type={type} />
            </div>
          ),
          require: true,
        },
        {
          label: '扣减课时',
          content: (
            <RadioGroup
              className="dialog-radio"
              onChange={e => this.setState({ reduceType: e.target.value as number, inputCheckErrorMsg: '' })}
              value={reduceType}
            >
              <Radio value={EDIT_REMOVE_TYPE.BUY}>购买课时</Radio>
              <Radio value={EDIT_REMOVE_TYPE.GIFT}>赠送课时</Radio>
            </RadioGroup>
          ),
          require: true,
          hidden: type !== EDIT_TYPE.REMOVE
        },
        {
          label: '',
          isFieldLike: true,
          content: (
            <FormControl
              required={true}
              label={type === EDIT_TYPE.SEND ? '赠送数量：' : '扣减数量：'}
              invalid={!!inputCheckErrorMsg}
              className="field-dialog-item"
            >
              <div>
                <Input
                  className={cx('dialog-input')}
                  onBlur={this.proxyCheckInput}
                  type="number"
                  onChange={(e) => {
                    this.setState({ number: e.target.value as unknown as number, inputCheckErrorMsg: '' });
                  }}
                  addonAfter="课时"
                  width="185px"
                  placeholder="请输入课时数"
                />
                {
                  type === EDIT_TYPE.REMOVE ? (
                    <p className="field-dialog-item__help-desc">本次最多扣减{reduceType === EDIT_REMOVE_TYPE.BUY ? '购买' : '赠送'}课时{reduceType === EDIT_REMOVE_TYPE.BUY ? accDiv(courseTime.mainRemaining, 100) : accDiv(courseTime.rewardRemaining, 100)}课时</p>
                  ) : null
                }
                {inputCheckErrorMsg && (<FormError className="field-dialog-item__error">{inputCheckErrorMsg}</FormError>)}
              </div>
            </FormControl>
          ),
          require: false,
        },
        {
          label: '发送通知',
          content: (
            <span>
              可在
              <CommonLink
                className="post-message-link"
                url={`${_global.url.v4}/message/messagepush#/setting/courseTimeChangeRemind`}
                target="_blank"
              >
                消息推送
              </CommonLink>
              中设置课程变更的消息发送规则
            </span>
          )
        },
        {
          label: '操作人',
          content: `${operator.operatorName} ${operator.operatorPhone}`,
        },
        {
          isFieldLike: true,
          label: '',
          content: (
            <FormControl
              required={false}
              label="备注："
              invalid={!!inputMarkErrorMsg}
              className="field-dialog-item"
            >
              <Input
                type="textarea"
                onChange={this.handleMarkChange}
                width="426px"
                onBlur={this.checkMarkInput}
                className="dialog-mark"
                placeholder="修改原因，100字以内"
                value={mark}
              />
              <p className="dialog-mark-desc">商家备注用户不可见</p>
              {inputMarkErrorMsg && (<FormError className="field-dialog-item__error">{inputMarkErrorMsg}</FormError>)}
            </FormControl>
          ),
        },
      ];
    } else {
      return [];
    }
  }

  componentDidMount() {
    const { kdtId, assetNo, studentId } = this.props.data;
    getAssetCourseTimeUpdateInfo<IAssetCourseTimeUpdateInfoReturns, IEduAssetBriefQuery>({
      kdtId,
      assetNo,
      studentId
    })
      .then(data => {
        this.setState({
          localData: data,
        });
      })
      .catch(err => Notify.error(err || '网络错误'));
  }

  render() {
    const { loadingState } = this.props;
    const renderDate = this.getShowData().filter(o => !o.hidden);
    return (
      <>
        <DialogBody>
          {renderDate.map((item, index) => (
            item.isFieldLike ? (
              <div key={index}>{item.content}</div>
            ) : (
              <div key={index} className={`dialog-item ${item.isContentShow ? 'dialog-item-content' : ''}`}>
                <span className={cx('label', item.require ? 'required' : '')}>
                  {item.label}：
                </span>
                <div className="content">{item.content}</div>
              </div>
            )
          ))}
        </DialogBody>
        <EbizDialogFooter>
          <DialogFooter
            onCancel={this.handleCloseDialog}
            onOk={this.handleOk}
            btnLoading={loadingState}
          />
        </EbizDialogFooter>
      </>
    );
  }
};

const DialogFooter = props => (
  <>
    <Button onClick={props.onCancel}>取消</Button>
    <Button type="primary" loading={props.btnLoading} onClick={props.onOk}>
      确定
    </Button>
  </>
);

export default EditCourseTime;
