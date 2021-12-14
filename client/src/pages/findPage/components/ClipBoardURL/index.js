import React from 'react'
import ReactClipboard from 'react-clipboardjs-copy'

export default ({ componentName, targetName, bizName }) => {
  const url = `${window.location.origin}${window.location.pathname}?componentLibName=${componentName}&name=${targetName}&bizName=${bizName}`
  const textDesc = '一键复制 URL，发送给 Ta（推荐）'
  const styleObj = {
    color: 'rgb(0,162,222)',
    cursor: 'pointer',
    textAlign: 'center',
    lineHeight: '56px',
    fontSize: '28px'
  }

  return <ReactClipboard
    style={styleObj}
    onSuccess={e => alert('复制成功')}
    onError={e => console.log('复制失败', e)}
    text={url}
  >
    <div>{textDesc}</div>
  </ReactClipboard>
}
