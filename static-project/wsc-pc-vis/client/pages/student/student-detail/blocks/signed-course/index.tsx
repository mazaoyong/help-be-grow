import { Pop } from '@zent/compat';
import React, { FC, ReactNode, useState, useCallback } from 'react';
import qs from 'qs';
import Big from 'big.js';
import { get } from 'lodash';
import formatDate from '@youzan/utils/date/formatDate';
import { IGridPageInfo, Tag } from 'zent';
import { CardList } from '@youzan/ebiz-components';
import { Operations } from '@youzan/react-components';
import { Link as SamLink } from '@youzan/sam-components';

import VersionWrapper from 'fns/version';
import { navigateToAdjustCourse } from '@ability-center/assets/adjustcourse';
import '@youzan/react-components/es/components/operations/style/index.css';
import StudentStatus from '@ability-center/student/student-status';
import { getModel } from '@youzan/arthur-scheduler-react';
import openRefundDialog from './actions/refund';
import {
  OpenAvailableDialog as OpenEditAvailableTime,
  OpenCourseDialog as OpenEditCourseTime,
  EduClassChangeDialog,
} from '@ability-center/assets';

import { getStudentSigndCourses } from '../../../api/student-detail';
import { COURSE_STATUS, COURSE_COLORS, ASSET_SOURCE_TYPE } from './config';
import useCampusQuery from '../../utils/use-campus-query';
import './style.scss';

import { ISignedCourseData, IFormatedSignedCourseItem } from './types';
import { FetchData } from '@youzan/ebiz-components/es/types/card-list';
import { ICardRenderProps } from '@youzan/ebiz-components/es/types/card-item';

const { open: openEduClassChange } = EduClassChangeDialog;

// 分转成元
const cent2yuan = (num: number): string => {
  return Big(Number(num))
    .div(100)
    .toFixed();
};

// 将后端接口返回的字段展开
const formatSignedCourseItem = (signdCourseData: ISignedCourseData): IFormatedSignedCourseItem => {
  const {
    eduCourseOrderDTO,
    eduCourseStudentDTO,
    hasRefundRecord
  } = signdCourseData;
  return {
    ...eduCourseOrderDTO,
    ...eduCourseStudentDTO,
    hasRefundRecord
  };
};

