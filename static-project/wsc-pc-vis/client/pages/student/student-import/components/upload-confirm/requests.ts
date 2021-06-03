import { batchDeleteRows, getValidateSummary, findRowsByPage } from '../../api/confirm';
import { prepareImport, submitImport, findTaskProgress } from '../../api/import';
import { IBatchDeleteRequest, IRequestByTaskIdType, IRequestTaskProgressType } from '../../types';

export const findRowsByPageRequest = (
  query: IRequestByTaskIdType,
  pageNumber: number = 1,
  pageSize: number = 10,
) => {
  return findRowsByPage({
    query,
    pageRequest: {
      pageNumber,
      pageSize,
      sort: {
        orders: [
          {
            direction: 'DESC',
            property: 'id',
          },
        ],
      },
    },
  });
};

export const batchDeleteRequest = (query: IBatchDeleteRequest) => {
  return batchDeleteRows(query);
};

export const prepareImportRequest = (query: IRequestByTaskIdType) => {
  return prepareImport(query);
};

export const getValidateSummaryRequest = (query: IRequestByTaskIdType) => {
  return getValidateSummary(query);
};

export const submitImportRequest = (query: IRequestByTaskIdType) => {
  return submitImport(query);
};

export const findTaskProgressRequest = (query: IRequestTaskProgressType) => {
  return findTaskProgress(query);
};
