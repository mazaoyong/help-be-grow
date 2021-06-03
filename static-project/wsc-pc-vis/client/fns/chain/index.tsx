
import React, { Component, ReactElement, ComponentType } from 'react';
import _omit from 'lodash/omit';
// import _pickBy from 'lodash/pickBy';
// import _keys from 'lodash/keys';
// import _remove from 'lodash/remove';
import {
  isEduHqStore, // 是否是教育总店
  isEduBranchStore, // 是否是教育校区
  isEduSingleStore, // 是否是教育单店
  isEduChainStore, // 是否是教育连锁店铺（总店+校区
  isEduShop, // 是否是教育店铺
  isWscSingleStore, // 微商城单店（包含教育
  isWscHqStore, // 微商城总店（包含教育
  isWscBranchStore, // 微商城分店（包含教育
  isWscChainStore, // 微商城连锁（总店+分店（包含教育
  isRetailShop, // 零售店铺
  isRetailSingleStore, // 零售单店
  isUnitedHqStore, // 大网点
  isUnifiedHqStore, // 零售 3.0 总店
  isUnifiedShop, // 零售 3.0 模型
  isUnifiedPartnerStore, // 零售 3.0 合伙人模型
  isUnifiedBranchStore, // 零售 3.0 分店（包括线下门店）
  isRetailMinimalistBranchStore, // 零售极简分店
  isRetailMinimalistHqStore, // 零售极简总店
  isRetailMinimalistShop, // 零售极简店铺
  isRetailMinimalistPartnerStore // 零售极简合伙人店铺
} from '@youzan/utils-shop';
import './disabled-form.scss';
export * from '../../shared/fns/wsc-chain/index';

export interface IConditionParam {
  supportBranchStore: boolean,
  supportHqStore: boolean,
  supportSingleStore: boolean,
  supportChainStore: boolean,
  supportEduBranchStore: boolean,
  supportEduHqStore: boolean,
  supportEduSingleStore: boolean,
  supportEduChainStore: boolean,
  supportEduStore: boolean,
  supportRetailShop: boolean,
  supportRetailSingleShop: boolean,
  supportRetailUnitedHqShop: boolean,
  supportUnifiedPartnerStore: boolean,
  supportUnifiedShop: boolean,
  supportNonRetailUnifiedShop: boolean,
  supportMinifyRetailBranchShop: boolean,
  supportMinifyRetailHqShop: boolean,
  supportMinifyParterShop: boolean,
}

/**
 * @description 判断该店铺环境下是否显示
 * @param {Object} props IConditionParam
 * {
    supportBranchStore = false,
    supportHqStore = false,
    supportSingleStore = false,
  }
 */
