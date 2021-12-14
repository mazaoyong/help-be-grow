import React from 'react'
import {
  Select,
  MenuItem
} from '@material-ui/core'

export default ({ bizName, setBizName, updateLog }) => {
  return (
    <div style={{
      width: '40%',
      marginLeft: '20px',
      color: 'rgba(0, 0, 0, 0.87)',
      position: 'relative'
    }}>
      <div>请选择代码仓库（默认展示全部）：</div>
      <Select
        value={bizName || '全部'}
        defaultValue={'全部'}
        style={{ width: '100%', paddingLeft: '8px' }}
        label="bizName"
        onChange={e => {
          setBizName(e.target.value);
        }}
      >
        {
          updateLog.sort((pre, next) => next.spend - pre.spend).map((i) => {
            return `${i.appName}/client/`
          }).concat(['wsc-pc-vis/client-h5/', 'all']).map((appName) => (
            <MenuItem value={appName}>{appName}</MenuItem>
          ))
        }
      </Select>
      <div
        style={{
          color: 'rgba(0, 0, 0, 0.87)',
          position: 'absolute',
          cursor: 'pointer',
          bottom: '0',
          right: '-84px',
          border: '1px solid',
          padding: '0 12px'
        }}
        onClick={() => setBizName('all')}
      >全部</div>
    </div>
  )
}