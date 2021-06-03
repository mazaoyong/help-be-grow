import React from 'react';
import get from 'lodash/get';

import { IFilterActionsAdaptor, IFilterProps } from '../../../types/filter';

export const useDefaultQueries = (
  props: IFilterProps,
  adaptor: ReturnType<IFilterActionsAdaptor>
): Record<string, any> => {
  const passiveValue = React.useMemo(() => props.value || {}, [props.value]);
  const defaultQueries = React.useMemo(
    () => get(props, adaptor.initValuePath, passiveValue) as Record<string, any>,
    [adaptor.initValuePath, passiveValue, props]
  );
  const formattedQueries = React.useMemo(() => {
    if (props.formatQueries) {
      return props.formatQueries(defaultQueries);
    }
    return defaultQueries;
  }, [defaultQueries, props]);

  return formattedQueries;
};
