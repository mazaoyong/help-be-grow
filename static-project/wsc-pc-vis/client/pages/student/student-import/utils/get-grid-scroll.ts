import { IMPORT_TYPE } from '../constants';

/**  横向指定滚动区域的宽度 */
export default function getGridScroll(importType: IMPORT_TYPE, columnLen?: number) {
  if (importType === IMPORT_TYPE.byStudentInfo && columnLen) {
    return { x: columnLen * 160 };
  }
  const map = {
    [IMPORT_TYPE.byCourse]: 1900,
    [IMPORT_TYPE.byClass]: 1300,
    default: 1900,
  };
  const scrollX = map[importType] || map.default;
  return { x: scrollX };
}
