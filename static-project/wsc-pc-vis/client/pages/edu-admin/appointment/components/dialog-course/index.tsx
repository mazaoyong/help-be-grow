
import { Pop, Form } from '@zent/compat';
import React, { useState, FC, useCallback, useEffect } from 'react';
import { IDialogCourseFieldProps, ILessonData } from './types';
import { Grid, Notify, RadioGroup, IGridColumn, Sweetalert, IRadioEvent } from 'zent';
import './styles.scss';
import { styleNamePrefix, LessonErrorsNoQuotaContinue } from './constants';
import DialogCourse from './dialog';

const { getControlGroup } = Form;

const DialogCourseField: FC<IDialogCourseFieldProps> = props => {
  // 弹框是否展示
  const [visible, setVisible] = useState(false);
  // 选择的数据
  const [selectedData, setSelectedData] = useState<ILessonData | null>(null);
  // 是否已选择
  const [hasSelected, setHasSelected] = useState(false);

  const {
    onChoose,
    courseType,
    studentId,
    assetNo = '',
    eduCourseInfo,
    branchInfo,
    isConfirm,
    lessonInfo,
    isEdit,
    studentLessonNo,
  } = props;
  const eduCourseId = eduCourseInfo && eduCourseInfo.eduCourseId;

  // 未选择学员
  const noStudent = !studentId;
  // 未选择线下课
  const noAsset = +courseType === 1 && assetNo === '';
  // 校区kdtId
  const branchKdtId = branchInfo ? branchInfo.kdtId : 0;

  useEffect(() => {
    if (lessonInfo && lessonInfo.lessonNo) {
      setSelectedData(lessonInfo as ILessonData);
      setHasSelected(true);
    } else {
      setSelectedData(null);
      setHasSelected(false);
      onChoose && onChoose(null);
    }
  }, [studentId, courseType, eduCourseId, branchKdtId, onChoose, lessonInfo]);

  const choosedColumn: Array<IGridColumn> = [
    {
      title: '上课时间',
      width: '120px',
      nowrap: true,
      bodyRender: ({ lessonDate, lessonTime }) => {
        return (
          <Pop trigger="hover" position="top-left" content={`${lessonDate} ${lessonTime}`}>
            <>
              <p>{lessonDate}</p>
              <p>{lessonTime}</p>
            </>
          </Pop>
        );
      },
    },
    {
      title: '课节',
      width: '80px',
      nowrap: true,
      bodyRender: ({ lessonName }) => {
        return (
          <Pop trigger="hover" position="top-left" content={lessonName}>
            {lessonName || '-'}
          </Pop>
        );
      },
    },
    {
      title: '课程',
      width: '120px',
      nowrap: true,
      bodyRender: ({ eduCourseName }) => {
        return (
          <Pop trigger="hover" position="top-left" content={eduCourseName}>
            {eduCourseName || '-'}
          </Pop>
        );
      },
    },
  ];

  // 控制显示隐藏
  const toggleVisible = useCallback(() => {
    if (!props.disabled) {
      setVisible(!visible);
    }
  }, [visible, props.disabled]);

  // 选择课节
  const chooseLesson = useCallback(() => {
    if (selectedData !== null) {
      setVisible(false);
      setHasSelected(true);
      onChoose && onChoose(selectedData);
    } else {
      Notify.warn('请先选择课节');
    }
  }, [selectedData, onChoose]);

  // 勾选事件处理
  const handleRadioChange = useCallback(
    (e: IRadioEvent<ILessonData | null>) => {
      const data = e.target.value;
      if (data) {
        if (data.checkCode === LessonErrorsNoQuotaContinue.code) {
          Sweetalert.confirm({
            title: '提示',
            confirmText: '确定',
            content: LessonErrorsNoQuotaContinue.message,
            onConfirm: () => {
              setSelectedData({ ...data });
            },
          });
        } else {
          setSelectedData({ ...data });
        }
      } else {
        setSelectedData(null);
      }
    },
    [setSelectedData],
  );

  let anchorComp = (
    <a href="javascript:;" onClick={toggleVisible} className={`${props.disabled ? 'a-dis' : ''}`}>
      {hasSelected ? '重新选择' : '选择上课日程'}
    </a>
  );
  if (noStudent) {
    anchorComp = (
      <Pop trigger="hover" content="请先选择学员">
        {anchorComp}
      </Pop>
    );
  } else if (noAsset) {
    anchorComp = (
      <Pop trigger="hover" content="请先选择线下课">
        {anchorComp}
      </Pop>
    );
  }

  return (
    <div className={styleNamePrefix}>
      {anchorComp}
      {hasSelected && (
        <Grid
          className={`${styleNamePrefix}__grid`}
          datasets={[selectedData]}
          columns={choosedColumn}
          ellipsis={true}
          rowKey="lessonNo"
        />
      )}
      <RadioGroup
        value={selectedData}
        isValueEqual={(a, b) => {
          if (a !== null && b != null) {
            return a.lessonNo === b.lessonNo;
          }
          return false;
        }}
        onChange={handleRadioChange}
      >
        <DialogCourse
          visible={visible}
          onConfirm={chooseLesson}
          onClose={toggleVisible}
          courseType={courseType}
          studentId={studentId}
          assetNo={assetNo}
          eduCourseInfo={eduCourseInfo}
          branchInfo={branchInfo}
          isConfirm={isConfirm}
          isEdit={isEdit}
          lessonInfo={lessonInfo}
          studentLessonNo={studentLessonNo}
        />
      </RadioGroup>
    </div>
  );
};
export default getControlGroup(DialogCourseField);
