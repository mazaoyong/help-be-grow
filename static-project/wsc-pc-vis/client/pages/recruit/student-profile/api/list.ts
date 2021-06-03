import { StudentProfileAPI } from '@ability-center/student';

// 获取已经添加的学员资料项列表
export const getProfileItemList = StudentProfileAPI.getProfileItemList;

// 添加门店的学员资料项列表
export const addProfileItems = StudentProfileAPI.addProfileItems;

// 获取设置的学员资料项列表
export const getAllStudentProfileListByKdtId = StudentProfileAPI.getAllStudentProfileListByKdtId;

// 创建资料项
export const createStudentProfileItem = StudentProfileAPI.createStudentProfileItem;

// 编辑资料项
export const updateStudentProfileItem = StudentProfileAPI.updateStudentProfileItem;

// 删除资料项
export const deleteStudentProfileItem = StudentProfileAPI.deleteStudentProfileItem;

// 根据场景值获取学员资料项
export const getListByApplicableScene = StudentProfileAPI.getListByApplicableScene;

export const getRemoteConf = StudentProfileAPI.getRemoteConf;
