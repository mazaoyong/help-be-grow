export enum CourseTypeEnum {
  TRAIL_COURSE = 0,
  OFFICIAL_COURSE,
}
export function isOfficialCourse(courseType: CourseTypeEnum | undefined): boolean {
  if (courseType) {
    return courseType === CourseTypeEnum.OFFICIAL_COURSE;
  }
  return false;
}
