import React, { ComponentType, ReactNode } from 'react';

interface IProps<T> {
  value: boolean;
  component: ComponentType<any>;
  componentProps: T;
  children: ReactNode;
}

export default function SwitchRender<T>(props: IProps<T>) {
  const { component: Component, children, value, componentProps } = props;
  return <>{value ? <Component {...componentProps}>{children}</Component> : children}</>;
}
