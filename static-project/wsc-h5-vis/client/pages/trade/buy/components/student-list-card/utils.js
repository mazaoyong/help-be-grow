import Args from '@youzan/utils/url/args';
import YZLocalStorage from '@youzan/utils/browser/local_storage';
import * as SafeLink from '@/common/utils/custom-safe-link';
import { find } from 'lodash';

/**
 * 重定向到学员编辑页
 *
 * @param {number|string} [studentId] - 学员id
 */
export const redircetToEdit = studentId => {
  const query = {
    alias: studentId,
    callback_url: window.location.href,
  };

  SafeLink.redirect({
    url: 'wscvis/edu/student-edit.html',
    query,
  });
};

/**
 * 从url或localstorage获取缓存的studentId
 *
 * @return {number} - 学员id
 */
export const getStudentIdFromCache = () => {
  let studentId = Args.get('checkedStudent');

  if (studentId) {
    return +studentId;
  }

  const checkedUserId = YZLocalStorage.getItem('recentSelectedUser') || '';
  if (+checkedUserId === _global.buyer_id) {
    studentId = YZLocalStorage.getItem('recentSelectedStudent') || '';
  } else {
    YZLocalStorage.removeItem('recentSelectedStudent');
  }

  return +studentId;
};

/**
 * 缓存studentId
 *
 * @param {string} studentId - 学员id
 */
export const setStudentIdToCache = (studentId) => {
  YZLocalStorage.setItem('recentSelectedStudent', studentId);
  YZLocalStorage.setItem('recentSelectedUser', _global.buyer_id);
};

/**
 * 检查学员信息是否完整
 *
 * @param {Array} [customizeItems=[]] - 学员信息中的资料项
 * @param {number} [currentScene=1] - 场景值，默认为报名表单的场景值1
 *
 * @return {boolean} 学员信息是否完整
 */
export const checkStudentIsCompleted = (
  customizeItems = [],
  currentScene = 1
) => {
  return !customizeItems.some(info => {
    const { applicableScenes = [] } = info;
    const senceConf =
      find(applicableScenes, scene => scene.applicableScene === currentScene) ||
      {};
    if (senceConf.required) {
      return info.value === '';
    }
    return false;
  });
};
