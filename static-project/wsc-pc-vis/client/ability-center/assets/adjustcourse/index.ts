import qs from 'qs';
import AdjustRecord from 'pages/recruit/adjustcourse/pages/adjust/components/adjust-record';

interface queryOption {
  studentIds: string;
  kdtId: number;
  assetNos: string;
  eduClassId?: string;
  eduCourseId?: string;
}

function navigateToAdjustCourse(option: queryOption) {
  const queryString = qs.stringify(option, { addQueryPrefix: true });
  const prefix = `${window._global.url.v4}/vis/edu/page/adjustcourse`;
  if (queryString.length > 0) {
    return prefix + queryString;
  }
  return prefix;
}

export {
  AdjustRecord,
  navigateToAdjustCourse
}