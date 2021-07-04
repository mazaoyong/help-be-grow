## 启动服务
server:
	go run app/web.go

## 本地调试 3000端口
dev:
	cd client && yarn dev

## 网站打包
build:
	cd client && yarn build