export function isInStoreCondition(props: Partial<IConditionParam>): boolean {
  const {
    // 总部（电商连锁——店铺类型）
    supportHqStore = false,
    // 分布（电商连锁——店铺类型）
    supportBranchStore = false,
    // 单店（电商——开店模式）
    supportSingleStore = false,
    // 连锁模式（电商——开店模式）
    supportChainStore = false,
    // 教育总部（电商教育——店铺类型）
    supportEduHqStore = false,
    // 教育分部（电商教育——店铺类型）
    supportEduBranchStore = false,
    // 单店（电商教育——开店模式）
    supportEduSingleStore = false,
    // 连锁（电商教育——开店模式）
    supportEduChainStore = false,
    // 教育店铺
    supportEduStore = false,
    supportRetailShop = false,
    // 支持零售除了3.0以外的店铺
    supportNonRetailUnifiedShop = false,
    // 支持零售极简版分店的店铺
    supportMinifyRetailBranchShop = false,
    // 支持零售极简版总店的店铺
    supportMinifyRetailHqShop = false,
    supportRetailSingleShop = false,
    supportRetailUnitedHqShop = false,
    supportUnifiedShop = false,
    supportMinifyParterShop = false,
    supportUnifiedPartnerStore = false,
  } = props || {};

  const resultList: boolean[] = [];

  if (supportHqStore) {
    resultList.push(isWscHqStore || isEduHqStore || isUnifiedHqStore || isRetailMinimalistHqStore);
  }

  if (supportBranchStore) {
    resultList.push(isWscBranchStore || isEduBranchStore || isUnifiedBranchStore ||
       isRetailMinimalistBranchStore || isRetailMinimalistPartnerStore);
  }

  if (supportSingleStore) {
    resultList.push(isWscSingleStore || isEduSingleStore);
  }

  if (supportChainStore) {
    resultList.push(isWscChainStore || isEduChainStore || isUnifiedShop || isRetailMinimalistShop);
  }

  if (supportEduHqStore) {
    resultList.push(isEduHqStore);
  }

  if (supportEduBranchStore) {
    resultList.push(isEduBranchStore);
  }

  if (supportEduStore) {
    resultList.push(isEduShop);
  }

  if (supportEduSingleStore) {
    resultList.push(isEduSingleStore);
  }

  if (supportEduChainStore) {
    resultList.push(isEduChainStore);
  }

  // TODO: 歧义命名，实际上应该是除了零售3.0的店铺
  if (supportRetailShop) {
    resultList.push(isRetailShop);
  }

  if (supportMinifyRetailBranchShop) {
    resultList.push(isRetailMinimalistBranchStore);
  }

  if (supportMinifyRetailHqShop) {
    resultList.push(isRetailMinimalistHqStore);
  }

  if (supportNonRetailUnifiedShop) {
    resultList.push(isRetailShop && !isUnifiedShop && !isRetailMinimalistPartnerStore);
  }

  if (supportRetailSingleShop) {
    resultList.push(isRetailSingleStore);
  }

  if (supportRetailUnitedHqShop) {
    resultList.push(isRetailShop && isUnitedHqStore);
  }

  if (supportUnifiedShop) {
    resultList.push(isUnifiedShop);
  }

  if (supportMinifyParterShop) {
    resultList.push(isRetailMinimalistPartnerStore);
  }

  if (supportUnifiedPartnerStore) {
    resultList.push(isUnifiedPartnerStore);
  }

  return resultList.filter(item => item).length > 0;
}

/**
 * @description true | false 状态机
 * @param {boolean} isInStoreCondition 是否展示
 * @param {Component} Com react 组件
 * @return {Component} Com
 * @example
 * const ChainSupportSingleFiled = showWrapper(true, Field);
 * <ChainSupportSingleFiled></ChainSupportSingleFiled>
 */
export function showWrapper<P>(isInStoreCondition: boolean, Com: ComponentType<any | P>) {
  const ifCanShow = isInStoreCondition;

  return class HOC extends Component<any | P> {
    render() {
      return ifCanShow ? <Com {...this.props as any} /> : null;
    }
  };
}

// showWrapper 的高阶版
export function showWrapperHOF(isInStoreCondition: boolean) {
  const ifCanShow = isInStoreCondition;

  return function showWrapper(Com) {
    return class HOC extends Component<typeof Com> {
      render() {
        return ifCanShow ? <Com {...this.props} /> : null;
      }
    };
  };
}

