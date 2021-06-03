import { Pop } from '@zent/compat';
import React, { PureComponent } from 'react';
import { number } from '@youzan/utils';
import { Button, Notify, ClampLines, Icon } from 'zent';
import classnames from 'classnames';
import get from 'lodash/get';
import cloneDeep from 'lodash/cloneDeep';
import openDialog from '../../../../../components/student-select';
import { AbnormalCodePop } from '@ability-center/appointment/abnormal-util';
import { getStudentListDialog, addStudent } from '../../../../api';
import { openBatchSigninDialog as openBatchDialog } from '@ability-center/appointment/signin-util';
import { EduClassChangeDialog } from '@ability-center/assets';

class DialogHeader extends PureComponent {
  render() {
    const { eduClass } = this.props;
    return (
      <div className="student-dialog-header-name">
        {`以下为购买“${eduClass.eduCourseName || ''}”的学员`}
      </div>
    );
  }
}

class DialogFooter extends PureComponent {
  state = {
    loading: false
  };
  onSubmit = () => {
    const { submit } = this.props;
    this.setState({ loading: true });
    return submit().finally(() => {
      this.setState({ loading: false });
    });
  };
  render() {
    const { eduClassInfo = {}, table = {} } = this.props;
    const { loading } = this.state;
    const eduClass = eduClassInfo.eduClass || {};
    const classStat = eduClassInfo.classStat || {};
    const selectedRows = table.selectedRows || [];

    const hasLimit = true;
    const total = eduClass.maxStuNum - classStat.currentStuNum;
    const selected = selectedRows.length;
    const left = total - selected;

    return (
      <div className="student-dialog-footer">
        <div className="student-dialog-footer__tip">
          已选（{selected}），
          {hasLimit ? (
            <span className={classnames({ 'student-dialog-footer__tip-warning': left < 0 })}>
              可选（{total}）
            </span>
          ) : null}
        </div>
        <Button type="primary" onClick={this.onSubmit} loading={loading}>
          确认
        </Button>
      </div>
    );
  }
}

const openMoveClassDialog = (student = {}, callback = () => {}) => {
  const courseSellType = get(student, 'userAssert.courseSellType');
  const remaining = get(student, 'courseTime.remaining');
  const studentName = get(student, 'student.name');
  const eduClassId = get(student, 'eduClass.id');

  // 资产是按课时，课时<=0
  if (courseSellType === 1 && remaining <= 0) {
    Notify.error(`学员“${studentName}”课时已耗完，不能调班`);
    return;
  }

  // 资产是按课时、时段、自定义，课程到期日<当天
  if (
    [0, 1, 2].includes(courseSellType) &&
    student.eduCourseValidDescription !== '永久有效' &&
    new Date(student.eduCourseValidDescription).getTime() < Date.now()
  ) {
    Notify.error(`学员“${studentName}”课程到期了，不能调班`);
    return;
  }

  EduClassChangeDialog.open({ defaultData: {
    kdtId: student.kdtId,
    assetNo: student.assetNo,
    studentId: student.student.id,
    eduClassId: eduClassId,
  },
  callback });
};

