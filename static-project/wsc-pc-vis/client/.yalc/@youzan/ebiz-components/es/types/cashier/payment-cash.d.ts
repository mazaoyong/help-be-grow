/// <reference types="react" />
import { IPaymentPayArgs } from './types';
interface IPaymentCashProps {
    price: number;
    orderNo: string;
    prepayId: string;
    onPay: (args: IPaymentPayArgs) => void;
    onCancel: () => void;
}
export default function PaymentCash(params: IPaymentCashProps): JSX.Element;
export {};
