import { Pop } from '@zent/compat';
import React, { PureComponent } from 'react';
import { Button, Dialog, ClampLines, Icon, Notify } from 'zent';
import classnames from 'classnames';
import { format } from 'date-fns';

import ConflictDialog from '../../../appointment/components/dialog-conflict';
import openStudentSelect from '../../../components/student-select';
import { getStudentBySchedule, createScheduletudent } from '../../containers/detail/api';

import './styles.scss';
import accDiv from '@youzan/utils/number/accDiv';
import { detectConflict } from '../../../appointment/api';
import { AbnormalCodePop } from '@ability-center/appointment/abnormal-util';
import { openBatchSigninDialog as openBatchAbnormalDialog } from '@ability-center/appointment/signin-util';

const { openDialog, closeDialog } = Dialog;

const urlPrefix = window._global.url.v4;

class DialogFooter extends PureComponent {
  render() {
    const { profile, table } = this.props;
    const { selectedRows } = table;
    const hasLimit = profile && profile.appointRule;
    const total = profile && profile.appointNumLeft;
    const selected = selectedRows ? selectedRows.length : 0;
    const left = total - selected;

    return (
      <div className="student-dialog-footer">
        <div className="student-dialog-footer__button-group">
          <span
            className={classnames({ 'student-dialog-footer__tip-warning': hasLimit && left < 0 })}
          >
            已选（{selected}）
          </span>
          {hasLimit ? <span>，可选（{total}）</span> : null}
        </div>
        <Button type="primary" onClick={this.props.submit}>
          确定
        </Button>
      </div>
    );
  }
}

function DialogHeader({ title }) {
  return <div className="student-dialog-header-name">以下为购买“{title}”的学员</div>;
}

