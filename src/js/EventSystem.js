const EventSystem = {
    // 历史奏折记录
    petitionHistory: [],

    // 添加奏折到历史记录
    addToHistory(petition, decision, effects) {
        this.petitionHistory.push({
            id: this.petitionHistory.length + 1,
            title: petition.text,
            decision: decision,
            effects: effects,
            timestamp: `第 ${window.GameData ? window.GameData.month : 1} 月`
        });
    },

    // 获取所有历史奏折
    getHistory() {
        return this.petitionHistory;
    },

    // 清空历史记录（新游戏时调用）
    clearHistory() {
        this.petitionHistory = [];
    },

    // 随机事件表：格式如奏章
    petitions: [
        {
            text: "户部尚书上奏：江南水灾，需拨银两赈灾。是否批准（减国库，加民心）？",
            effects: { treasury: -100, publicSentiment: 10 },
            rejectEffects: { treasury: 0, publicSentiment: -20 },
            type: 'court'
        },
        {
            text: "兵部尚书上奏：边关异动，需拨军饷戍边。是否批准（减国库，加军力）？",
            effects: { treasury: -150, militaryPower: 15 },
            rejectEffects: { treasury: 0, militaryPower: -10 },
            type: 'court'
        },
        {
            text: "工部尚书上奏：修缮宫殿，彰显国力。是否批准（减国库，加国威）？",
            effects: { treasury: -80, prestige: 5 },
            rejectEffects: { treasury: 0, prestige: -2 },
            type: 'court'
        },
        {
            text: "地方官员进言：今年风调雨顺，建议减免赋税以安民心。是否批准（减国库增加收入速度，加民心）？",
            effects: { treasury: -50, publicSentiment: 15 },
            rejectEffects: { treasury: 80, publicSentiment: -10 },
            type: 'court'
        }
    ],

    // 回合结算随机事件（天灾叛乱）
    randomEvents: [
        {
            text: "突然发生干旱！农作物歉收，民怨四起。",
            effects: { treasury: -50, publicSentiment: -15 },
            chance: 0.1
        },
        {
            text: "流寇发难！边境村庄受到袭击。",
            effects: { publicSentiment: -10, militaryPower: -5 },
            chance: 0.1
        },
        {
            text: "意外之财！在矿山中发现了新的金脉。",
            effects: { treasury: 200 },
            chance: 0.05
        }
    ],
    
    // 战争地区
    warTargets: [
        { name: "北方游牧", requiredMilitary: 80, reward: { prestige: 20, treasury: 100 }, fail: { militaryPower: -30, prestige: -10 } },
        { name: "南方群岛", requiredMilitary: 50, reward: { prestige: 10, treasury: 60 }, fail: { militaryPower: -15, prestige: -5 } },
    ]
};
