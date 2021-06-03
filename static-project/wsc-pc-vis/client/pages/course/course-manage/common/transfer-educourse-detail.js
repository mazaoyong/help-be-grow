import cloneDeep from 'lodash/cloneDeep';

export default function getEduCourseDetail(eduCourse) {
  const eduCourseDetail = cloneDeep(eduCourse);
  if (eduCourseDetail) {
    let classInfo = [].concat(eduCourseDetail.content);
    classInfo = classInfo.map(item => {
      const classItem = {};
      if (item.classCourse && item.classCourse.courseId) {
        classItem.type = 1; // 已关联线下课
      } else if (item.eduClass.maxStuNum - item.classStat.currentStuNum <= 0) {
        classItem.type = 2; // 已满员
      } else if (new Date(item.eduClass.endTime) - new Date() <= 0) {
        classItem.type = 3; // 已结班
      } else {
        classItem.type = 0; // 可选
      }
      classItem.stuEnableNumber = item.eduClass.maxStuNum - item.classStat.currentStuNum;
      classItem.classCourse = item.classCourse;
      classItem.description = `${getDate(item.eduClass.startTime)}至${getDate(
        item.eduClass.endTime,
      )}`;
      classItem.eduClassName = item.eduClass.eduClassName;
      classItem.id = item.eduClass.id;
      classItem.shopName = item.shopName;
      classItem.kdtId = item.kdtId;
      // TODO 按期线下课，新增，选择班级数据联动显示
      classItem.startTime = item.eduClass.startTime;
      classItem.endTime = item.eduClass.endTime;
      classItem.maxStuNum = item.eduClass.maxStuNum;
      return classItem;
    });
    eduCourseDetail.content = classInfo;
  }

  return eduCourseDetail;
}

function getDate(time) {
  const dateString = new Date(time);
  return `${dateString.getFullYear()}-${dateString.getMonth() + 1}-${dateString.getDate()}`;
}
