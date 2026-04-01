class CourtScene extends Phaser.Scene {
    constructor() {
        super({ key: 'CourtScene' });
    }

    create() {
        // 背景：金殿
        this.add.image(400, 300, 'throne_room').setDisplaySize(800, 600);
        this.add.rectangle(400, 300, 800, 600, 0x000000, 0.4);

        // 标题
        this.add.text(400, 45, '「御门听政」', {
            font: 'bold 34px serif', fill: '#FFD700',
            stroke: '#5a0000', strokeThickness: 4
        }).setOrigin(0.5);

        // 朝臣立绘
        const minister = this.add.image(130, 390, 'minister').setAlpha(0.95);
        minister.setDisplaySize(140, 260);

        // 皇帝立绘（右侧）
        const emperor = this.add.image(670, 360, 'emperor').setAlpha(0.9);
        emperor.setDisplaySize(150, 280);

        // 随机抽一张奏折
        const petitions = EventSystem.petitions.filter(e => e.type === 'court');
        this.currentEvent = Phaser.Utils.Array.GetRandom(petitions);

        // 对话框
        this.add.image(400, 300, 'dialogBg');
        this.add.text(400, 220, '【 奏折 】', {
            font: 'bold 22px serif', fill: '#FFD700'
        }).setOrigin(0.5);
        this.add.text(400, 295, this.currentEvent.text, {
            font: '20px Arial', fill: '#fff',
            wordWrap: { width: 580 }, align: 'center'
        }).setOrigin(0.5);

        // 效果预览
        const eff = this.currentEvent.effects;
        const effStr = this.formatEffects(eff);
        this.add.text(400, 375, '批准效果: ' + effStr, {
            font: '16px Arial', fill: '#aaffaa'
        }).setOrigin(0.5);

        const rejEff = this.currentEvent.rejectEffects;
        const rejStr = this.formatEffects(rejEff);
        this.add.text(400, 400, '驳回效果: ' + rejStr, {
            font: '16px Arial', fill: '#ffaaaa'
        }).setOrigin(0.5);

        // 按钮
        this.makeBtn(260, 465, '✅  准奏', 'btnGreen', () => this.applyEffects(this.currentEvent.effects, '准奏，退朝！', '准奏'));
        this.makeBtn(540, 465, '❌  驳回', 'btnRed', () => this.applyEffects(this.currentEvent.rejectEffects, '驳回，退朝！', '驳回'));

        // 历史奏折按钮
        this.makeBtn(680, 80, '📜 历史', 'btnGreen', () => this.showHistoryPopup());

        // 退朝
        this.add.text(400, 555, '[ 不作处理，退朝 ]', {
            font: '18px Arial', fill: '#cccccc'
        }).setOrigin(0.5).setInteractive()
            .on('pointerover', function () { this.setStyle({ fill: '#fff' }); })
            .on('pointerout', function () { this.setStyle({ fill: '#cccccc' }); })
            .on('pointerdown', () => this.scene.start('MenuScene'));
    }

    showHistoryPopup() {
        const history = EventSystem.getHistory();
        
        // 创建弹出窗口容器（包含所有元素）
        const popupContainer = this.add.container(0, 0);
        
        // 创建弹出窗口背景
        const popupBg = this.add.rectangle(400, 300, 560, 460, 0x1a1a1a, 1);
        const popupBorder = this.add.rectangle(400, 300, 560, 460).setStrokeStyle(4, 0xFFD700);
        
        // 标题栏背景
        const titleBarBg = this.add.rectangle(400, 100, 560, 60, 0x2a2a2a);
        
        // 标题
        const title = this.add.text(400, 100, '【 历史奏折 】', {
            font: 'bold 24px serif', fill: '#FFD700'
        }).setOrigin(0.5);
        
        // 创建滚动列表区域
        const listBg = this.add.rectangle(400, 320, 540, 350, 0x1a1a1a);
        
        // 创建滚动容器
        const scrollContainer = this.add.container(130, 135);
        const scrollMask = this.make.graphics().fillRect(130, 135, 540, 350).createGeometryMask();
        scrollContainer.setMask(scrollMask);
        
        let yPos = 0;
        const itemHeight = 90;
        
        if (history.length === 0) {
            scrollContainer.add(this.add.text(400 - 130, 150, '暂无历史记录', {
                font: '18px Arial', fill: '#888'
            }).setOrigin(0.5));
        } else {
            [...history].reverse().forEach((item, index) => {
                const itemBg = this.add.rectangle(270, yPos + itemHeight / 2, 520, 85, 0x2a2a2a);
                const decisionColor = item.decision === '准奏' ? '#aaffaa' : '#ffaaaa';
                const titleText = this.add.text(20, yPos + 10, item.fullText, {
                    font: '14px Arial', fill: '#fff',
                    wordWrap: { width: 490 }
                });
                const decisionText = this.add.text(20, yPos + 55, '决策: ' + item.decision, {
                    font: 'bold 16px Arial', fill: decisionColor
                });
                const effectsText = this.add.text(20, yPos + 75, '效果: ' + this.formatEffects(item.effects), {
                    font: '14px Arial', fill: '#ffffaa'
                });
                
                scrollContainer.add([itemBg, titleText, decisionText, effectsText]);
                yPos += itemHeight;
            });
        }
        
        // 滚动功能
        const maxScroll = Math.max(0, yPos - 350);
        let currentScroll = 0;
        
        this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY) => {
            if (maxScroll > 0) {
                currentScroll = Phaser.Math.Clamp(currentScroll + deltaY, 0, maxScroll);
                scrollContainer.y = 135 - currentScroll;
            }
        });
        
        // 关闭按钮（在标题栏内）
        const closeBtn = this.add.image(640, 100, 'btnRed').setInteractive();
        this.add.text(640, 100, '✕', { font: 'bold 24px Arial', fill: '#fff' }).setOrigin(0.5);
        
        // 将所有元素添加到容器中，便于管理
        popupContainer.add([popupBg, popupBorder, titleBarBg, title, listBg, scrollContainer, closeBtn]);
        
        const closePopup = () => {
            popupContainer.destroy();
            this.input.off('wheel');
        };
        
        closeBtn.on('pointerdown', closePopup);
        closeBtn.on('pointerover', () => closeBtn.setAlpha(0.8));
        closeBtn.on('pointerout', () => closeBtn.setAlpha(1.0));
    }

    formatEffects(fx) {
        if (!fx) return '无';
        return Object.entries(fx).map(([k, v]) => {
            const names = { treasury: '国库', publicSentiment: '民心', militaryPower: '军力', prestige: '威望' };
            return `${names[k] || k} ${v > 0 ? '+' : ''}${v}`;
        }).join('  ');
    }

    makeBtn(x, y, label, texture, cb) {
        const btn = this.add.image(x, y, texture).setInteractive();
        this.add.text(x, y, label, { font: 'bold 20px Arial', fill: '#fff' }).setOrigin(0.5);
        btn.on('pointerover', () => btn.setAlpha(0.8));
        btn.on('pointerout', () => btn.setAlpha(1.0));
        btn.on('pointerdown', cb);
    }

    applyEffects(effects, msg, decision) {
        if (!effects) { this.scene.start('MenuScene'); return; }
        
        // 记录历史
        EventSystem.addHistory(this.currentEvent, decision, effects);
        
        if (effects.treasury) window.GameData.treasury += effects.treasury;
        if (effects.publicSentiment) window.GameData.publicSentiment += effects.publicSentiment;
        if (effects.militaryPower) window.GameData.militaryPower += effects.militaryPower;
        if (effects.prestige) window.GameData.prestige += effects.prestige;

        window.GameData.nextMonth();
        this.scene.get('HUDScene').updateHUD();

        const over = window.GameData.checkGameOver();
        if (over) { this.scene.stop('HUDScene'); this.scene.start('GameOverScene', { reason: over }); return; }
        this.scene.start('MenuScene');
    }
}
