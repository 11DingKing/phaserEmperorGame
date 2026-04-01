class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloadScene' });
    }

    preload() {
        // 背景图片
        this.load.image('menu_bg', 'assets/menu_bg.png');
        this.load.image('throne_room', 'assets/throne_room.png');
        this.load.image('harem_bg', 'assets/harem_bg.png');
        this.load.image('battle_bg', 'assets/battle_bg.png');

        // 人物精灵
        this.load.image('emperor', 'assets/emperor.png');
        this.load.image('queen', 'assets/queen.png');
        this.load.image('consort', 'assets/consort.png');
        this.load.image('minister', 'assets/minister.png');

        // 进度条
        const bar = this.add.graphics();
        this.load.on('progress', (val) => {
            bar.clear();
            bar.fillStyle(0xFFD700, 1);
            bar.fillRect(200, 280, 400 * val, 30);
            bar.lineStyle(2, 0xffffff);
            bar.strokeRect(200, 280, 400, 30);
        });

        this.add.text(400, 250, '加载中...', {
            font: '24px Arial', fill: '#ffffff'
        }).setOrigin(0.5);

        // 生成纯色纹理占位（按钮等UI元素）
        const g = this.make.graphics({ x: 0, y: 0, add: false });

        g.fillStyle(0x3e3e3e, 1);
        g.fillRoundedRect(0, 0, 220, 55, 12);
        g.generateTexture('btnBg', 220, 55);

        g.clear();
        g.fillStyle(0x2d6a4f, 1);
        g.fillRoundedRect(0, 0, 220, 55, 12);
        g.generateTexture('btnGreen', 220, 55);

        g.clear();
        g.fillStyle(0x7b2d2d, 1);
        g.fillRoundedRect(0, 0, 220, 55, 12);
        g.generateTexture('btnRed', 220, 55);

        g.clear();
        g.fillStyle(0x2d5a8a, 1);
        g.fillRoundedRect(0, 0, 120, 45, 10);
        g.generateTexture('btnBlue', 120, 45);

        g.clear();
        g.fillStyle(0x000000, 0.75);
        g.fillRoundedRect(0, 0, 650, 230, 14);
        g.generateTexture('dialogBg', 650, 230);

        g.clear();
        g.fillStyle(0x000000, 0.65);
        g.fillRect(0, 0, 800, 55);
        g.generateTexture('hudBg', 800, 55);

        g.destroy();
    }

    create() {
        this.scene.start('MenuScene');
    }
}
