package main

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"strings"
)

var rootPath string

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

type SearchYourMother struct {
	userInput string
}

// 判断是不是java接口
func (sym SearchYourMother) isJavaApi() bool {
	return strings.Contains(sym.userInput, "com.youzan")
}

// 判断是不是json接口
func (sym SearchYourMother) isJsonApi() bool {
	return strings.Contains(sym.userInput, ".json")
}

// 查找json接口
func (sym SearchYourMother) getSearchResult() []ServiceFile {
	serviceList := []ServiceFile{}
	controllers := []ControllerFile{}
	if !sym.isJavaApi() {
		return serviceList
	}
	apiName := sym.userInput
	divisionRegexp := regexp.MustCompile("[.#]")
	divisionArr := divisionRegexp.FindStringIndex(apiName)
	division := divisionArr[len(divisionArr)-1]
	serviceName := apiName[:division]
	serviceFunc := apiName[division+1:]
	// 1.先查找接口所在的service层
	filepath.Walk(rootPath+"/app/services", func(path string, info os.FileInfo, err error) error {
		serviceFileStr := getFileStr(path)
		if isJsFile(info.Name()) && isExist(serviceFileStr, []string{serviceName, serviceFunc}) {
			serviceFilePath := path[strings.Index(path, "services") : len(path)-3]
			item := ServiceFile{
				path:   serviceFilePath,
				name:   info.Name()[:len(info.Name())-3],
				action: getServiceAction(serviceFileStr, serviceFunc),
			}
			serviceList = append(serviceList, item)
		}
		return nil
	})
	totalRouterList := []Router{}

	// 2.查找对应的控制器controller
	for _, serviceItem := range serviceList {
		condition, _ := regexp.Compile("const ([A-Za-z]*).*" + serviceItem.path)
		filepath.Walk(rootPath+"/app/controllers", func(path string, info os.FileInfo, err error) error {
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

		// 3.查找对应的json接口路由映射
		totalJsonAPiList := []string{}
		for _, routerItem := range totalRouterList {
			filepath.Walk(rootPath+"/app/routers", func(path string, info os.FileInfo, err error) error {
				routerFileStr := getFileStr(path)
				if isJsFile(info.Name()) && isExist(routerFileStr, []string{routerItem.controllerPosition, routerItem.controllerAction}) {
					// 得判断controllerPath出现的次数，如果是一次就表示是变量，不然就是普通的字符串
					controllerPositionStr := routerItem.controllerPosition
					if strings.Count(routerFileStr, routerItem.controllerPosition) == 1 {
						controllerPositionRegexp := regexp.MustCompile("const ([A-Za-z]*) =.*" + routerItem.controllerPosition)
						controllerPositionSearchResult := controllerPositionRegexp.FindStringSubmatch(routerFileStr)
						if len(controllerPositionSearchResult) > 1 {
							controllerPositionStr = controllerPositionSearchResult[1]
						}
					}
					jsonFileToArr := strings.Split(routerFileStr, ",")
					for rsIndex, randomStr := range jsonFileToArr {
						if !strings.Contains(randomStr, ".json") && strings.Contains(randomStr, routerItem.controllerAction) && strings.Contains(jsonFileToArr[rsIndex-1], controllerPositionStr) {
							jsonApiRandomStr := jsonFileToArr[rsIndex-2]
							routerPrefixRegexp := regexp.MustCompile(`\${([A-Za-z]*)}`)
							routerPrefixSearchResult := routerPrefixRegexp.FindStringSubmatch(jsonApiRandomStr)
							if len(routerPrefixSearchResult) > 1 {
								routerPrefixVar := routerPrefixSearchResult[1]
								routerPrefixVarRegexp := regexp.MustCompile("const " + routerPrefixVar + " = (.*)")
								jsonApiRandomStr = strings.ReplaceAll(jsonApiRandomStr, "${"+routerPrefixVar+"}", routerPrefixVarRegexp.FindStringSubmatch(routerFileStr)[1])
							}
							totalJsonAPiList = append(totalJsonAPiList, getFreshJsonApi(jsonApiRandomStr))
						}
					}
				}
				return nil
			})
			fmt.Println(222, totalRouterList)
		}
		fmt.Println(333, totalJsonAPiList)
		for _, test := range totalJsonAPiList {
			fmt.Println(11, test)
		}
	}
	return serviceList
}

// 检索字符串在文件中的位置，没有就返回-1
func getPosition(path, searchContent string) int {
	file, err := os.ReadFile(path)
	if err != nil {
		fmt.Print(err)
	}
	strIndex := strings.Index(string(file), searchContent)
	return strIndex
}

// 判断是否是js文件
func isJsFile(fileName string) bool {
	fileNamelength := len(fileName) - 3
	index := strings.Index(fileName, ".js")
	return index != -1 && index == fileNamelength
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

// 返回文件字符串
func getFileStr(path string) string {
	file, err := os.ReadFile(path)
	// 文件目录返回空字符串
	if err != nil {
		return ""
	}
	return string(file)
}

// 通过接口后缀来查找service的方法
func getServiceAction(fileStr, serviceFunc string) string {
	actionRegexp, _ := regexp.Compile("async ([A-Za-z]*)(.|\n)*? return")
	searchResult := actionRegexp.FindAllStringSubmatch(fileStr, -1)
	result := ""
	for _, item := range searchResult {
		if strings.Contains(item[0], serviceFunc) {
			result = item[1]
			break
		}
	}
	return result
}

// 通过service里面的方法查找controller的方法
func getControllerAction(fileStr string, keyList []string) []string {
	controllerBlockRegexp, _ := regexp.Compile("async ([A-Za-z]+)(.|\n)+?(ctx.json|ctx.render)")
	block := controllerBlockRegexp.FindAllStringSubmatch(fileStr, -1)
	result := []string{}
	for _, item := range block {
		if isExist(item[0], keyList) {
			result = append(result, item[1])
		}
	}
	return result
}

// json接口脏字符串做清洗
func getFreshJsonApi(jsonApi string) string {
	freshJsonApiRegexp := regexp.MustCompile("/.*.json")
	result := freshJsonApiRegexp.FindString(jsonApi)
	result = strings.ReplaceAll(result, "'", "")
	result = strings.ReplaceAll(result, ";", "")
	return result
}

type Config struct {
	WSC_PC_VIS           string
	WSC_PC_VIS_CLIENT    string
	WSC_PC_VIS_CLIENT_H5 string
	WSC_H5_VIS           string
}

func getConfig() Config {
	var config Config
	pwd, _ := os.Getwd()

	fileConfig, err := os.Open(pwd + "/config.json")
	if err != nil {
		fmt.Println("创建文件失败，err=", err)
	}
	defer fileConfig.Close()
	jsonDecoder := json.NewDecoder(fileConfig)
	err = jsonDecoder.Decode(&config)
	if err != nil {
		fmt.Println("编码失败，err=", err)
	}
	return config
}

func main() {
	dirRootPath := getConfig()
	rootPath = dirRootPath.WSC_PC_VIS
	sym := SearchYourMother{"com.youzan.owl.pc.api.signin.SignInFacade.findSignInRecordsV3"}
	fmt.Println(sym.getSearchResult())
}

// func main() {
// 	// userInput := "com.youzan.ump.manage.api.specific.ReferralService.endActivity"
// 	// userInput := "com.youzan.owl.pc.api.lesson.LessonFacade.findAppointmentList"
// 	userInput := "com.youzan.owl.edu.api.course.CourseProductFacade.getCourseList"
// 	// userInput := "com.youzan.owl.pc.api.offlineenrollment.OfflineEnrollmentGatherFacade.findGiveAwayByOrderNo"
// 	seachStruct := SearchYourMother{userInput}
// 	seachStruct.getSearchResult()
// }
