# Uni AI Hub

University High School AI Club 出品的一站式枢纽：**Information（行业前沿信息）/ Courses（学习与培训）/ Internship（实习与内推）**。
技术栈：Next.js（App Router）+ Tailwind CSS，网站本身支持 PWA（手机可"添加到主屏幕"，体验接近原生 App），免费部署在 Vercel 即可上线。

## 三大板块怎么做到"实时"

| 板块 | 实时方式 | 代码位置 |
|---|---|---|
| Information | 自动抓取 arXiv 论文 RSS、NVIDIA/Microsoft/OpenAI/Hugging Face 等官方博客、TechCrunch/VentureBeat 等科技媒体、Hacker News，按主题打标签，每 30 分钟刷新 | `src/lib/feeds.js`、`src/lib/information.js` |
| Internship | 自动同步学生社区在 GitHub 上每天维护的真实实习数据库（SimplifyJobs 等），每 6 小时刷新；内推信息/简历模板/Timeline 为社团整理的示例内容 | `src/lib/internships.js`、`src/data/internshipResources.json` |
| Courses | 默认是社团整理的精选示例（大学课程 + 企业自学课程 + 学生竞赛），可选接入 Google Sheet 做到非技术成员也能实时更新 | `src/data/courses.json`、`src/lib/courses.js` |

> 大学课程目录、企业培训项目本身更新很慢，没有官方 RSS，所以这两块暂时不做"自动抓取"，而是给了一个无代码更新方案（见下）。

## 关于"App"

目前的实现是一个**响应式网站 + PWA**：手机浏览器打开后选择"添加到主屏幕"，图标、启动方式都和原生 App 一样，且只需要维护一套代码。
如果将来真的需要上架 App Store / Google Play 的原生 App，可以在这套 Next.js 代码基础上用 [Capacitor](https://capacitorjs.com/) 包一层原生壳，无需重写。

## 项目结构

```
src/
  app/
    page.js                首页
    information/page.js    Information 板块页面
    courses/page.js        Courses 板块页面
    internship/page.js     Internship 板块页面
  components/               UI 组件
  lib/                       数据抓取与处理逻辑
  data/                      精选示例内容（JSON 种子数据）
public/
  manifest.json             PWA 配置
  sw.js                      Service Worker（离线缓存应用外壳）
  icon-192.png / icon-512.png  App 图标
```
