import get from 'lodash/get';
import clone from 'lodash/clone';
import { getCourseList, getClassroomByNo } from './api';
import { getClassDetailByNo } from '../../../edu-admin/educlass/api';
import { formatQueryIntoFormValues } from './format-value';
import { Notify } from 'zent';

const pageRequest = {
  pageNumber: 1,
  pageSize: 30,
};

/**
 * 根据url参数来查询信息并回填，返回的是一个Promise数组
 *
 * @param {Object} query url查询参数
 * @returns Promise<{attachOptions, formValues}>
 */
export default function getFieldInfoByQuery(query, kdtId) {
  const supplementedQuery = clone(query);
  const getCurrentCourse = () =>
    new Promise(resolve => {
      if (get(supplementedQuery, 'eduCourseId')) {
        const requestQuery = {
          eduCourseIds: [supplementedQuery.eduCourseId],
          kdtId,
        };
        getCourseList({ query: requestQuery, pageRequest })
          .then(data => {
            const { content = [] } = data;
            content.forEach(item => {
              const { name, classNum } = item;
              supplementedQuery.classNum = classNum;
              supplementedQuery.eduCourseName = name;
            });
            resolve('done');
          })
          .catch(err => {
            Notify.error(err);
          });
      } else {
        resolve('done');
      }
    });
  const getCurrenClass = new Promise(resolve => {
    if (get(query, 'classNo')) {
      const requestQuery = {
        classNo: query.classNo,
        kdtId,
      };
      getClassDetailByNo(requestQuery)
        .then(data => {
          if (data) {
            const {
              id,
              eduCourseId,
              eduCourseName,
              eduClassName,
              startTime,
              endTime,
              kdtId,
              shopName,
            } = data;
            supplementedQuery.eduCourseId = eduCourseId;
            supplementedQuery.eduCourseName = eduCourseName;
            supplementedQuery.classId = id;
            supplementedQuery.className = eduClassName;
            supplementedQuery.classStartTime = startTime;
            supplementedQuery.classEndTime = endTime;
            supplementedQuery.kdtId = kdtId;
            supplementedQuery.shopName = shopName;
          }
          resolve('done');
        })
        .catch(err => {
          Notify.error(err);
        });
    } else {
      resolve('done');
    }
  });
  const getClassroom = new Promise(resolve => {
    if (get(query, 'classroomNo')) {
      const requestQuery = {
        classroomNo: query.classroomNo,
        kdtId,
      };
      getClassroomByNo(requestQuery)
        .then(data => {
          if (data) {
            const { addressId, addressName, kdtId, shopName, capacity } = data;
            supplementedQuery.addressId = addressId;
            supplementedQuery.addressName = addressName;
            supplementedQuery.kdtId = kdtId;
            supplementedQuery.shopName = shopName;
            supplementedQuery.classroomCapacity = capacity;
          }
          resolve('done');
        })
        .catch(err => {
          Notify.error(err);
        });
    } else {
      resolve('done');
    }
  });

  return Promise.all([getCurrenClass, getClassroom])
    .then(_ => getCurrentCourse())
    .then(_ => formatQueryIntoFormValues(supplementedQuery));
}
