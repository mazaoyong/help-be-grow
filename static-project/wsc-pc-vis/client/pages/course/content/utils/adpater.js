import map from 'lodash/map';
import mapKeysToSnakeCase from '@youzan/utils/string/mapKeysToSnakeCase';
import mapKeysToCamelCase from '@youzan/utils/string/mapKeysToCamelCase';
import { formatContent } from './format-content';

export const getContentList = api => async param => {
  const { page: pageNumber, ...data } = param;
  data.pageNumber = pageNumber;

  const result = await api(data);
  result.content = map(result.content, item => {
    const { videoContentDTO, ...other } = item;
    return Object.assign(other, videoContentDTO);
  });
  return result;
};

export const getContentDetail = api => async param => {
  const result = await api(param);
  const {
    textContentDTO,
    audioContentDTO,
    columnDTO,
    videoContentDTO,
    collectInfoSetting,
    joinGroupSetting,
    ...otherResult
  } = result;
  Object.assign(otherResult, audioContentDTO, columnDTO, textContentDTO, videoContentDTO);
  const ajaxData = mapKeysToSnakeCase(otherResult);
  ajaxData.collect_info_setting = collectInfoSetting || {};
  ajaxData.join_group_setting = joinGroupSetting || {};
  return ajaxData;
};

export const saveContentDetail = api => async (isUpdate, param) => {
  const data = formatContent(mapKeysToCamelCase(param));

  let pictureDTO = {};
  try {
    const picture = JSON.parse(data.picture);
    pictureDTO.picId = picture.attachment_id;
    pictureDTO.picHeight = picture.height;
    pictureDTO.picWidth = picture.width;
    pictureDTO.cover = picture.attachment_full_url;
  } catch (error) {
    pictureDTO = '';
  }
  data.picture = undefined;
  data.pictureDTO = pictureDTO;

  // publishAt 后端不接受空字符串
  if (!data.publishAt) {
    data.publishAt = undefined;
  }

  const result = await api(isUpdate, data);
  return result;
};

export const postBatchContent = api => async (param) => {
  const contentList = map(param, item => formatContent(item));
  const result = await api({ contentList });
  return result;
};
