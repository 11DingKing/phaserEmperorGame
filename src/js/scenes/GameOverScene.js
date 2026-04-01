class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    init(data) {
        this._reason = data.reason || '国运衰竭，天庭覆灭...';
    }

    create() {
        // 背景用战场图淡红色
        this.add.image(400, 300, 'battle_bg').setDisplaySize(800, 600);
        this.add.rectangle(400, 300, 800, 600, 0x3a0000, 0.75);

        // 皇帝立绘（倒置/溅染效果用tint）
        const emp = this.add.image(400, 230, 'emperor').setDisplaySize(200, 360).setTint(0x880000).setAlpha(0.7);

        // 动态标题
        const title = this.add.text(400, 80, '☠  驾崩  ☠', {
            font: 'bold 52px serif', fill: '#ff3333',
            stroke: '#000', strokeThickness: 5
        }).setOrigin(0.5);

        this.tweens.add({
            targets: title, scaleX: 1.05, scaleY: 1.05,
            yoyo: true, repeat: -1, duration: 800, ease: 'Sine.easeInOut'
        });

        // 死因
        this.add.text(400, 420, this._reason, {
            font: '24px Arial', fill: '#ffe8b0',
            wordWrap: { width: 620 }, align: 'center'
        }).setOrigin(0.5);

        // 统计信息
        const d = window.GameData;
        this.add.text(400, 480, `在位 ${d.year} 年 ${d.month} 月 · 威望: ${d.prestige}`, {
            font: '18px Arial', fill: '#aaaaaa'
        }).setOrigin(0.5);

        // 重开按钮
        const btnBg = this.add.graphics();
        btnBg.fillStyle(0x660000, 0.9);
        btnBg.fillRoundedRect(270, 525, 260, 55, 12);

        this.add.text(400, 553, '🔁  重整旗鼓，再战天下', {
            font: 'bold 20px Arial', fill: '#FFD700'
        }).setOrigin(0.5);

        btnBg.setInteractive(new Phaser.Geom.Rectangle(270, 525, 260, 55), Phaser.Geom.Rectangle.Contains);
        btnBg.on('pointerover', () => { btnBg.clear(); btnBg.fillStyle(0x990000, 1).fillRoundedRect(270, 525, 260, 55, 12); });
        btnBg.on('pointerout', () => { btnBg.clear(); btnBg.fillStyle(0x660000, 0.9).fillRoundedRect(270, 525, 260, 55, 12); });
        btnBg.on('pointerdown', () => {
            window.GameData.reset();
            EventSystem.clearHistory();
            this.scene.stop('HUDScene');
            this.cameras.main.fade(400, 0, 0, 0, false, (cam, t) => {
                if (t === 1) {
                    this.scene.start('MenuScene');
                }
            });
        });
    }
}
