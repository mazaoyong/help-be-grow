import get from 'lodash/get';

import {
  ReservedType,
  ICombinedFilterConf,
  INeedOptionsConfType,
  IFilterActionsAdaptor,
} from '../../types/filter';

export function needOptions(conf: ICombinedFilterConf): conf is INeedOptionsConfType {
  const reflectMap: { [key in ReservedType]?: boolean } = {
    Radio: true,
    Select: true,
    Checkbox: true,
  };

  return reflectMap[conf.type] || false;
}

export const ERROR_HINTS = {
  NOT_CUSTOM_TYPE: 'Custom field required ComponentType',
  NOT_VALID_ELEMENT: 'is not a valid react-element',
};

export const adaptorConstructor: IFilterActionsAdaptor = (props) => {
  const providerHandleSubmit = get(props, 'list.action.setFilter');
  let afterSubmit;
  let afterReset;
  if (providerHandleSubmit) {
    afterSubmit = providerHandleSubmit;
    afterReset = providerHandleSubmit;
  }

  const queries = (props: any) => get(props, 'list.state.filter');
  const loading = (props: any) => get(props, 'list.state.loading');

  return {
    afterSubmit,
    afterReset,
    initValuePath: 'list.state.filter',
    queries,
    loading,
  };
};
