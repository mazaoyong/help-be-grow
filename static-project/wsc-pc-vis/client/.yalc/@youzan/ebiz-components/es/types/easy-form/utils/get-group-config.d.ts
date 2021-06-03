import { IGroupEasyFormConfigs, EasyFormConfigType } from '../types';
/**
 * 如果想要将一些字段按组进行归类，可以通过使用`group`方法，同时指定`groupName`来
 * 合并一些字段，同时，还能通过`groupTitle`渲染出一个通过设置`collapse: true`来
 * 渲染一个支持折叠的表单域组。
 *
 * **BTW: 如果要覆盖这个配置，请使用`overrideGroupConfig`函数包裹需要重写的配置
 * 然后添加到`overrideConfigs`属性中**
 */
export declare const group: (groupConfig: IGroupEasyFormConfigs) => EasyFormConfigType;
