## 安装依赖
install:
	npm i && cd client && npm i

## 清除依赖
clean-lock:
	rm -rf package-lock.json node_modules client/node_modules client/package-lock.json

## 启动服务
qa-server:
	npm run server

## 本地调试 3000端口
dev:
	cd client && yarn dev

## 网站打包
build:
	cd client && yarn build

## 测试一个接口的解析过程
search:
	node bin/dev.js --mode=${mode}