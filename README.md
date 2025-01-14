# 拉屎模拟器 (Toilet Rush Simulator)

一个有趣的 HTML5 游戏，玩家需要控制角色寻找厕所并完成任务。游戏支持PC端和移动端，提供多种角色和场景选择。

## 游戏特点

- 多角色选择：
  - 普通人：标准速度和耐力
  - 急迫者：较快速度，较低耐力
  - 老司机：高速度，高耐力

- 多场景选择：
  - 家：简单难度，环境熟悉
  - 办公室：中等难度，多个厕所和障碍物
  - 公园：困难难度，随机移动的游客增加难度

- 游戏机制：
  - 60秒倒计时
  - 急迫度系统
  - 力度控制系统
  - 分数系统
  - 状态提示

## 操作说明

### PC端操作
- ↑/W：向上移动
- ↓/S：向下移动
- ←/A：向左移动
- →/D：向右移动
- 空格键：控制力度
- ESC：暂停游戏

### 移动端操作
- 虚拟摇杆：控制移动
- 动作按钮：控制力度
  - 短按：直接完成
  - 长按：精确控制力度

## 游戏目标

1. 在时间耗尽前找到厕所
2. 控制力度到合适位置完成任务
3. 获得高分：
   - 完美控制：+100分
   - 良好控制：+50分
   - 一般控制：+20分
   - 时间奖励：剩余时间 × 2
   - 急迫度惩罚：当前急迫度 × 0.5

## 技术特性

- 纯原生JavaScript实现
- 响应式设计
- 移动端优化
  - 虚拟摇杆控制
  - 触摸事件优化
  - 横屏提示
  - 自适应UI

## 项目结构

```
├── index.html          # 主页面
├── css/
│   ├── style.css      # 主样式
│   └── mobile.css     # 移动端样式
├── js/
│   ├── assets.js      # 资源管理
│   ├── character.js   # 角色类
│   ├── scene.js       # 场景类
│   ├── game.js        # 游戏主逻辑
│   └── mobile-controller.js  # 移动端控制器
└── README.md          # 项目说明
```

## 开发环境设置

1. 克隆仓库：
```bash
git clone [仓库地址]
```

2. 使用本地服务器运行（推荐使用 Live Server 或 http-server）：
```bash
# 使用 npm 安装 http-server
npm install -g http-server

# 在项目目录下运行
http-server
```

3. 在浏览器中访问 `http://localhost:8080`

## 浏览器兼容性

- Chrome (推荐)
- Firefox
- Safari
- Edge
- 移动端浏览器

## 注意事项

1. 移动端请使用竖屏模式以获得最佳游戏体验
2. 确保浏览器启用了 JavaScript
3. 建议使用现代浏览器运行游戏

## 未来计划

- [ ] 添加更多角色
- [ ] 添加更多场景
- [ ] 增加成就系统
- [ ] 添加排行榜
- [ ] 增加音效和背景音乐
- [ ] 支持多语言

## 贡献

欢迎提交 Issue 和 Pull Request 来帮助改进游戏。

## 许可证

MIT License 