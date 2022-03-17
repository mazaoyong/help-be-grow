import axios from 'axios'

const isDev = process.env.NODE_ENV !== 'production'

axios.defaults.baseURL = isDev ? '/api' : '/'

// 获取更新日志
export const apiGetUpdateLogAction = () => {
  return axios.get("/getUpdateLog")
}

// 接口搜索
export const apiGetSearchResult = (userInput: string) => {
  return axios.get("/getSearchResult?searchContent=" + encodeURIComponent(userInput.trim()))
}

// 获取项目配置
export const apiGetProjectConfig = () => {
  return axios.get("/getProjectConfig")
}

// 获取组件使用数据
export const apiGetUsageData = () => {
  return axios.get("/getUsageData")
}

export const apiGetComponentFiles = ({ targetName, component }: { targetName: string, component: string }) => {
  return axios.get('/findComponent', {
    params: {
      name: targetName,
      component,
    },
  });
}
