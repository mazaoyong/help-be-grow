import request from 'common/api/request';
import { visAjax } from 'fns/new-ajax';

/**
 * 新接口-查询课程商品列表信息
 *
 * @param {*} payLoad 数据
 */
export function findPageByCondition(payload) {
  return visAjax('GET', '/edu/course-product/list-page.json', payload);
}

/**
 * 批量删除
 *
 * @export
 * @param {Object} payload
 * @param {Array} payload.aliasList 带处理的数据
 * @returns
 */
export function setBatchDelete(payload) {
  return request('POST', '/edu/course-product/batch-delete.json', payload);
}

/**
 * 批量设置vip折扣
 *
 * @export
 * @param {Object} payload
 * @param {Array} payload.actionIds 带处理的数据
 * @param {boolean[=true]} payload.joinDiscount 是否参与折扣
 */
export function setBatchSetDiscount(payload) {
  const { aliasList, joinDiscount = true } = payload || {};
  return request('POST', '/edu/course-product/batch-set-discount.json', { aliasList, joinDiscount });
}

/**
 * 批量上下架
 *
 * @export
 * @param {Object} payload
 * @param {Array} payload.aliasList 需要操作的数据的alias集合
 * @param {boolean[=true]} payload.sell true是上架销售
 * @returns
 */
export function setBatchSetSellStatus(payload) {
  const { aliasList = [], sell = true, sellStatusProductModelList = [] } = payload;
  return request('POST', '/edu/course-product/batch-set-sell-status.json', {
    aliasList,
    sell,
    sellStatusProductModelList,
  });
}

/**
 * 快捷修改无sku商品信息（序号及标题）
 *
 * @export
 * @param {Object} payload
 * @param {number} payload.order 要修改的序号
 * @param {string} payload.alias 要修改的商品alias
 * @returns
 */
export function quickUpdateProductByAlias(payload) {
  return request('POST', '/edu/course-product/quick-update.json', payload);
}

/**
 * 快捷修改sku信息
 *
 * @export
 * @param {Object} payload
 * @param {number} payload.skuType 1 无sku 2多sku
 * @param {Array} payload.skus
 * @returns
 */
export function quickUpdateProductSkuByAlias(payload) {
  return request('POST', '/edu/course-product/quick-update-sku.json', payload);
}

// 新接口 列表页获取sku信息
export function findProductSkus(payload) {
  return request('GET', '/edu/course-product/find-skus.json', payload);
}

// 查询课程标签
export function getCourseTagApi(data) {
  return request('GET', '/edu/course-product/find-tags.json', data);
}

// 查询老师列表
export function getTeacherListApi(data) {
  return request('GET', '/edu/getTeacherListByPage.json', data);
}

// 查询上课地点
export function getStoreListApi(data) {
  return request('GET', '/edu/store/find-stores.json', data);
}

// 查询商品规格名列表
export function findSkuPropNamesApi(data) {
  return request('GET', '/edu/course-product/find-sku-names.json', data);
}

// 获取商品规格值列表
export function findSkuPropValuesApi(data) {
  return request('GET', '/edu/course-product/find-sku-values.json', data);
}

// 创建店铺规格key
export function postCreateSkuPropNameApi(data) {
  return request('post', '/edu/course-product/create-sku-name.json', data);
}

// 获取店铺规格value
export function postCreateSkuPropValApi(data) {
  return request('post', '/edu/course-product/create-sku-value.json', data);
}

// 创建商品
export function postCreateCourseApi(data) {
  return request('post', '/edu/course-product/_textarea_/create-course.json', data);
}

// pc端获取课程详情
export function getCoursePCDetailApi(data) {
  return request('get', '/edu/course-product/get-pc-detail.json', data);
}

// 更新课程
export function putUpdateCourseApi(data) {
  return request('put', '/edu/course-product/_textarea_/update-course.json', data);
}

// 获取商品锁
export function getProductLockTypes(data) {
  return request('get', '/lock/types.json', data);
}

// 查询指定课程关联班级列表
export function findEduClassByCondition(payload) {
  return visAjax('GET', '/edu/course/findEduClassByCondition.json', payload);
}

// 完成店铺任务
export function finishTask(payload) {
  return visAjax('POST', '/commom/shop/finishTask.json', payload);
}

// 校区页面配置
export function findPageCampusProduct(payload) {
  return visAjax('GET', '/edu/course-product/find-campus-product.json', payload);
}

// 根据售卖状态获取校区信息
export function findPageBySoldStatus(payload) {
  return visAjax('GET', '/edu/course-product/list-page-by-sold-status.json', payload);
}
