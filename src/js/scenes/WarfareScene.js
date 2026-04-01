class WarfareScene extends Phaser.Scene {
    constructor() {
        super({ key: 'WarfareScene' });
    }

    create() {
        // 背景
        this.add.image(400, 300, 'battle_bg').setDisplaySize(800, 600);
        this.add.rectangle(400, 300, 800, 600, 0x000000, 0.45);

        // 标题
        this.add.text(400, 45, '「御驾亲征」', {
            font: 'bold 34px serif', fill: '#FFD700',
            stroke: '#00004a', strokeThickness: 4
        }).setOrigin(0.5);

        // 当前军力面板
        const panel = this.add.graphics();
        panel.fillStyle(0x000000, 0.65);
        panel.fillRoundedRect(25, 70, 220, 75, 10);

        this.add.text(135, 90, '⚔  当前军力', { font: '18px Arial', fill: '#aaddff' }).setOrigin(0.5);
        this.add.text(135, 120, `${window.GameData.militaryPower}`, {
            font: 'bold 28px Arial', fill: '#ffffff'
        }).setOrigin(0.5);

        // 皇帝立绘
        const emp = this.add.image(670, 330, 'emperor').setAlpha(0.9);
        emp.setDisplaySize(150, 280);

        // 战争目标
        this.add.text(300, 100, '选择出征目标：', {
            font: '22px Arial', fill: '#ffe8b0'
        }).setOrigin(0.5);

        EventSystem.warTargets.forEach((target, i) => {
            const y = 185 + i * 120;
            this.makeTargetCard(300, y, target);
        });

        // 招兵买马
        const trainY = 440;
        const trainCard = this.add.graphics();
        trainCard.fillStyle(0x0a3a0a, 0.85);
        trainCard.fillRoundedRect(100, trainY, 400, 60, 10);

        this.add.text(300, trainY + 30, '🏕  招兵买马  (-100国库  +20军力)', {
            font: '18px Arial', fill: '#aaffaa'
        }).setOrigin(0.5);

        trainCard.setInteractive(new Phaser.Geom.Rectangle(100, trainY, 400, 60), Phaser.Geom.Rectangle.Contains);
        trainCard.on('pointerover', () => { trainCard.clear(); trainCard.fillStyle(0x1a5a1a, 0.95).fillRoundedRect(100, trainY, 400, 60, 10); });
        trainCard.on('pointerout', () => { trainCard.clear(); trainCard.fillStyle(0x0a3a0a, 0.85).fillRoundedRect(100, trainY, 400, 60, 10); });
        trainCard.on('pointerdown', () => {
            if (window.GameData.treasury >= 100) {
                window.GameData.treasury -= 100;
                window.GameData.militaryPower += 20;
                this.scene.get('HUDScene').updateHUD();
                this.showResult('募集完成！军力大振。', true);
                this.time.delayedCall(1200, () => this.scene.restart());
            } else {
                this.showResult('国库不足，无法募兵！', false);
            }
        });

        // 返回
        this.add.text(400, 560, '[ 班师回朝 ]', {
            font: '22px Arial', fill: '#cccccc'
        }).setOrigin(0.5).setInteractive()
            .on('pointerover', function () { this.setStyle({ fill: '#fff' }); })
            .on('pointerout', function () { this.setStyle({ fill: '#cccccc' }); })
            .on('pointerdown', () => this.scene.start('MenuScene'));
    }

    makeTargetCard(x, y, target) {
        const card = this.add.graphics();
        card.fillStyle(0x1a1a3a, 0.85);
        card.fillRoundedRect(x - 195, y - 40, 390, 90, 10);

        this.add.text(x - 80, y - 20, target.name, { font: 'bold 22px Arial', fill: '#ffdd88' }).setOrigin(0.5);
        this.add.text(x + 80, y - 22, `推荐军力 ≥ ${target.requiredMilitary}`, { font: '15px Arial', fill: '#aaaaff' }).setOrigin(0.5);
        this.add.text(x - 80, y + 12, `胜: 国库+${target.reward.treasury} 威望+${target.reward.prestige}`, { font: '14px Arial', fill: '#aaffaa' }).setOrigin(0.5);
        this.add.text(x + 80, y + 12, `败: 军力${target.fail.militaryPower} 威望${target.fail.prestige}`, { font: '14px Arial', fill: '#ffaaaa' }).setOrigin(0.5);

        const btn = this.add.graphics();
        btn.fillStyle(0x3a1a0a, 0.9);
        btn.fillRoundedRect(x + 130, y - 18, 60, 36, 8);
        this.add.text(x + 160, y, '出征', { font: 'bold 16px Arial', fill: '#FFD700' }).setOrigin(0.5);

        btn.setInteractive(new Phaser.Geom.Rectangle(x + 130, y - 18, 60, 36), Phaser.Geom.Rectangle.Contains);
        btn.on('pointerdown', () => this.startWar(target));
    }

    startWar(target) {
        if (window.GameData.militaryPower < 10) {
            this.showResult('军队羸弱，无力出征！', false);
            return;
        }

        const myPower = window.GameData.militaryPower * Phaser.Math.FloatBetween(0.8, 1.2);
        const enemyPwr = target.requiredMilitary * Phaser.Math.FloatBetween(0.85, 1.15);

        window.GameData.treasury -= 50;  // 军费
        window.GameData.health -= 5;

        let win = myPower >= enemyPwr;
        if (win) {
            window.GameData.treasury += target.reward.treasury;
            window.GameData.prestige += target.reward.prestige;
            this.showResult(`【大捷】征服 ${target.name}！\n国库 +${target.reward.treasury}  威望 +${target.reward.prestige}`, true);
        } else {
            window.GameData.militaryPower += target.fail.militaryPower;
            window.GameData.prestige += target.fail.prestige;
            this.showResult(`【大败】${target.name} 之役，伤亡惨重...\n军力 ${target.fail.militaryPower}  威望 ${target.fail.prestige}`, false);
        }

        this.scene.get('HUDScene').updateHUD();

        const over = window.GameData.checkGameOver();
        if (over) {
            this.time.delayedCall(2000, () => { this.scene.stop('HUDScene'); this.scene.start('GameOverScene', { reason: over }); });
        } else {
            this.time.delayedCall(2000, () => this.scene.start('MenuScene'));
        }
    }

    showResult(msg, success) {
        const color = success ? 0x0a3a0a : 0x3a0a0a;
        const panel = this.add.graphics();
        panel.fillStyle(color, 0.92);
        panel.fillRoundedRect(125, 220, 550, 140, 12);
        panel.lineStyle(2, success ? 0x00ff88 : 0xff4444, 1);
        panel.strokeRoundedRect(125, 220, 550, 140, 12);

        this.add.text(400, 295, msg, {
            font: '22px Arial', fill: '#fff',
            wordWrap: { width: 490 }, align: 'center'
        }).setOrigin(0.5);
    }
}
