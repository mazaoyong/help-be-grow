export const getDefaultText = (value, defaultValue) => {
  if (value === 0) return value;
  return value || defaultValue || '-';
};

/**
 * 移除对象中空字符串字段
 * todo 暂时只处理表层，深层次暂不做处理
 *
 * @param {Object} obj 对象
 */
export const deleteEmptyProperty = (obj = {}) => {
  const temp = Object.assign({}, obj);
  for (const key in temp) {
    if (temp[key] === '' || temp[key] === null || temp[key] === undefined) {
      delete temp[key];
    }
  }

  return temp;
};

/**
 * 获取班级状态文案
 *
 * @param {*} startTime 开班时间
 * @param {*} endTime 结班时间
 */
export const getEduClassStatus = (startTime, endTime) => {
  const now = Date.now();
  let eduClassStatus = '';

  if (startTime && endTime) {
    if (startTime && endTime) {
      if (now < startTime) {
        eduClassStatus = 'WILL';
      }
      if (now >= startTime && now <= endTime) {
        eduClassStatus = 'ING';
      }

      if (now > endTime) {
        eduClassStatus = 'DONE';
      }
    }

    return eduClassStatus;
  }
};
