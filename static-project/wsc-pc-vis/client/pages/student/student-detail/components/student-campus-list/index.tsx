import React, { FC } from 'react';
import { isInStoreCondition } from 'fns/chain';
import { Divider } from '../student-card';

const StudentCampusList: FC<{ campusList: Record<string, any>[] }> = ({ campusList }) => {
  return isInStoreCondition({ supportHqStore: true }) ? (
    <Divider className="student-detail__campus">
      <div className="student-card__content-line">
        <label>所属校区</label>
        <div className="primary">
          {(campusList.length &&
            ((campusList as unknown) as Record<string, any>)
              .map(school => school.name)
              .join('、')) ||
            '-'}
        </div>
      </div>
    </Divider>
  ) : null;
};

export default StudentCampusList;
