import { Pop } from '@zent/compat';
import React, { PureComponent } from 'react';
import { VisList, VisTable } from 'components/vis-list';
import { number } from '@youzan/utils';
import { Notify, Dialog, Button, Icon } from 'zent';
import { Link as SamLink, Button as SamButton } from '@youzan/sam-components';
import { EasyList } from '@youzan/ebiz-components';
import { openSignInDialog, getTitle } from '@ability-center/appointment/signin-util';
import { getScheduleStudents, removeStudent, modifyStatus, batchRemoveStudent } from '../api';
import { CommentDialog } from '@ability-center/supv/moments';
import ModifyStatus from './ModifyStatus';
import TrialTag from '../../../components/trial-tag';

const urlPrefix = window._global.url && window._global.url.v4;
const { openDialog, closeDialog } = Dialog;
const { GridSweetAlert } = EasyList;

export default class List extends PureComponent {
  _maxTotal = 0;
  render() {
    const { childRef, zanQueries, onAdd, profile = {} } = this.props;
    return (
      <div>
        <VisList>
          <VisTable
            selectable
            scroll={{
              x: 1300,
            }}
            rowKey="stuLessonNo"
            ref={childRef}
            zanQueries={zanQueries}
            fetchData={this.fetchData}
            columns={this.columns()}
            batchComponents={this.batchComponents()}
            emptyLabel={
              !profile.isTrial && (
                <>
                  还没有数据，你可以
                  <SamLink name="编辑" href="javascript:void(0);" onClick={onAdd}>
                    添加学员
                  </SamLink>
                </>
              )
            }
          />
        </VisList>
      </div>
    );
  }

  batchComponents = () => {
    return [
      <span key="pure" style={{ marginRight: '8px' }}>
        当页全选
      </span>,
      data => {
        const btnGlobalProps = {
          disabled: !data || data.length === 0,
        };
        return (
          <div className="schedule-detail__batch-ops">
            <SamButton
              name="编辑"
              key="batch-attendance"
              onClick={this.createClickHandler(0, data, true)}
              {...btnGlobalProps}
            >
              签到
            </SamButton>
            <SamButton
              name="编辑"
              key="batch-leave"
              onClick={this.createClickHandler(1, data, true)}
              {...btnGlobalProps}
            >
              请假
            </SamButton>
            <SamButton
              name="编辑"
              key="batch-truancy"
              onClick={this.createClickHandler(2, data, true)}
              {...btnGlobalProps}
            >
              未到
            </SamButton>
            <SamButton
              name="编辑"
              key="batch-comment"
              onClick={this.createBatchMoment.bind(this, data)}
              {...btnGlobalProps}
            >
              点评
            </SamButton>
            <GridSweetAlert
              text={
                <div className="schedule-detail__batch-item">
                  <SamButton name="移除" key="batch-remove" {...btnGlobalProps} onClick={e => e.preventDefault()}>
                    移除
                  </SamButton>
                </div>
              }
              content={`是否要移除这${data.length}名学员？`}
              onConfirm={this.batchRemoveStudent.bind(this, data)}
            />
          </div>
        );
      },
    ];
  };

  batchRemoveStudent = params => {
    const { afterSignIn } = this.props;
    const targetKdtId = _global.kdtId;
    batchRemoveStudent({
      kdtId: targetKdtId,
      studentLessonNos: params.map(data => data.stuLessonNo),
    })
      .then(res => {
        const { successNum, failedNum } = res;
        Notify.success(
          `成功移除${successNum}名学员${failedNum > 0 ? `，${failedNum}名学员移除失败` : ''}`,
        );
      })
      .finally(afterSignIn)
      .catch(Notify.error);
  };

  fetchData = params => {
    const formattedPrams = this.formatData(params);
    return getScheduleStudents(formattedPrams).then(
      ({ content, total, pageable: { pageNumber } = {} }) => {
        if (total > this._maxTotal) {
          this._maxTotal = total;
        }
        return {
          datasets: content,
          total,
          current: Number(pageNumber) || 1,
        };
      },
    );
  };

  formatData = ({ filterConditions, pageConditions }) => {
    const { lessonNo, kdtId } = this.props;
    const { signInStatus } = filterConditions || {};
    const { pageNumber, pageSize } = pageConditions || {};
    return {
      pageRequest: { pageNumber, pageSize },
      query: { lessonNo, signInStatus, kdtId },
    };
  };

