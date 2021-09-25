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
import { useState, useEffect } from 'react'
import { createTheme } from '@material-ui/core/styles'
import "./style.scss"
import ErrorIcon from '@material-ui/icons/ErrorTwoTone';
import React from 'react'
import { apiGetUpdateLogAction, apiGetSearchResult } from '@api'
import { ISearchListItem, ISearchCardItem } from '@type'
import { SEARCH_CARD_TITLE, APP_NAME, WSC_PC_VIS_NAV } from '@constants'
import SearchCard from '@components/SearchCard'
import gitlab from './gitlab.svg'

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
  const [searchAltitude, setSearchAltitude] = useState(1);
  const [isRandomBgImg, setIsRandomBgImg] = useState(false);
  const [searchList, setSearchList] = useState([]);
  const [userInput, setUserInput] = useState("");
  // 更新日志数据
  const [updateLog, setUpdateLog] = useState({});

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
    if (
      val.indexOf(".json") === -1 &&
      val.indexOf("com.youzan") !== -1 &&
      val.indexOf("#") === -1
    ) {
      // 这两行代码导致java接口需要输入全路径
      const lastDot = val.lastIndexOf(".");
      val = val.substring(0, lastDot) + "#" + val.substring(lastDot + 1);
    }
    if (doing !== null) {
      clearTimeout(doing);
    }
    if (val) {
      setUserInput(val);
      doing = window.setTimeout(() => {
        searchAction(val);
      }, 500);
    }
  };

  useEffect(() => {
    const isRandomBgImg = localStorage.getItem("isRandomBgImg");
    setIsRandomBgImg(!(isRandomBgImg === "0"));
    // 获取更新日志
    apiGetUpdateLogAction()
  }, []);
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
    const result: ISearchCardItem[] = []
    Object.entries(item).forEach(([key, value]) => {
      let content = []
      if (key === "appName") {
        content = [APP_NAME[value] || value];
      } else if (key === "navigator" && item.appName === "wsc-pc-vis") {
        content = value.map(getNavigatorList);
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
      <div className="main">
        <div className={`bg-primary ${isRandomBgImg && "random-bg-img"}`}>
          <Box display="flex" alignItems="center">
            {/* <Box pl={1}>
              <span>更新时间：{updateLog.updateEndTime}，</span>
              <span>{updateLog.spend}</span>
            </Box>
            <Box ml={0.5} display="flex">
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
              <FormControlLabel
                control={
                  <Switch
                    onChange={(e) => handleSetIsRandomBgImg(e.target.checked)}
                    checked={isRandomBgImg}
                  />
                }
                label="背景图片"
              />
            </Box>
          </Box>
          <div className="flex-col align-center">
            <h1 className="m-title">SearchYM</h1>
            <p className="m-desc">
              <Box fontSize={16}>
                已收录了教育B端（包括商家小程序）和教育C端的接口映射
              </Box>
              <Box fontSize={12} pt={1} textAlign="center">
                <span>有问题@米九(马灶勇)</span>
              </Box>
            </p>
            <div className="m-search">
              <Paper elevation={searchAltitude}>
                <TextField
                  placeholder="请输入json接口或者java接口"
                  fullWidth
                  variant="outlined"
                  color="secondary"
                  onFocus={() => setSearchAltitude(3)}
                  onBlur={() => setSearchAltitude(1)}
                  onChange={(e) => handleUserInput(e.target.value)}
                  className="ms-input"
                  type="search"
                />
              </Paper>
              <Box fontSize={12} pt={1}>
                json接口示例：v4/vis/edu/course-product/list-page.json
              </Box>
              <Box fontSize={12} pt={1}>
                java接口示例：com.youzan.owl.pc.api.courseitem.offlinecourse.PcCourseFacade#findPageByCondition
              </Box>
            </div>
          </div>
        </div>
        <div className="list">
          {searchList.map((item, index) => (
            <SearchCard searchItem={getSearchItem(item)} key={index} keyword={userInput} />
          ))}
        </div>
      </div>
    </ThemeProvider>
  );
};

export default SearchList
