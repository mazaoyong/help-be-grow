import React, { useMemo, useState, useCallback } from 'react';
import ClueRecordsEdit from '../clue-records-edit';
import ClueRecordsList from '../clue-records-list';

interface IOwner {
  name: string;
  ownerId?: number;
  userId: number;
}

export interface IClueRecordsProps {
  needCheckAccess: boolean;
  clueId: number;
  phase: number;
  owners: IOwner[];
  onChange: () => void;
  timeStamp: number;
};

const ClueRecords = (props: IClueRecordsProps) => {
  const [innerUpdateFlag, setInnerUpdateFlag] = useState(0);
  const { clueId, owners, phase, onChange, timeStamp, needCheckAccess = true } = props;

  const isOwner = owners.filter(({ userId }) => userId === _global.userId).length > 0;

  const isDeleted = useMemo(() => phase === 8, [phase]);

  const isAdmin = window._global.userRoleId === 1;

  const canEdit = !isDeleted && (!needCheckAccess || (isOwner || (isAdmin && owners.length > 0)));

  const handleChange = useCallback(() => {
    onChange && onChange();
    setInnerUpdateFlag(Date.now());
  }, [onChange, setInnerUpdateFlag]);

  return (
    <article className="clue-records">
      {/*
      // @ts-ignore */}
      {canEdit ? <ClueRecordsEdit clueId={clueId} onChange={handleChange}/> : null}
      {/*
      // @ts-ignore */}
      <ClueRecordsList clueId={clueId} onChange={handleChange} timeStamp={timeStamp + innerUpdateFlag}/>
    </article>
  );
};

export default ClueRecords;
