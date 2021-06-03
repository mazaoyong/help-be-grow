import without from 'lodash/without';
import uniq from 'lodash/uniq';

import { IStudentProfileItem } from './pre-handle-data';
import { IApplicableSceneState } from '../components/custom-profile-dialog/components/applicable-scene-field';

export type ApplicableScene = IStudentProfileItem['applicableScenes'];
export type convertType = 'EDIT' | 'ADD'

/**
 * @description 🚨需要注意的是，`necessaryList`跟外部值没有强关系，
 * 因为，如果当使用场景的✅取消了，那么`applicableScenes`这个字段中
 * 会直接去除这一场景，也就意味着解析这个字段就会忽略场景☑️的选填情况
 */
export function convertProps2State(
  scenes: ApplicableScene,
  defaultNecessaryList?: IApplicableSceneState['necessaryList'],
): IApplicableSceneState {
  const defaultState: IApplicableSceneState = {
    applicableScenesList: [],
    necessaryList: defaultNecessaryList || [],
  };

  if (scenes && scenes.length) {
    scenes.forEach(scene => {
      const { applicableScene, required } = scene;
      const { applicableScenesList, necessaryList } = defaultState;
      applicableScenesList.push(applicableScene);
      if (required) {
        defaultState.necessaryList = uniq(necessaryList.concat(applicableScene));
      } else {
        defaultState.necessaryList = without(defaultState.necessaryList, applicableScene);
      }
    });
  }
  return defaultState;
};

export function convertState2Value(state: IApplicableSceneState): ApplicableScene {
  const { applicableScenesList, necessaryList } = state;
  const output: ApplicableScene = [];
  let required = false;
  applicableScenesList.forEach(scene => {
    required = necessaryList.findIndex(necessary => necessary === scene) > -1;
    output.push({
      applicableScene: scene,
      required,
    });
  });

  return output;
}

/** 当前场景值是否在必选场景列表中 */
export function getNecessaryValue(scene: number, necessaryList: IApplicableSceneState['necessaryList']) {
  return necessaryList.findIndex(necessaryScene => necessaryScene === scene) > -1;
}

/** 必选和选填选项必须和场景✅配套出现，如果场景没有☑️就禁用必填和选填选项 */
export function disableNecessarySelector(scene: number, activeScenes: number[]): boolean {
  return activeScenes.findIndex(activeScene => activeScene === scene) === -1;
}
