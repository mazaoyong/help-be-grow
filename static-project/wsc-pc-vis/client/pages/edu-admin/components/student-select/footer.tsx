import { ReactNode, cloneElement } from 'react';
import { IFooterOptions, IDialogProps } from './types';

export default function renderFooter(tableOptions: IFooterOptions, props: IDialogProps): ReactNode {
  return cloneElement(tableOptions.component, props);
}