export default function openStudentDialog(lessonNo, profile, afterSelect, kdtId) {
  const context = {
    filteredData: []
  };
  const title = profile.className || profile.eduCourseName;
  const submit = data => {
    const studentAssets = (data || []).map(item => ({
      studentId: item.student && item.student.id,
      assetNo: item.assetNo
    }));
    return createScheduletudent({
      lessonNo,
      studentAssets,
      kdtId: +kdtId
    }).then((resp) => {
      const { failedNum = 0, failedStudents = {}, successNum = 0 } = resp;
      openBatchAbnormalDialog({
        type: -1,
        data: {
          failedNum,
          successNum,
          studentErrorDTOS: failedStudents
        },
        onConfirm: afterSelect
      });
    });
  };
  return openStudentSelect({
    header: {
      component: <DialogHeader title={title} />,
      children: [
        {
          name: 'studentName',
          type: 'Search',
          textAlign: 'right',
          placeholder: '搜索学员名称'
        },
        {
          name: 'refresh',
          type: 'Button',
          textAlign: 'left',
          text: '刷新',
          childProps: {
            style: {
              color: '#155bd4',
              border: '0px'
            }
          }
        }
      ]
    },

    table: {
      columns: [
        {
          title: '学员',
          bodyRender(data) {
            const uid = data.student && data.student.userId;
            const studentUrl = `${urlPrefix}/vis/edu/page/student#/detail/${uid}`;
            return (
              <a
                href={studentUrl}
                className="schedule-detail_list-name"
                rel="noopener noreferrer"
                target="_blank"
              >
                {(data.student && (data.student.name || data.student.mobile)) || ''}
              </a>
            );
          }
        },
        {
          title: '手机号',
          bodyRender(data) {
            return (
              <div>
                {(data.student && data.student.mobile) || (data.parent && data.parent.mobile) || ''}
              </div>
            );
          }
        },
        {
          title: '学员家长',
          bodyRender(data) {
            const uid = data.parent && data.parent.userId;
            const studentUrl = `${urlPrefix}/scrm/customer/manage#/detail?yzUid=${uid}`;
            return (
              <a
                href={studentUrl}
                className="schedule-detail_list-name"
                rel="noopener noreferrer"
                target="_blank"
              >
                {(data.parent && (data.parent.name || data.parent.mobile)) || ''}
              </a>
            );
          }
        },
        {
          title: '线下课',
          bodyRender(data) {
            const title = (data.course && data.course.title) || '';
            return <ClampLines lines={1} text={title} />;
          }
        },
        {
          title: <span>剩余课时<Pop trigger='hover' content={<>
            <p>剩余课时=购买课时+赠送课时-已用课时=可用课时+冻结课时</p>
            <p>如果有预约日程，则剩余课时包含预约冻结的课时。</p>
          </>}><Icon type='help-circle' style={{ color: '#A0A0A0' }} /></Pop></span>,
          bodyRender(data) {
            const remaining = data.courseTime && accDiv(data.courseTime.remaining, 100);
            return <div>{remaining || (remaining === 0 ? 0 : '-')}</div>;
          }
        },
        {
          title: '课程有效期',
          bodyRender(data) {
            return <div>{data.eduCourseValidDescription || ''}</div>;
          }
        },
        {
          title: '状态',
          textAlign: 'left',
          width: '120px',
          bodyRender(data = {}, fetch) {
            return <AbnormalCodePop {...data} kdtId={kdtId} onConfirm={fetch} />;
          }
        }
      ],

      rowKey: 'assetNo',

      getRowConf: (data, index) => {
        const canChoose = (data.joinState && data.joinState.choose) || false;

        const isStudentRepeated = context.filteredData.some(item => {
          return item.assetNo !== data.assetNo && item.student.id === data.student.id;
        });

        return { canSelect: canChoose && !isStudentRepeated };
      },

      selection: {
        selectedRowKeys: [],
        isSingleSelection: false,
        needCrossPage: true
      }
    },

    footer: {
      component: <DialogFooter profile={profile} />
    },

    title: '选择学员',

    onSelect: selectedData => {
      if (!selectedData) {
        return;
      }

      const filteredData = selectedData.reduce((arr, item) => {
        if (item.student && arr.every(_item => _item.student.id !== item.student.id)) {
          arr.push(item);
        }
        return arr;
      }, []);

      // 这里是一个副作用，在 getRowConf 中会用到
      context.filteredData = filteredData;

      return Promise.resolve(filteredData);
    },

    onFetch: ({ header, table, footer }) => {
      const pageSize = 6;
      const params = {
        pageRequest: {
          pageNumber: table.current || 1,
          pageSize: pageSize,
          sort: {
            orders: [
              {
                direction: 'DESC',
                property: 'created_at'
              }
            ]
          }
        },
        query: {
          studentName: header.studentName,
          lessonNo,
          kdtId
        }
      };
      return getStudentBySchedule(params).then(data => {
        return {
          current: (data.pageable && data.pageable.pageNumber) || 1,
          pageSize: pageSize,
          datasets: data.content,
          totalItem: data.total
        };
      });
    },

    onSubmit: async data => {
      if (!profile || !profile.startTime) {
        Notify.error('获取日程详情失败，请刷新页面重试');
        return;
      }
      const total = profile && profile.appointNumLeft;
      const maxNum = profile && profile.maxAppointNum;
      const selected = data ? data.length : 0;
      const left = total - selected;

      // 学员日程冲突校验
      const conflictQuery = {
        kdtId: +kdtId,
        studentIds: data.map(item => item.student.id),
        startTime: format(profile.startTime, 'YYYY-MM-DD HH:mm:ss'),
        endTime: format(profile.endTime, 'YYYY-MM-DD HH:mm:ss')
      };
      const { hasConflict, conflictMsg } = await detectConflict(conflictQuery);
      if (hasConflict) {
        await ConflictDialog.open({
          defaultData: { conflictMsg }
        });
      }

      if (!profile.appointRule || left >= 0) {
        return submit(data);
      }

      const id = 'choose';

      return new Promise((resolve, reject) => {
        openDialog({
          dialogId: id, // id is used to close the dialog
          title: '日程名额满员',
          children: <div>该上课日程已满员（上限{maxNum}人），是否仍然添加？</div>,
          footer: (
            <>
              <Button
                type="primary"
                outline
                onClick={() => {
                  submit(data)
                    .then(resolve)
                    .catch(reject)
                    .finally(() => {
                      closeDialog(id);
                    });
                }}
              >
                确定添加
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  reject(new Error());
                  closeDialog(id);
                }}
              >
                我再想想
              </Button>
            </>
          )
        });
      });
    }
  });
}
