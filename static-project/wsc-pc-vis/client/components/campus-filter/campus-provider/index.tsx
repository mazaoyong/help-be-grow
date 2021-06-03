import React, { createContext, useState } from 'react';
import CampusFilter, { IProps as ICampusFilterProps } from '../index';
import { isInStoreCondition } from 'fns/chain';

type IProps = Omit<ICampusFilterProps, 'targetKdtId' | 'onChangeTargetKdtId'>;

interface ICampusContext {
  targetKdtId: number;
  setTargetKdtId: (targetKdtId: number) => void;
}

export const CampusContext = createContext<ICampusContext>({} as ICampusContext);

const showCampusFilter = isInStoreCondition({
  supportHqStore: true,
  supportUnifiedPartnerStore: true,
  supportMinifyParterShop: true,
});
export const CampusProvider: React.FC<IProps> = (props) => {
  const { children, ...otherProps } = props;
  const [targetKdtId, setTargetKdtId] = useState(_global.kdtId);
  return (
    <CampusContext.Provider value={{ targetKdtId, setTargetKdtId }}>
      {showCampusFilter && (
        <CampusFilter
          {...otherProps}
          targetKdtId={targetKdtId}
          onChangeTargetKdtId={setTargetKdtId}
        />
      )}
      {children}
    </CampusContext.Provider>
  );
};
