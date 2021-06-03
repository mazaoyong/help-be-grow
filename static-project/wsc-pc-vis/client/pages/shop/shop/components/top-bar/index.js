import React from 'react';

import styles from './style.m.scss';

function jump(link) {
  link ? (window.location = link) : window.history.go(-1);
}

export default props => {
  const { content, link } = props;
  return (
    <div className={styles.style}>
      <a className={styles.link} onClick={() => jump(link)}>
        <i className={styles['icon-back-arrow']} />
        上一步
      </a>
      <span className={styles.content}>{content}</span>
    </div>
  );
};
