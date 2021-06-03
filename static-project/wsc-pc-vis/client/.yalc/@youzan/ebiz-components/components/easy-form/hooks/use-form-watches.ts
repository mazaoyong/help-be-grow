import React from 'react';
import isNil from 'lodash/isNil';
import { ZentForm } from 'zent/es/form/ZentForm';

import { YZ_NODE_ENV } from '../../utils/constants';
import { invariant } from '../utils/invariant';
import {
  EasyFormConfigType,
  EasyFormModelType,
  EasyFormWatchFunction,
  GroupEasyFormModel,
  IEasyFormWatchCtx,
  NormalEasyFormModel,
} from '../types';
import { NoticeFuncType, updateModel } from '../utils/update-model';
import { FieldModel } from 'zent';

interface IUseEasyFormWatchesParams {
  config: EasyFormConfigType[];
  formInstance: ZentForm<Record<string, EasyFormModelType>>;
  formStatusInstance: ZentForm<Record<string, NormalEasyFormModel | GroupEasyFormModel>>;
}
interface IUseEasyFormWatchesRes {
  handleValueChange(key: string, value: any): void;
}

type WatchType = [EasyFormWatchFunction, string];
type UseEasyFormWatches = (params: IUseEasyFormWatchesParams) => IUseEasyFormWatchesRes;
export const useFormWatches: UseEasyFormWatches = (params) => {
  const { config: formConfigs, formInstance, formStatusInstance } = params;
  const keyWatchListCacheMap = React.useRef<Map<string, WatchType[]>>(new Map());

  const getCurrentModel = React.useCallback(
    (pattern: IModelPattern) => {
      const { type } = pattern;
      if (type === 'normal') {
        const definitelyPath = pattern.path![0];
        return {
          value: formInstance.model.get(definitelyPath) as NormalEasyFormModel,
          status: formStatusInstance.model.get(definitelyPath) as NormalEasyFormModel,
        };
      } else if (type === 'group') {
        const [outerPath, innerPath] = pattern.path as [string, string];
        const valueSetModel = formInstance.model.get(outerPath) as GroupEasyFormModel;
        const statusSetModel = formStatusInstance.model.get(outerPath) as GroupEasyFormModel;
        return {
          value: valueSetModel.get(innerPath),
          status: statusSetModel.get(innerPath),
        };
      }
      return null;
    },
    [formInstance.model, formStatusInstance.model]
  );

  // 获取相关监听的watches
  const getRelatedWatches = React.useCallback(
    (key: string) => {
      const watchList: [EasyFormWatchFunction, string][] = [];
      formConfigs.forEach((config) => {
        if (config.type === '__internal_group__') {
          const { config: groupInnerConfig = [] } = config;
          groupInnerConfig.forEach((innerConfig) => {
            const res = getCurrentWatchFromConfig(key, innerConfig);
            if (res !== null) {
              const [watcher, innerKey] = res;
              watchList.push([watcher, `${config.name}.${innerKey}`]);
            }
          });
        } else {
          const res = getCurrentWatchFromConfig(key, config);
          if (res !== null) watchList.push(res);
        }
      });
      return watchList;
    },
    [formConfigs]
  );

  const ctxSetMethod = React.useCallback(
    (
      valueModel: FieldModel<any>,
      statusModel: FieldModel<any>,
      notice: NoticeFuncType
    ): IEasyFormWatchCtx['set'] => (payload) => {
      updateModel(valueModel, statusModel, payload, notice);
    },
    []
  );

  const handleValueChange: IUseEasyFormWatchesRes['handleValueChange'] = React.useCallback(
    (key, value) => {
      let watchList = keyWatchListCacheMap.current.get(key);
      if (!watchList) {
        watchList = getRelatedWatches(key);
        keyWatchListCacheMap.current.set(key, watchList);
      }
      const pathPattern = modelPathGetter(key);
      invariant(
        () => pathPattern.type !== 'invalid',
        `${key}不是合法的监听对象，请注意格式只能为一下三种中的一种：
1. foo
2. foo.boo
3. foo[index]`
      );
      if (watchList.length) {
        watchList.forEach(([watchFunc, targetKey]) => {
          const targetPathPattern = modelPathGetter(targetKey);
          const curModel = getCurrentModel(targetPathPattern);
          if (
            invariant<NonNullable<typeof curModel>>(
              () => !isNil(curModel),
              `找不到要监听的对象${targetKey}`,
              curModel
            )
          ) {
            let curValue;
            let nextPayload = {};
            const notice = (prevValue: any, input: any) => {
              curValue = prevValue;
              nextPayload = input || {};
            };
            const { value: valueModel, status: statusModel } = curModel;
            watchFunc(
              value,
              { set: ctxSetMethod(valueModel!, statusModel!, notice) },
              formInstance
            );
            logModelChange({
              from: key,
              target: targetKey,
              watchValue: value,
              curValue,
              nextPayload,
            });
          }
        });
      }
    },
    [ctxSetMethod, formInstance, getCurrentModel, getRelatedWatches]
  );

  return { handleValueChange };
};

function getCurrentWatchFromConfig(key: string, config: EasyFormConfigType): WatchType | null {
  const { watch, name: normalName } = config;
  if (!watch) return null;
  const ownWatchKeys = Object.keys(watch);
  if (ownWatchKeys.includes(key)) {
    return [watch[key], normalName];
  }
  return null;
}

// 需要支持foo.boo和foo[1]这样的运算
interface IModelPattern {
  // 最多支持两层，因为group和list也只支持两层
  path: [string] | [string, string | number] | null;
  type: 'normal' | 'list' | 'group' | 'invalid';
}
const defaultPattern: IModelPattern = {
  type: 'invalid',
  path: null,
};
function modelPathGetter(key: string): IModelPattern {
  const pathPattern: IModelPattern = { ...defaultPattern };
  const groupMatch = key.match(/^([^\s]+)\.([^\s]+)/);
  const listMatch = key.match(/^([^\s]+)\[(\d+)\]/);
  if (groupMatch) {
    // 是对象匹配
    pathPattern.type = 'group';
    pathPattern.path = [groupMatch[1], groupMatch[2]];
  } else if (listMatch) {
    const numberedRes = Number(listMatch[2]);
    // 第二个参数必须得是数字
    if (Number.isNaN(numberedRes)) return defaultPattern;
    // 匹配数组
    pathPattern.type = 'list';
    pathPattern.path = [listMatch[1], numberedRes];
  } else {
    pathPattern.type = 'normal';
    pathPattern.path = [key];
  }
  const res = invariant(
    () => pathPattern.path !== null && pathPattern.path.length <= 2,
    'watch最多支持监听数据的嵌套层数为2层'
  );
  if (!res) return defaultPattern;
  return pathPattern;
}

function logModelChange(params: {
  from: string;
  target: string;
  watchValue: any;
  curValue: any;
  nextPayload: any;
}) {
  if (YZ_NODE_ENV !== 'prod') {
    const { from, target, watchValue, curValue, nextPayload } = params;
    console.group(`[FIRE WATCH] ${target} <-- ${from}`);
    console.log('%c watch value', 'font-weight: bolder; color: grey', watchValue);
    console.log('%c current value', 'font-weight: bolder; color: green', curValue);
    console.log('%c next payload', 'font-weight: bolder; color: lightblue', nextPayload);
    console.groupEnd();
  }
}
