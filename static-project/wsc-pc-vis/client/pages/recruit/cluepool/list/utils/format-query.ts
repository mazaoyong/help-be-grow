import { omitBy, isNil } from 'lodash';
import { IBaseFetchListQuery } from '../../api/list';
import { CluePageType } from './use-fetch-list';

type FormattedQuery = IBaseFetchListQuery['clueInfoQuery'];
function formatQuery(origin: Record<string, any>, pageType: CluePageType): FormattedQuery {
  const res: FormattedQuery = {};

  // 添加属性，如果没有值就丢掉
  Object.entries(origin).forEach(([key, value]) => {
    let isValid = true;
    if (!['recordDateRange', 'createAtDateRange', 'revisitDateRange'].includes(key)) {
      isValid = isNotEmpty(value);
    }
    if (!isValid) return;
    switch (key) {
      case 'recordDateRange':
      case 'createAtDateRange':
      case 'revisitDateRange':
        if (Array.isArray(value) && value.length) {
          // 原线索搜索条件，格式为 [[dateRange, chooseDay], selectType]
          const [selectedTime] = value;
          const [dateRange = []] = selectedTime || [];
          if (Array.isArray(dateRange)) {
            res[key] = {
              startTime: dateRange[0],
              endTime: dateRange[1],
            };
          }
        }
        break;
      case 'sourceId':
        // 多校区的情况下，value会变成长度为3的数组，这时候需要将第一个表示校区的参数忽略
        const [, ...curSourceValue]: [number, string, number] =
          value.length === 3 ? value : [_global.kdtId, ...value];
        const [groupId = '', sourceId = -1] = curSourceValue;
        if (Number(sourceId) === -1) {
          // 如果没有sourceId，说明分组信息为全部，此时用groupId来查询
          res.groupId = groupId;
        } else {
          res.sourceId = sourceId;
        }
        break;
      case 'tags':
        // value 是一个二维数组：[[一级ID， 二级ID], [一级ID， 二级ID]]
        if (Array.isArray(value)) {
          res.tags = value
            .reduce((result, v) => {
              return result.concat((v || [])[1]);
            }, [])
            .filter(Boolean);
        }
        break;
      case 'kdtId':
        res.kdtId = value[0];
        break;
      case 'ownerId':
        res.ownerId = value[0];
        break;
      default:
        res[key] = value;
        break;
    }
  });

  // 如果是我的线索列表，添加ownerId
  if (pageType === 'mine') {
    res.ownerId = _global.userId;
  }

  return omitBy(res, isNil);
}

export default formatQuery;

function isNotEmpty(value: any): boolean {
  if (Array.isArray(value)) {
    return value.every(isNotEmpty);
  }
  if (typeof value === 'object') {
    return Object.entries(value).every(([, objValue]) => isNotEmpty(objValue));
  }
  return Boolean(value);
}
