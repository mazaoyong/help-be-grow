import { visAjax } from 'fns/new-ajax';

// 查询校区课程（分页）
export function getCourseList(payload) {
  return visAjax('GET', '/edu/eduCourse/getEduCourseList.json', payload);
}

// 查询单店员工
export function getSingleShopStaffList(payload) {
  return visAjax('GET', '/student/single-staff/find.json', payload);
}

// 查询连锁店铺员工
export function getChainStaffList(payload) {
  return visAjax('GET', '/staff/queryPage.json', payload);
}

// 查询班级列表
export function getClassList(payload) {
  return visAjax('GET', '/edu/educlass/findPageByName.json', payload);
}

// 根据任务Id查询导入情况（分页）
export function findRowsByPage(payload) {
  return visAjax('GET', '/edu/studentImport/findRowsByPage.json', payload);
}

// 查询学员导入任务行
export function getRowById(payload) {
  return visAjax('GET', '/edu/studentImport/getRowById.json', payload);
}

// 查询学员导入任务行(脱敏)
export function findRowsDesensitizeByPage(payload) {
  return visAjax('GET', '/edu/studentImport/findRowsDesensitizeByPage.json', payload);
}

interface ISaveRow {
  rowFields: Array<{ name: string; value: string }>;
  taskId: number;
  rowId?: number;
}

// 新增/修改学员任务行
export function saveRow(payload: ISaveRow) {
  return visAjax('POST', '/edu/studentImport/saveRow.json', payload);
}

// 批量修改任务列字段
export function batchUpdateFields(payload) {
  return visAjax('POST', '/edu/studentImport/batchUpdateFields.json', payload);
}

// 批量删除任务行
export function batchDeleteRows(payload) {
  return visAjax('POST', '/edu/studentImport/batchDeleteRows.json', payload);
}

// 获取导入任务总览
export function getValidateSummary(payload) {
  return visAjax('GET', '/edu/studentImport/getValidateSummary.json', payload);
}

// 获取单个导入任务详情
export function getByTaskId(payload) {
  return visAjax('GET', '/edu/studentImport/getByTaskId.json', payload);
}

// 查询重复数据行
export function findSameRows(payload) {
  return visAjax('GET', '/edu/studentImport/findSameRows.json', payload);
}

// 查询冲突数据行
export function getSameData(payload: { rowId: number }) {
  return visAjax('GET', '/edu/studentImport/getSameData.json', payload);
}
