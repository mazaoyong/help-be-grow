import React from 'react';
import ReactDOM from 'react-dom';

export function useOpenDialog(container: HTMLElement) {
  const [visible, setVisble] = React.useState<boolean>(true);

  const onClose = () => setVisble(false);
  const onClosed = () => ReactDOM.unmountComponentAtNode(container);

  return { visible, onClose, onClosed };
}