type SwitchWrapperPropsValue = (isShow: boolean) => ReactElement | ReactElement | null;
export interface ISwitchWrapperParam {
  supportBranchStore: SwitchWrapperPropsValue,
  supportHqStore: SwitchWrapperPropsValue,
  supportSingleStore: SwitchWrapperPropsValue,
  supportChainStore: SwitchWrapperPropsValue,
  supportEduBranchStore: SwitchWrapperPropsValue,
  supportEduHqStore: SwitchWrapperPropsValue,
  supportEduSingleStore: SwitchWrapperPropsValue,
  supportEduChainStore: SwitchWrapperPropsValue,
  defaultCpn: SwitchWrapperPropsValue,
}
export function switchWrapper(props: Partial<ISwitchWrapperParam>): ReactElement | null {
  const {
    supportBranchStore,
    supportHqStore,
    supportSingleStore,
    supportChainStore,
    supportEduBranchStore,
    supportEduHqStore,
    supportEduSingleStore,
    supportEduChainStore,
    defaultCpn,
  } = props;

  function callResult(cb, condition) {
    if (typeof cb === 'function') {
      return cb(condition);
    }
    return cb;
  }

  if (isEduHqStore && supportEduHqStore) {
    return callResult(supportEduHqStore, isEduHqStore);
  }

  if (isEduBranchStore && supportEduBranchStore) {
    return callResult(supportEduBranchStore, isEduBranchStore);
  }

  if (isEduSingleStore && supportEduSingleStore) {
    return callResult(supportEduSingleStore, isEduSingleStore);
  }

  if (isEduChainStore && supportEduChainStore) {
    return callResult(supportEduChainStore, isEduChainStore);
  }

  if (isWscHqStore && supportHqStore) {
    return callResult(supportHqStore, isWscHqStore);
  }

  if (isWscBranchStore && supportBranchStore) {
    return callResult(supportBranchStore, isWscBranchStore);
  }

  if (isWscSingleStore && supportSingleStore) {
    return callResult(supportSingleStore, isWscSingleStore);
  }

  if (isWscChainStore && supportChainStore) {
    return callResult(supportChainStore, isWscChainStore);
  }

  return defaultCpn ? callResult(defaultCpn, true) : null;
}

export const SwitchWrapper = switchWrapper;

/**
 * @description 表单
 * @param {*} isInStoreCondition chainState
 * @param {*} Com Component
 * @return {Component} Component
 */
export function chainDisableForm(isInStoreCondition, Com: React.ComponentType<any>) {
  const canEdit = isInStoreCondition;

  return class HOC<T extends { className?: string, [prop: string]: any }> extends Component<T> {
    renderDisabledFrom = () => {
      return (
        <Com
          {...this.props}
          className={`${this.props.className || ''} chain-edu-disabled-form`}
        >
          <fieldset
            className="chain-edu-disabled-form-fieldset"
            disabled
          >
            {this.props.children}
          </fieldset>
        </Com>
      );
    }

    render() {
      return canEdit ? <Com {...this.props} /> : this.renderDisabledFrom();
    }
  };
}

/**
 * @description 禁field点击事件
 * @param {*} isInStoreCondition chainState
 * @param {Com} Element
 * @param {Props} Props
 * @return {Element} Element
 */
export function chainDisableField(isInStoreCondition, Com, props) {
  const canEdit = isInStoreCondition;
  const renderDisabledField = (props) => {
    return (
      <div style={{ cursor: 'not-allowed' }} className="chain-edu-disabled-wrap">
        <fieldset
          style={{ pointerEvents: 'none', color: 'grey !important' }}
          className="chain-edu-disabled-form-fieldset"
          disabled
        >
          <Com
            {...props}
          >
          </Com>
        </fieldset>
      </div>
    );
  };

  return canEdit ? <Com {...props} /> : renderDisabledField(props);
}

export interface IArrayColumnParam {
  chainState?: boolean;
}
/**
 * @description 针对对象数组的包装方法
 * @param {Array} array 包含所有情况的数组
 * @return {Array} 对应店铺的数组数据
 * @example
 * const originList = [
 *  {
  *   a: 123,
  * },
  * {
  *   a: 345,
  *   chainState: false, // 这项需要判断显示与否，true 为显示
  * }
 * ]
 * const formatList = arrayColumnWrapper(originList); // -> [{a: 123}]
 */
export function arrayColumnWrapper<T = Record<string, any>>(array: (T & IArrayColumnParam)[]): T[] {
  return array.filter(item => {
    if (!item) return false;
    const chainState = item.chainState;
    return (typeof chainState === 'boolean' && chainState) || typeof chainState !== 'boolean';
  }).map(item => {
    return _omit(item, 'chainState');
  }) as unknown as T[];
}
