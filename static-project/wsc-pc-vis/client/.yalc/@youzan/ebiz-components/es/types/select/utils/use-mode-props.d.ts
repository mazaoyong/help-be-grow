import { IEbizSelectProps, IEbizSelectSyncProps, IEbizSelectAsyncProps } from '../types';
/**
 * @description 因为select有两种工作模式，并且在两种工作模式下都有自己特有的属性，所以需要一
 * 个hooks来分发这些属性，确保类型完整
 */
declare const useModeProps: (props: IEbizSelectProps) => {
    syncModeProps: IEbizSelectSyncProps;
    asyncModeProps: IEbizSelectAsyncProps;
    isRunAsyncMode: boolean;
};
export default useModeProps;
