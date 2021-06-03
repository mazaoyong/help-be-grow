/* eslint-disable camelcase */
import { visAjax, ironAjax } from 'fns/new-ajax';

export const getQrcode = data => {
  return ironAjax('GET', '/ump/paidcontent/invite.json', data);
};

// 会员权益列表
export const getBenefitList = data => {
  return visAjax('GET', '/pct/benefit/getFindBenefitPackagePage.json', data);
};

// 0 未关联 1 已关联 3 关联并已被领取
export const checkBenefitPkgStatus = data => {
  return visAjax('GET', '/pct/benefit/getCheckBenefitPackageStatus.json', data);
};

// 删除会员权益
export const deleteBenefit = data => {
  return visAjax('POST', '/pct/benefit/postDeleteBenefitPackage.json', data);
};

// 获取待选择的会员卡
export const getBenefitPkgVipCards = data => {
  return visAjax('GET', '/pct/benefit/getFindSelectableBenefitCardPage.json', data);
};

// 新建会员权益
export const saveBenefit = data => {
  const url = !data.alias ? '/pct/benefit/_textarea_/postCreateBenefitPackage.json' : '/pct/benefit/_textarea_/postEditBenefitPackage.json';
  return visAjax('POST', url, data);
};

// 获取详情
export const getBenefitDetail = data => {
  return visAjax('GET', '/pct/benefit/getBenefitPackageDetail.json', data);
};

// 获取权益包下的内容和专栏列表
export const getBenefitDetailItems = data => {
  return visAjax('GET', '/pct/benefit/getFindBenefitItemDetailPage.json', data);
};

// 获取权益包内的内容
export const getBenefitContents = data => {
  return ironAjax('GET', '/ump/paidcontent/benefitPkgContents.json', data);
};

// 添加权益包项
export const addBenefitDetailItems = data => {
  return visAjax('POST', '/pct/benefit/postAddBenefitItems.json', data);
};

// 删除权益包项
export const deleteBenefitDetailItems = data => {
  return visAjax('POST', '/pct/benefit/postRemoveBenefitItems.json', data);
};

// 修改序号
export const modifySerialNo = data => {
  return visAjax('POST', '/pct/benefit/postEditBenefitItem.json', data);
};
