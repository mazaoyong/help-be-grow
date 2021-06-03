import get from 'lodash/get';

const enumValue = {
  edu_stuName: 'name',
  edu_stuAva: 'avatar',
  edu_stuBirth: 'bornData',
  edu_stuSex: 'gender',
  edu_stuContractPhone: 'mobile',
  edu_stuContractWeChat: 'wechatAccount',
  edu_stuAddress: 'address',
  edu_stuGrade: 'grade',
  edu_idCard: 'idCardNo',
  edu_school: 'school',
};

// 需要将自定义资料项中的几个资料项映射到form对象的最外层中，保证原有数据结构
export default function(originValues, form) {
  const addonKeys = Object.keys(enumValue);
  addonKeys.forEach(key => {
    let value = get(originValues, key);
    if (value) {
      const reflectKey = enumValue[key];
      if (reflectKey === 'address') {
        value = JSON.stringify(value || '[]');
      }
      form[reflectKey] = value;
    }
  });

  return form;
}
