import { ReactElement } from 'react';
interface IPaymentCardProps {
    className?: string;
    markId: number;
    markName: string;
    onClick?: () => void;
}
export interface IPaymentCardGroupProps {
    value: number;
    onChange: (index: number, markId: number, markName: string) => void;
    children: ReactElement[];
}
export default function PaymentCard({ className, onClick, markId, markName }: IPaymentCardProps): JSX.Element;
export declare function PaymentCardGroup({ value, onChange, children }: IPaymentCardGroupProps): JSX.Element;
export {};
