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
    InputBase = _MaterialUI.InputBase,
    Typography = _MaterialUI.Typography,
    Tooltip = _MaterialUI.Tooltip;

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
var getNavigatorList = function getNavigatorList(apiFile) {
  var apiFilePart = apiFile.replace(".js", "").split("/");
  var nameList = [];
  apiFilePart.forEach(function (item) {
    if (!["", "pages"].includes(item)) {
      var findNav = WSC_PC_VIS_NAV.filter(function (nav) {
        return nav.key === item;
      });
      if (findNav.length === 1) {
        nameList.push(findNav[0]);
      } else if (findNav.length > 1) {
        findNav.forEach(function (nav) {
          if (nameList.find(function (name) {
            return name.key === nav.parent;
          })) {
            nameList.push(nav);
          }
        });
      }
    }
  });
  return apiFile + " " + nameList.map(function (item) {
    return "\u3010" + item.value + "\u3011";
  }).join("—");
};
var SearchCard = function SearchCard(props) {
  var _React$useState = React.useState(false),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      isCopy = _React$useState2[0],
      setIsCopy = _React$useState2[1];

  var _props$userInput = props.userInput,
      userInput = _props$userInput === undefined ? "" : _props$userInput;

  var listItemRange = {
    JsonApi: "json接口",
    JavaApi: "java接口",
    AppName: "应用名称",
    Navigator: "页面导航",
    Controller: "controllers文件",
    Service: "services文件"
  };
  var ListItemRender = function ListItemRender(_ref) {
    var keyVal = _ref.keyVal,
        title = _ref.title;

    var secondary = props.item[keyVal];
    if (keyVal === "AppName") {
      secondary = [APP_NAME[secondary]];
    } else if (keyVal === "Navigator") {
      if (props.item["AppName"] === "wsc-pc-vis") {
        secondary = secondary.map(getNavigatorList);
      }
    } else {
      secondary = [secondary];
    }
    var reg = new RegExp(userInput, "g");
    // 点击复制
    var handleSearchCardClick = function handleSearchCardClick(_ref2) {
      var content = _ref2.content,
          keyVal = _ref2.keyVal;

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
    return React.createElement(
      Box,
      null,
      React.createElement(
        Typography,
        { variant: "h6", color: "textPrimary" },
        title
      ),
      React.createElement(
        Box,
        { display: "flex", alignItems: "center" },
        React.createElement(
          Typography,
          { variant: "body1", color: "textSecondary" },
          secondary.map(function (item, index) {
            return React.createElement("div", {
              dangerouslySetInnerHTML: {
                __html: item.replace(reg, "<span class=\"user-input\">" + userInput + "</span>")
              },
              key: index
            });
          })
        ),
        React.createElement(
          Box,
          { ml: "auto" },
          React.createElement(
            Tooltip,
            {
              title: isCopy ? "已复制！" : "复制到剪切板",
              placement: "top"
            },
            React.createElement(
              Button,
              {
                variant: "outlined",
                color: "primary",
                onClick: function onClick() {
                  return handleSearchCardClick({ content: secondary, keyVal: keyVal });
                },
                onMouseOut: function onMouseOut() {
                  return setIsCopy(false);
                }
              },
              "\u590D\u5236"
            )
          )
        )
      )
    );
  };
  return React.createElement(
    Card,
    { className: "mb-6" },
    Object.entries(listItemRange).map(function (_ref3) {
      var _ref4 = _slicedToArray(_ref3, 2),
          key = _ref4[0],
          value = _ref4[1];

      return React.createElement(
        Box,
        { px: 2, py: 1, key: key },
        React.createElement(ListItemRender, { keyVal: key, title: value })
      );
    })
  );
};
// 防抖
var doing = null;
var LikeButton = function LikeButton() {
  var _React$useState3 = React.useState(1),
      _React$useState4 = _slicedToArray(_React$useState3, 2),
      searchAltitude = _React$useState4[0],
      setSearchAltitude = _React$useState4[1];

  var _React$useState5 = React.useState(false),
      _React$useState6 = _slicedToArray(_React$useState5, 2),
      isRandomBgImg = _React$useState6[0],
      setIsRandomBgImg = _React$useState6[1];

  var _React$useState7 = React.useState([]),
      _React$useState8 = _slicedToArray(_React$useState7, 2),
      searchList = _React$useState8[0],
      setSearchList = _React$useState8[1];

  var _React$useState9 = React.useState(""),
      _React$useState10 = _slicedToArray(_React$useState9, 2),
      userInput = _React$useState10[0],
      setUserInput = _React$useState10[1];

  // 设置是否展示随机背景图片


  var handleSetIsRandomBgImg = function handleSetIsRandomBgImg(isSet) {
    localStorage.setItem("isRandomBgImg", +isSet);
    setIsRandomBgImg(isSet);
  };

  // 获取搜索内容
  var searchAction = function searchAction(userInput) {
    return new Promise(function (resolve) {
      fetch("/getSearchResult?searchContent=" + encodeURIComponent(userInput)).then(function (response) {
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
    if (val.indexOf(".json") === -1 && val.indexOf("com.youzan") !== -1 && val.indexOf("#") == -1) {
      var lastDot = val.lastIndexOf(".");
      val = val.substring(0, lastDot) + "#" + val.substring(lastDot + 1);
    }
    if (doing) {
      clearTimeout(doing);
    }
    if (val) {
      setUserInput(val);
      doing = setTimeout(function () {
        searchAction(val);
      }, 500);
    }
  };

  React.useEffect(function () {
    var isRandomBgImg = localStorage.getItem("isRandomBgImg");
    setIsRandomBgImg(!(isRandomBgImg === "0"));
    // searchAction("edu/course-product/list-page.jso");
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
            ),
            React.createElement(
              Box,
              { fontSize: 12, pt: 1, textAlign: "center" },
              "\u6709\u95EE\u9898@\u7C73\u4E5D(\u9A6C\u7076\u52C7)"
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
            ),
            React.createElement(
              Box,
              { fontSize: 12, pt: 1 },
              "json\u63A5\u53E3\u793A\u4F8B\uFF1Av4/vis/edu/course-product/list-page.json"
            ),
            React.createElement(
              Box,
              { fontSize: 12, pt: 1 },
              "java\u63A5\u53E3\u793A\u4F8B\uFF1Acom.youzan.owl.pc.api.courseitem.offlinecourse.PcCourseFacade#findPageByCondition"
            )
          )
        )
      ),
      React.createElement(
        "div",
        { className: "list" },
        searchList.map(function (item, index) {
          return React.createElement(SearchCard, { item: item, key: index, userInput: userInput });
        })
      )
    )
  );
};

var domContainer = document.querySelector("#root");
ReactDOM.render(React.createElement(LikeButton, null), domContainer);