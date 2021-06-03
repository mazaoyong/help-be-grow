import isNil from 'lodash/isNil';
import { IGroupEasyFormConfigs, EasyFormConfigType } from '../types';
import { invariant } from './invariant';

/**
 * 如果想要将一些字段按组进行归类，可以通过使用`group`方法，同时指定`groupName`来
 * 合并一些字段，同时，还能通过`groupTitle`渲染出一个通过设置`collapse: true`来
 * 渲染一个支持折叠的表单域组。
 *
 * **BTW: 如果要覆盖这个配置，请使用`overrideGroupConfig`函数包裹需要重写的配置
 * 然后添加到`overrideConfigs`属性中**
 */
export const group = (groupConfig: IGroupEasyFormConfigs): EasyFormConfigType => {
  reportInvalidProperties(groupConfig);
  const internalGeneratorSymbol = Symbol.for('internal');
  return {
    collapse: false,
    ...groupConfig,
    name: groupConfig.groupName,
    type: '__internal_group__',
    // @ts-ignore
    [internalGeneratorSymbol]: true,
  };
};

function reportInvalidProperties(config: any) {
  // 校验List中的config是否合规
  invariant(() => !isNil(config.groupName), '缺少groupName属性');
  invariant(() => !isNil(config.config), '缺少config属性');
  // @ts-ignore
  invariant(() => isNil(config.label), '不存在label属性，你可能是想要试试groupTitle属性');
}
