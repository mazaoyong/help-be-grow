import ajaxWrap from 'fns/new-ajax/ajax-wrap';
import { visAjax } from 'fns/new-ajax';
import { isEduHqStore } from '@youzan/utils-shop';

const clueAjax = ajaxWrap(window._global.url.v4 + '/vis/edu/clue');

/**
 * 查询课程顾问列表
 * 1:高级管理员、8:普通管理员、2:客服、21:老师、22:课程顾问、24:教务专员
 *
 * @return Promise
 */

export function findAll(data) {
  return visAjax('GET', '/edu/clue/findAll.json', data);
}

export function findPool(data) {
  return visAjax('GET', '/edu/clue/findPool.json', data);
}

export function findMine(data) {
  return visAjax('GET', '/edu/clue/findMine.json', data);
}

export function findAllWithCount(data) {
  return visAjax('GET', '/edu/clue/findAllWithCount.json', data);
}

export function findPoolWithCount(data) {
  return visAjax('GET', '/edu/clue/findPoolWithCount.json', data);
}

export function findMineWithCount(data) {
  return visAjax('GET', '/edu/clue/findMineWithCount.json', data);
}

export function createClue(command) {
  return visAjax('POST', '/edu/clue/createClue.json', { command }, { contentType: 'application/json' });
}

export function updateClueAPI(command) {
  return visAjax('POST', '/edu/clue/updateClue.json', { command }, { contentType: 'application/json' });
}

export function findAttributeItems() {
  return visAjax('GET', '/edu/clue/findAttributeItems.json');
}

// 获取员工列表
export function getFollowersAPI(kdtId) {
  let roleIds = [1, 2, 8, 21, 22, 24];

  if (isEduHqStore) {
    roleIds = [1, 8, 22, 24, 26];
  }

  const data = { roleIds };
  if (kdtId) {
    data.kdtId = kdtId;
  }
  return visAjax('GET', '/commom/edu/findStaffByRoles.json', data);
}

// the privilege is judged by backend
export function findPagePowerStaffs(targetKdtId) {
  return visAjax('GET', '/commom/edu/findPagePowerStaffs.json', {
    cluePowerQuery: {
      powerTypes: [11],
      targetKdtId: targetKdtId || window._global.kdtId,
    },
  });
}

// 线索详情
export function getClueDetailByIdAPI(clueId) {
  return clueAjax('GET', '/getDetailById.json', { clueId });
}

// 修改线索状态
export function changeStateAPI(clueId, targetStateCode, orderNo) {
  return clueAjax('POST', '/changeState.json', { clueId, targetStateCode, orderNo });
}

// 查询关联订单
export function queryRelatedOrder(page, query) {
  return new Promise((resolve, reject) => {
    clueAjax('GET', '/queryRelatedOrder.json', { params: { page, query } }).then(resolve).catch(err => {
      // 订单号非法时当做查不出内容，这个后端不好弄，暂时前端做
      if (err === '订单号非法') {
        resolve({
          content: [],
          numberOfElements: 0,
          pageable: null,
          total: 0,
          totalPages: 1,
        });
      } else {
        reject(err);
      }
    });
  });
}

// 查询线索订单归属校区
export function checkOrderBelongsTo({ clueId, orderNo }) {
  return clueAjax('GET', '/checkOrderBelongsTo.json', { query: { clueId, orderNo } });
}

// 领取线索(批量)
export function takeCluesAPI(clueIds) {
  return clueAjax('POST', '/takeClues.json', { clueIds });
}

// 分配线索(批量)
export function distributeCluesAPI(data) {
  return clueAjax('POST', '/distributeClues.json', data);
}

// 放弃线索
export function giveUpCluesAPI(clueIds, reason) {
  return clueAjax('POST', '/giveUpClues.json', { reason, clueIds });
}

// 删除线索
export function deleteCluesAPI(clueIds, reason, reasonId) {
  return clueAjax('POST', '/deleteClues.json', { reason, reasonId, clueIds });
}

// 还原线索
export function restoreCluesAPI(clueIds, restoreType = 0, userId = null, reason = null) {
  return clueAjax('POST', '/restoreClues.json', { reason, clueIds, restoreType, userId });
}

// 永久删除线索
export function permanentlyDeleteCluesAPI(clueIds, reason) {
  return clueAjax('POST', '/permanentlyDeleteClues.json', { reason, clueIds });
}

// 转让线索(批量)
export function transferCluesAPI(data) {
  return clueAjax('POST', '/transferClues.json', data);
}

export function giveUpClues(data) {
  return visAjax('POST', '/edu/clue/giveUpClues.json', data);
}

export function takeClues(data) {
  return visAjax('POST', '/edu/clue/takeClues.json', data);
}

// 线索标签更新
export function updateClueTagsAPI(clueId, tagIds) {
  return clueAjax('POST', '/updateClueTags.json', { clueId, tagIds });
}

// 分页查询跟进记录列表
export function findPageClueRecordsAPI(data) {
  return clueAjax('GET', '/findPageClueRecords.json', data);
}

// 线索详情页添加跟进记录
export function createClueRecordAPI(data) {
  return clueAjax('POST', '/createClueRecord.json', data);
}

// 线索详情页更新跟进记
export function updateClueRecordAPI(data) {
  return clueAjax('POST', '/updateClueRecord.json', data);
}

// 分页查询线索标签分组（含有线索标签）
export function findTagGroupPageAPI(pageRequest) {
  return clueAjax('GET', '/findTagGroupPage.json', { pageRequest });
}

export function findSourceGroupPageAPI(data) {
  return clueAjax('GET', '/findSourceGroupPage.json', data);
}

// 分页查询流转原因
export function findTransferReasonPageByQueryAPI(data) {
  return clueAjax('GET', '/findTransferReasonPageByQuery.json', data);
}

// 预约列表
export function findStudentLessonsAPI(data) {
  return visAjax('GET', '/edu/appointment/findStudentLessonsForClue.json', data);
}

// 已购课程列表
export function findPageByMobileWithCourseAPI(data) {
  return visAjax('GET', '/edu/student/findPageByMobileWithCourse.json', data);
}

// 预报名
export function createPreAppointmentAPI(data) {
  return visAjax('POST', '/edu/regis/record/createPreAppointment.json', data);
}

// 预报名
export function createPreAppointmentForClue(data) {
  return visAjax('POST', '/edu/regis/record/createPreAppointmentForClue.json', data);
}

// 获取连锁总部下面所有的子店铺
export function findListAllCampusAPI() {
  return visAjax('GET', '/commom/shop/findListAllCampus.json', {});
}

export function findMyRole() {
  return visAjax('GET', '/edu/clue/findMyRole.json');
}

// 获取试听配置
export function getClueSettings() {
  return visAjax('GET', '/edu/clue/setting/getClueSetting.json');
}

export function getRemoteConf() {
  return visAjax('GET', '/edu/profile/get-remote-conf.json', {});
}

// 线索插件，获取客户资料项配置
export function findUnifiedAttributeItems(data) {
  return visAjax('GET', '/edu/clue/find-unified-attribute-items.json', data);
}

// 修改来源
export function modifySource(data) {
  return visAjax('POST', '/edu/student/modifySource.json', data);
}

// 查看线索是否可以转化为学员
export function checkClueMerge(data) {
  return visAjax('GET', '/edu/clue/checkClueMerge.json', data);
}

// 转化确认接口
export function confirmClueMerge(data) {
  return visAjax('POST', '/edu/clue/confirmClueMerge.json', data);
}
