import React from 'react'
import { LIB_DOC_URL } from '../../enum'

export default ({ componentName }) => (
  LIB_DOC_URL[componentName] ? <div
    style={{
      textAlign: 'center',
    }}
  >
    <a
      style={{
        fontSize: '20px',
        color: 'tan',
      }}
      href={LIB_DOC_URL[componentName]}
      target="_blank"
      rel="noopener"
    >
      组件库文档：{LIB_DOC_URL[componentName]}
    </a>
  </div> : null
)
