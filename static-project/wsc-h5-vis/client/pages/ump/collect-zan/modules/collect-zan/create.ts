import { toCourse } from '../navigation/course';

export function createZan(alias: string) {
  // 跳转至课程详情页
  toCourse(alias);
}
