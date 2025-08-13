# EAP Mall Web

EAP Mall Web 是一套面向企业级的电商与拍卖一体化前端项目，基于 Vue 3 + Vite + Vant 4 开发，提供现代化的移动端商城体验。

## 特性

- 📱 响应式设计，同时支持移动端和PC端
- 🛒 完整的电商功能：商品浏览、购物车、订单管理
- 🎯 拍卖功能集成（开发中）
- 🎨 基于 Vant 4 的现代化 UI 组件
- ⚡ Vite 构建，快速开发体验
- 🔧 TypeScript 支持

## 技术栈

- **前端框架**: Vue 3.2.45
- **构建工具**: Vite 4.0.0
- **UI 组件**: Vant 4.0.9
- **路由管理**: Vue Router 4.1.6
- **状态管理**: Pinia 2.0.28
- **HTTP 客户端**: Axios 1.2.6
- **样式语言**: Less 4.1.3

## 快速开始

### 环境要求

- Node.js >= 16
- pnpm >= 8.6.0 (推荐) 或 npm

### 安装依赖

```bash
# 推荐使用 pnpm
pnpm install

# 或使用 npm
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建部署

```bash
# 开发环境构建
npm run build:dev

# 生产环境构建
npm run build:prod
```

## 配置说明

项目使用环境变量进行配置，支持不同环境的配置文件：

- `.env` - 通用配置
- `.env.development` - 开发环境配置
- `.env.production` - 生产环境配置

主要配置项：

```bash
# API基础路径
VITE_BASE_URL='http://localhost:48080'
VITE_API_URL='/app-api'

# 是否启用租户
VITE_APP_TENANT_ENABLE=false

# 是否启用验证码
VITE_APP_CAPTCHA_ENABLE=true
```

## 项目结构

```
src/
├── api/                # API接口定义
├── assets/             # 静态资源
├── common/             # 公共工具和样式
├── components/         # 公共组件
├── router/             # 路由配置
├── service/            # 业务服务层
├── stores/             # Pinia状态管理
├── utils/              # 工具函数
├── views/              # 页面组件
└── main.js             # 应用入口
```

## 功能模块

- 🏠 **首页** - 商品轮播、分类导航、推荐商品
- 📦 **商品** - 商品列表、搜索、详情展示
- 🛒 **购物车** - 商品管理、批量操作
- 📝 **订单** - 下单、支付、订单管理
- 👤 **用户** - 登录注册、个人中心
- 🎯 **拍卖** - 拍卖功能（开发中）

## 开发规范

- 组件命名使用 PascalCase
- 文件名使用 kebab-case
- 使用 ESLint + Prettier 进行代码格式化
- 提交信息遵循约定式提交规范

## 兼容性

- 现代浏览器 (Chrome, Firefox, Safari, Edge)
- 移动端浏览器
- 微信内置浏览器

## 许可证

本项目基于 GPL-3.0 许可证开源。

## 贡献

欢迎提交 Issue 和 Pull Request 来帮助改进项目。
