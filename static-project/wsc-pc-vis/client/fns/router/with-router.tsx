import { pctCheck } from 'fns/auth';
import React, { Component, ComponentType } from 'react';
import { visPush } from './vis-push';

// type Exclude<T, U> = T extends U ? never : T;
// type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export interface IVisRouterProps {
  pctCheck?: boolean;
  to?: string;
  href?: string;
  onClick?: () => void;
  [key: string]: any;
  target?: string;
}

// ComponentClass<Omit<Props, 'href'>>
export default function withVisRouter(Cmpt: ComponentType<IVisRouterProps>) {
  return class TabWrap extends Component<IVisRouterProps> {
    public render() {
      const propsCopy = { ...(this.props as IVisRouterProps) };
      delete propsCopy.pctCheck;
      let url: string;
      // 捕获 to 属性
      if (propsCopy.to) {
        url = propsCopy.to;
        delete propsCopy.to;
      }

      // 捕获 href 属性
      if (propsCopy.href) {
        url = propsCopy.href;
        delete propsCopy.href;
      }

      propsCopy.onClick = () => {
        if (this.props.pctCheck) {
          pctCheck()
            .then(() => {
              if (this.props.onClick) {
                this.props.onClick();
              } else {
                visPush(url, this.props.target);
              }
            })
            .catch(() => {
              // Nothing to do
            });
        } else {
          if (this.props.onClick) {
            this.props.onClick();
          } else {
            visPush(url, this.props.target);
          }
        }
      };

      return <Cmpt {...propsCopy} />;
    }
  };
}
