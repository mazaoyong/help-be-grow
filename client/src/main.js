"use strict";
// Create a theme instance.
const {
  createMuiTheme,
  ThemeProvider,
  Button,
  Card,
  List,
  ListItem,
  ListItemText,
  Grid,
  TextField,
  Box,
  Switch,
  FormControlLabel,
  InputAdornment,
  IconButton,
  Icon,
  Paper,
  InputBase,
  Typography,
  Tooltip,
} = MaterialUI;
const theme = createMuiTheme({
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
const APP_NAME = {
  "wsc-pc-vis": "教育B端",
  "wsc-h5-vis": "教育C端",
};
const getNavigatorList = (apiFile) => {
  const apiFilePart = apiFile.replace(".js", "").split("/");
  const nameList = [];
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
const SearchCard = (props) => {
  const [isCopy, setIsCopy] = React.useState(false);
  const { userInput = "" } = props;
  const listItemRange = {
    JsonApi: "json接口",
    JavaApi: "java接口",
    AppName: "应用名称",
    Navigator: "页面导航",
    Controller: "controllers文件",
    Service: "services文件",
  };
  const ListItemRender = ({ keyVal, title }) => {
    let secondary = props.item[keyVal];
    if (keyVal === "AppName") {
      secondary = [APP_NAME[secondary]];
    } else if (keyVal === "Navigator") {
      if (props.item["AppName"] === "wsc-pc-vis") {
        secondary = secondary.map(getNavigatorList);
      }
    } else {
      secondary = [secondary];
    }
    const reg = new RegExp(userInput, "g");
    // 点击复制
    const handleSearchCardClick = ({ content, keyVal }) => {
      // const notCopyList = ["Navigator", "AppName"];
      // if (notCopyList.includes(keyVal)) {
      //   return;
      // }
      var aux = document.createElement("input");
      aux.setAttribute("value", content.toString());
      document.body.appendChild(aux);
      aux.select();
      document.execCommand("copy");
      document.body.removeChild(aux);
      setIsCopy(true);
    };
    return (
      <Box>
        <Typography variant="h6" color="textPrimary">
          {title}
        </Typography>
        <Box display="flex" alignItems="center">
          <Typography variant="body1" color="textSecondary">
            {secondary.map((item, index) => (
              <div
                dangerouslySetInnerHTML={{
                  __html: item.replace(
                    reg,
                    `<span class="user-input">${userInput}</span>`
                  ),
                }}
                key={index}
              ></div>
            ))}
          </Typography>
          <Box ml="auto">
            <Tooltip
              title={isCopy ? "已复制！" : "复制到剪切板"}
              placement="top"
            >
              <Button
                variant="outlined"
                color="primary"
                onClick={() =>
                  handleSearchCardClick({ content: secondary, keyVal })
                }
                onMouseOut={() => setIsCopy(false)}
              >
                复制
              </Button>
            </Tooltip>
          </Box>
        </Box>
      </Box>
    );
  };
  return (
    <Card className="mb-6">
      {Object.entries(listItemRange).map(([key, value]) => {
        return (
          <Box px={2} py={1} key={key}>
            <ListItemRender keyVal={key} title={value} />
          </Box>
        );
      })}
    </Card>
  );
};
// 防抖
let doing = null;
const LikeButton = () => {
  const [searchAltitude, setSearchAltitude] = React.useState(1);
  const [isRandomBgImg, setIsRandomBgImg] = React.useState(false);
  const [searchList, setSearchList] = React.useState([]);
  const [userInput, setUserInput] = React.useState("");

  // 设置是否展示随机背景图片
  const handleSetIsRandomBgImg = (isSet) => {
    localStorage.setItem("isRandomBgImg", +isSet);
    setIsRandomBgImg(isSet);
  };

  // 获取搜索内容
  const searchAction = (userInput) => {
    return new Promise((resolve) => {
      fetch("/getSearchResult?searchContent=" + encodeURIComponent(userInput))
        .then((response) => {
          return response.json();
        })
        .then((res) => {
          const searchList = res.data;
          resolve(searchList);
          setSearchList(searchList);
        })
        .catch((err) => {
          console.error(err);
        });
    });
  };

  // 用户输入
  const handleUserInput = (val) => {
    if (val.indexOf(".json") === -1 && val.indexOf("com.youzan") !== -1) {
      const lastDot = val.lastIndexOf(".");
      val = val.substring(0, lastDot) + "#" + val.substring(lastDot + 1);
    }
    if (doing) {
      clearTimeout(doing);
    }
    if (val) {
      setUserInput(val);
      doing = setTimeout(() => {
        searchAction(val);
      }, 500);
    }
  };

  React.useEffect(() => {
    const isRandomBgImg = localStorage.getItem("isRandomBgImg");
    setIsRandomBgImg(!(isRandomBgImg === "0"));
    // searchAction("edu/course-product/list-page.jso");
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <div className="main">
        <div className={`bg-primary ${isRandomBgImg && "random-bg-img"}`}>
          <Box display="flex" justifyContent="flex-end">
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
          <div className="flex-col align-center">
            <h1 className="m-title">SearchYM</h1>
            <p className="m-desc">
              <Box fontSize={16}>
                已收录了教育B端（包括商家小程序）和教育C端的接口映射
              </Box>
              <Box fontSize={12} pt={1} textAlign="center">
                有问题@米九(马灶勇)
              </Box>
            </p>
            {/* <span className="m-desc">有问题企微@米九（马灶勇）</span> */}
            <div className="m-search">
              {/* <Paper elevation={searchAltitude} className="ms-paper">
                <Box display="flex" alignItems="center">
                  <InputBase
                    color="secondary"
                    onFocus={() => setSearchAltitude(3)}
                    onBlur={() => setSearchAltitude(1)}
                    className="ms-input"
                    placeholder="请输入json接口或者java接口"
                  ></InputBase>
                </Box>
              </Paper> */}
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
                />
              </Paper>
              <Box fontSize={12} pt={1}>
                示例：v4/vis/edu/course-product/list-page.json
              </Box>
            </div>
          </div>
        </div>
        <div className="list">
          {searchList.map((item, index) => (
            <SearchCard item={item} key={index} userInput={userInput} />
          ))}
        </div>
      </div>
    </ThemeProvider>
  );
};

let domContainer = document.querySelector("#root");
ReactDOM.render(<LikeButton />, domContainer);
