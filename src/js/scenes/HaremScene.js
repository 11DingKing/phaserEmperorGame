class HaremScene extends Phaser.Scene {
    constructor() {
        super({ key: 'HaremScene' });
    }

    create() {
        // 背景
        this.add.image(400, 300, 'harem_bg').setDisplaySize(800, 600);
        this.add.rectangle(400, 300, 800, 600, 0x000000, 0.35);

        // 标题
        this.add.text(400, 45, '「后宫佳丽」', {
            font: 'bold 34px serif', fill: '#FFD700',
            stroke: '#5a0000', strokeThickness: 4
        }).setOrigin(0.5);

        // 皇后
        this.createCharacter(200, 280, 'queen', '皇后·青岚', 'queen', 200, 120);

        // 贵妃
        this.createCharacter(600, 280, 'consort', '贵妃·秋水', 'consort', 150, 80);

        // 返回按钮
        const back = this.add.text(400, 560, '[ 移驾回宫 ]', {
            font: '22px Arial', fill: '#ffe8b0'
        }).setOrigin(0.5).setInteractive();
        back.on('pointerover', () => back.setStyle({ fill: '#fff' }));
        back.on('pointerout', () => back.setStyle({ fill: '#ffe8b0' }));
        back.on('pointerdown', () => this.scene.start('MenuScene'));
    }

    createCharacter(x, y, textureKey, name, dataKey, cost, affGain) {
        // 人物立绘
        const img = this.add.image(x, y, textureKey).setDisplaySize(130, 220);

        // 信息卡片底板
        const card = this.add.graphics();
        card.fillStyle(0x000000, 0.6);
        card.fillRoundedRect(x - 100, y + 120, 200, 130, 8);

        const aff = window.GameData.haremAffection[dataKey] || 0;

        this.add.text(x, y + 140, name, {
            font: 'bold 20px serif', fill: '#FFD700'
        }).setOrigin(0.5);

        // 好感度进度条
        this.add.text(x, y + 165, `好感度: ${aff}`, {
            font: '16px Arial', fill: '#ffcce0'
        }).setOrigin(0.5);

        const barBg = this.add.graphics();
        barBg.fillStyle(0x333333, 1);
        barBg.fillRoundedRect(x - 70, y + 183, 140, 10, 4);
        const barFg = this.add.graphics();
        barFg.fillStyle(0xff69b4, 1);
        barFg.fillRoundedRect(x - 70, y + 183, Math.min(140, aff * 1.4), 10, 4);

        // 互动按钮
        const btn = this.add.graphics();
        btn.fillStyle(0x7b2d5a, 0.9);
        btn.fillRoundedRect(x - 65, y + 202, 130, 36, 8);
        const btnTxt = this.add.text(x, y + 220, `💝 赏赐 (-${cost}金)`, {
            font: '15px Arial', fill: '#fff'
        }).setOrigin(0.5);

        btn.setInteractive(new Phaser.Geom.Rectangle(x - 65, y + 202, 130, 36), Phaser.Geom.Rectangle.Contains);
        btn.on('pointerover', () => btn.clear().fillStyle(0xaa448a, 1).fillRoundedRect(x - 65, y + 202, 130, 36, 8));
        btn.on('pointerout', () => btn.clear().fillStyle(0x7b2d5a, 0.9).fillRoundedRect(x - 65, y + 202, 130, 36, 8));
        btn.on('pointerdown', () => {
            if (window.GameData.treasury >= cost) {
                window.GameData.treasury -= cost;
                window.GameData.haremAffection[dataKey] = (window.GameData.haremAffection[dataKey] || 0) + affGain;
                window.GameData.health -= 3;
                this.scene.get('HUDScene').updateHUD();

                const over = window.GameData.checkGameOver();
                if (over) { this.scene.stop('HUDScene'); this.scene.start('GameOverScene', { reason: over }); return; }

                this.scene.restart();
            } else {
                this.showMsg('国库空虚，无以赏赐...');
            }
        });
    }

    showMsg(msg) {
        const panel = this.add.image(400, 300, 'dialogBg').setAlpha(0);
        const txt = this.add.text(400, 295, msg, {
            font: '22px Arial', fill: '#fff', wordWrap: { width: 560 }, align: 'center'
        }).setOrigin(0.5).setAlpha(0);
        const close = this.add.text(400, 380, '[ 知道了 ]', {
            font: '20px Arial', fill: '#FFD700'
        }).setOrigin(0.5).setAlpha(0).setInteractive();
        this.tweens.add({ targets: [panel, txt, close], alpha: 1, duration: 250 });
        close.on('pointerdown', () => this.tweens.add({
            targets: [panel, txt, close], alpha: 0, duration: 150,
            onComplete: () => { panel.destroy(); txt.destroy(); close.destroy(); }
        }));
    }
}
