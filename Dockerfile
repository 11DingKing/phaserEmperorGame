FROM nginx:alpine

# 将游戏静态文件复制到 nginx 默认目录
COPY src/ /usr/share/nginx/html

# 暴露 80 端口
EXPOSE 80
