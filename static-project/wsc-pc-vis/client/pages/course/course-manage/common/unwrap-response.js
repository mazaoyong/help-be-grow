import { cloneDeep, isObject } from 'lodash';

// 按照原有数据格式展开新接口数据，方便使用
export default function(_data) {
  const data = cloneDeep(_data);

  const {
    course,
    product,
    course: { formalCourse, trialCourse },
  } = data;

  let unWrapped = {
    ...course,
    ...product,
  };

  if (isObject(formalCourse)) {
    const {
      classHourCourse,
      dateRangeCourse,
      periodCourse,
      customCourse,
      eduCourse,
      applyCourseType,
      isRelatedEduCourse,
    } = formalCourse;

    unWrapped = { ...unWrapped, ...formalCourse };
    delete unWrapped.formalCourse;

    if (isObject(classHourCourse)) {
      unWrapped = { ...unWrapped, ...classHourCourse };
      delete unWrapped.classHourCourse;
    }

    if (isObject(dateRangeCourse)) {
      unWrapped = { ...unWrapped, ...dateRangeCourse };
      delete unWrapped.dateRangeCourse;
    }

    if (isObject(periodCourse)) {
      unWrapped = { ...unWrapped, ...periodCourse };
      delete unWrapped.periodCourse;
    }

    if (isObject(customCourse)) {
      unWrapped = { ...unWrapped, ...customCourse };
      delete unWrapped.customCourse;
    }

    if (!unWrapped.applyCourse) {
      unWrapped.applyCourse = {
        eduCourse,
        applyCourseType,
        isRelatedEduCourse,
      };

      delete unWrapped.eduCourse;
      delete unWrapped.applyCourseType;
      delete unWrapped.isRelatedEduCourse;
    }
  }

  if (isObject(trialCourse)) {
    unWrapped = { ...unWrapped, ...trialCourse };
    delete unWrapped.trialCourse;
  }

  return unWrapped;
}
