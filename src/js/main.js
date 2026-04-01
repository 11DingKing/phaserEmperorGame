const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    backgroundColor: '#333333',
    scene: [
        PreloadScene,
        MenuScene,
        HUDScene,
        CourtScene,
        HaremScene,
        WarfareScene,
        GameOverScene
    ]
};

// 启动游戏实例
const game = new Phaser.Game(config);
