/// <reference types="react" />
import { ICashierProps } from './types';
export declare function openCashier(props: ICashierProps): void;
export declare function closeCashier(): void;
declare const _default: {
    Cashier: (props: ICashierProps) => JSX.Element;
    openCashier: typeof openCashier;
    closeCashier: typeof closeCashier;
};
export default _default;
export * from './types';
