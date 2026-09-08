# HYZK-GEO · GitHub Pages 部署说明

本说明提供后续操作步骤；当前未创建 GitHub 仓库、上传文件或发布。

发布前，先用两份 SOP 核对 2.0 升级项、确认咨询二维码及对外服务表述。详见《内容核对记录》。

## 方式一：网页上传成品，操作最少

1. 在本地项目目录运行 `npm run build`，取得 `dist` 文件夹。
2. 登录 GitHub，创建名为 `HYZK-GEO` 的仓库。使用免费账户部署公开站点时，可选择 Public。
3. 进入新仓库，选择上传文件，将 **dist 内部的文件和 assets 文件夹** 上传到仓库根目录。不要将 dist 文件夹本身嵌套上传。根目录必须直接看到 `index.html`。
4. 完成提交后，进入 **Settings → Pages**。
5. 在 **Build and deployment → Source** 选择 **Deploy from a branch**；分支选 `main`，目录选 `/ (root)`，保存。
6. 等待部署完成，点击 Pages 显示的网址。若使用 `xuxy0307` 账户且仓库叫 `HYZK-GEO`，默认地址应为 `https://xuxy0307.github.io/HYZK-GEO/`。这只是预期地址，不代表当前已上线。
7. 后续修改，在本地重新构建，将更新后的 dist 内容再次上传。

此方式只上传成品，GitHub 仓库里没有本地开发脚本。务必保留本地源码项目。

## 方式二：上传源码，以 GitHub Actions 自动发布

适合希望保留版本历史、后续持续维护的情况。

1. 创建空仓库 `HYZK-GEO`。
2. 使用 GitHub Desktop 的“添加现有仓库 / 创建仓库”功能，将本地 HYZK-GEO 项目作为独立仓库管理，提交并发布到该空仓库；默认发布分支为 `main`。如果更熟悉 Git 命令，也可按 GitHub 新仓库页面提供的命令上传。
3. 确认源码中的 `.github/workflows/deploy.yml` 已一起上传。`.gitignore` 会排除 dist。
4. 在 **Settings → Pages → Source** 选择 **GitHub Actions**。
5. 进入 **Actions → Deploy HYZK-GEO to GitHub Pages**，必要时点击 **Run workflow**。之后每次推送 main 会自动构建发布。
6. 完成后在 Pages 或 workflow 的 github-pages 环境里查看网址。

本项目无需 npm install。构建脚本只使用 Node.js 内置模块。工作流上传 dist，网页不会包含 docs 与 scripts；但如果源码仓库为公开仓库，docs 本身仍然能在 GitHub 被查看，不要添加内部资料或客户数据。

不要同时为同一仓库混用上述两种方式。方式一选择分支发布，方式二选择 GitHub Actions。

## 部署后验证

- 首页、Logo、二维码正常加载，手机菜单可展开。
- 章节导航、FAQ 与查看二维码链接正常。
- 使用 `/HYZK-GEO/` 路径打开，而不是用户主页根路径。
- 若页面 404，先检查 index.html 是否位于发布根目录、Pages 来源是否正确，以及 Actions 是否完成。

官方依据（2026-09-07 核对）：
https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
