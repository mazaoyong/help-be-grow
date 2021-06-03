import React, { FC, useCallback, useMemo } from 'react';
import { Tag } from 'zent';
import get from 'lodash/get';
import { IEduCourseApplyProps } from './types';
import { IFormControlGroupProps } from '@zent/compat';
import EduCourseChooser from './educourse-selector';

const EduCourseSelectorWrap: FC<IEduCourseApplyProps & IFormControlGroupProps> = (props) => {
  const { onChange = () => {}, value, disabled } = props;
  const onClose = useCallback(() => {
    const { applyCourseType, isRelatedEduCourse } = value;
    onChange({
      applyCourseType,
      // 教务课程信息
      eduCourse: {
        id: null,
        name: '',
        classRelatedInfo: null,
      },
      // 是否启用适用课程
      isRelatedEduCourse,
    });
  }, [value]);

  const getEduCourseListLayout = useMemo(() => {
    return <EduCourseChooser {...props} />;
  }, [props]);

  const attachEduCourseLayout = useMemo(() => {
    return (
      <Tag
        theme="grey"
        className="educourse-apply-tag"
        closable={!disabled}
        onClose={onClose}>
        {get(value, 'eduCourse.name')}
      </Tag>
    );
  }, [value, disabled, onClose]);

  return (
    <>
      {get(value, 'eduCourse.id') && get(value, 'eduCourse.name') ? attachEduCourseLayout : getEduCourseListLayout}
    </>
  );
};

export default EduCourseSelectorWrap;
