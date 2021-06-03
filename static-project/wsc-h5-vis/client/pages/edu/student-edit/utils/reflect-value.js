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

export default function(originValues, form) {
  const addonKeys = Object.keys(enumValue);
  addonKeys.forEach(key => {
    let value = get(originValues, key);
    if (value) {
      const reflectKey = enumValue[key];
      if (reflectKey === 'address' && Array.isArray(value)) {
        if (value.length === 0) {
          value = '';
        } else {
          value = JSON.stringify(value || []);
        }
      }
      form[reflectKey] = String(value);
    }
  });

  return form;
}