export default function openStudentDialog(eduClassInfo = {}, callback = () => {}) {
  const context = {
    filteredData: []
  };
  const eduClass = eduClassInfo.eduClass || {};
  const classStat = eduClassInfo.classStat || {};
  return openDialog({
    header: {
      component: <DialogHeader eduClass={eduClass} />,
      children: [
        {
          key: 1,
          name: 'userClassStatus',
          type: 'Select',
          textAlign: 'right',
          placeholder: '全部',
          data: [
            { value: '', text: '全部' },
            { value: 0, text: '未分班' },
            { value: 1, text: '已分班' }
          ]
        },
        {
          key: 2,
          name: 'studentName',
          type: 'Search',
          textAlign: 'right',
          placeholder: '搜索学员姓名'
        },
        {
          key: 3,
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
      rowKey: 'assetNo',
      columns: [
        {
          title: '学员',
          bodyRender(data) {
            const student = (data && data.student) || {};
            const studentUrl = `https://www.youzan.com/v4/vis/edu/page/student#/detail/${
              student.id
            }`;
            return student.name ? (
              <a href={studentUrl} rel="noopener noreferrer" target="_blank">
                {student.name}
              </a>
            ) : (
              '-'
            );
          }
        },
        {
          title: '手机号',
          bodyRender(data) {
            return <div>{(data.student && data.student.mobile) || '-'}</div>;
          }
        },
        {
          title: '学员家长',
          bodyRender(data) {
            const customer = (data && data.customer) || {};
            const uid = customer.userId;
            const customerUrl = `https://www.youzan.com/v4/scrm/customer/manage#/detail?yzUid=${uid}`;
            return (
              <a href={customerUrl} rel="noopener noreferrer" target="_blank">
                {customer.name || customer.mobile}
              </a>
            );
          }
        },
        {
          title: '线下课',
          bodyRender(data) {
            const title = (data.course && data.course.title) || (data.eduCourse && data.eduCourse.name);
            return <ClampLines lines={1} text={title} />;
          }
        },
        {
          title: <span>剩余课时<Pop trigger='hover' content={<>
            <p>剩余课时=购买课时+赠送课时-已用课时=可用课时+冻结课时</p>
            <p>如果有预约日程，则剩余课时包含预约冻结的课时。</p>
          </>}><Icon type='help-circle' style={{ color: '#A0A0A0' }} /></Pop></span>,
          bodyRender(data) {
            const remaining = data.courseTime && number.accDiv(data.courseTime.remaining, 100);
            return <div>{remaining || (remaining === 0 ? 0 : '-')}</div>;
          }
        },
        {
          title: '课程有效期',
          bodyRender(data) {
            return <div>{data.eduCourseValidDescription || '-'}</div>;
          }
        },
        {
          title: '所在班级',
          bodyRender(data) {
            return <div>{(data.relatedClassNames || []).join(',') || '未分班'}</div>;
          }
        },
        {
          title: '状态',
          textAlign: 'left',
          bodyRender(data = {}, fetch) {
            const { student = {}, state = {} } = data;
            return <AbnormalCodePop
              student={student}
              mode={'educlass'}
              joinState={state}
              kdtId={eduClass.kdtId}
              onConfirm={fetch}
              onMoveClass={() => {
                let moveClassData = cloneDeep(data);
                if (moveClassData.relatedClasses && moveClassData.relatedClasses.length) {
                  moveClassData.eduClass = moveClassData.relatedClasses[0];
                }
                openMoveClassDialog(moveClassData, fetch);
              }}
            />;
          }
        }
      ],

      getRowConf: (data, index) => {
        const canChoose = (data.state && data.state.choose) || false;

        const isChoosed = context.filteredData.some(item => {
          return item.assetNo === data.assetNo;
        });

        if (
          !isChoosed &&
          +classStat.currentStuNum + context.filteredData.length >= +eduClass.maxStuNum
        ) {
          return { canSelect: false, rowClass: '' };
        }

        const isStudentRepeated = context.filteredData.some(item => {
          return item.assetNo !== data.assetNo && item.student.id === data.student.id;
        });

        return { canSelect: canChoose && !isStudentRepeated, rowClass: '' };
      },

      selection: {
        selectedRowKeys: [],
        isSingleSelection: false,
        needCrossPage: true
      }
    },

    footer: {
      component: <DialogFooter eduClassInfo={eduClassInfo} />
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

      // 超出max直接截取
      const slicedData = filteredData.slice(0, eduClass.maxStuNum);

      // 这里是一个副作用，在 getRowConf 中会用到
      context.filteredData = slicedData;

      return Promise.resolve(slicedData);
    },

    onFetch: ({ header, table, footer }) => {
      const pageSize = 6;
      const params = {
        pageRequest: {
          pageNumber: table.current || 1,
          pageSize
        },
        query: {
          studentName: header.studentName,
          eduClassId: eduClass.id,
          eduCourseId: eduClass.eduCourseId,
          kdtId: eduClass.kdtId || _global.kdtId
        }
      };
      if (header.userClassStatus || header.userClassStatus === 0) {
        params.query.userClassStatus = header.userClassStatus;
      }
      return getStudentListDialog(params)
        .then(data => {
          return {
            current: (data.pageable && data.pageable.pageNumber) || 1,
            pageSize,
            datasets: data.content,
            totalItem: data.total
          };
        })
        .catch(error => {
          Notify.error(error);
        });
    },
    onSubmit: data => {
      const studentAssets = (data || []).map(item => ({
        studentId: item.student && item.student.id,
        assetNo: item.userAsset && item.userAsset.assetNo
      }));
      return addStudent({
        addStudents: studentAssets,
        eduClassId: eduClass.id,
        kdtId: eduClass.kdtId || _global.kdtId
      })
        .then((resp) => {
          const { failedNum = 0, successNum = 0, failedStudents = [] } = resp || {};
          openBatchDialog({
            type: -1,
            mode: 'educlass', // 日程或班级
            data: {
              failedNum,
              successNum,
              studentErrorDTOS: failedStudents
            },
            onConfirm: callback
          });
          // callback();
        })
        .catch(error => {
          Notify.error(error);
        });
    }
  });
}
