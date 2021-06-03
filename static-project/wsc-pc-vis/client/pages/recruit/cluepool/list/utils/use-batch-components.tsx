import React from 'react';
import { isInStoreCondition } from 'fns/chain';

import { CluePageType } from './use-fetch-list';
import BatchSamButtons, {
  IBatchSamButtonConfig,
  IBatchSamButtonsProps,
} from '../components/batch-sam-buttons';

// 基本方法，所有类型的页面都需要有这个方法
interface IBaseClueListMethods<DataType extends Record<string, any>> {
  masterTakeClue2Hq(data: DataType[]): void;
  masterDistributeClue(data: DataType[]): void;
  takeClue(data: DataType[]): void;
  distributeClue(data: DataType[]): void;
}
interface IAllClueListMethods<DataType extends Record<string, any>>
  extends IBaseClueListMethods<DataType> {
  transferClue(data: DataType[]): void;
}
interface IPoolClueListMethods<DataType extends Record<string, any>>
  extends IBaseClueListMethods<DataType> {
  deleteClue(data: DataType[]): void;
}
interface IMineClueListMethods<DataType extends Record<string, any>>
  extends IBaseClueListMethods<DataType> {
  transferClue(data: DataType[]): void;
  abandonClue(data: DataType[]): void;
}

// 类型推断：推断不同页面类型所需要的方法，主要用于在编写（本文件 L:55）过程中的隔离，在传入的时候要求方法要全部传入
// prettier-ignore
export type IMethodsProxy<DataType extends Record<string, any>, PageType extends CluePageType> = PageType extends 'all'
  ? IAllClueListMethods<DataType> : PageType extends 'mine'
    ? IMineClueListMethods<DataType> : PageType extends 'pool'
      ? IPoolClueListMethods<DataType> : IBaseClueListMethods<DataType>;

type ILooseTypeMethodsProxy<PageType extends CluePageType> = IMethodsProxy<any, PageType>;

const isChainMaster = isInStoreCondition({ supportHqStore: true });
// 不同页面下需要丢弃的按钮
const allDropButtons: string[] = ['take', 'distribute', 'delete'];
const poolDropButtons: string[] = ['transfer', 'abandon'];
const mineDropButtons: string[] = ['take', 'distribute', 'takeToHq', 'delete'];

/**
 * @author chenzihao
 * @description
 * 返回渲染批量操作按钮的FC，思路和`useBatchActions`类似，统一管理所有的按钮，在这个文件中
 * 应该枚举出所有的按钮，然后最后根据页面类型(`pageType`)来控制在不同页面应该展示的批量操作
 * 按钮。修改应该注意如下要点：
 * 1. 建议同时打开`useBatchActions`文件和本文件以获得更好的`typescript`推断
 * 2. 修改、添加方法应该在相应的页面的类型下添加相应方法的函数签名Line:11
 * 3. 按钮的渲染采用配置的方式进行渲染，策略是先声明所有类型的按钮配置，然后根据Line:41来控制
 * 丢弃相对应的按钮
 * @param {CluePageType} pageType 页面类型
 * @param {IMethodsProxy} methods `useBatchActions`的方法
 * @param {IBatchSamButtonsProps} passiveProps 批量按钮的属性
 * @return {React.FC}
 */
const useBatchComponents = <DataType extends Record<string, any>, K extends CluePageType = any>(
  pageType: K,
  methods: IMethodsProxy<DataType, K>,
  passiveProps?: Omit<IBatchSamButtonsProps, 'data' | 'configs'>,
) => {
  const batchComponents: IBatchSamButtonConfig[] = React.useMemo(() => {
    return [
      {
        name: 'transfer',
        samName: '转让',
        btnText: '转让',
        priority: 1,
        restButtonProps: {
          onClick: (methods as ILooseTypeMethodsProxy<'mine' | 'all'>).transferClue,
        },
      },
      {
        name: 'abandon',
        samName: '放弃',
        btnText: '放弃',
        priority: 2,
        restButtonProps: { onClick: (methods as ILooseTypeMethodsProxy<'mine'>).abandonClue },
      },
      {
        name: 'delete',
        samName: '删除',
        btnText: '删除',
        priority: 100,
        restButtonProps: { onClick: (methods as ILooseTypeMethodsProxy<'pool'>).deleteClue },
      },
    ] as IBatchSamButtonConfig[];
  }, [methods]);

  const masterBatchComponents: IBatchSamButtonConfig[] = React.useMemo(() => {
    if (isChainMaster) {
      return [
        {
          name: 'takeToHq',
          samName: '领取',
          btnText: '领取到总部',
          priority: 4,
          restButtonProps: { onClick: methods.masterTakeClue2Hq },
        },
        {
          name: 'distributeToBranch',
          samName: '分配',
          btnText: '分配到到校区',
          priority: 5,
          restButtonProps: { onClick: methods.masterDistributeClue },
        },
      ] as IBatchSamButtonConfig[];
    }
    return [
      {
        name: 'take',
        samName: '领取',
        btnText: '领取',
        priority: 4,
        restButtonProps: { onClick: (methods as ILooseTypeMethodsProxy<'pool'>).takeClue },
      },
      {
        name: 'distribute',
        samName: '分配',
        btnText: '分配',
        priority: 5,
        restButtonProps: { onClick: (methods as ILooseTypeMethodsProxy<'pool'>).distributeClue },
      },
    ] as IBatchSamButtonConfig[];
  }, [methods]);

  const filterButtons = React.useCallback(
    (configs: IBatchSamButtonConfig[]) => {
      switch (pageType) {
        case 'all':
          return dropConfigByNameList(allDropButtons, configs);
        case 'pool':
          return dropConfigByNameList(poolDropButtons, configs);
        case 'mine':
          return dropConfigByNameList(mineDropButtons, configs);
        default:
          return configs;
      }
    },
    [pageType],
  );

  return (data: any[]) => (
    <BatchSamButtons
      {...passiveProps}
      data={data}
      configs={filterButtons(batchComponents.concat(masterBatchComponents))}
    />
  );
};

export default useBatchComponents;

function dropConfigByNameList(
  nameList: string[],
  configs: IBatchSamButtonConfig[],
): IBatchSamButtonConfig[] {
  if (nameList.length) {
    return configs.filter((config) => !nameList.includes(config.name));
  }
  return configs;
}
