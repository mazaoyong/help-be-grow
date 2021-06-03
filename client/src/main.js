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
const SearchCard = (props) => {
  const listItemRange = {
    JsonApi: "json接口",
    JavaApi: "java接口",
    AppName: "应用名称",
    Navigator: "页面导航",
    Controller: "controllers文件",
    Service: "services文件",
  };
  // 浏览器复制
  function copyToClip(content, message) {
    var aux = document.createElement("input");
    aux.setAttribute("value", content);
    document.body.appendChild(aux);
    aux.select();
    document.execCommand("copy");
    document.body.removeChild(aux);
    if (message) {
      alert(message);
    } else {
      alert("复制成功");
    }
  }
  // 点击复制
  const handleCopy = (key, value) => {
    // console.log(key, value);
    // let clipboard = value;
    // const freshStrRegexp = /(\S+)(#|\.js)/;
    // const FRESH_KEY = ["Navigator", "JavaApi", "Controller", "Service"];
    // if (FRESH_KEY.includes(key)) {
    //   clipboard = value.match(freshStrRegexp)[1];
    // }
    // copyToClip(clipboard);
    // console.log(clipboard);
  };
  const ListItemRender = ({ keyVal, value }) => {
    let secondary = props.item[keyVal];
    if (keyVal === "AppName") {
      secondary = APP_NAME[secondary];
    }
    if (keyVal === "Navigator") {
      return (
        <ListItemText
          primary="页面导航"
          secondary={secondary}
          onClick={() => handleCopy(keyVal, secondary)}
        ></ListItemText>
      );
    } else {
      return (
        <ListItemText
          primary={value}
          secondary={secondary}
          onClick={() => handleCopy(keyVal, secondary)}
        />
      );
    }
  };
  return (
    <Card className="mb-6">
      {Object.entries(listItemRange).map(([key, value]) => {
        return (
          <ListItem button key={key}>
            <ListItemRender keyVal={key} value={value} />
          </ListItem>
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

  // 设置是否展示随机背景图片
  const handleSetIsRandomBgImg = (isSet) => {
    localStorage.setItem("isRandomBgImg", +isSet);
    setIsRandomBgImg(isSet);
  };

  // 获取搜索内容
  const searchAction = (userInput) => {
    return new Promise((resolve) => {
      fetch("/getSearchResult?searchContent=" + userInput)
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
    if (doing) {
      clearTimeout(doing);
    }
    doing = setTimeout(() => {
      searchAction(val);
    }, 500);
  };

  React.useEffect(() => {
    const isRandomBgImg = localStorage.getItem("isRandomBgImg");
    setIsRandomBgImg(!(isRandomBgImg === "0"));
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
            </div>
          </div>
        </div>
        <div className="list">
          {searchList.map((item, index) => (
            <SearchCard item={item} key={index} />
          ))}
        </div>
      </div>
    </ThemeProvider>
  );
};

let domContainer = document.querySelector("#root");
ReactDOM.render(<LikeButton />, domContainer);
