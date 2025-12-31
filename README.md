<div align="center">

# 🖼️ CU-Wallhaven

**基于 Wallhaven API 的高颜值壁纸应用**

_探索和收藏世界上最精美的壁纸 - 一次开发，全端运行_

[![GitHub license](https://img.shields.io/badge/license-CC%20BY--NC%204.0-green?style=flat-square)](./LICENSE)
[![uni-app x](https://img.shields.io/badge/uni--app%20x-blue?style=flat-square)](https://uniapp.dcloud.io/)
[![Cool Unix](https://img.shields.io/badge/Cool%20Unix-8.0-orange?style=flat-square)](https://unix.cool-js.com/)

</div>

## ✨ 功能特性

- 🌊 **瀑布流浏览** - 精美的双列瀑布流布局，沉浸式壁纸浏览体验
- 🔍 **智能搜索** - 支持关键词搜索，快速找到心仪壁纸
- 🎚️ **多维筛选** - 按分类、内容分级、排序方式、色调等多种维度筛选
- 📁 **收藏管理** - 查看和管理 Wallhaven 账户收藏夹
- ❤️ **本地收藏** - 无需登录即可收藏喜爱的壁纸
- 📥 **一键下载** - 支持将壁纸保存到本地相册
- 🌓 **深色模式** - 完美适配明/暗主题切换
- 📱 **跨端运行** - 支持 Android、iOS(开发中)、H5、鸿蒙(开发中)等多平台

## 📱 应用截图

<table>
  <tr>
    <td align="center" width="33%">
      <strong>首页瀑布流</strong><br/>
      浏览海量精美壁纸
    </td>
    <td align="center" width="33%">
      <strong>筛选与搜索</strong><br/>
      智能筛选快速定位
    </td>
    <td align="center" width="33%">
      <strong>壁纸详情</strong><br/>
      高清预览一键下载
    </td>
  </tr>
</table>

## 🚀 快速开始

### 环境准备

- [HBuilderX](https://www.dcloud.io/hbuilderx.html) 4.0+
- Node.js 18+
- pnpm (推荐) 或 npm

### 安装依赖

```bash
pnpm install
```

### 开发运行

```bash
# 运行到 H5
pnpm dev:h5

# 运行到 Android（需连接设备或模拟器）
# 在 HBuilderX 中选择 运行 -> 运行到手机或模拟器
```

### 配置 API Key（可选）

若需使用 Wallhaven NSFW 内容或访问个人收藏夹，请在应用设置中配置 API Key：

1. 前往 [Wallhaven 账户设置](https://wallhaven.cc/settings/account) 获取 API Key
2. 打开应用 -> 侧边栏 -> 设置 -> 填入 API Key

## 🛠️ 技术栈

<div align="center">

### 核心框架

![uni-app x](https://img.shields.io/badge/uni--app%20x-2CA5E0?style=for-the-badge&logo=vue.js&logoColor=white)
![Vue 3](https://img.shields.io/badge/Vue%203-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

### UI 框架

![Cool Unix](https://img.shields.io/badge/Cool%20Unix-FF6B6B?style=for-the-badge&logo=componentstore&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

### 开发工具

![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![pnpm](https://img.shields.io/badge/pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white)

</div>

## 📂 项目结构

```
cu-wallhaven/
├── pages/
│   └── wallhaven/          # 壁纸模块页面
│       ├── home/           # 首页 - 瀑布流 & 搜索
│       ├── detail/         # 壁纸详情
│       ├── collections/    # 收藏夹列表
│       ├── collection-detail/  # 收藏夹详情
│       ├── favorites/      # 本地收藏
│       ├── settings/       # 设置
│       └── about/          # 关于
├── types/
│   └── wallhaven.ts        # Wallhaven API 类型定义
├── config/                 # 环境配置
├── cool/                   # Cool Unix 核心库
├── uni_modules/            # uni-app 插件
```

## 🔗 相关链接

- [Wallhaven](https://wallhaven.cc/) - 壁纸数据来源
- [Wallhaven API 文档](https://wallhaven.cc/help/api)
- [uni-app x 文档](https://doc.dcloud.net.cn/uni-app-x/)
- [Cool Unix 文档](https://unix.cool-js.com/)

## 📄 开源协议

本项目基于 [CC BY-NC 4.0 协议](LICENSE) 开源，允许非商业用途的自由使用、修改和分发。

## 🙏 致谢

- [Wallhaven](https://wallhaven.cc/) 提供优质壁纸资源
- [Cool Unix](https://github.com/cool-team-official/cool-unix) 提供强大的开发脚手架
</CodeContent>
