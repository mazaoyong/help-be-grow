import { DataType } from '@ability-center/student';
import find from 'lodash/find';
import get from 'lodash/get';

function dealNormalType(value, type, attrItems) {
  switch (type) {
    case DataType.ADDRESS:
    case DataType.PROVINCE:
      if (value) {
        try {
          const address = JSON.parse(String(value).replace(/\n/, '\\n'));
          return address.map(({ name }) => name).join('');
        } catch {
          return '-';
        }
      }
      break;
    case DataType.GENDER:
      switch (value) {
        case '1':
          return '男';
        case '2':
          return '女';
        default:
          break;
      }
      break;
    case DataType.MULTI_SELECT:
      if (attrItems) {
        if (typeof value === 'string') {
          const selectedItems = value.split(',').map(id => find(attrItems, { id: Number(id) }));
          if (Array.isArray(selectedItems) && selectedItems.every(sel => !!sel)) {
            return selectedItems.map(item => item.value).join(', ');
          }
        }
      }
      break;
    case DataType.SELECT:
      if (attrItems) {
        return get(find(attrItems, { id: Number(value) }), 'value');
      }
      break;
    default:
      return value || '-';
  }
}

function dealExaminationType(value, type, attrItems) {
  switch (type) {
    case DataType.ADDRESS:
    case DataType.PROVINCE:
      if (value) {
        // 适配考试的信息采集
        if (type === DataType.PROVINCE) {
          return value;
        }
        const items = value.split(' ');
        let detailAttr = '';
        try {
          detailAttr = get(JSON.parse(items.pop()), 'name', '');
        } catch (error) {
          console.error(error);
        }
        return `${items.join(' ')} ${detailAttr}`;
      }
      break;
    case DataType.MULTI_SELECT:
      return String(value).replace(/,/g, '，');
    case DataType.SELECT:
      return value;
    default:
      return dealNormalType(value, type, attrItems);
  }
}

function dealTuitionRewardsType(value, type, attrItems) {
  switch (type) {
    case DataType.ADDRESS:
    case DataType.PROVINCE:
    case DataType.MULTI_SELECT:
    case DataType.SELECT:
      return value;
    default:
      return dealNormalType(value, type, attrItems);
  }
}

const getAttributeValue = (value, type, attrItems, scene = 'clue') => {
  switch (scene) {
    case 'examination':
      return dealExaminationType(value, type, attrItems);
    case 'tuition-rewards':
      return dealTuitionRewardsType(value, type, attrItems);
    default:
      return dealNormalType(value, type, attrItems);
  }
};

export default getAttributeValue;
