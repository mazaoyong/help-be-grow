import { IListEasyFormConfigs, EasyFormConfigType } from '../types';
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
export declare const list: (listConfig: IListEasyFormConfigs) => EasyFormConfigType;
