import React, { memo } from 'react';
import { ClueRecordTypes } from '@ability-center/clue';

import {
  AddItem,
  SystemAddItem,
  UpdatePhaseItem,
  UpdateOwnersItem,
  UpdateTagsItem,
  UpdateRecordItem,
  UpdateStuItem,
  UpdateSourceItem,
  UpdateRoleItem,
} from '../clue-records-item';

const ClueRecordsItem = memo(({ data, onUpdate, onChange }) => {
  const { recordType } = data;

  switch (recordType) {
    case ClueRecordTypes.ADD_CLUE:
      return <AddItem data={data} />;

    case ClueRecordTypes.UPDATE_BASE_PROFILE:
      return <UpdateStuItem data={data} />;

    case ClueRecordTypes.UPDATE_PHASE:
      return <UpdatePhaseItem data={data} />;

    case ClueRecordTypes.UPDATE_TAGS:
      return <UpdateTagsItem data={data} />;

    case ClueRecordTypes.UPDATE_OWNER:
      return <UpdateOwnersItem data={data} />;

    case ClueRecordTypes.UPDATE_RECORD:
      return <UpdateRecordItem onChange={onChange} data={data} onUpdate={onUpdate}/>;

    case ClueRecordTypes.UPDATE_SOURCE:
      return <UpdateSourceItem data={data}/>;
    case ClueRecordTypes.UPDATE_ROLE:
      return <UpdateRoleItem data={data}/>;

    case ClueRecordTypes.SUBMIT_REGISTER_FORM:
    case ClueRecordTypes.TRAIL_SIGN_UP:
    case ClueRecordTypes.BOOST_UP:
    case ClueRecordTypes.POSTER:
    case ClueRecordTypes.BRAND_HOMEPAGE:
    case ClueRecordTypes.TYPE_UNKNOWN:
    case ClueRecordTypes.INTRO_TRANSFER:
    case ClueRecordTypes.ONLINE_REGISTER:
    case ClueRecordTypes.JOIN_EXAM:
    default:
      return <SystemAddItem data={data} />;
  }
});

export default ClueRecordsItem;
