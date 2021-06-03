import { visAjax } from 'fns/new-ajax';
import type {
  IStudentSignSummaryQuery,
  IPageRequest as IStudentSummaryPageRequest,
  IStudentSignSummaryDTO,
} from 'definitions/api/owl/pc/SignSummaryFacade/findStudentSignSummaryInfo';
import type {
  IAssetSignSummaryQuery,
  IPageRequest as IAssetsSummaryPageRequest,
  IAssetSignSummaryDTO,
} from 'definitions/api/owl/pc/SignSummaryFacade/findAssetSignSummaryInfo';
import type { IStudentSignSummaryQuery as IStudentExportQuery } from 'definitions/api/owl/pc/SignSummaryFacade/exportStudentSignSummaryInfoTask';
import type { IAssetSignSummaryQuery as IAssetsExportQuery } from 'definitions/api/owl/pc/SignSummaryFacade/exportAssetSignSummaryInfoTask';

export function getStudentCourseSummaryList(
  query: IStudentSignSummaryQuery,
  pageRequest: IStudentSummaryPageRequest,
) {
  return visAjax<{ content: IStudentSignSummaryDTO[] }>(
    'GET',
    '/edu-admin/course-summary/course-summary-common/findStudentSignSummaryInfo.json',
    { query, pageRequest },
  );
}

export function getAssetsCourseSummaryList(
  query: IAssetSignSummaryQuery,
  pageRequest: IAssetsSummaryPageRequest,
) {
  return visAjax<{ content: IAssetSignSummaryDTO[] }>(
    'GET',
    '/edu-admin/course-summary/course-summary-common/findAssetSignSummaryInfo.json',
    { query, pageRequest },
  );
}

export function exportStudentList(query: IStudentExportQuery) {
  return visAjax<boolean>(
    'POST',
    '/edu-admin/course-summary/course-summary-export/exportStudentSignSummaryInfoTask.json',
    { query },
  );
}

export function exportAssetList(query: IAssetsExportQuery) {
  return visAjax<boolean>(
    'POST',
    '/edu-admin/course-summary/course-summary-export/exportAssetSignSummaryInfoTask.json',
    { query },
  );
}
