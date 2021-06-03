/// <reference types="react" />
interface IPaymentCalculatorProps {
    price: number;
    payment: number;
    onPaymentChange: (val: number) => void;
}
export declare function PaymentPrice({ price }: {
    price?: number | undefined;
}): JSX.Element;
export declare function PaymentCalculator({ price, payment, onPaymentChange }: IPaymentCalculatorProps): JSX.Element;
export {};
