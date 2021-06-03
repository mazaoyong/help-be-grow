import { visAjax } from 'fns/new-ajax';

import type { ISignUpReadExportQuery } from 'definitions/api/owl/pc/StudentFacade/submitSignUpReadExportTask';

export function exportApplyList(query: ISignUpReadExportQuery) {
  return visAjax<boolean>('POST', '/student/apply-list/submitSignUpReadExportTask.json', { query });
}
