class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        // 背景
        this.add.image(400, 300, 'menu_bg').setDisplaySize(800, 600);

        // 半透明暗色遮罩，突出文字
        this.add.rectangle(400, 300, 800, 600, 0x000000, 0.45);

        // 皇帝立绘
        const emp = this.add.image(660, 390, 'emperor').setAlpha(0.9);
        emp.setDisplaySize(180, 320);

        // 标题
        this.add.text(340, 90, '天子·九五', {
            font: 'bold 52px serif', fill: '#FFD700',
            stroke: '#8B0000', strokeThickness: 4,
            shadow: { offsetX: 3, offsetY: 3, color: '#000', blur: 6, fill: true }
        }).setOrigin(0.5);
        this.add.text(340, 150, '皇帝模拟器', {
            font: '26px serif', fill: '#ffe8b0',
            stroke: '#000', strokeThickness: 2
        }).setOrigin(0.5);

        // 启动 HUD
        if (!this.scene.isActive('HUDScene')) {
            this.scene.launch('HUDScene');
        } else {
            this.scene.get('HUDScene').updateHUD();
        }

        // 功能按钮
        const buttons = [
            { label: '⚖  上朝理政', scene: 'CourtScene', color: 0x6b3a2a },
            { label: '🌸  游览后宫', scene: 'HaremScene', color: 0x7b2d5a },
            { label: '⚔  御驾亲征', scene: 'WarfareScene', color: 0x2d3a6b },
        ];

        buttons.forEach((btn, i) => {
            const y = 260 + i * 75;
            const bg = this.add.graphics();
            bg.fillStyle(btn.color, 0.9);
            bg.fillRoundedRect(180, y - 25, 280, 50, 10);

            const label = this.add.text(320, y, btn.label, {
                font: 'bold 22px Arial', fill: '#fff',
                shadow: { offsetX: 1, offsetY: 1, color: '#000', blur: 3, fill: true }
            }).setOrigin(0.5);

            bg.setInteractive(new Phaser.Geom.Rectangle(180, y - 25, 280, 50), Phaser.Geom.Rectangle.Contains);
            bg.on('pointerover', () => { bg.clear(); bg.fillStyle(btn.color + 0x222222, 1); bg.fillRoundedRect(180, y - 25, 280, 50, 10); });
            bg.on('pointerout', () => { bg.clear(); bg.fillStyle(btn.color, 0.9); bg.fillRoundedRect(180, y - 25, 280, 50, 10); });
            bg.on('pointerdown', () => { this.cameras.main.fade(300, 0, 0, 0, false, (cam, t) => { if (t === 1) this.scene.start(btn.scene); }); });
        });

        // 休养按钮
        const restY = 510;
        const restBg = this.add.graphics();
        restBg.fillStyle(0x2d5a2d, 0.9);
        restBg.fillRoundedRect(180, restY - 25, 280, 50, 10);
        this.add.text(320, restY, '🌙  休养生息（下月）', {
            font: 'bold 20px Arial', fill: '#b8ffb8'
        }).setOrigin(0.5);

        restBg.setInteractive(new Phaser.Geom.Rectangle(180, restY - 25, 280, 50), Phaser.Geom.Rectangle.Contains);
        restBg.on('pointerdown', () => this.advanceMonth());

        // 年份信息显示在右下角
        this.dateLabel = this.add.text(780, 580, '', {
            font: '16px Arial', fill: '#ffe8b0', align: 'right'
        }).setOrigin(1, 1);
        this.updateDateLabel();
    }

    updateDateLabel() {
        this.dateLabel.setText(`第 ${window.GameData.year} 年  第 ${window.GameData.month} 月`);
    }

    advanceMonth() {
        window.GameData.nextMonth();

        // 月收入：基础+国库税收
        const income = 30 + Math.floor(window.GameData.militaryPower * 0.2);
        window.GameData.treasury += income;

        // 随机事件触发
        this.triggerRandomEvent();

        // 更新 HUD
        this.scene.get('HUDScene').updateHUD();
        this.updateDateLabel();

        const over = window.GameData.checkGameOver();
        if (over) {
            this.time.delayedCall(300, () => {
                this.scene.stop('HUDScene');
                this.scene.start('GameOverScene', { reason: over });
            });
        }
    }

    triggerRandomEvent() {
        if (Math.random() > 0.35) return;

        const event = Phaser.Utils.Array.GetRandom(EventSystem.randomEvents);
        if (Math.random() > event.chance * 5) return;  // 稀有度过滤

        const fx = event.effects;
        if (fx.treasury) window.GameData.treasury += fx.treasury;
        if (fx.publicSentiment) window.GameData.publicSentiment += fx.publicSentiment;
        if (fx.militaryPower) window.GameData.militaryPower += fx.militaryPower;

        // 用场景内对话框展示，而非 alert
        this.showEventPopup(event.text);
    }

    showEventPopup(msg) {
        const panel = this.add.image(400, 300, 'dialogBg').setAlpha(0);
        const txt = this.add.text(400, 285, '【突发事件】\n' + msg, {
            font: '20px Arial', fill: '#fff', wordWrap: { width: 560 }, align: 'center'
        }).setOrigin(0.5).setAlpha(0);
        const close = this.add.text(400, 380, '[ 知道了 ]', {
            font: '22px Arial', fill: '#FFD700'
        }).setOrigin(0.5).setAlpha(0).setInteractive();

        this.tweens.add({ targets: [panel, txt, close], alpha: 1, duration: 300 });
        close.on('pointerdown', () => {
            this.tweens.add({
                targets: [panel, txt, close], alpha: 0, duration: 200,
                onComplete: () => { panel.destroy(); txt.destroy(); close.destroy(); }
            });
        });
    }
}
