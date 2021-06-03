import qs from 'qs';
import React, { Component, ReactElement, ReactNode } from 'react';
import { History, createHashHistory, useQueries } from 'history';

/**
 * VisList用于包裹组件，并传递Location对象
 *
 * @class VisList
 * @extends {Component<WithRouterProps, any>}
 */
class VisList extends Component<any, any> {
  constructor(props: any) {
    super(props);

    const history = this.getHistory();
    const location = this.getLocation(history);

    this.state = {
      history,
      location,
    };
  }

  handlePushRouter = (params: object): void => {
    const { history, location } = this.state;
    const { pathname, query } = location;
    const timeStamp = new Date().getTime();
    const queryObject = Object.assign(query || {}, params, { _updatetime: timeStamp });
    history.push({
      pathname,
      search: `?${qs.stringify(queryObject)}`,
    });
  };

  private getHistory = () => {
    const history = useQueries(createHashHistory)({
      stringifyQuery: qs.stringify,
      parseQueryString: qs.parse,
    });
    history.listen(() => {
      const location = this.getLocation(history);
      this.setState({ location });
    });
    return history as any;
  };

  private getLocation = (history: History) => {
    return history.getCurrentLocation();
  };

  render(): ReactNode {
    const { children } = this.props;
    const { location } = this.state;
    return React.Children.map(children, (child: unknown, key: number) => {
      return React.cloneElement(child as ReactElement<{ [key: string]: any }>, {
        key,
        location,
        push: this.handlePushRouter,
      });
    });
  }
}

export default VisList;
