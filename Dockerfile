# # # 使用官方的Node.js基础镜像
ARG NODE_VERSION=20.16.0
FROM node:${NODE_VERSION}-alpine as build-stage

# 设置工作目录
WORKDIR /app

# 将当前目录的内容复制到工作目录中
COPY . /app

# 安装依赖
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=pnpm-lock.yaml,target=pnpm-lock.yaml \
    --mount=type=cache,target=/root/.pnpm \
    pnpm install --frozen-lockfile



# 构建项目
RUN pnpm run build

# 使用Nginx作为生产环境的基础镜像
FROM nginx:alpine

# 移除默认的 Nginx 配置文件（如果需要）
RUN rm /etc/nginx/conf.d/default.conf

# 将本地的 Nginx 配置文件复制到容器中
COPY nginx.conf /etc/nginx/conf.d/

# 复制构建好的文件到Nginx的html目录
COPY --from=build-stage /app/dist /usr/share/nginx/html

RUN mkdir -p /usr/share/nginx/secret
COPY --from=build-stage /app/secret/www.me.explorernw.top.pem /usr/share/nginx/secret
COPY --from=build-stage /app/secret/www.me.explorernw.top.key /usr/share/nginx/secret

# 使用caddy作为生产环境的基础镜像
# FROM caddy:latest
# COPY --from=build-stage /app/dist /root/www
# 移除默认的 caddy 配置文件
# RUN rm /etc/caddy/Caddyfile
# COPY Caddyfile /etc/caddy/Caddyfile
# CMD ["caddy", "run", "--adapter", "caddyfile", "--config", "/etc/caddy/Caddyfile", "--log", "stdout", "--quiet"]

# 使Nginx容器对外暴露80端口
EXPOSE 80

# 使用 Nginx 或其他服务来提供静态文件
CMD ["nginx", "-g", "daemon off;"]
