import React from 'react';
import ReactDOM from 'react-dom';
import PctDeleteDialog, { Props } from './dialog';

export function openDialog(options: Omit<Props, 'zentForm' | 'container'>) {
  const container = document.createElement('div');

  ReactDOM.render(<PctDeleteDialog container={container} {...options} />, container);
}