  columns = () => {
    return [
      {
        title: '学员',
        fixed: 'left',
        bodyRender: data => {
          const uid = data.student && data.student.id;
          const studentUrl = `${urlPrefix}/vis/edu/page/student#/detail/${uid}`;
          let text = '-';
          if (data.student && data.student.name) {
            text = (
              <a
                href={studentUrl}
                className="schedule-detail_list-name"
                rel="noopener noreferrer"
                target="_blank"
              >
                {data.student.name}
              </a>
            );
            // if (!data.student.deleted) {}
          }
          return (
            <span>
              {text}
              {data.isTrial ? <TrialTag /> : null}
            </span>
          );
        },
      },
      {
        title: '手机号',
        bodyRender: data => {
          return <span>{(data.student && data.student.mobile) || '-'}</span>;
        },
      },
      {
        title: (
          <span>
            剩余课时
            <Pop
              trigger="hover"
              content={
                <>
                  <p>剩余课时=购买课时+赠送课时-已用课时=可用课时+冻结课时</p>
                  <p>如果有预约日程，则剩余课时包含预约冻结的课时。</p>
                </>
              }
            >
              <Icon type="help-circle" style={{ color: '#A0A0A0' }} />
            </Pop>
          </span>
        ),
        bodyRender: data => {
          return <span>{data.remaining < 0 ? '-' : number.accDiv(data.remaining, 100)}</span>;
        },
      },
      {
        title: '课程有效期',
        name: 'eduCourseValidDescription',
      },
      {
        title: '扣除课时',
        bodyRender: data => {
          return data.consumeNum === -1 ? '-' : number.accDiv(data.consumeNum, 100);
        },
      },
      {
        title: '签到状态',
        bodyRender: data => {
          switch (data.signInStatus) {
            case 2:
              return <span className="sign-orange">待签到</span>;
            case 4:
              return <span className="sign-blue">已签到</span>;
            case 6:
              return <span className="sign-grey">未到</span>;
            default:
              return <span className="sign-red">请假</span>;
          }
        },
      },
      {
        title: '操作',
        fixed: 'right',
        textAlign: 'right',
        width: '180px',
        bodyRender: data => {
          const { signInStatus } = data;
          const Pops = Pop.withPop(({ pop }) => {
            return (
              <>
                <SamLink
                  name="编辑"
                  href="javascript: void(0);"
                  onClick={this.showRemoveStudentModal.bind(this, data)}
                >
                  移除
                </SamLink>
                <span style={{ color: '#DCDEE0' }}>{` | `}</span>
                <SamLink
                  name="编辑"
                  href="javascript: void(0);"
                  onClick={() => {
                    window.Logger &&
                      window.Logger.log({
                        et: 'custom', // 事件类型
                        ei: 'create_moment', // 事件标识
                        en: '点击点评按钮', // 事件名称
                        params: {
                          operator_source: 'wsc-pc-vis',
                        }, // 事件参数
                      });
                    pop.close();
                    this.createSingleMoment(data);
                  }}
                >
                  点评
                </SamLink>
              </>
            );
          });
          if (signInStatus) {
            // 待签到
            if (signInStatus === 2) {
              return (
                <span className="schedule-detail_list-op">
                  <SamLink
                    name="编辑"
                    href="javascript: void(0);"
                    onClick={this.createClickHandler(0, data)}
                  >
                    签到
                  </SamLink>
                  <SamLink
                    name="编辑"
                    href="javascript: void(0);"
                    onClick={this.createClickHandler(1, data)}
                  >
                    请假
                  </SamLink>
                  <SamLink
                    name="编辑"
                    href="javascript: void(0);"
                    onClick={this.createClickHandler(2, data)}
                  >
                    未到
                  </SamLink>
                  <Pop trigger="click" content={<Pops />}>
                    <span style={{ color: '#155bd4', cursor: 'pointer' }}>...</span>
                  </Pop>
                </span>
              );
            } else {
              // 没有签到状态
              return (
                <span className="schedule-detail_list-op">
                  <SamLink
                    name="编辑"
                    href="javascript: void(0);"
                    onClick={this.showModifyStatusModal.bind(this, data)}
                  >
                    更改状态
                  </SamLink>
                  <SamLink
                    name="编辑"
                    href="javascript: void(0);"
                    onClick={this.showRemoveStudentModal.bind(this, data)}
                  >
                    移除
                  </SamLink>
                  <SamLink
                    name="编辑"
                    href="javascript: void(0);"
                    onClick={this.createSingleMoment.bind(this, data)}
                  >
                    点评
                  </SamLink>
                </span>
              );
            }
          }
          return (
            <span className="schedule-detail_list-tip">
              <SamLink
                name="编辑"
                href="javascript: void(0);"
                onClick={this.showRemoveStudentModal.bind(this, data)}
              >
                移除
              </SamLink>
            </span>
          );
        },
      },
    ];
  };

  createSingleMoment = data => {
    const { student = {} } = data;
    this.openMomonetDialog([
      {
        userId: student.id,
        userName: student.name,
        userRole: 1,
      },
    ]);
  };

  createBatchMoment = data => {
    if (data.length) {
      window.Logger &&
        window.Logger.log({
          et: 'custom', // 事件类型
          ei: 'create_batch_moments', // 事件标识
          en: '点击批量点评按钮', // 事件名称
          params: {
            operator_source: 'wsc-pc-vis',
          }, // 事件参数
        });
      this.openMomonetDialog(
        data.map(item => {
          const { student = {} } = item;
          return {
            userId: student.id,
            userName: student.name,
            userRole: 1,
          };
        }),
      );
    } else {
      Notify.error('请至少选择一名学员');
    }
  };

