## 安装依赖
install:
	yarn && make gen-data

## 生成数据#
gen-data:
	node bin/genData.js

## 清除依赖
clean-lock:
	rm -rf package-lock.json node_modules client/node_modules client/package-lock.json

## 启动服务
qa-server:
	node bin/dev

## 本地调试 3000端口
dev:
	cd client && yarn dev

## 网站打包
build:
	cd client && yarn build

## 测试一个接口的解析过程
search:
	node bin/search.js --mode=${mode}

pre:install
	cd client && yarn build