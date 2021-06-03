import React from 'react';
import { Button, IButtonProps, Link } from 'zent';
import cx from 'classnames';
import './styles.scss';

interface ICommonLinkProps extends IButtonProps {
  className?: string;
  style?: React.CSSProperties;
  target?: HTMLLinkElement['target'];
  displayType?: 'button' | 'link';
  url?: string;
  href?: string;
  justButton?: boolean;
  rel?: string;
}

const CommonLink: React.FC<ICommonLinkProps> = (props) => {
  const {
    children,
    displayType = 'link',
    url,
    href: passiveHref,
    justButton = false,
    ...knownProps
  } = props;
  const { className, ...passiveProps } = knownProps;
  const hrefProp = React.useMemo(() => (justButton ? {} : { href: url || passiveHref }), [
    justButton,
    passiveHref,
    url,
  ]);

  if (displayType === 'button') {
    return (
      <Button type="primary" className={cx('common-link', className)} {...passiveProps} href={url}>
        {children}
      </Button>
    );
  }

  return (
    <Link className={cx(className, 'common-link')} {...passiveProps} {...hrefProp}>
      {props.children}
    </Link>
  );
};

export default CommonLink;
export type IBaseCommonLinkProps = Omit<ICommonLinkProps, 'url'>;
