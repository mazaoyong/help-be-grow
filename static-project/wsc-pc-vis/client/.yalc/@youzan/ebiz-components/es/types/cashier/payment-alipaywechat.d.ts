/// <reference types="react" />
import { IPaymentPayArgs } from './types';
interface IPaymentAlipayWechatProps {
    price: number;
    orderNo: string;
    payUrl: string;
    prepayId: string;
    getWscQrcodeApi: (args: {
        url: string;
        width: number;
        height: number;
    }) => Promise<string>;
    onPay: (args: IPaymentPayArgs) => void;
    onCancel: () => void;
}
export default function PaymentAlipayWechat({ price, orderNo, payUrl, prepayId, getWscQrcodeApi, onPay, onCancel }: IPaymentAlipayWechatProps): JSX.Element;
export {};
