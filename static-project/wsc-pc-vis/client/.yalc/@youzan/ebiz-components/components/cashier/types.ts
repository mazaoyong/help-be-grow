import { ReactNode } from "react";

export interface IPaymentPayArgs {
  authCode?: string;
  orderNo: string;
  prepayId?: string;
  payTool: string;
  customMarkPayName?: string;
}

export interface ICashierProps {
  orderNo: string;
  price: number;
  payUrl: string;
  prePayId: string;
  getWscQrcodeApi: (args: { url: string, width: number, height: number }) => Promise<any>;
  getOrderInfoApi: (args: { orderNo: string }) => Promise<any>;
  getPayToolsApi: () => Promise<any>
  onPay: (args: IPaymentPayArgs) => void;
  onCancel: () => void;
}

export interface ITabOptionsProps {
  text: string;
  children: ReactNode;
}

export interface ITabProps {
  options: ITabOptionsProps[];
}
