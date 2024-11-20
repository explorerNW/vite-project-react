# 使用官方的Node.js基础镜像
ARG NODE_VERSION=20.16.0
FROM node:${NODE_VERSION}-alpine as build-stage

# 设置工作目录
WORKDIR /app

# 复制package.json和package-lock.json到工作目录
COPY package*.json ./

# 安装依赖
# RUN yarn install
# Create a stage for building the application.

# Download additional development dependencies before building, as some projects require
# "devDependencies" to be installed to build. If you don't need this, remove this step.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=yarn.lock,target=yarn.lock \
    --mount=type=cache,target=/root/.yarn \
    yarn install --frozen-lockfile

# Download additional development dependencies before building, as some projects require
# "devDependencies" to be installed to build. If you don't need this, remove this step.
RUN --mount=type=bind,source=package.json,target=package.json \
--mount=type=bind,source=yarn.lock,target=yarn.lock \
--mount=type=cache,target=/root/.yarn \
yarn install --frozen-lockfile

# 复制整个项目到工作目录
COPY . .

# 构建React应用
RUN yarn run build

# 使用Nginx作为生产环境的基础镜像
FROM nginx:alpine

# 复制构建好的文件到Nginx的html目录
COPY --from=build-stage /app/dist /usr/share/nginx/html

# 暴露端口
EXPOSE 80

# 启动Nginx
CMD ["nginx", "-g", "daemon off;"]

