package main

import (
	"encoding/json"
	"fmt"
	"html/template"
	"net/http"
	"os"
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

func templates(w http.ResponseWriter, r *http.Request) {
	//解析模板
	t, _ := template.ParseFiles("./client/dist/index.html")
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
		filePtr, err := os.Open(rootPath + "/client/data/" + appName + ".json")
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
		if userInput != "" && (strings.Contains(searchItem.JsonApi, userInput) || strings.Contains(searchItem.JavaApi, userInput)) && len(searchResult) < 10 {
			searchResult = append(searchResult, searchItem)
		}
	}
	result.Data = searchResult
	//向客户端返回JSON数据
	bytes, _ := json.Marshal(result)
	fmt.Fprint(w, string(bytes))
}

func main() {
	fs := http.FileServer(http.Dir("client/dist"))
	http.Handle("/public/", http.StripPrefix("/public/", fs))
	http.HandleFunc("/", templates)
	http.HandleFunc("/getSearchResult", getSearchResult)
	http.ListenAndServe(":8301", nil)
}
