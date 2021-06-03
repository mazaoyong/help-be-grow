import { batchUpdateFields } from '../../api/confirm';
import { IBatchUpdateFieldRequest } from '../../types';

export const batchUpdateRequest = (query: IBatchUpdateFieldRequest) => {
  return batchUpdateFields(query);
};
