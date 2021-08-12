## 启动服务
server:
	npm run server && npm run server-dev

## 本地调试 3000端口
dev:
	cd client && yarn dev

## 网站打包
build:
	cd client && yarn build

## 生成数据
gen-data:
	node app/index.js