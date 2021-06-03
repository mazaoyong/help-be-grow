import { React, FC } from '@youzan/tany-react';
// import { Route } from '@youzan/tany';
import { Operations } from '@youzan/react-components';
import CommonLink from 'components/common-link';
import { Link as SamLink } from '@youzan/sam-components';
import WorkbookPromotion from '../../../list/components/promotion-dialog';
import DeleteOption from '../delete-option';

import { IHomeworkListDTO } from 'domain/homework-domain/types/homework';

interface IListOperationsProps {
  data: IHomeworkListDTO;
  handleDelete: (id: number) => Promise<any>;
  isTeacher?: boolean;
  workbookId: string | number;
  workbookKdtId?: number;
}

const HomeworkStudentsOption: FC<{
  homeworkStudentAssignmentLink: string;
  disabled?: boolean;
}> = ({ homeworkStudentAssignmentLink, disabled }) => {
  return disabled ? (
    <span className="disabled">学员作业</span>
  ) : (
    <CommonLink className="student-assignments" url={homeworkStudentAssignmentLink} target="_blank">
      学员作业
    </CommonLink>
  );
};

const EditOption: FC<{ id: number; isTeacher?: boolean; disabled }> = ({
  id,
  isTeacher,
  disabled,
}) => {
  const link = `${window._global.url.v4}/vis/supv/homework/work/${id}/edit`;
  return disabled ? (
    <span className="disabled">编辑</span>
  ) : isTeacher ? (
    <CommonLink className="commonlink-operation" url={link} target="_blank">
      编辑
    </CommonLink>
  ) : (
    <SamLink name="编辑" href={link}>
      编辑
    </SamLink>
  );
};

const HomeworkListOption: FC<IListOperationsProps> = ({
  data,
  handleDelete,
  isTeacher,
  workbookId,
}) => {
  const operationList = [
    <HomeworkStudentsOption
      key="manage"
      homeworkStudentAssignmentLink={`/v4/vis/supv/homework/work/${data?.id}/assignments?workbookId=${workbookId}`}
      disabled={data?.kdtId !== _global.kdtId}
    />,
    <EditOption
      key="edit"
      id={data?.id}
      isTeacher={isTeacher}
      disabled={data?.kdtId !== _global.kdtId}
    />,
    <WorkbookPromotion
      key="promotion"
      id={data?.id}
      alias={data?.alias}
      title={data?.title}
      text="长按识别二维码查看作业"
      source="homework"
      disabled={data?.kdtId !== _global.kdtId}
    />,
    <DeleteOption
      key="delete"
      onConfirm={() => handleDelete(data?.id)}
      submitNum={data?.submitNum}
      disabled={data?.kdtId !== _global.kdtId}
    />,
  ];

  return <Operations items={operationList} />;
};

export default HomeworkListOption;
