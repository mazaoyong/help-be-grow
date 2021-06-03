import { ajax } from '@youzan/vis-ui';

// export function getContentAndLive(columnAlias, pageNumber, sortType) {
//   return ajax({
//     url: '/wscvis/knowledge/contentAndLive.json',
//     data: {
//       columnAlias,
//       pageNumber,
//       sortType,
//     },
//     loading: false,
//   });
// }

export function getColumnChapters(columnAlias, pid) {
  return ajax({
    url: '/wscvis/knowledge/getColumnChapters.json',
    data: {
      columnAlias,
      pid,
    },
    loading: false,
  });
}

export function getContentAndLive(columnAlias, pageNumber, sortType, chapterId) {
  const data = {
    columnAlias,
    pageNumber,
    sortType,
  };
  if (chapterId) {
    data.chapterId = chapterId;
  }
  return ajax({
    url: '/wscvis/knowledge/contentAndLive.json',
    data,
    loading: false,
  });
}
