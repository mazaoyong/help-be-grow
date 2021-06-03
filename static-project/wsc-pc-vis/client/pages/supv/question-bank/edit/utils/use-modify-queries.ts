import React from 'react';
import { Location } from 'history';

import { IEditParams, IModifyParams, ICreatedParams } from '@ability-center/supv/question-bank';

const useModifyQueries = (
  location: Location,
): [
    IModifyParams | undefined,
    ICreatedParams | undefined,
    IEditParams,
    (queries: Record<string, any>) => void,
  ] => {
  const _originQueries = React.useMemo<IEditParams>(() => {
    const _l = (location as unknown) as Location<IEditParams>;
    return _l.query;
  }, [location]);
  const [originQueries, setQueries] = React.useState<IEditParams>(_originQueries);

  const addQueries = React.useCallback((queries: Record<string, any>) => {
    setQueries((prevQueries) => Object.assign({}, prevQueries, queries));
  }, []);

  const editQuery = React.useMemo(() => {
    if (originQueries.type === 'edit' || originQueries.type === 'duplicate') {
      return originQueries;
    }
    return undefined;
  }, [originQueries]);

  const createQuery = React.useMemo(
    () => (originQueries.type === 'create' ? originQueries : undefined),
    [originQueries],
  );

  return [editQuery, createQuery, _originQueries, addQueries];
};

export default useModifyQueries;
