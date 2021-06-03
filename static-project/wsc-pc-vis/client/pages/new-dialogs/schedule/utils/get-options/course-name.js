import { getCourseList } from '../api';

// 异步校验属否含有eduCourseId
export function asyncValidateEduCourseId(values, eduCourseId) {
  return new Promise((resolve, reject) => {
    if (!eduCourseId.eduCourseId) {
      // eslint-disable-next-line prefer-promise-reject-errors
      reject('上课课程不能为空');
    }
    resolve(true);
  });
}

export default function getCourseName(query, pageRequest) {
  const q = { name: query };
  return getCourseList({ query: q, pageRequest }).then(data => {
    const { content = [] } = data;
    const options = [];
    content.forEach(item => {
      const { id, name, classNum, isTrial } = item;
      if (!isTrial) {
        options.push({ value: { eduCourseId: id, classNum }, text: name });
      }
    });
    return options;
  });
}
