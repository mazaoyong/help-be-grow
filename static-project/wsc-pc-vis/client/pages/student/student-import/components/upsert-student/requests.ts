import {
  saveRow,
  getRowById,
} from '../../api/confirm';
import { formRowFields } from '../../utils/parse-row-fields';

import { IRowDataRequest } from '../../types';

export const saveRowData = (query: IRowDataRequest) => {
  const { fields, taskId, rowId } = query;

  if (!fields || !Object.keys(fields)) throw '提交信息不能为空';

  const rowFields = formRowFields(fields);
  if (!rowFields) throw '提交信息不能为空';
  return saveRow({
    rowFields,
    taskId,
    rowId,
  });
};

export const getRowData = (query: IRowDataRequest) => {
  return getRowById({ query });
};
