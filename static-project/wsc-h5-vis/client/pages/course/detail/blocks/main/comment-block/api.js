import { ajax } from '@youzan/vis-ui';

export function getGoodsComment(alias, pageNum, pageSize, chosen) {
  return ajax({
    url: '/wscvis/knowledge/comment/list.json',
    data: {
      alias,
      pageNum,
      pageSize,
      chosen,
    },
    loading: false,
  });
}

export function deleteComment(alias, id) {
  return ajax({
    url: '/wscvis/knowledge/comment/delete.json',
    type: 'post',
    contentType: 'application/json',
    data: {
      alias,
      id,
    },
    loading: false,
  });
};

export function changeLikeStatus(alias, id, isPraise) {
  return ajax({
    url: '/wscvis/knowledge/comment/praise.json',
    type: 'post',
    contentType: 'application/json',
    data: {
      alias,
      id,
      isPraise,
    },
    loading: false,
  });
};
