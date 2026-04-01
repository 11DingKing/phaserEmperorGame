# 🏯 皇帝模拟器 (Emperor Simulator)

基于 **Phaser.js** 开发的 Web 端回合制皇帝模拟器游戏。身处九五之尊，你需要在治理朝政、管理后宫与发动战争之间寻得平衡，守住江山社稷。

---

## 🎮 游戏特色

- **朝堂奏章**：审批大臣上奏，每次决策都将影响国库、民心与军力
- **后宫系统**：与皇后、贵妃互动，提升好感度以获得加成
- **战争征伐**：选择征讨目标，军力充足则凯旋而归，反之则损兵折将
- **随机事件**：旱灾、流寇、金矿……突发事件随时改变局势
- **回合推进**：每月结算，时间在决策中流逝，见证王朝的兴衰
- **多种结局**：国库亏空、民怨沸腾、皇帝驾崩，任一条件触发游戏终结

---

## 🖥️ 技术栈

| 技术 | 说明 |
|------|------|
| [Phaser 3](https://phaser.io/) (v3.60.0) | 游戏引擎，通过 CDN 引入 |
| 原生 HTML / CSS / JavaScript | 无额外框架依赖 |
| Nginx (Docker) | 静态文件托管 |

---

## 📁 项目结构

```
label-03245/
├── Dockerfile              # Docker 构建文件
├── docker-compose.yml      # Docker Compose 配置
├── README.md               # 项目说明
└── src/                    # 所有前端源文件
    ├── index.html          # 游戏入口页面
    ├── styles.css          # 全局样式
    ├── assets/             # 像素风格图片资源
    │   ├── menu_bg.png     # 主菜单背景
    │   ├── throne_room.png # 朝堂背景
    │   ├── harem_bg.png    # 后宫背景
    │   ├── battle_bg.png   # 战争背景
    │   ├── emperor.png     # 皇帝角色
    │   ├── queen.png       # 皇后角色
    │   ├── consort.png     # 贵妃角色
    │   └── minister.png    # 大臣角色
    └── js/
        ├── main.js         # Phaser 游戏实例入口
        ├── GameApp.js      # 全局游戏数据（单例）
        ├── EventSystem.js  # 事件与奏折数据配置
        └── scenes/
            ├── PreloadScene.js  # 资源预加载场景
            ├── MenuScene.js     # 主菜单场景
            ├── CourtScene.js    # 朝堂场景
            ├── HaremScene.js    # 后宫场景
            ├── WarfareScene.js  # 战争场景
            ├── HUDScene.js      # 状态栏 HUD 场景
            └── GameOverScene.js # 游戏结局场景
```

---

## 🚀 How to Run

### 开发模式

```bash
cd src
```

由于本项目为纯静态页面，可直接用本地 HTTP 服务器托管：

```bash
# Python 3
python -m http.server 5173

# 或 Node.js
npx serve .
```

开发访问地址：[http://localhost:5173](http://localhost:5173)

### Docker 部署

```bash
# 构建并启动容器
docker-compose up -d --build
```

容器访问地址：[http://localhost:8081](http://localhost:8081)

```bash
# 停止并移除容器
docker-compose down
```

---

## ⚙️ Services

| 服务名 | 构建来源 | 容器端口 | 主机端口 | 说明 |
|--------|----------|----------|----------|------|
| `web` | `Dockerfile`（基于 `nginx:alpine`）| `80` | `8081` | 纯前端静态服务；Nginx 配置 SPA 路由回退至 `index.html`，避免刷新 404 |

---

## 🔑 测试账号

无（本项目为纯前端单机游戏，无需注册或登录）

---

## 题目内容
用Phaser.js 开发皇帝游戏，游戏画面800*600，需要ASSETS加载图片 实现场景切换 及互动

## 📊 游戏数值说明

游戏中需要管理以下核心资源：

| 资源 | 初始值 | 说明 |
|------|--------|------|
| 💰 国库 | 500 | 低于 0 触发亡国 |
| 👥 民心 | 50 | 低于 0 触发起义 |
| ⚔️ 军力 | 50 | 影响战争胜败 |
| 👑 威信 | 20 | 战争奖励影响 |
| ❤️ 龙体 | 100 | 低于等于 0 触发驾崩 |

---

## 🔚 游戏结局

| 触发条件 | 结局 |
|----------|------|
| 国库 < 0 | 军队哗变，被叛军拉下皇位 |
| 民心 < 0 | 民怨沸腾，农民起义，天庭倾覆 |
| 龙体 ≤ 0 | 积劳成疾，驾崩于寝宫 |

---

## 📜 许可证

本项目仅供学习交流使用。
