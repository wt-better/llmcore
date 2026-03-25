#!/bin/bash

# llmcore.cn 阿里云 ECS 手动部署脚本
# 使用方法: ./deploy.sh

set -e

echo "🚀 开始部署 llmcore.cn..."

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查是否以 root 运行
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}请使用 root 权限运行: sudo ./deploy.sh${NC}"
    exit 1
fi

# 1. 更新系统
echo -e "${YELLOW}[1/8] 更新系统...${NC}"
apt update && apt upgrade -y

# 2. 安装 Node.js 20
echo -e "${YELLOW}[2/8] 安装 Node.js...${NC}"
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt install -y nodejs
fi
node -v
npm -v

# 3. 安装 PM2
echo -e "${YELLOW}[3/8] 安装 PM2...${NC}"
npm install -g pm2

# 4. 安装 Nginx
echo -e "${YELLOW}[4/8] 安装 Nginx...${NC}"
apt install -y nginx

# 5. 创建应用目录
echo -e "${YELLOW}[5/8] 创建应用目录...${NC}"
APP_DIR="/opt/llmcore"
mkdir -p $APP_DIR
echo "应用目录: $APP_DIR"

# 6. 复制项目文件（假设在本地已打包）
echo -e "${YELLOW}[6/8] 准备项目文件...${NC}"
echo "请确保项目文件已上传到 $APP_DIR"
echo "可以使用: scp -r . root@你的ECSIP:$APP_DIR"

# 7. 安装依赖
echo -e "${YELLOW}[7/8] 安装项目依赖...${NC}"
cd $APP_DIR
npm ci --production

# 8. 构建应用
echo -e "${YELLOW}[8/8] 构建应用...${NC}"
npm run build

echo -e "${GREEN}✅ 基础环境安装完成！${NC}"
echo ""
echo "下一步操作:"
echo "1. 配置环境变量: cp .env.example .env.local && nano .env.local"
echo "2. 启动服务: pm2 start ecosystem.config.js"
echo "3. 配置 Nginx: cp nginx-site.conf /etc/nginx/sites-available/llmcore"
echo "4. 启用站点: ln -s /etc/nginx/sites-available/llmcore /etc/nginx/sites-enabled/"
echo "5. 测试配置: nginx -t && systemctl restart nginx"
