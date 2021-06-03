import React from 'react';
import { IEbizSelectProps, IEbizSelectSyncProps, IEbizSelectAsyncProps } from '../types';
import isAsyncMode from './is-async-mode';
/**
 * @description 因为select有两种工作模式，并且在两种工作模式下都有自己特有的属性，所以需要一
 * 个hooks来分发这些属性，确保类型完整
 */
const useModeProps = (props: IEbizSelectProps) => {
  const isRunAsyncMode = React.useMemo(() => isAsyncMode(props), [props]);

  const syncModeProps = React.useMemo<IEbizSelectSyncProps>(() => {
    return (isRunAsyncMode ? {} : props) as IEbizSelectSyncProps;
  }, [isRunAsyncMode, props]);

  const asyncModeProps = React.useMemo<IEbizSelectAsyncProps>(() => {
    const defaultAsyncProps: Partial<IEbizSelectAsyncProps> = {
      mode: 'async',
      fetchOnOpened: false,
      fetchOnMounted: false,
      showAdd: false,
      showRefresh: false,
    };
    return (isRunAsyncMode ? {
      ...defaultAsyncProps,
      ...props,
    } : {}) as IEbizSelectAsyncProps;
  }, [isRunAsyncMode, props]);

  return { syncModeProps, asyncModeProps, isRunAsyncMode };
};

export default useModeProps;
