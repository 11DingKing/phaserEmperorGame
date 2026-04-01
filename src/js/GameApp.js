class GameAppData {
    constructor() {
        this.reset();
    }

    reset() {
        this.treasury = 500;
        this.publicSentiment = 50;
        this.militaryPower = 50;
        this.prestige = 20; // 威信
        this.health = 100;
        this.year = 1;
        this.month = 1;

        this.haremAffection = {
            queen: 30, // 皇后
            consort: 10 // 贵妃
        };

        // 清空历史奏折记录
        if (typeof EventSystem !== 'undefined') {
            EventSystem.clearHistory();
        }
    }

    nextMonth() {
        this.month++;
        if (this.month > 12) {
            this.month = 1;
            this.year++;
        }
    }

    checkGameOver() {
        if (this.treasury < 0) return "国库亏空，军队哗变，你被叛军拉下皇位！";
        if (this.publicSentiment < 0) return "民怨沸腾，各地农民起义，天庭倾覆！";
        if (this.health <= 0) return "终日劳累，染病暴毙，驾崩于寝宫中。";
        return null; // 继续游戏
    }
}

// 暴漏成为一个全局单例
window.GameData = new GameAppData();
