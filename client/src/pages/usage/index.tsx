import React, { useState, useEffect, ChangeEvent } from "react";
import { ThemeProvider, Select, MenuItem, TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import * as echarts from "echarts";
import { createTheme } from "@material-ui/core/styles";
import { apiGetUsageData } from "../../api";
import "./style.scss";

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

const componentsType = {
  VIS_UI: {
    name: "vis-ui",
    value: "@youzan/vis-ui",
  },
  EBIZ_COMPONENTS: {
    name: "ebiz-components",
    value: "@youzan/ebiz-components",
  },
  LOCAL: {
    name: "本地根目录组件",
    value: "localComponents",
  },
};

interface IData {
  time: string;
  data: IComponentData[];
}

interface IComponentData {
  name: string;
  key: string;
  value: any;
}

interface IChartsData {
  time: string;
  value: any;
}

const Usage = () => {
  const [componentSelect, setComponentSelect] = useState<string>(
    componentsType.VIS_UI.value
  );
  const [projectSelect, setProjectSelect] = useState<string>("wsc-h5-vis");
  const [allComponents, setAllComponents] = useState<string[]>([]);
  const [originData, setOriginData] = useState<IData[]>([]);
  const [projectList, setProjectList] = useState<string[]>([]);
  const [filterSelect, setFilterSelect] = useState<string[]>([]);

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const { allComponents } = getProjectAndComponentList(originData);
    const formatData: IChartsData[] = formatUsageData(originData);
    initEcharts(formatData, allComponents);
  }, [originData, componentSelect, projectSelect, filterSelect]);

  // 获取表单数据
  const getData = () => {
    apiGetUsageData().then((res) => {
      const data: IData[] = res?.data?.data || [];
      setOriginData(data);
    });
  };

  const getProjectAndComponentList = (data: IData[]) => {
    const projectList: string[] = [];
    const componentList: string[] = [];
    data.forEach((item) => {
      item.data
        .map((it) => {
          if (!projectList.includes(it.name)) {
            projectList.push(it.name);
          }
          return it;
        })
        .filter((it) => it.key === componentSelect && it.name === projectSelect)
        .forEach((it) => {
          if (!projectList.includes(it.name)) {
            projectList.push(it.name);
          }
          Object.keys(it.value).forEach((v) => {
            if (!componentList.includes(v)) {
              componentList.push(v);
            }
          });
        });
    });
    setProjectList(projectList);
    setAllComponents(componentList);
    return {
      allComponents: componentList,
    };
  };

  const initEcharts = (data: IChartsData[], components: string[]) => {
    const chartDom = document.getElementById("main");
    const myChart = echarts.init(chartDom as HTMLElement);
    const componentList = filterSelect?.length ? filterSelect : components;

    const series = componentList.map((item) => ({
      name: item,
      type: "line",
      smooth: true,
      data: data.map((it) => it.value[item] || 0),
      endLabel: {
        show: true,
        formatter: function () {
          return item;
        },
      },
    }));

    const option = {
      tooltip: {
        trigger: "axis",
        className: "echarts-com-tooltip",
        confine: true,
        enterable: true,
      },
      legend: {
        data: componentList,
        show: false,
      },
      grid: {
        containLabel: true,
      },
      toolbox: {
        feature: {
          saveAsImage: {},
        },
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: data.map((item) => item.time),
      },
      yAxis: {
        type: "value",
      },
      series,
    };

    option && myChart.setOption(option, true);
  };

  const formatUsageData = (data: IData[]) => {
    const filterCondition = (it: IComponentData) =>
      it.key === componentSelect && it.name === projectSelect;

    const filterData = data.map((item) => ({
      time: item.time,
      value: item.data.find(filterCondition)?.value || {},
    }));

    return filterData;
  };

  const onComponentSelectChange = (e: ChangeEvent<any>) => {
    setComponentSelect(e.target.value);
    setFilterSelect([]);
  };

  const onProjectSelectChange = (e: ChangeEvent<any>) => {
    setProjectSelect(e.target.value);
    setFilterSelect([]);
  };
  return (
    <ThemeProvider theme={theme}>
      <div className="echarts-select">
        <h1 className="echarts-title">组件库使用数情况</h1>
        <p>组件库：</p>
        <Select value={componentSelect} onChange={onComponentSelectChange}>
          {Object.values(componentsType).map((item) => (
            <MenuItem value={item.value} key={item.name}>
              {item.name}
            </MenuItem>
          ))}
        </Select>
        <p>仓库：</p>
        <Select value={projectSelect} onChange={onProjectSelectChange}>
          {projectList.map((item) => (
            <MenuItem value={item} key={item}>
              {item}
            </MenuItem>
          ))}
        </Select>
        <p>筛选组件：</p>
        <Autocomplete
          options={allComponents}
          onChange={(_, value) => setFilterSelect(value)}
          multiple
          getOptionLabel={(option) => option}
          style={{ width: 300 }}
          renderInput={(params) => (
            <TextField {...params} label="请输入" variant="outlined" />
          )}
        />
      </div>
      <div id="main" className="echarts-div"></div>
    </ThemeProvider>
  );
};
export default Usage;
