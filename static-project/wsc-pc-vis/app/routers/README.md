# routers 说明 
目录结构：严格参照controller 目录内README.md说明进行目录结构划分

url设置规范：
  - json接口：
    - 总体规则： `v4/vis/业务域/(可选)二级目录/controller名字小写/dubbo方法名（驼峰）.json`
    - 举例controller:  course/ContentController.js dubbo: com.youzan.owl.pc.api.onlinecourse.ContentFacade.getByAlias
    - url: `v4/vis/course/content/getByAlias.json`
    - 举例controller:  course/ContentEditController.js dubbo: com.youzan.owl.pc.api.onlinecourse.ContentFacade.getByAlias
    - url: `v4/vis/course/content-edit/getByAlias.json`
  - html：
    - 总体规则： `v4/vis/业务域/(可选)二级目录/controller名字小写`
    - 举例controller:  course/xxx/CourseEditController.js
    - url: `v4/vis/course/xxx/course-edit`
    - 注意：一个controller里面只提供1个返回页面的方法，如需要返回多个需考虑拆分controller文件
  
TODO：增加commit检查