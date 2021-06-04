package main

import (
	"encoding/json"
	"fmt"
	"io/fs"
	"io/ioutil"
	"os"
	"path/filepath"
	"regexp"
	"strings"

	"gopkg.in/mgo.v2"
)

type SearchDirPath struct {
	serviceDirPath   string
	controlleDirPath string
	routerDirPath    string
	clientDirPath    []string
}

type ServiceFile struct {
	path   string
	name   string
	action string
}

type ControllerFile struct {
	path       string
	name       string
	routerList []Router
}

type Router struct {
	controllerPosition string
	controllerAction   string
}

type AsyncItem struct {
	funcName      string
	serviceName   string
	serviceAction string
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

var searchDirPath SearchDirPath
var userInput string
var appName string

func main() {
	// userInput = "com.youzan.owl.pc.api.student.StudentAggregateFacade#findStuLessonByLessonNoV2"
	// userInput = "com.youzan.owl.edu.api.course.CourseProductFacade.getCourseList"
	// userInput = "com.youzan.owl.pc.api.signin.SignInFacade#findSignInRecordsV3"

	// userInput = "/v4/vis/edu/schedule/detail/students.json"
	// userInput = "/v4/vis/edu/reserve/list.json"
	// userInput = "/edu/clue/findAll.json"
	userInput = "/wscvis/getFooter.json"

	return
	appNameArr := []string{"wsc-pc-vis", "wsc-h5-vis"}
	for _, itemAppName := range appNameArr {
		appName = itemAppName
		searchDirPath = getSearchDirPath(appName)

		totalRouterList := getTotalRouterList()
		searchResultList := []SearchResultItem{}
		for _, item := range totalRouterList {
			userInput = item
			// fmt.Println("router:", item)
			// fmt.Println(111, searchByJsonApi())
			searchResultList = append(searchResultList, searchByJsonApi()...)
		}
		writeFile(searchResultList)
	}

	if isJavaApi() {
		searchByJavaApi()
	}
	if isJsonApi() {
		// fmt.Println(111, searchByJsonApi())
		// writeFile(searchByJsonApi())
	}
}

// 将生成的数据写入json文件
func writeFile(searchResultList []SearchResultItem) {
	// 创建文件
	filePtr, err := os.Create("./client/data/" + appName + ".json")
	if err != nil {
		fmt.Println("Create file failed", err.Error())
		return
	}
	defer filePtr.Close()
	// 创建Json编码器
	// encoder := json.NewEncoder(filePtr)
	// err = encoder.Encode(searchResultList)
	// if err != nil {
	// 	fmt.Println("Encoder failed", err.Error())
	// } else {
	// 	fmt.Println("Encoder success")
	// }
	// 带JSON缩进格式写文件
	jsonData, err := json.MarshalIndent(searchResultList, "", "  ")
	if err != nil {
		fmt.Println("Encoder failed", err.Error())
	}
	filePtr.Write(jsonData)
}

// 插入数据库
func insertMongoDb(searchRsult []SearchResultItem) {
	//连接本地mongodb服务
	url := "mongodb://localhost"
	session, err := mgo.Dial(url)
	if err != nil {
		fmt.Println(err)
	}
	defer session.Close()
	//打开默认数据库test
	session.SetMode(mgo.Monotonic, true)
	client := session.DB("searchYourMonther").C("apiNavigator")
	for _, insertItem := range searchRsult {
		client.Insert(&insertItem)
	}
}

func getTotalRouterList() []string {
	result := []string{}
	filepath.Walk(searchDirPath.routerDirPath, func(path string, info fs.FileInfo, err error) error {
		if isJsFile(info.Name()) || isTsFile(info.Name()) {
			routerFileStr := getFileStr(path)
			getConstRegexp := regexp.MustCompile(`const (\w*) = (.*)`)
			totalConstResult := getConstRegexp.FindAllStringSubmatch(routerFileStr, -1)
			totalConstMap := getTotalConstMap(totalConstResult)
			for key, value := range totalConstMap {
				routerFileStr = strings.ReplaceAll(routerFileStr, key, value)
			}
			jsonFileToArr := strings.Split(routerFileStr, ",")
			for _, item := range jsonFileToArr {
				if strings.Contains(item, ".json") {
					result = append(result, getFreshJsonApi(item))
				}
			}
		}
		return nil
	})
	return result
}

// 获取应用名称
func getAppName(rootPath string) string {
	appNamMap := map[string]string{
		"wsc-pc-vis": "教育B端",
		"wsc-h5-vis": "教育C端",
	}
	return appNamMap[rootPath]
}

// json接口查找对应的java接口
func searchByJsonApi() []SearchResultItem {
	searchResultList := []SearchResultItem{}
	// 1.先找到对应的router文件
	jsonApiDivision := strings.LastIndex(userInput, "/")
	jsonApiPrefix := userInput[:jsonApiDivision]
	jsonApiAction := userInput[jsonApiDivision+1:]
	totalController := []Router{}
	filepath.Walk(searchDirPath.routerDirPath, func(path string, info os.FileInfo, err error) error {
		routerFileStr := getFileStr(path)
		if isJsFile(info.Name()) || isTsFile(info.Name()) && isExist(routerFileStr, []string{jsonApiPrefix, jsonApiAction}) {
			// 先把全部变量提取出来，然后替换所有的变量
			getConstRegexp := regexp.MustCompile(`const (\w*) = (.*)`)
			totalConstResult := getConstRegexp.FindAllStringSubmatch(routerFileStr, -1)
			totalConstMap := getTotalConstMap(totalConstResult)
			for key, value := range totalConstMap {
				routerFileStr = strings.ReplaceAll(routerFileStr, key, value)
			}
			jsonFileToArr := strings.Split(routerFileStr, ",")
			for rsIndex, randomStr := range jsonFileToArr {
				if rsIndex == 0 {

				} else if isExist(randomStr, []string{jsonApiPrefix, jsonApiAction}) {
					for _, controllerActionStr := range getArrVarList(jsonFileToArr[rsIndex+2:]) {
						controllerPosition := getFreshConstValue(jsonFileToArr[rsIndex+1])
						totalController = append(totalController, Router{
							controllerPosition: controllerPosition,
							controllerAction:   controllerActionStr,
						})
						searchResultList = append(searchResultList, SearchResultItem{
							AppName:    appName,
							Router:     cleanPathPrefix(path),
							JsonApi:    userInput,
							Controller: "/app/controllers/" + strings.ReplaceAll(controllerPosition, ".", "/") + ".js" + "#" + controllerActionStr,
						})
					}
				}
			}
		}
		return nil
	})
	searchServiceFileArr := []ServiceFile{}
	// 2.在controller文件里找到service函数
	for _, controllerFileItem := range totalController {
		filePath := searchDirPath.controlleDirPath + "/" + strings.ReplaceAll(controllerFileItem.controllerPosition, ".", "/") + ".js"
		fileStr := getFileStr(filePath)
		// fmt.Println(333, filePath)
		asyncRegexp := regexp.MustCompile(`async ` + controllerFileItem.controllerAction + `(.|\n)*?await new ((\w)*)[\(|)\w]+\.((\w)*)`)
		asyncStr := asyncRegexp.FindStringSubmatch(fileStr)
		headConstMap := getFileHeadConstMap(fileStr)
		if len(asyncStr) > 1 {
			searchServiceFileArr = append(searchServiceFileArr, ServiceFile{
				path:   searchDirPath.serviceDirPath + "/" + headConstMap[asyncStr[2]] + ".js",
				action: asyncStr[4],
			})
		}
	}
	// 3.找到java接口地址
	for index, searchServiceItem := range searchServiceFileArr {
		serviceFileStr := getFileStr(searchServiceItem.path)
		javaApiPrefixRegexp := regexp.MustCompile(`return '(com\.youzan(\.|\w)+)'`)
		javaApiPrefixResult := javaApiPrefixRegexp.FindStringSubmatch(serviceFileStr)
		javaApiPrefix := ""
		if len(javaApiPrefixResult) > 0 {
			javaApiPrefix = javaApiPrefixResult[1]
		}
		javaActionRegexp := regexp.MustCompile(`async ` + searchServiceItem.action + `(.|\n)*?this\.invoke\(['"](\w+)['"](.|\n)*?\n\s{2}}`)
		// 有可能会找不到接口
		javaActionResult := javaActionRegexp.FindStringSubmatch(serviceFileStr)
		searchResultList[index].Service = cleanPathPrefix(searchServiceItem.path)
		if len(javaActionResult) > 2 {
			searchResultList[index].JavaApi = javaApiPrefix + "#" + javaActionResult[2]
			searchResultList[index].Service = searchResultList[index].Service + "#" + javaActionResult[2]
		}
	}

	for index, _ := range searchResultList {
		searchResultList[index].Navigator = searchPagesByJsonApi(userInput)
	}
	// fmt.Println(123456, searchResultList)
	return searchResultList
}

// 清掉前缀
func cleanPathPrefix(path string) string {
	result := strings.ReplaceAll(path, "static-project/wsc-pc-vis", "")
	result = strings.ReplaceAll(result, "static-project/wsc-h5-vis", "")
	// cleanCondit := []string{"/client", "/client-h5", "/app"}
	// for _, condit := range cleanCondit {
	// 	result = strings.ReplaceAll(path, "static-project/wsc-pc-vis"+condit, "")
	// 	result = strings.ReplaceAll(result, "static-project/wsc-h5-vis"+condit, "")
	// }
	// fmt.Println(1234, path, result)
	return result
}

// 通过json接口ws-pc-vis查找页面
func searchPagesByJsonApi(jsonApi string) []string {
	jsonApiArr := strings.Split(jsonApi, "/")
	resultPathArr := []string{}
	for _, clientPath := range searchDirPath.clientDirPath {
		if strings.Contains(clientPath, "client-h5") {
			resultPathArr = append(resultPathArr, searchWscH5VisPages(jsonApiJoin(jsonApiArr))...)
		} else {
			filepath.Walk(clientPath+"/pages", func(path string, info fs.FileInfo, err error) error {
				if (isJsFile(info.Name()) || isTsFile(info.Name())) && strings.Contains(path, "/pages/biz") == false {
					clientFileStr := getFileStr(path)
					specialConditionRegexp := regexp.MustCompile(`[^\w]\/` + jsonApiArr[len(jsonApiArr)-1])
					resultPathItem := strings.ReplaceAll(path, "static-project/wsc-pc-vis/client", "")
					resultPathItem = strings.ReplaceAll(resultPathItem, "static-project/wsc-pc-vis/client-h5", "")
					if jsonApiJoin(jsonApiArr) != "" && strings.Contains(clientFileStr, jsonApiJoin(jsonApiArr)) { // 第一种搜索方式
						resultPathArr = append(resultPathArr, resultPathItem)
					} else if specialConditionRegexp.FindString(clientFileStr) != "" { // 第二种
						if getClientSearchResultSpecial(path) {
							resultPathArr = append(resultPathArr, resultPathItem)
						}
					}
				}
				return nil
			})
		}
	}
	for index, item := range resultPathArr {
		resultPathArr[index] = cleanPathPrefix(item)
	}
	return resultPathArr
}

// 通过json接口ws-client-h5-vis查找页面
func searchWscH5VisPages(shortJsonApi string) []string {
	result := []string{}
	apiAction := []string{}
	apiBlockRegexp := regexp.MustCompile(`  (\w+)(.|\n)+?\n  \}`)
	clientH5Path := "static-project/wsc-pc-vis/client-h5"
	filepath.Walk(clientH5Path+"/pages-api", func(path string, info fs.FileInfo, err error) error {
		fileStr := getFileStr(path)
		for _, item := range apiBlockRegexp.FindAllStringSubmatch(fileStr, -1) {
			if strings.Contains(item[0], shortJsonApi) {
				apiAction = append(apiAction, item[1])
			}
		}
		return nil
	})
	for _, apiItem := range apiAction {
		filepath.Walk(clientH5Path+"/pages", func(path string, info fs.FileInfo, err error) error {
			fileStr := getFileStr(path)
			if strings.Contains(fileStr, "."+apiItem) {
				result = append(result, strings.ReplaceAll(path, "static-project/wsc-pc-vis/client-h5", ""))
			}
			return nil
		})
	}
	return result
}

// 针对接口比较特殊的封装方式，比如edu-admin/appointment/api/reserve.js文件里对接口的封装
func getClientSearchResultSpecial(jsonApiMainPath string) bool {
	jsonApiArr := strings.Split(userInput, "/")
	jsonApiPrefix := jsonApiJoin(jsonApiArr[3 : len(jsonApiArr)-1])
	searchSpecRegexp := regexp.MustCompile(strings.ReplaceAll(jsonApiPrefix, "/", `\/`) + `[^\/]`)
	result := false
	for _, clientPath := range searchDirPath.clientDirPath {
		filepath.Walk(clientPath, func(path string, info fs.FileInfo, err error) error {
			if result {
				return filepath.SkipDir
			}
			if isJsFile(info.Name()) || isTsFile(info.Name()) {
				clientFileStr := getFileStr(path)
				if searchSpecRegexp.FindString(clientFileStr) != "" {
					sameCount := 0
					comparePathArr := strings.Split(jsonApiMainPath, "/")
					for index, pathName := range strings.Split(path, "/") {
						if pathName == comparePathArr[index] {
							sameCount++
						} else {
							break
						}
					}
					if sameCount >= 5 {
						result = true
					}
				}
			}
			return nil
		})
	}
	return result
}

// 数组以"/"连接成字符串
func jsonApiJoin(stringArr []string) string {
	result := ""
	for _, strItem := range stringArr {
		if strItem != "v4" && strItem != "vis" && strItem != "" {
			result += "/" + strItem
		}
	}
	return result
}

// 获取文件所有头部const变量的值，转为map数据
func getFileHeadConstMap(fileStr string) map[string]string {
	fileHeadConstRegexp := regexp.MustCompile(`const (\w+) = require[('".\/]+([\w\/-]+)`)
	fileHeadConstArr := fileHeadConstRegexp.FindAllStringSubmatch(fileStr, -1)
	if len(fileHeadConstArr) == 0 {
		fileHeadConstRegexp = regexp.MustCompile(`import (\w+) from [('".\/]+([\w\/-]+)`)
		fileHeadConstArr = fileHeadConstRegexp.FindAllStringSubmatch(fileStr, -1)
	}
	result := map[string]string{}
	for _, item := range fileHeadConstArr {
		result[item[1]] = strings.Replace(item[2], "services/", "", 1)
	}
	return result
}

// 文件内容以async分组
func getFileAsyncMap(fileStr string) []AsyncItem {
	asyncMapRegexp := regexp.MustCompile(`\s{2}async (\w+)(.|\n)*?\n\s{2}\}`)
	asyncMap := asyncMapRegexp.FindAllStringSubmatch(fileStr, -1)
	serviceInfoRegexp := regexp.MustCompile(`await new (\w+).*\.(\w*)`)
	result := []AsyncItem{}
	for _, item := range asyncMap {
		serviceInfo := serviceInfoRegexp.FindStringSubmatch(item[0])
		if len(serviceInfo) > 0 {
			result = append(result, AsyncItem{
				funcName:      item[1],
				serviceName:   serviceInfo[1],
				serviceAction: serviceInfo[2],
			})
		}
	}
	return result
}

// 判断数组中是否含有变量
func getArrVarList(randomStrArr []string) []string {
	isExistVarRegexp := regexp.MustCompile(`[a-z]\w*`)
	requesetMethodRegexp := regexp.MustCompile("[A-Z]{3,4}")
	result := []string{}
	resultStr := randomStrArr[0]
	if isExistVarRegexp.MatchString(resultStr) && !requesetMethodRegexp.MatchString(resultStr) {
		if len(randomStrArr) > 1 {
			result = append(getArrVarList(randomStrArr[1:]), isExistVarRegexp.FindString(resultStr))
		} else {
			result = append(result, isExistVarRegexp.FindString(resultStr))
		}
	}
	return result
}

// java接口寻找页面
func searchByJavaApi() {
	// 1.先查找接口所在的service层
	serviceFileList := getJavaApiServicePosition()
	// 2.查找对应的控制器controller
	controllerFileList := getControllerByService(serviceFileList)
	// 3.查找对应的json接口路由映射
	getRouterPositionByController(controllerFileList)
}

func getJavaApiServicePosition() []ServiceFile {
	serviceList := []ServiceFile{}
	divisionRegexp := regexp.MustCompile("[.#]")
	divisionArr := divisionRegexp.FindAllStringIndex(userInput, -1)
	divisionSub := divisionArr[len(divisionArr)-1]
	serviceName := userInput[:divisionSub[0]]
	serviceFunc := userInput[divisionSub[1]:]
	filepath.Walk(searchDirPath.serviceDirPath, func(path string, info os.FileInfo, err error) error {
		serviceFileStr := getFileStr(path)
		if isJsFile(info.Name()) && isExist(serviceFileStr, []string{serviceName, serviceFunc}) {
			serviceFilePath := path[strings.Index(path, "services") : len(path)-3]
			for _, serviceAction := range getServiceAction(serviceFileStr, serviceFunc) {
				item := ServiceFile{
					path:   serviceFilePath,
					name:   info.Name()[:len(info.Name())-3],
					action: serviceAction,
				}
				serviceList = append(serviceList, item)
			}
		}
		return nil
	})
	return serviceList
}

func getControllerByService(serviceFileList []ServiceFile) []Router {
	totalRouterList := []Router{}
	controllers := []ControllerFile{}
	for _, serviceItem := range serviceFileList {
		condition, _ := regexp.Compile(`const (\w*).*` + serviceItem.path)
		filepath.Walk(searchDirPath.controlleDirPath, func(path string, info os.FileInfo, err error) error {
			controllerFileStr := getFileStr(path)
			if isJsFile(info.Name()) && isExist(controllerFileStr, []string{serviceItem.path}) {
				controllerFilePath := path[strings.Index(path, "controllers") : len(path)-3]
				routerList := []Router{}
				newServiceName := condition.FindStringSubmatch(controllerFileStr)[1]
				controllerActionList := getControllerAction(controllerFileStr, []string{newServiceName, serviceItem.action})
				for _, action := range controllerActionList {
					singleRouter := Router{
						controllerPosition: strings.ReplaceAll(controllerFilePath[12:], "/", "."),
						controllerAction:   action,
					}
					routerList = append(routerList, singleRouter)
					totalRouterList = append(totalRouterList, singleRouter)
				}
				if len(routerList) > 0 {
					controllers = append(controllers, ControllerFile{
						path:       controllerFilePath,
						name:       info.Name()[:len(info.Name())-3],
						routerList: routerList,
					})
				}
			}
			return nil
		})
	}
	return totalRouterList
}

func getRouterPositionByController(controllerFileList []Router) {
	totalJsonAPiList := []string{}
	for _, routerItem := range controllerFileList {
		filepath.Walk(searchDirPath.routerDirPath, func(path string, info os.FileInfo, err error) error {
			routerFileStr := getFileStr(path)
			if isJsFile(info.Name()) && isExist(routerFileStr, []string{routerItem.controllerPosition, routerItem.controllerAction}) {
				// 先把全部变量提取出来，然后替换所有的变量
				getConstRegexp := regexp.MustCompile(`const (\w*) = (.*)`)
				totalConstResult := getConstRegexp.FindAllStringSubmatch(routerFileStr, -1)
				totalConstMap := getTotalConstMap(totalConstResult)
				for key, value := range totalConstMap {
					routerFileStr = strings.ReplaceAll(routerFileStr, key, value)
				}
				jsonFileToArr := strings.Split(routerFileStr, ",")
				for rsIndex, randomStr := range jsonFileToArr {
					if rsIndex == 0 {

					} else if strings.Contains(randomStr, routerItem.controllerAction) && strings.Contains(jsonFileToArr[rsIndex-1], routerItem.controllerPosition) {
						jsonApiRandomStr := jsonFileToArr[rsIndex-2]
						totalJsonAPiList = append(totalJsonAPiList, getFreshJsonApi(jsonApiRandomStr))
					}
				}
			}
			return nil
		})
	}
}

// 将router正则获取到的二维数组装成map格式
func getTotalConstMap(totalConstResult [][]string) map[string]string {
	totalConstMap := map[string]string{}
	for _, constItemArr := range totalConstResult {
		totalConstMap[constItemArr[1]] = getFreshConstValue(constItemArr[2])
	}
	return totalConstMap
}

// json接口脏字符串做清洗
func getFreshJsonApi(jsonApi string) string {
	freshJsonApiRegexp := regexp.MustCompile("/.*.json")
	result := freshJsonApiRegexp.FindString(jsonApi)
	return getFreshConstValue(result)
}

// 变量字符串清洗
func getFreshConstValue(constValue string) string {
	result := strings.ReplaceAll(constValue, "'", "")
	result = strings.ReplaceAll(result, ";", "")
	result = strings.ReplaceAll(result, "+", "")
	result = strings.ReplaceAll(result, "$", "")
	result = strings.ReplaceAll(result, "{", "")
	result = strings.ReplaceAll(result, "}", "")
	result = strings.ReplaceAll(result, " ", "")
	result = strings.ReplaceAll(result, "\n", "")
	return result
}

// 通过service里面的方法查找controller的方法
func getControllerAction(fileStr string, keyList []string) []string {
	controllerBlockRegexp, _ := regexp.Compile(`async (\w+)(.|\n)+?(ctx.json|ctx.render)`)
	block := controllerBlockRegexp.FindAllStringSubmatch(fileStr, -1)
	result := []string{}
	for _, item := range block {
		if isExist(item[0], keyList) {
			result = append(result, item[1])
		}
	}
	return result
}

// 判断文件是否存在某组字符串
func isExist(fileStr string, keyList []string) bool {
	exist := true
	for _, key := range keyList {
		if !strings.Contains(fileStr, key) {
			exist = false
			break
		}
	}
	return exist
}

// 判断是否是js文件
func isJsFile(fileName string) bool {
	fileNamelength := len(fileName) - 3
	index := strings.Index(fileName, ".js")
	return (index != -1 && index == fileNamelength) || isTsFile(fileName)
}

// 判断是否是ts文件
func isTsFile(fileName string) bool {
	fileNamelength := len(fileName) - 3
	index := strings.Index(fileName, ".ts")
	return index != -1 && index == fileNamelength
}

// 返回文件字符串
func getFileStr(path string) string {
	file, err := ioutil.ReadFile(path)
	fileStr := string(file)
	// 文件目录返回空字符串
	if err != nil {
		file, err = os.ReadFile(strings.ReplaceAll(path, ".js", ".ts"))
		fileStr = string(file)
	}
	return fileStr
}

// 通过接口后缀来查找service的方法
func getServiceAction(fileStr, serviceFunc string) []string {
	actionRegexp := regexp.MustCompile(`async (\w*)(.|\n)*?return(.|\n)*?}`)
	searchResult := actionRegexp.FindAllStringSubmatch(fileStr, -1)
	resultArr := []string{}
	for _, item := range searchResult {
		if strings.Contains(item[0], serviceFunc) {
			resultArr = append(resultArr, item[1])
		}
	}
	return resultArr
}

// 判断是不是java接口
func isJavaApi() bool {
	return strings.Contains(userInput, "com.youzan")
}

// 判断是不是json接口
func isJsonApi() bool {
	return strings.Contains(userInput, ".json")
}

func getSearchDirPath(dirPathKey string) SearchDirPath {
	ROOT_PATH := "static-project"
	totalProjectPath := []string{"wsc-h5-vis", "wsc-pc-trade", "wsc-pc-vis"}
	dirPathMap := make(map[string]SearchDirPath)
	for _, projectPath := range totalProjectPath {
		rootPath := ROOT_PATH + "/" + projectPath
		clientDirPath := []string{rootPath + "/client"}
		if projectPath == "wsc-pc-vis" {
			clientDirPath = append(clientDirPath, rootPath+"/client-h5")
		}
		dirPathMap[projectPath] = SearchDirPath{
			serviceDirPath:   rootPath + "/app/services",
			controlleDirPath: rootPath + "/app/controllers",
			routerDirPath:    rootPath + "/app/routers",
			clientDirPath:    clientDirPath,
		}
	}
	return dirPathMap[dirPathKey]
}
