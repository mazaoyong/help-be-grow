import React, { useCallback, useContext } from 'react';
import { Button } from 'zent';
import useStdudentSelect from '@ability-center/student/student-selector';

import useStudentDetail from '@ability-center/common/use-student-detail';

import { Context as CourseOrderContext, INIT_STUDENT_IDS } from '../../contexts/course-order';

interface IProps {
  prefixcls: string;
  canAdd: boolean;
  zentForm: any;
}

const StudentInfo: React.FC<IProps> = ({ prefixcls, canAdd, zentForm }) => {
  const { state: { studentIds }, dispatch } = useContext(CourseOrderContext);
  const [ studentDetail ] = useStudentDetail({ studentId: studentIds[0] });
  const onStudentConfirm = useCallback((studentInfo) => {
    dispatch({
      type: INIT_STUDENT_IDS,
      payload: {
        studentIds: [studentInfo.id]
      }
    });
    zentForm.setFieldsValue({
      totalTransOutAmount: {},
      totalTransInAmount: {}
    });
  }, []);
  const openStudentDialog = useStdudentSelect({ onConfirm: onStudentConfirm });

  return (
    <div className={`${prefixcls}-student`}>
      <div className={`${prefixcls}-student-choose`}>
        <Button onClick={() => openStudentDialog()} disabled={!canAdd}>
          选择学员
        </Button>
      </div>
      {studentDetail.userId &&
        <div className={`${prefixcls}-student-info`}>
          <div className='info-item'>
            <label>学员：</label>{studentDetail.name}
          </div>
          <div className='info-item'>
            <label>联系人手机：</label>{studentDetail.mobile}
          </div>
          <div className='info-item'>
            <label>学员编号：</label>{studentDetail.studentNo}
          </div>
        </div>
      }
    </div>
  );
};

export default StudentInfo;
