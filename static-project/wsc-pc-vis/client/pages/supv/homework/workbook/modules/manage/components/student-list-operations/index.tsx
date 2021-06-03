import { React, FC } from '@youzan/tany-react';
import { Dialog } from '@youzan/ebiz-components';
import { Operations } from '@youzan/react-components';
import CommonLink from 'components/common-link';
import { RecordDetail } from '@ability-center/clue/record-detail';

import type { IAttributeValueDTO } from 'definitions/api/owl/pc/ExerciseBookStatisticsFacade/findStudentPageByCondition';

const { openDialog } = Dialog;

interface IListOperationsProps {
  enrollmentInfo: IAttributeValueDTO[];
  assignmentListLink: string;
}

const StudentAssignmentOption: FC<{ assignmentListLink: string }> = ({ assignmentListLink }) => (
  <CommonLink
    className="commonlink-operation"
    url={assignmentListLink}
    target="_blank"
  >
    查看作业
  </CommonLink>
);

const ShowEnrollmentOption: FC<{ enrollmentInfo: IAttributeValueDTO[] }> = ({ enrollmentInfo = [] }) => (
  <span
    className="operation"
    onClick={() => openDialog(RecordDetail, {
      title: '报名信息',
      data: {
        attributes: enrollmentInfo,
        scene: 'examination', // 场景处理与考试一致
      },
    })}
  >
    报名信息
  </span>
);

const StudentListOption: FC<IListOperationsProps> = ({ enrollmentInfo = [], assignmentListLink }) => {
  const operationList = [
    { show: true, component: <StudentAssignmentOption assignmentListLink={assignmentListLink} /> },
    {
      show: enrollmentInfo && enrollmentInfo.length > 0,
      component: <ShowEnrollmentOption enrollmentInfo={enrollmentInfo} />
    },
  ]
    .filter(operation => operation.show)
    .map(operation => operation.component);

  return (
    <Operations items={operationList} />
  );
};

export default StudentListOption;
