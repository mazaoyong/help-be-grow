package main

import (
	"fmt"

	"gopkg.in/mgo.v2"
)

type SearchResultItem struct {
	AppName    string   // 应用名称
	JavaApi    string   // java接口
	JsonApi    string   // json接口
	Navigator  []string // 页面导航
	Router     string   // 路由文件
	Controller string   // 控制层文件
	Service    string   // model层文件
}

func main() {
	//连接本地mongodb服务
	url := "mongodb://localhost"
	session, err := mgo.Dial(url)
	if err != nil {
		panic(err)
	}
	defer session.Close()
	//打开默认数据库test
	session.SetMode(mgo.Monotonic, true)
	client := session.DB("searchYourMonther").C("apiNavigator")
	// client.Insert(&SearchResultItem{
	// 	AppName:    "wsc-pc-vis",
	// 	JsonApi:    "/v4/vis/edu/schedule/detail/students.json",
	// 	JavaApi:    "com.youzan.owl.pc.api.signin.SignInFacade#findSignInRecordsV3",
	// 	Navigator:  []string{"edu-admin", "appointment"},
	// 	Router:     "/app/router/test.js",
	// 	Controller: "/app/controller/test.js",
	// 	Service:    "/app/service/test.js",
	// })

	searchResult := []SearchResultItem{}
	err = client.Find(nil).All(&searchResult)
	fmt.Println(111, searchResult)
}
