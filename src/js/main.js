// 兜底定义 Logger，防止浏览器报错
if (typeof Logger === "undefined") {
  window.Logger = {
    log: console.log.bind(console),
    error: console.error.bind(console),
    warn: console.warn.bind(console),
  };
}

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: "game-container",
  backgroundColor: "#333333",
  scene: [
    PreloadScene,
    MenuScene,
    HUDScene,
    CourtScene,
    HaremScene,
    WarfareScene,
    GameOverScene,
  ],
};

// 启动游戏实例
const game = new Phaser.Game(config);
