import React from 'react'
import ReactClipboard from 'react-clipboardjs-copy'

export default ({ idName }) => {
  const textDesc = '一键复制（复制影响面，内容太多则不太推荐）'
  const styleObj = { color: '#c9c0d3', cursor: 'pointer', textAlign: 'center', lineHeight: '40px' }

  return <ReactClipboard
    style={styleObj}
    onSuccess={e => alert('复制成功')}
    onError={e => console.log('复制失败', e)}
    options={{
      target: () => document.getElementById(idName)
    }}
  >
    <div>{textDesc}</div>
  </ReactClipboard>
}
