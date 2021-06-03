"use strict";
// Create a theme instance.

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _MaterialUI = MaterialUI,
    createMuiTheme = _MaterialUI.createMuiTheme,
    ThemeProvider = _MaterialUI.ThemeProvider,
    Button = _MaterialUI.Button,
    Card = _MaterialUI.Card,
    List = _MaterialUI.List,
    ListItem = _MaterialUI.ListItem,
    ListItemText = _MaterialUI.ListItemText,
    Grid = _MaterialUI.Grid,
    TextField = _MaterialUI.TextField,
    Box = _MaterialUI.Box,
    Switch = _MaterialUI.Switch,
    FormControlLabel = _MaterialUI.FormControlLabel,
    InputAdornment = _MaterialUI.InputAdornment,
    IconButton = _MaterialUI.IconButton,
    Icon = _MaterialUI.Icon,
    Paper = _MaterialUI.Paper,
    InputBase = _MaterialUI.InputBase;

var theme = createMuiTheme({
  palette: {
    primary: {
      main: "#55ab68"
    },
    secondary: {
      main: "#fff"
    },
    background: {
      default: "#000"
    }
  }
});
var APP_NAME = {
  "wsc-pc-vis": "教育B端",
  "wsc-h5-vis": "教育C端"
};
var SearchCard = function SearchCard(props) {
  var listItemRange = {
    JsonApi: "json接口",
    JavaApi: "java接口",
    AppName: "应用名称",
    Navigator: "页面导航",
    Controller: "controllers文件",
    Service: "services文件"
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
  var handleCopy = function handleCopy(key, value) {
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
  var ListItemRender = function ListItemRender(_ref) {
    var keyVal = _ref.keyVal,
        value = _ref.value;

    var secondary = props.item[keyVal];
    if (keyVal === "AppName") {
      secondary = APP_NAME[secondary];
    }
    if (keyVal === "Navigator") {
      return React.createElement(ListItemText, {
        primary: "\u9875\u9762\u5BFC\u822A",
        secondary: secondary,
        onClick: function onClick() {
          return handleCopy(keyVal, secondary);
        }
      });
    } else {
      return React.createElement(ListItemText, {
        primary: value,
        secondary: secondary,
        onClick: function onClick() {
          return handleCopy(keyVal, secondary);
        }
      });
    }
  };
  return React.createElement(
    Card,
    { className: "mb-6" },
    Object.entries(listItemRange).map(function (_ref2) {
      var _ref3 = _slicedToArray(_ref2, 2),
          key = _ref3[0],
          value = _ref3[1];

      return React.createElement(
        ListItem,
        { button: true, key: key },
        React.createElement(ListItemRender, { keyVal: key, value: value })
      );
    })
  );
};
// 防抖
var doing = null;

var LikeButton = function LikeButton() {
  var _React$useState = React.useState(1),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      searchAltitude = _React$useState2[0],
      setSearchAltitude = _React$useState2[1];

  var _React$useState3 = React.useState(false),
      _React$useState4 = _slicedToArray(_React$useState3, 2),
      isRandomBgImg = _React$useState4[0],
      setIsRandomBgImg = _React$useState4[1];

  var _React$useState5 = React.useState([]),
      _React$useState6 = _slicedToArray(_React$useState5, 2),
      searchList = _React$useState6[0],
      setSearchList = _React$useState6[1];

  // 设置是否展示随机背景图片


  var handleSetIsRandomBgImg = function handleSetIsRandomBgImg(isSet) {
    localStorage.setItem("isRandomBgImg", +isSet);
    setIsRandomBgImg(isSet);
  };

  // 获取搜索内容
  var searchAction = function searchAction(userInput) {
    return new Promise(function (resolve) {
      fetch("/getSearchResult?searchContent=" + userInput).then(function (response) {
        return response.json();
      }).then(function (res) {
        var searchList = res.data;
        resolve(searchList);
        setSearchList(searchList);
      }).catch(function (err) {
        console.error(err);
      });
    });
  };

  // 用户输入
  var handleUserInput = function handleUserInput(val) {
    if (doing) {
      clearTimeout(doing);
    }
    doing = setTimeout(function () {
      searchAction(val);
    }, 500);
  };

  React.useEffect(function () {
    var isRandomBgImg = localStorage.getItem("isRandomBgImg");
    setIsRandomBgImg(!(isRandomBgImg === "0"));
  }, []);

  return React.createElement(
    ThemeProvider,
    { theme: theme },
    React.createElement(
      "div",
      { className: "main" },
      React.createElement(
        "div",
        { className: "bg-primary " + (isRandomBgImg && "random-bg-img") },
        React.createElement(
          Box,
          { display: "flex", justifyContent: "flex-end" },
          React.createElement(FormControlLabel, {
            control: React.createElement(Switch, {
              onChange: function onChange(e) {
                return handleSetIsRandomBgImg(e.target.checked);
              },
              checked: isRandomBgImg
            }),
            label: "\u80CC\u666F\u56FE\u7247"
          })
        ),
        React.createElement(
          "div",
          { className: "flex-col align-center" },
          React.createElement(
            "h1",
            { className: "m-title" },
            "SearchYM"
          ),
          React.createElement(
            "p",
            { className: "m-desc" },
            React.createElement(
              Box,
              { fontSize: 16 },
              "\u5DF2\u6536\u5F55\u4E86\u6559\u80B2B\u7AEF\uFF08\u5305\u62EC\u5546\u5BB6\u5C0F\u7A0B\u5E8F\uFF09\u548C\u6559\u80B2C\u7AEF\u7684\u63A5\u53E3\u6620\u5C04"
            )
          ),
          React.createElement(
            "div",
            { className: "m-search" },
            React.createElement(
              Paper,
              { elevation: searchAltitude },
              React.createElement(TextField, {
                placeholder: "\u8BF7\u8F93\u5165json\u63A5\u53E3\u6216\u8005java\u63A5\u53E3",
                fullWidth: true,
                variant: "outlined",
                color: "secondary",
                onFocus: function onFocus() {
                  return setSearchAltitude(3);
                },
                onBlur: function onBlur() {
                  return setSearchAltitude(1);
                },
                onChange: function onChange(e) {
                  return handleUserInput(e.target.value);
                },
                className: "ms-input"
              })
            )
          )
        )
      ),
      React.createElement(
        "div",
        { className: "list" },
        searchList.map(function (item, index) {
          return React.createElement(SearchCard, { item: item, key: index });
        })
      )
    )
  );
};

var domContainer = document.querySelector("#root");
ReactDOM.render(React.createElement(LikeButton, null), domContainer);