/*****************
 * 这里写一些components简介及必要信息
 */
import React, { useState, useEffect } from 'react';

import './style.sass';

interface IProps {

}

export default function Sample(props: IProps) {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me {props}
      </button>
    </div>
  );
}
