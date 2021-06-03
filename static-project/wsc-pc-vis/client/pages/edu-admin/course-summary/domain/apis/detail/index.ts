import { visAjax } from 'fns/new-ajax';

import type {
  IEduAssetOperationQuery,
  IEduAssetOperationInfoDTO,
  IPageRequest as IEduAssetPageRequest,
} from 'definitions/api/owl/pc/EduAssetOperationFacade/queryAssetOperationPage';
import type {
  IAssetDetailQuery,
  IAssetDetailDTO,
} from 'definitions/api/owl/pc/SignSummaryFacade/getAssetDetail';
import type { IEduAssetSubOperationExportQuery } from 'definitions/api/owl/pc/EduAssetOperationFacade/submitAssetSubOperationExportTask';
import {
  IEduAssetSubBriefDTO,
  IEduAssetSubOperationQuery,
} from 'definitions/api/owl/pc/EduAssetOperationFacade/queryAssetSubOperationBriefInfo';
import {
  ISignInBriefInfoDTO,
  ISignInRecordsQuery,
} from 'definitions/api/owl/pc/SignInFacade/findSignInBrieInfo';

export function getManualConsumeRecords(
  query: IEduAssetOperationQuery,
  pageRequest: IEduAssetPageRequest,
) {
  return visAjax<{ content: IEduAssetOperationInfoDTO[] }>(
    'GET',
    '/edu-admin/course-summary/course-summary-common/queryAssetSubOperationPage.json',
    {
      query,
      page: pageRequest,
    },
  );
}

export function getSummaryDetailAssetInfo(query: IAssetDetailQuery) {
  return visAjax<IAssetDetailDTO>(
    'GET',
    '/edu-admin/course-summary/course-summary-common/getAssetDetail.json',
    { query },
  );
}

export function exportManualConsumeRecords(query: IEduAssetSubOperationExportQuery) {
  return visAjax<boolean>(
    'POST',
    '/edu-admin/course-summary/course-summary-export/submitAssetSubOperationExportTask.json',
    { query },
  );
}

export function getManualConsumeSummary(query: IEduAssetSubOperationQuery) {
  return visAjax<IEduAssetSubBriefDTO>(
    'GET',
    '/edu-admin/course-summary/course-summary-common/queryAssetSubOperationBriefInfo.json',
    { query },
  );
}

export function getRecordsSummary(query: ISignInRecordsQuery) {
  return visAjax<ISignInBriefInfoDTO>(
    'GET',
    '/edu-admin/course-summary/course-summary-common/findSignInBrieInfo.json',
    { query },
  );
}
