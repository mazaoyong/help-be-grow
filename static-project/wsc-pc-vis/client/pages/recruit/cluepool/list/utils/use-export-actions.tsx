import React from 'react';
import ExportActions from 'components/export-actions';

import { CluePageType } from './use-fetch-list';
import { EXPORT_RECORD_TYPES } from '@ability-center/ump/export-record';
import { IFilterProps } from '@youzan/ebiz-components/es/types/easy-list';

const exportRecordTypeMap: Record<CluePageType, EXPORT_RECORD_TYPES> = {
  all: EXPORT_RECORD_TYPES.CLUE_ALL,
  pool: EXPORT_RECORD_TYPES.CLUE_POOL,
  mine: EXPORT_RECORD_TYPES.CLUE_POOL
};

export default function useExportActions(
  pageType: CluePageType,
  handleExport: (any)=>Promise<any>
): IFilterProps['actionsOption'] {
  /** 优先判断店铺配置是否显示 */
  if (!_global.clueExportable || pageType === 'mine') {
    return {};
  }
  return {
    beforeReset(filter) {
      return (
        <ExportActions
          samName="导出"
          withAgreementConfirm
          onExport={() => handleExport(filter)}
          type={exportRecordTypeMap[pageType]}
        />);
    }
  };
}
