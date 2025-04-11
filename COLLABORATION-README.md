# Umo Editor 协同编辑功能启动指南

本文档简要介绍如何启动 Umo Editor 的协同编辑功能。

## 启动步骤

### 1. 启动后端 WebSocket 服务器

```bash
# 进入服务器目录
cd collaboration-server

# 启动服务器
node server.js
```

服务器将在 `ws://localhost:1234` 上运行，您应该会看到以下输出：

```bash
WebSocket server is running on port 1234
Open http://localhost:9000 in your browser to test collaboration
```

### 2. 启动前端开发服务器

在另一个终端窗口中：

```bash
# 回到项目根目录
cd ..

# 启动开发服务器
npm run dev
```

### 3. 测试协同编辑功能

1. 打开两个浏览器窗口（或不同的浏览器）
2. 在每个窗口中访问 `http://localhost:9000`
3. 现在您可以在两个窗口中同时编辑文档，并看到实时同步效果
