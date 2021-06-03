/// <reference types="react" />
import { IPaymentPayArgs } from './types';
interface IPaymentOtherProps {
    price: number;
    orderNo: string;
    prepayId: string;
    getPayToolsApi: () => Promise<any>;
    onPay: (params: IPaymentPayArgs) => void;
    onCancel: () => void;
}
export default function PaymentOther(params: IPaymentOtherProps): JSX.Element;
export {};
