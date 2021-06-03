import { IChartRawData, TChartDataLines } from '../types';
export const parseChartData: (rawData: IChartRawData) => TChartDataLines = (rawData) => {
  const transferData = {};
  for (const date of Object.keys(rawData)) {
    for (const key of Object.keys(rawData[date])) {
      if (!transferData[key]) {
        transferData[key] = {
          name: key,
          data: [ rawData[date][key] ]
        };
      } else {
        transferData[key]['data'].push(rawData[date][key]);
      }
    }
  }
  return Object.values(transferData);
};
