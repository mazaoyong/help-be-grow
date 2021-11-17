import {
  ThemeProvider,
  Button,
  Card,
  TextField,
  Box,
  Switch,
  FormControlLabel,
  Paper,
  Typography,
  Tooltip,
  IconButton
} from '@material-ui/core'
import { useState, useEffect, useMemo, FocusEventHandler } from 'react'
import { createTheme } from '@material-ui/core/styles'
import "./style.scss"
import { HelpOutline } from '@material-ui/icons'
import React from 'react'
import { apiGetUpdateLogAction, apiGetSearchResult, apiGetProjectConfig, apiGetComponentFiles } from '@api'
import { ISearchListItem, ISearchCardItem, IUpdateLogItem, IPrjConfigItem } from '@type'
import { SEARCH_CARD_TITLE, APP_NAME, WSC_PC_VIS_NAV } from '@constants'
import SearchCard from '@components/SearchCard'
import gitlab from './gitlab.svg'
import { format } from 'date-fns'
import { formatMsToStr } from '@utils'

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

// 防抖
let doing: number | null = null;
const SearchList = () => {
  const [searchAltitude, setSearchAltitude] = useState<number>(1);
  const [isRandomBgImg, setIsRandomBgImg] = useState<boolean>(false);
  const [searchList, setSearchList] = useState<ISearchListItem[]>([]);
  const [userInput, setUserInput] = useState<string>("");
  // 更新日志数据
  const [updateLog, setUpdateLog] = useState<IUpdateLogItem[]>([]);
  // 配置数据
  const [prjConfig, setPrjConfig] = useState<Record<string, string>>({})
  const [filenameList, setFilenameList] = useState<string[]>([]);

  // 设置是否展示随机背景图片
  const handleSetIsRandomBgImg = (isSet: boolean) => {
    localStorage.setItem("isRandomBgImg", isSet ? '1' : '0');
    setIsRandomBgImg(isSet);
  };

  // 获取搜索内容
  const searchAction = (userInput: string) => {
    return new Promise((resolve) => {
      apiGetSearchResult(userInput)
        .then((res) => {
          const searchList = res.data.data;
          resolve(searchList);
          setSearchList(searchList);
        })
        .catch((err) => {
          console.error(err);
        })
    });
  };

  // 用户输入
  const handleUserInput = (val: string) => {
    console.log(val);
  };

  const handleSubmit = async (val: string) => {
    console.log(val);
    try {
      const { data: { data } } = await apiGetComponentFiles(val.trim());
      console.log(data);
      setFilenameList(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const isRandomBgImg = localStorage.getItem("isRandomBgImg");
    setIsRandomBgImg(!(isRandomBgImg === "0"));
    // 获取配置数据和更新日志
    Promise.all([apiGetProjectConfig(), apiGetUpdateLogAction()])
      .then(([configRes, updateLogRes]) => {
        const configData = configRes?.data?.data || []
        const updateLogData = updateLogRes?.data?.data || []
        setPrjConfig(configData.reduce((initValue: Record<string, string>, item: IPrjConfigItem) => {
          return {
            ...initValue,
            [item.name]: item.label
          }
        }, {}))
        setUpdateLog(updateLogData)
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

  // 更新状态颜色
  const UPDATE_STATE_THEME = {
    1: '#55AB68',
    2: '#F7CC45',
    [-1]: 'red'
  }
  const getNavigatorList = (apiFile: string): string => {
    const apiFilePart = apiFile.replace(".js", "").split("/");
    const nameList: Record<"key" | "value", string>[] = [];
    apiFilePart.forEach((item) => {
      if (!["", "pages"].includes(item)) {
        const findNav = WSC_PC_VIS_NAV.filter((nav) => nav.key === item);
        if (findNav.length === 1) {
          nameList.push(findNav[0]);
        } else if (findNav.length > 1) {
          findNav.forEach((nav) => {
            if (nameList.find((name) => name.key === nav.parent)) {
              nameList.push(nav);
            }
          });
        }
      }
    });
    return apiFile + " " + nameList.map((item) => `【${item.value}】`).join("—");
  };
  // 每个卡片的数据转成对象
  const getSearchItem = (item: ISearchListItem): ISearchCardItem[] => {
    console.log('item>>>>', item);

    const result: ISearchCardItem[] = []
    Object.entries(item).forEach(([key, value]) => {
      let content = []
      if (key === "appName") {
        content = [prjConfig[value] + `（${value}）`];
      } else if (key === "navigator") {
        content = item.appName === "wsc-pc-vis" ? value.map(getNavigatorList) : value;
      } else {
        content = [value]
      }
      result.push({
        title: SEARCH_CARD_TITLE[key],
        content
      })
    })
    return result
  }
  return (
    <ThemeProvider theme={theme}>
      <div className="find-page-main">
        <div className="bg-primary">
          {/* <div className={`bg-primary ${isRandomBgImg && "random-bg-img"}`}> */}
          <Box display="flex" alignItems="center">
            <Box pl={1} display="flex" alignItems="center">
              更新时间：{updateData.time}，总用时：{updateData.spend}
            </Box>
            {/* <Box ml={0.5} display="flex">
              {updateLog.status !== 1 && (
                <Tooltip title={(updateLog.status === -1 ? '【报错】' : '【警告】') + updateLog.info} interactive>
                  <ErrorIcon style={{ color: UPDATE_STATE_THEME[updateLog.status], fontSize: '16px', cursor: 'pointer' }}></ErrorIcon>
                </Tooltip>
              )}
            </Box> */}
            <Box ml="auto">
              <IconButton aria-label="upload picture" component="span" onClick={() => window.open('https://gitlab.qima-inc.com/fe-edu/help-be-grow', '__blank')}>
                {/* <div className="gitlab-svg"></div> */}
                <img src={gitlab} width={25} />
              </IconButton>
              {/* <FormControlLabel
                control={
                  <Switch
                    onChange={(e) => handleSetIsRandomBgImg(e.target.checked)}
                    checked={isRandomBgImg}
                  />
                }
                label="背景图片"
              /> */}
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
                <TextField
                  placeholder="请输入组件名"
                  fullWidth
                  variant="outlined"
                  color="secondary"
                  onBlur={(e) => {
                    handleSubmit(e.target.value);
                  }}
                  onFocus={(e) => {
                    handleSubmit(e.target.value);
                  }}
                  onChange={(e) => {
                    handleSubmit(e.target.value);
                  }}
                  // onFocus={() => setSearchAltitude(3)}
                  // onBlur={() => setSearchAltitude(1)}
                  // onChange={(e) => handleUserInput(e.target.value)}
                  className="ms-input"
                  type="search"
                />
              </Paper>
              <Box fontSize={12} pt={1}>
                组件名示例：EasyForm
              </Box>
              {/* <Box fontSize={12} pt={1}>
                json接口示例：v4/vis/edu/course-product/list-page.json
              </Box>
              <Box fontSize={12} pt={1}>
                java接口示例：com.youzan.owl.pc.api.courseitem.offlinecourse.PcCourseFacade#findPageByCondition
              </Box> */}
            </div>
          </div>
        </div>
        <div className="list">
          <ul style={{ color: 'initial' }}>
            {filenameList.map((item) => (
              <li key={item}>{item.split('/app/static-project/')[1]}</li>
            ))}
          </ul>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default SearchList