// 渲染操作按钮
const generateRenderOperators = CALLBACK => (
  signedCourseItem: IFormatedSignedCourseItem
): ReactNode => {
  const {
    kdtId,
    assetNo,
    shiftClass,
    modifyCourseValid,
    userAsset,
    modifyCourseTime,
    hasRefundRecord,
    eduCourseState,
    transferCourse,
    userAsset: { userId = null } = {}
  } = signedCourseItem;
  const isModifyValid = eduCourseState !== 1 && eduCourseState !== 4;
  const isModifyCourseTime = eduCourseState !== 4;
  const isNotPresent = get(userAsset, 'assetOriginType') !== 8;

  const operations: ReactNode[] = [];

  if (modifyCourseValid) {
    const ops = VersionWrapper({
      name: 'student-detail-sigend-course-edit-available-time',
      children: (
        <SamLink
          key="handleSetDefaultAvailableTime"
          name="修改有效期"
          hide={true}
          onClick={() => {
            CALLBACK['handleSetDefaultAvailableTime'](signedCourseItem);
          }}
        >
          修改有效期
        </SamLink>
      )
    });

    ops && operations.push(
      ops
    );
  }

  if (modifyCourseTime && isModifyCourseTime) {
    const ops = VersionWrapper({
      name: 'student-detail-sigend-course-edit-course-time',
      children: (<SamLink
        key="handleChangeCourseTime"
        name="修改课时"
        hide={true}
        onClick={() => {
          CALLBACK['handleChangeCourseTime'](signedCourseItem);
        }}
      >
        修改课时
      </SamLink>)
    });

    ops && operations.push(
      ops
    );
  }

  // 转课
  if (transferCourse) {
    let abilitys = getModel('adjustCourseAssert', 'courseAssert');
    if (abilitys.available) {
      const ops = (
        <SamLink
          key="handleAdjust"
          name="转课"
          hide={true}
          target='_blank'
          href={navigateToAdjustCourse({
            studentIds: '' + signedCourseItem.userAsset.userId,
            kdtId: signedCourseItem.kdtId,
            assetNos: '' + signedCourseItem.assetNo
          })}
        >
          转课
        </SamLink>
      );
      operations.push(
        ops
      );
    }
  }

  // 调班
  if (shiftClass) {
    const ops = VersionWrapper({
      name: 'student-detail-sigend-course-shift-class',
      children: (<a
        key="handleChangeStudentClass"
        onClick={() => {
          CALLBACK['handleChangeStudentClass'](signedCourseItem);
        }}
      >
        调班
      </a>)
    });
    ops && operations.push(
      ops
    );
  }
  // 退课记录
  if (hasRefundRecord) {
    operations.push(
      <a
        key="refundRecord"
        href={'/v4/vis/edu/page/refund-record#/list?assetNo=' + assetNo + '&kdtId=' + kdtId}
        target="_blank"
        rel="noopener noreferrer"
      >
        退课记录
      </a>
    );
  }

  operations.push(
    <a
      key="refundRecord"
      href={`/v4/vis/edu/page/student#/assets/${userId}?assetNo=${assetNo}&kdtId=${kdtId}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      变更明细
    </a>
  );

  if (isModifyValid && isNotPresent) {
    //  ctx.handleRefund.bind(this, courseItem)
    operations.push(
      <SamLink
        name="退课"
        key="handleRefund"
        onClick={() => {
          CALLBACK['handleRefund'](signedCourseItem);
        }}
      >
        退课
      </SamLink>
    );
  }

  return <Operations items={operations} />;
};

const renderConfig: ICardRenderProps<IFormatedSignedCourseItem> = {
  title: '',
  // 卡片标题 - 课程名称以及状态
  renderTitle: ({ course: { title }, eduCourseState, transferCourse, assetSourceType, eduCourse: { name } }) => (
    <>
      <span style={{ marginRight: '8px' }}>{transferCourse ? name : title }</span>
      <StudentStatus
        type={eduCourseState}
        customerStatus={COURSE_STATUS}
        customerColors={COURSE_COLORS}
      />
      <Tag theme="blue"
        style={{
          lineHeight: '20px',
          padding: '0 6px',
          fontSize: '12px',
          marginLeft: '8px'
        }}
        outline
      >{ASSET_SOURCE_TYPE['' + assetSourceType]}</Tag>
    </>
  ),
  // 卡片副标题 - 适用课程
  renderSubtitle: ({ eduCourse: { name } }) => `适用课程：${name || '-'}`,
  // 内容区域
  contentGroup: [
    [
      {
        label: '课时',
        name: 'courseTimeDisplay',
        render: ({ courseTime }): ReactNode => {
          if (!courseTime) {
            return '-';
          }
          const { total, remaining, reward } = courseTime;
          const time = total ? [remaining, total].map(cent2yuan).join('/') : '';
          const present = reward ? '（含赠送' + cent2yuan(reward) + '课时）' : '';
          return `${time}${present}` || '-';
        }
      },
      {
        label: '有效期',
        name: 'eduCourseValidDescription',
        render: ({ eduCourseValidDescription }) => eduCourseValidDescription || '-'
      },
      {
        label: '班级',
        name: 'classesDisplay',
        render: ({ relatedClassNames }) => {
          if (relatedClassNames.length) {
            const classes = relatedClassNames.join(',');
            // 如果只有一个课程的时候
            if (relatedClassNames.length === 1) {
              return classes;
            }
            return (
              <Pop trigger="hover" content={classes}>
                <span className="ellipsis-2">{classes}</span>
              </Pop>
            );
          }
          return '-';
        }
      }
    ],
    [
      {
        label: '报名时间',
        name: 'entrollmentTimeDisplay',
        render: ({ orderCreatedAt }) => !orderCreatedAt ? '-' : formatDate(orderCreatedAt, 'YYYY-MM-DD HH:mm:ss')
      },
      {
        label: '课程实付金额',
        name: 'actuallyPaidDisplay',
        render: ({ realPay }) => {
          if (realPay === undefined) {
            return '-';
          }
          return (
            <div>¥{cent2yuan(realPay)}</div>
          );
        }
      },
      {
        label: '已退',
        name: 'alredayRefundDisplay',
        render: ({ assetNo, itemAlreadyRefundAmt, kdtId }) => {
          if (!itemAlreadyRefundAmt) {
            return '-';
          }
          return (
            <a
              href={'/v4/vis/edu/page/refund-record#/list?assetNo=' + assetNo + '&kdtId=' + kdtId}
              target="_blank"
              rel="noopener noreferrer"
            >
              ¥{cent2yuan(itemAlreadyRefundAmt)}
            </a>
          );
        }
      }
    ]
  ],
  // 操作区域
  operators: []
};

// TODO: 此处不需要接受排序参数，写死
const buildQueryData = (query: Record<string, any>, pageInfo: IGridPageInfo) => {
  const { current, pageSize } = pageInfo;
  return {
    query,
    pageRequest: {
      pageNumber: current || 1,
      pageSize: pageSize || 2,
      sort: {
        orders: [
          {
            property: 'created_at',
            direction: 'DESC'
          }
        ]
      }
    }
  };
};

interface ISignedCourseResponse {
  content: Array<ISignedCourseData>;
  total: number;
}

export interface ISignedCourseListProps {
  studentId: number | string; // 学员信息
  campusKdtId?: number; // 校区 kdtId
  studentName: string; // 学员姓名
  studentMobile: string; // 学员手机号
  pageSize?: number; // 每页显示的数量
}

// 已购课程列表
const SignedCourseList: FC<ISignedCourseListProps> = props => {
  const { studentId, studentName, studentMobile, campusKdtId, pageSize = 2 } = props;

  const STUDENT = {
    id: studentId,
    name: studentName,
    mobile: studentMobile
  };

  // 传递给 CardList 的信号量
  const [refreshSignal, setRefreshSignal] = useState(0);

  const refreshList = () => {
    setRefreshSignal(refreshSignal => refreshSignal + 1);
  };

  // 转换 api 数据到 CardList 需要的数据格式
  const transfromResponseToDataSets = useCallback(({ content = [], total }: ISignedCourseResponse) => ({
    total,
    datasets: content.map(formatSignedCourseItem)
  }), []);

  // 根据campusKdtId更新
  // useEffect(
  //   () => {
  //     if (campusKdtId) {
  //       refreshList();
  //     }
  //   },
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   [campusKdtId],
  // );
  const passiveQueries = useCampusQuery({
    name: studentName,
    mobile: studentMobile,
    studentId: studentId,
    kdtId: campusKdtId
  });
  const fetchSignedCourseData: FetchData = useCallback(pageInfo => {
    const queryData = buildQueryData(
      passiveQueries,
      pageInfo
    );
    return getStudentSigndCourses(queryData).then(transfromResponseToDataSets);
  }, [passiveQueries, transfromResponseToDataSets]);

  // 操作按钮的逻辑
  const CALLBACKS = {
    // 修改有效期
    handleSetDefaultAvailableTime: (signedCourseItem: IFormatedSignedCourseItem) => {
      const { startTime, endTime, assetNo, kdtId, userAsset: { userId = null } = {} } = signedCourseItem;
      const defaultAvailableTime = [startTime, endTime].map(time => (time < 0 ? '' : time));

      OpenEditAvailableTime({
        defaultData: {
          kdtId: kdtId,
          assetNo: assetNo,
          studentId: userId || STUDENT.id,
          time: defaultAvailableTime,
        },
        callback: refreshList
      });
    },

    // 修改课时
    handleChangeCourseTime: (signedCourseItem: IFormatedSignedCourseItem) => {
      // 设置当前的课程数据，供修改课时的函数使用
      const { kdtId, userAsset: { userId = null } = {} } = signedCourseItem;

      OpenEditCourseTime({
        defaultData: {
          kdtId: kdtId,
          assetNo: signedCourseItem.assetNo,
          studentId: userId,
        },
        callback: refreshList
      });
    },

    // 修改班级
    handleChangeStudentClass: (signedCourseItem: IFormatedSignedCourseItem) => {
      const {
        kdtId,
        userAsset: { userId = null } = {},
        eduClasses,
      } = signedCourseItem;

      const eduClassId = get(eduClasses, '[0].eduClassId');

      openEduClassChange({
        defaultData: {
          kdtId: kdtId,
          assetNo: signedCourseItem.assetNo,
          studentId: userId,
          eduClassId: eduClassId,
        },
        className: 'student-dialog',
        callback: refreshList
      });
    },

    // 退课
    handleRefund: (signedCourseItem: IFormatedSignedCourseItem) => {
      const studentId = STUDENT.id;
      const {
        assetNo,
        kdtId,
        userAsset,
        orderNo,
        skuId,
        realPay,
        course,
        courseType,
        userAsset: { userId = null } = {}
      } = signedCourseItem;
      // 课时，始终不弹窗
      // 按期/体验课，实付为 0，弹窗
      // 按时段/自定义，实付为 0，且未生效，弹窗
      const courseSellType = course && course.courseSellType;
      const startTime = userAsset && userAsset.startTime;
      if (
        realPay === 0 &&
        courseSellType !== 1 &&
        (courseSellType === 3 || courseType === 0 || !startTime)
      ) {
        openRefundDialog({
          studentId: userId || studentId,
          targetKdtId: kdtId,
          ...signedCourseItem
        });
        return;
      }
      const query = qs.stringify({
        assetNo,
        studentId: userId || studentId,
        orderNo,
        skuId,
        kdtId
      });
      window.location.href = '/v4/vis/edu/page/refund?' + query;
    }
  };

  // 生成操作按钮的渲染函数
  const renderOperators = generateRenderOperators(CALLBACKS);
  renderConfig.renderOperators = renderOperators;

  return (
    <>
      <CardList
        // @ts-ignore
        selectable={false}
        renderConfig={renderConfig}
        fetchData={fetchSignedCourseData}
        updatingSignal={refreshSignal}
        pageInfo={{
          pageSize
        }}
        rowKey="assetNo"
      />
    </>
  );
};

export default SignedCourseList;
