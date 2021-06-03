import React, { useMemo } from 'react';
import ClueRecordsEdit from '../clue-records-edit';
import ClueRecordsList from '../clue-records-list';
import store from '../../store';

const ClueRecords = () => {
  const { owners, phase } = store.useStoreState();

  const isOwner = owners.filter(({ userId }) => userId === _global.userId).length > 0;

  const isDeleted = useMemo(() => phase === 8, [phase]);

  const isAdmin = Boolean(window._global.isAdmin);

  const canEdit = isOwner || (!isDeleted && isAdmin && owners.length > 0);

  return (
    <article className="clue-records">
      {canEdit ? <ClueRecordsEdit /> : null}
      <ClueRecordsList />
    </article>
  );
};

export default ClueRecords;
