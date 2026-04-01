class HUDScene extends Phaser.Scene {
    constructor() {
        super({ key: 'HUDScene' });
    }

    create() {
        // 顶部半透明黑色HUD背景
        this.add.image(400, 27, 'hudBg');

        const style = { font: 'bold 16px Arial', fill: '#FFD700' };
        const styleW = { font: 'bold 16px Arial', fill: '#ffffff' };

        this.yearText = this.add.text(10, 8, '', style);
        this.treasuryText = this.add.text(190, 8, '', styleW);
        this.publicText = this.add.text(330, 8, '', styleW);
        this.militaryText = this.add.text(470, 8, '', styleW);
        this.healthText = this.add.text(610, 8, '', styleW);

        // 图标色块
        this.makeIcon(174, 16, 0xFFD700);  // 国库
        this.makeIcon(314, 16, 0x00cc66);  // 民心
        this.makeIcon(454, 16, 0xff4444);  // 军力
        this.makeIcon(594, 16, 0x66aaff);  // 精力

        this.updateHUD();
    }

    makeIcon(x, y, color) {
        const g = this.add.graphics();
        g.fillStyle(color, 1);
        g.fillRect(x, y - 7, 12, 14);
    }

    updateHUD() {
        const d = window.GameData;
        this.yearText.setText(`⏳ ${d.year}年 ${d.month}月`);
        this.treasuryText.setText(` 国库: ${d.treasury}`);
        this.publicText.setText(` 民心: ${d.publicSentiment}`);
        this.militaryText.setText(` 军力: ${d.militaryPower}`);
        this.healthText.setText(` 精力: ${d.health}`);

        // 危机颜色警告
        this.treasuryText.setStyle({ fill: d.treasury < 100 ? '#ff6666' : '#ffffff' });
        this.publicText.setStyle({ fill: d.publicSentiment < 15 ? '#ff6666' : '#ffffff' });
        this.militaryText.setStyle({ fill: d.militaryPower < 20 ? '#ff6666' : '#ffffff' });
        this.healthText.setStyle({ fill: d.health < 20 ? '#ff6666' : '#ffffff' });
    }
}
