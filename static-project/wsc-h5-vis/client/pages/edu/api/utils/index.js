import { isObject } from 'lodash';

// 按照原有数据格式展开新接口数据，方便使用
export function unwrapCourseDetail(data) {
  const {
    course,
    course: { formalCourse, trialCourse },
    product,
  } = data;

  let unWrappedCourse = { ...course };

  if (isObject(formalCourse)) {
    const { classHourCourse, dateRangeCourse, periodCourse, customCourse } = formalCourse;
    unWrappedCourse = { ...unWrappedCourse, ...formalCourse };
    delete unWrappedCourse.formalCourse;

    if (isObject(classHourCourse)) {
      unWrappedCourse = { ...unWrappedCourse, ...classHourCourse };
      delete unWrappedCourse.classHourCourse;
    }

    if (isObject(dateRangeCourse)) {
      unWrappedCourse = { ...unWrappedCourse, ...dateRangeCourse };
      delete unWrappedCourse.dateRangeCourse;
    }

    if (isObject(periodCourse)) {
      unWrappedCourse = { ...unWrappedCourse, ...periodCourse };
      delete unWrappedCourse.periodCourse;
    }

    if (isObject(customCourse)) {
      unWrappedCourse = { ...unWrappedCourse, ...customCourse };
      delete unWrappedCourse.customCourse;
    }
  }

  if (isObject(trialCourse)) {
    unWrappedCourse = { ...unWrappedCourse, ...trialCourse };
    delete unWrappedCourse.trialCourse;
  }

  if (isObject(product.skuFormatModel)) {
    product.skuFormatModel.list = product.skuFormatModel.list || [];
    product.skuFormatModel.tree = product.skuFormatModel.tree || [];
  }

  return { ...data, course: unWrappedCourse };
}
