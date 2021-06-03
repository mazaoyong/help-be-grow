import mapKeysToCamelCase from '@youzan/utils/string/mapKeysToCamelCase';
import pickBy from 'lodash/pickBy';

export function isTextContent(item) {
  return (item.mediaType || item.media_type) === 1;
};

export function isAudioContent(item) {
  return (item.mediaType || item.media_type) === 2;
};

export function isVideoContent(item) {
  return (item.mediaType || item.media_type) === 3;
};

export function isLiveContent(item) {
  return (item.mediaType || item.media_type) === 4;
};

export function getTrialText(mediaType) {
  const textArr = ['试读', '试听', '试看', '试看'];
  return textArr[mediaType - 1];
};

export function formatParams(params) {
  const { page, pageSize, sortBy, sortType, subSortBy, ...query } = mapKeysToCamelCase(params);
  const direction = sortType ? sortType.toUpperCase() : 'DESC';
  const orders = [{
    property: sortBy,
    direction,
  }];
  if (subSortBy) {
    orders.push({
      property: subSortBy,
      direction,
    });
  }
  return {
    query: pickBy(query, item => item !== undefined && item !== null),
    pageRequest: {
      pageNumber: page,
      pageSize,
      sort: {
        orders,
      },
    },
  };
};
