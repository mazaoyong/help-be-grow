import { allPhaseOptions, poolPhaseOptions, minePhaseOptions } from '../filter-configs/config-base';
import { CluePageType } from './use-fetch-list';

export interface IPhaseCount {
  phase: number;
  count: number;
}

export default class MapOptionsToTabs {
  private all = allPhaseOptions;
  private pool = poolPhaseOptions;
  private mine = minePhaseOptions;

  private _mapOptionsToTabs = (options: Record<string, any>, phaseCounts: IPhaseCount[]) => {
    const phaseCountsMap = new Map();
    let summary = 0;
    this._getPhaseMapValues(phaseCounts).map(([phaseKey, value]) => {
      summary += value;
      phaseCountsMap.set(phaseKey, value);
    });
    // 添加全部的场景
    phaseCountsMap.set(0, summary);
    return options.map((item) => {
      const currentPhase = Number(item.value) || 0;
      const currentPhaseCount = phaseCountsMap.get(Number(currentPhase)) || 0;
      return {
        value: String(item.value),
        label: `${item.text} ${currentPhaseCount}`,
      };
    });
  };
  private _getPhaseMapValues = (phaseCounts: IPhaseCount[]) => {
    let res: [number, number][] = [];
    if (phaseCounts.length) {
      res = phaseCounts.map((phaseCount) => {
        const { phase, count } = phaseCount;
        return [Number(phase), Number(count)];
      });
    }
    return res;
  };

  public getTabConfigs = (pageType: CluePageType, phaseCounts: IPhaseCount[]) => {
    return this._mapOptionsToTabs(this[pageType], phaseCounts);
  };
}
