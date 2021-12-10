import {
  ThemeProvider,
  TextField,
  Box,
  Paper,
  Tooltip,
  IconButton,
  Select,
  MenuItem
} from '@material-ui/core'
import React, { useState, useEffect, useMemo } from 'react'
import { createTheme } from '@material-ui/core/styles'
import { apiGetUpdateLogAction, apiGetProjectConfig, apiGetComponentFiles } from '@api'
import { ISearchListItem, IUpdateLogItem, IPrjConfigItem } from '@type'
import { WSC_PC_VIS_NAV } from '@constants'
import { format } from 'date-fns'
import { formatMsToStr } from '@utils'
import ReactClipboard from 'react-clipboardjs-copy'
import qs from 'qs'
import ZanTracker from '@youzan/zan-web-tracker'
import { LIB_DOC_URL } from './enum'

import gitlab from './gitlab.svg'
import "./style.scss"

declare type TSubmitParams = {
  targetName?: string;
  component?: string;
}

declare type TWscPcVisNav = {
  key: string;
  value: string;
  parent?: string;
}

const theme = createTheme({
  palette: {
    primary: {
      main: "#55ab68",
    },
    secondary: {
      main: "#fff",
    },
    background: {
      default: "#000",
    },
  },
});

const getUID = () => {
  const uid = window.localStorage.getItem('uid');
  if (uid) {
    return uid;
  }
  const random = Number(Math.random().toString().substr(3,length) + Date.now()).toString(36);
  window.localStorage.setItem('uid', random);
  return random;
}

const tracker = ZanTracker.initGlobalTracker({
  yai: 'wsc_b',
  app: 'help-be-grow',
  autoEnterpage: true,
  autoClick: true,
  autoNodeClick: false,
  autoNodeView: false,
  beforeEnterpage(tracker: any) {
    tracker.setEvent({
      data: {
        pt: 'findPage',
      },
    });
    tracker.setUser({
      data: {
        login_sign: getUID() // 防止埋点平台警告 [["user|login_sign","","empty"]]
      },
    });
  },
});

