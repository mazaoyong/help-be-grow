import { ajax } from '@youzan/vis-ui';

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

export function getNextOwl(alias, sortType, columnAlias) {
  return ajax({
    url: '/wscvis/course/column/getNextEduProductInfo.json',
    data: {
      alias,
      sortType,
      columnAlias,
    },
    loading: false,
  });
}

export function getDetailSimple(alias) {
  return ajax({
    url: '/wscvis/course/getSimple.json',
    data: {
      alias,
    },
    loading: false,
  });
}
