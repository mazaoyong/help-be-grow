import Args from '@youzan/utils/url/args';
import * as SafeLink from 'common/utils/custom-safe-link';

// 重定向到预约页
export const redirectToAppointment = ({ studentAlias, alias, skuId, applyCourseType }) => {
  SafeLink.redirect({
    url: '/wscvis/edu/appointment/create',
    query: {
      pageFrom: 'order',
      studentId: studentAlias,
      productAlias: alias,
      skuId,
      applycourseType: applyCourseType,
    },
  });
};

// 从URL上解析课程预约数据
export const parseAppointment = () => {
  return {
    time: customJsonParse(Args.get('appointmentTime'), []),
    lesson: Args.get('appointmentLesson') || '',
    lessonName: customDecodeURIComponent(Args.get('appointmentLessonName')),
    addressId: Args.get('appointmentAddressId') || 0,
    addressName: customDecodeURIComponent(Args.get('appointmentAddressName')),
  };
};

function customDecodeURIComponent(str) {
  try {
    return decodeURIComponent(str);
  } catch (error) {
    return '';
  }
}

function customJsonParse(str, defaultValue) {
  try {
    return JSON.parse(str);
  } catch (error) {
    return defaultValue;
  }
}
