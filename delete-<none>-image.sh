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