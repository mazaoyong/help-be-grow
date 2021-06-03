import { DataType } from '@ability-center/student';
import { keyBy, get } from 'lodash';

export function formatStudentPatchValue({ item, areaOptions, studentProfile }) {
  function formatValue(dataType, value) {
    if (!dataType) return value;

    function decodeAddress(address: string) {
      // return [{"code":"220000","name":"吉林省"},]
      const addresses = address.split(',');
      if (addresses.length < 1) return address;
      let node = areaOptions;
      let result: any[] = [];
      for (let index = 0; index < addresses.length; index++) {
        const name = addresses[index];
        if (!node) {
          result.push({ code: 0, name });
          continue;
        }
        const { id, children } = node.find(d => d.title === name) || {};
        if (!id) {
          continue;
        }
        result.push({ code: id, name });
        node = children;
      }
      if (result.length) {
        return result;
      }
      return address;
    }

    function decodeGender(gender: string) {
      const options = {
        男: '1',
        女: '2',
      };
      return options[gender] || gender;
    }

    const formatters = {
      // [DataType.DATE]: date => {
      //   return format(date, 'YYYY-MM-DD');
      // },
      [DataType.ADDRESS]: decodeAddress,
      [DataType.PROVINCE]: decodeAddress,
      [DataType.GENDER]: decodeGender,
    };
    const formatter = formatters[dataType];
    if (!formatter) return value;
    return formatter(value);
  }

  return async () => {
    const profileMap = keyBy(studentProfile, 'attributeKey');

    return Object.values(item.rowFieldMap as Object).reduce((total: any, cur: any) => {
      const { name, value } = cur;
      const { dataType } = get(profileMap, name, {});
      return Object.assign(total, { [name]: formatValue(dataType, value) });
    }, {});
  };
}

const genderMap = {
  '1': '男',
  '2': '女',
};

export const formatSubmitOptions = {
  addressFormatter: addresses => {
    return addresses.map(item => item.name).join(',');
  },
  selectFormatter: rawValue => {
    return get(rawValue, 'text', rawValue);
  },
  genderFormatter: rawValue => {
    return genderMap[rawValue] || rawValue;
  },
};

export function isErrorItem(item) {
  return !!get(item, 'rowFieldValidateFlag', 0);
}