// 防抖
let doing: number | null = null;
const SearchList = () => {
  const [searchAltitude, setSearchAltitude] = useState<number>(1);
  const [isRandomBgImg, setIsRandomBgImg] = useState<boolean>(false);
  // 更新日志数据
  const [updateLog, setUpdateLog] = useState<IUpdateLogItem[]>([]);
  // 配置数据
  const [prjConfig, setPrjConfig] = useState<Record<string, string>>({})
  const [filenameList, setFilenameList] = useState<Record<string, string>[]>([]);

  const [targetName, setTargetName] = useState<string>('');
  const [componentName, setComponentName] = useState<string>('@youzan/ebiz-components');

  const handleSubmit = async (params: TSubmitParams = {}) => {
    try {
      tracker.click({
        et: 'rule', // 事件类型
        ei: 'fetchComponentsData', // 事件标识
        en: '请求组件数据', // 事件名称
        pt: 'findPage', // 页面类型
        params: {
          componentName,
          targetName,
          spm: 'findPage',
        } // 事件参数
      });
      const { data: { data } } = await apiGetComponentFiles({ targetName: targetName.trim(), component: componentName, ...params });
      console.log('res>>>', data);
      setFilenameList(data);
    } catch (err) {
      console.error(err);
    }
  };

  const initSelect = async () => {
    let res: Record<string, any> = {};
    const { componentLibName = '', name = '' } = qs.parse(window.location.href.split('?')[1]);

    tracker.click({
      et: 'rule', // 事件类型
      ei: 'fetchComponentsData', // 事件标识
      en: '请求组件数据', // 事件名称
      pt: 'findPage', // 页面类型
      params: {
        componentName,
        targetName,
        spm: 'findPage',
      } // 事件参数
    });

    if (componentLibName) setComponentName(componentLibName as string);
    if (name) {
      setTargetName(name as string);
      res = await apiGetComponentFiles({ targetName: (name as string).trim(), component: (componentLibName || componentName) as string });
    }
    return res;
  };

  useEffect(() => {
    const isRandomBgImg = localStorage.getItem("isRandomBgImg");
    setIsRandomBgImg(!(isRandomBgImg === "0"));
    // 获取配置数据和更新日志
    Promise.all([apiGetProjectConfig(), apiGetUpdateLogAction(), initSelect()])
      .then(([configRes, updateLogRes, resultListRes]) => {
        const configData = configRes?.data?.data || []
        const updateLogData = updateLogRes?.data?.data || []
        const resultListData = resultListRes?.data?.data || []
        setPrjConfig(configData.reduce((initValue: Record<string, string>, item: IPrjConfigItem) => {
          return {
            ...initValue,
            [item.name]: item.label
          }
        }, {}))
        setUpdateLog(updateLogData)
        setFilenameList(resultListData)
      })
  }, []);

  // 更新时间、总用时
  const updateData = useMemo(() => {
    if (updateLog.length) {
      const spendMax: number = updateLog.sort((pre, next) => next.spend - pre.spend)[0].spend
      return {
        time: format(updateLog[0]?.updateEndTime, 'yyyy年MM月dd日 HH点mm分'),
        spend: formatMsToStr(spendMax)
      }
    }
    return {}
  }, [updateLog])

  const getCodeUrl = (item:any) => {
    const codeUrl = `https://gitlab.qima-inc.com/wsc-node/${item.split('/')[0]}/-/blob/master/${item.split('/').slice(1).join('/')}`;
    return codeUrl;
  };

  const getBusiness = (appName: string, business: string) => {
    let BUSINESS_DICT: TWscPcVisNav[] = [];
    if (appName === 'wsc-pc-vis') {
      BUSINESS_DICT = WSC_PC_VIS_NAV;
    }
    const nameList: Record<"key" | "value", string>[] = business.split('/').map(i => {
      return BUSINESS_DICT.find(nav => i === nav.key) || { key: '', value: '' };
    });
    return nameList.filter(i => !!i.value).map((item) => `【${item.value}】`).join("—");
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="find-page-main">
        <div className="bg-primary">
          <Box display="flex" alignItems="center">
            <Box pl={1} display="flex" alignItems="center">
              更新时间：{updateData.time}，总用时：{updateData.spend}
            </Box>
            <Box ml="auto">
              <IconButton aria-label="upload picture" component="span" onClick={() => window.open('https://gitlab.qima-inc.com/fe-edu/help-be-grow', '__blank')}>
                <img src={gitlab} width={25} />
              </IconButton>
            </Box>
          </Box>
          <div className="flex-col align-center">
            <h1 className="m-title">组件用哪儿了</h1>
            <p className="m-desc">
              <Box fontSize={16}>
                <Tooltip
                  arrow
                  interactive
                  placement="right"
                  title={
                    <Box pb={1}>
                      {
                        updateLog.sort((pre, next) => next.spend - pre.spend).map((item: IUpdateLogItem) => (
                          <Box key={item.appName} display="flex" pt={1}>
                            {`${prjConfig[item.appName]}（${item.appName}）`}
                          </Box>
                        ))
                      }
                    </Box>
                  }>
                  <span className="include-text">
                    已收录了教育业务和其他绝大部分仓库
                  </span>
                </Tooltip>
              </Box>
              <Box fontSize={12} pt={1} textAlign="center">
                <span>有问题 @周婷婷</span>
              </Box>
              <Box fontSize={12} pt={1} textAlign="center">
                <span>感谢 help-be-grow 提供部署等支持 @(米九)马灶勇</span>
              </Box>
            </p>
            <div className="m-search">
              <Paper elevation={searchAltitude}>
                <Select value={componentName} style={{ width: '100%' }} label="components" onChange={e => {
                  setComponentName(e.target.value as string);
                  handleSubmit({ component: e.target.value as string });
                }}>
                  {
                    Object.keys(LIB_DOC_URL).map((i: string) => (
                      <MenuItem value={i}>{i}</MenuItem>
                    ))
                  }
                </Select>
                <TextField
                  placeholder="请输入组件名"
                  fullWidth
                  variant="outlined"
                  color="secondary"
                  value={targetName}
                  autoFocus
                  onBlur={(e) => {
                    setTargetName(e.target.value);
                    handleSubmit({ targetName: e.target.value });
                  }}
                  onFocus={(e) => {
                    setTargetName(e.target.value);
                    handleSubmit({ targetName: e.target.value });
                  }}
                  onChange={(e) => {
                    setTargetName(e.target.value);
                    handleSubmit({ targetName: e.target.value });
                  }}
                  className="ms-input"
                  type="search"
                />
              </Paper>
              <Box fontSize={12} pt={1}>
                使用说明文档：
                <a
                  style={{ color: 'tan' }}
                  href="https://shimo.im/docs/m5kv9XDyG1FXDdqX/"
                  target="_blank"
                  rel="noopener"
                >
                  https://shimo.im/docs/m5kv9XDyG1FXDdqX/
                </a>
              </Box>
              <Box fontSize={12} pt={1}>
                组件名示例：EasyForm
              </Box>
            </div>
          </div>
        </div>

        {!!filenameList && !!filenameList.length && (
          <ReactClipboard
            style={{ color: 'rgb(0,162,222)', cursor: 'pointer', textAlign: 'center', lineHeight: '40px' }}
            onSuccess={e => alert('复制成功')}
            onError={e => console.log('复制失败', e)}
            text={`${window.location.origin}${window.location.pathname}?componentLibName=${componentName}&name=${targetName}`}
          >
            <div>
              一键复制 URL，发送给 Ta（推荐）
            </div>
          </ReactClipboard>
        )}

        {LIB_DOC_URL[componentName] && <div
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
        </div>}

        <div id="copy-list" className="list">
          <ul style={{ color: 'initial' }}>
            {filenameList.map(({ fileUrl, appName, business }) => (
              <li key={fileUrl}>
                <div>{fileUrl.split('/app/static-project/')[1]}</div>
                <a
                  style={{ marginLeft: '24px', cursor: 'pointer' }}
                  href={getCodeUrl(fileUrl.split('/app/static-project/')[1])}
                  target="_blank"
                  rel="noopener"
                >跳转到代码</a>
                <span
                  style={{ marginLeft: '24px' }}
                >{getBusiness(appName, business)}</span>
              </li>
            ))}
          </ul>
        </div>

        {!!filenameList && !!filenameList.length && (
          <ReactClipboard
            style={{ color: '#c9c0d3', cursor: 'pointer', textAlign: 'center', lineHeight: '40px' }}
            onSuccess={e => alert('复制成功')}
            onError={e => console.log('复制失败', e)}
            // text={JSON.stringify(filenameList)}
            options={{
              target: () => document.getElementById('copy-list')
            }}
          >
            <div>
              一键复制（复制影响面，内容太多则不太推荐）
            </div>
          </ReactClipboard>
        )}
      </div>
    </ThemeProvider>
  );
};

export default SearchList
