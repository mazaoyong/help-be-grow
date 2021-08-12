package main

import (
	"encoding/json"
	"fmt"
	"html/template"
	"net/http"
	"os"
	"os/exec"
	"strings"
)

type BaseJsonBean struct {
	Code    int         `json:"code"`
	Data    interface{} `json:"data"`
	Message string      `json:"message"`
}

type SearchResultItem struct {
	AppName    string   // 应用名称
	JavaApi    string   // java接口
	JsonApi    string   // json接口
	Navigator  []string // 页面导航
	Router     string   // 路由文件
	Controller string   // 控制层文件
	Service    string   // model层文件
}

// 更新日志
type TUpdateLog struct {
	Spend         int    `json:spend`         // 花费的时间
	UpdateEndTime int    `json:updateEndTime` // 更新结束时间
	Status        int    `json:status`        // 更新状态，1表示成功，-1标记失败，2是更新异常
	Info          string `json:info`          // 更新成功或者失败返回的信息
}

func templates(w http.ResponseWriter, r *http.Request) {
	//解析模板
	t, _ := template.ParseFiles("./app/dist/index.html")
	data := map[string]interface{}{}
	//渲染模板
	t.Execute(w, data)

}

// 获取数据
func getSearchData() []SearchResultItem {
	appNameArr := []string{"wsc-pc-vis", "wsc-h5-vis"}
	result := []SearchResultItem{}
	rootPath, _ := os.Getwd()
	for _, appName := range appNameArr {
		filePtr, err := os.Open(rootPath + "/app/data/" + appName + ".json")
		if err != nil {
			fmt.Println("Open file failed [Err:%s]", err.Error())
			return nil
		}
		defer filePtr.Close()

		var searchData []SearchResultItem

		// 创建json解码器
		decoder := json.NewDecoder(filePtr)
		err = decoder.Decode(&searchData)
		if err != nil {
			fmt.Println("Decoder failed", err.Error())
		} else {
			result = append(result, searchData...)
		}
	}
	return result
}

func getSearchResult(w http.ResponseWriter, r *http.Request) {
	result := BaseJsonBean{}
	result.Code = 200
	result.Message = "request:ok"
	query := r.URL.Query()
	searchResult := []SearchResultItem{}
	// 获取要搜素的内容
	userInput := query.Get("searchContent")
	searchData := getSearchData()
	// fmt.Println(userInput)
	// 搜索符合条件的
	for _, searchItem := range searchData {
		if userInput != "" && (strings.Contains(searchItem.JsonApi, userInput) || strings.Contains(searchItem.JavaApi, userInput) || strings.Contains(searchItem.JavaApi, strings.ReplaceAll(userInput, "#", "."))) && len(searchResult) < 10 {
			searchResult = append(searchResult, searchItem)
		}
	}
	result.Data = searchResult
	//向客户端返回JSON数据
	bytes, _ := json.Marshal(result)
	fmt.Fprint(w, string(bytes))
}

func getUpdateLog(w http.ResponseWriter, r *http.Request) {
	rootPath, _ := os.Getwd()
	updateLogPath := rootPath + "/app/update_log.json"
	filePtr, err := os.Open(updateLogPath)
	if err != nil {
		fmt.Println("Open file failed [Err:%s]", err.Error())
	}
	var updateLogList []TUpdateLog
	defer filePtr.Close()
	// 创建json解码器
	decoder := json.NewDecoder(filePtr)
	err = decoder.Decode(&updateLogList)
	if err != nil {
		fmt.Println("Decoder failed", err.Error())
	} else {
		result := BaseJsonBean{}
		result.Code = 200
		result.Message = "request:ok"
		result.Data = updateLogList[len(updateLogList)-1]
		//向客户端返回JSON数据
		bytes, _ := json.Marshal(result)
		fmt.Fprint(w, string(bytes))
	}
}

func main() {
	cmd, err := exec.Command("/bin/bash", "-c", "./init.sh").Output()
	if err != nil {
		fmt.Println("Execute Command failed:" + err.Error())
		return
	}
	fmt.Println(string(cmd))
	fs := http.FileServer(http.Dir("client/build"))
	http.Handle("/", fs)
	// 搜索接口
	http.HandleFunc("/getSearchResult", getSearchResult)
	// 更新日志
	http.HandleFunc("/getUpdateLog", getUpdateLog)
	fmt.Println("启动服务：http://127.0.0.1:8301")
	http.ListenAndServe(":8301", nil)
}
