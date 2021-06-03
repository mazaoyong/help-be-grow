import React, { Component } from 'react';
import { BlockHeader } from 'zent';
import './index.scss';

interface Props {
  title: string;
  items: Array<{
    logo?: string;
    title?: any;
    content?: any;
    width?: number;
  }>;
}

export default class ImgText extends Component<Props> {
  public static defaultProps = {
    title: '',
    items: [],
  };

  public render() {
    const { title, items, children } = this.props;
    return (
      <section className="services-wrapper">
        <BlockHeader title={title} />
        <div className="service-item-wrapper">
          {items.map((item, index) => {
            return (
              <div key={`item-${index}`} className="item">
                <div className="logo">
                  <img src={item.logo} width={item.width} alt="" />
                </div>
                {item.title && <h4 className="title">{item.title}</h4>}
                {item.content && <p className="desc">{item.content}</p>}
              </div>
            );
          })}
        </div>
        {children}
      </section>
    );
  }
}
