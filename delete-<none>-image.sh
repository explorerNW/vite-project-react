#docker compose down
#docker compose up --build -d

# 获取所有悬挂镜像的ID
IMAGE_IDS=$(docker images -f "dangling=true" -q)

# 检查是否有悬挂镜像需要删除
if [ -z "$IMAGE_IDS" ]; then
  echo "No dangling images found to remove."
else
  # 删除悬挂镜像
  docker rmi $(docker ps -a -q -f "status=exited")
  echo "Dangling images removed successfully."
fi

yes y | docker system prune -a

# 清理无用的容器（退出的容器）

docker ps -aq --filter "status=exited" | xargs docker rm

# 清理无用的镜像（无任何容器关联）

docker images -q --filter "dangling=true" | xargs docker rmi

# 清理未被使用的数据卷

docker volume ls -qf dangling=true | xargs docker volume rm

# 清理网络资源

docker network ls | grep "bridge" | awk '/ / { print $1 }' | xargs docker network rm