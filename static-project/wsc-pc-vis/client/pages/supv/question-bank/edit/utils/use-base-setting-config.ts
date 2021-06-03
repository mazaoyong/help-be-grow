import React from 'react';
import { IModifyParams, ICreatedParams } from '@ability-center/supv/question-bank';
import { IFormCreatorConfig } from '@youzan/ebiz-components/es/types/easy-form-archive';

import getBaseSettingConfig from '../blocks/question-setting/get-base-setting-config';

function useBaseSettingConfig(editQuery?: IModifyParams, createQuery?: ICreatedParams) {
  const formConfig = React.useMemo<IFormCreatorConfig[]>(() => {
    const pickedQuery = editQuery || createQuery;
    return getBaseSettingConfig({
      categoryName: pickedQuery && pickedQuery.categoryName,
      type: pickedQuery ? 'edit' : 'create',
    });
  }, [createQuery, editQuery]);

  return formConfig;
}

export default useBaseSettingConfig;
