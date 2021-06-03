import isNil from 'lodash/isNil';
import { IListEasyFormConfigs, EasyFormConfigType } from '../types';
import { invariant } from './invariant';

/**
 * 调用这个构造函数，能够方便地让EasyForm渲染一个列表形式的form表单，比如渲染一个sku表单
 * **一般情况下不会出现key不唯一的错误提示，如果出现了，请使用getRepeatKey方法来渲染唯一的key**
 *
 * 请务必指定`repeatTrigger`，这个方法要求返回一个组件，并且组件需要预留位置给children，以
 * 便组件通过children加载list，同时，这个方法还有一些很实用的方法来帮助控制渲染列表。
 *
 * **BTW: 如果要覆盖这个配置，请使用`overrideGroupConfig`函数包裹需要重写的配置
 * 然后添加到`overrideConfigs`属性中**
 */
export const list = (listConfig: IListEasyFormConfigs): EasyFormConfigType => {
  reportInvalidProperties(listConfig);
  const internalGeneratorSymbol = Symbol.for('internal');
  return {
    ...listConfig,
    name: listConfig.listName,
    type: '__internal_list__',
    // @ts-ignore
    [internalGeneratorSymbol]: true,
  };
};

function reportInvalidProperties(config: any): void {
  invariant(() => !isNil(config.listName), '缺少listName属性');
  invariant(() => !isNil(config.repeatConfig), '缺少repeatTrigger属性');
  // 校验List中的config是否合规
  invariant(
    () => isNil(config.repeatConfig.watch),
    'list包裹的配置中，不能使用watch，因为在list数组中，这么做可能会导致form value出错'
  );
}
