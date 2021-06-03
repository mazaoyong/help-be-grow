import { createContext } from 'react';

interface ICampusContext {
  targetKdtId: number;
  isHeadquarters: boolean;
}

export const CampusContext = createContext<ICampusContext>({
  targetKdtId: _global.kdtId,
} as ICampusContext);
