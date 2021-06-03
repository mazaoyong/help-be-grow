import { IGlobalTrackerSetting } from './utils/zan-tracker-types';

export const getDefaultSetting = (): Required<IGlobalTrackerSetting> => ({
  yai: 'wsc_c',
  autoSpm: true,
  autoClick: true,
  autoView: false,
  autoEnterpage: true,
  debug: false,
});