  openMomonetDialog = mentionedUsers => {
    const { lessonNo, profile } = this.props;
    openDialog({
      dialogId: 'comment_dialog',
      title: '写点评',
      mask: true,
      maskClosable: false,
      children: (
        <CommentDialog
          data={{
            mentionedUsers,
            lessonNo,
            kdtId: profile.kdtId || _global.kdtId,
          }}
          queryData={{
            kdtId: profile.kdtId || _global.kdtId,
            lessonNo,
            lessonName: '',
          }}
          isEdit={false}
          type={1}
          onClose={() => closeDialog('comment_dialog')}
        />
      ),
      onClose: () => {
        closeDialog('comment_dialog');
      },
    });
  };

  // 显示修改状态的模态窗
  showModifyStatusModal = data => {
    openDialog({
      dialogId: 'modifyStatus',
      title: '更改状态',
      children: (
        <ModifyStatus
          data={data}
          profile={this.props.profile}
          dialogId="modifyStatus"
          settings={this.props.settings}
          handleModifyStatus={this.handleModifyStatus}
        />
      ),
    });
  };

  // 显示移除学员的模态窗
  showRemoveStudentModal = data => {
    openDialog({
      dialogId: 'removeStudent',
      title: '移除学员',
      children: (
        <span>
          <p>{`确定移除 "${data.student.name}"学员 ？`}</p>
          <p>移除后会归还学员的课时；如果是预约上课的，会取消学员的预约。</p>
        </span>
      ),
      footer: (
        <div className="schedule-detail_removeStudent">
          <Button onClick={this.handleRemoveStudent.bind(null, data)}>移除</Button>
          <Button type="primary" onClick={() => closeDialog('removeStudent')}>
            我再想想
          </Button>
        </div>
      ),
    });
  };

  handleModifyStatus = (status, data) => {
    // this.createClickHandler(status, data);
    const { afterSignIn, kdtId } = this.props;
    const { student, signInStatus } = data;
    modifyStatus({
      operatorId: _global.userId,
      signInType: status,
      studentLessonNo: data.stuLessonNo,
      kdtId,
    })
      .then(data => {
        const modifyStr = `学员<${student.name}>,签到状态由<${getTitle(
          signInStatus,
        )}>修改为<${getTitle(status)}>`;
        Notify.success(modifyStr);
        afterSignIn();
      })
      .catch(err => Notify.error(err));
  };

  handleRemoveStudent = data => {
    const { kdtId } = this.props;
    closeDialog('removeStudent');
    const { student, stuLessonNo } = data;
    const { userId } = _global;
    removeStudent({
      studentLessonNo: stuLessonNo,
      studentId: student.id,
      operateId: userId,
      kdtId: kdtId,
    })
      .then(data => {
        if (data) {
          Notify.success('移除完成');
          this.props.afterSignIn();
        }
      })
      .catch(err => Notify.error(err));
  };

  createClickHandler = (signInType, data, isbatch = false) => () => {
    const { profile, kdtId } = this.props;
    let params = {};
    if (Array.isArray(data)) {
      if (data.length < 1) {
        Notify.error('请选择至少一位学员');
        return;
      }
      params = data.reduce(
        (obj, item) => {
          const { studentLessonNos, consumeNum, studentName } = this.formatSignInParams(
            signInType,
            item,
          );
          obj.studentLessonNos = obj.studentLessonNos.concat(studentLessonNos);
          if (obj.consumeNum < consumeNum) {
            obj.consumeNum = consumeNum || 0;
          }
          if (!obj.studentName) {
            obj.studentName = studentName;
          }
          return obj;
        },
        {
          consumeNum: 0,
          studentLessonNos: [],
        },
      );
    } else {
      params = this.formatSignInParams(signInType, data);
    }
    const { afterSignIn } = this.props;
    openSignInDialog({
      afterSignIn,
      signInType,
      startTime: profile.startTime,
      isbatch,
      ...params,
      kdtId,
    });
  };

  formatSignInParams = (signInType, data) => {
    const { profile, settings } = this.props;
    const { stuLessonNo, student, kdtId } = data;
    const { writeOffRuleLeave, writeOffRuleTruancy } = settings;

    const studentLessonNos = [stuLessonNo];
    const studentName = student && student.name;
    let consumeNum = Number(profile.consumeNum) || 0;

    if (
      data.consumeNum === -1 ||
      (signInType === 1 && !writeOffRuleLeave) ||
      (signInType === 2 && !writeOffRuleTruancy)
    ) {
      consumeNum = 0;
    }

    return {
      studentLessonNos,
      studentName,
      consumeNum,
      kdtId,
    };
  };
}
