import { ajax } from '@youzan/vis-ui';

const BASE_URL = 'https://h5.youzan.com/wscvis';

export const postRewardCourse = data => {
  return ajax({
    method: 'post',
    url: `${BASE_URL}/knowledge/anonymous/course/postRewardCourse.json`,
    data,
    loading: false,
  });
};
