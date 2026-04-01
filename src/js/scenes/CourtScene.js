class CourtScene extends Phaser.Scene {
  constructor() {
    super({ key: "CourtScene" });
  }

  create() {
    // 背景：金殿
    this.add.image(400, 300, "throne_room").setDisplaySize(800, 600);
    this.add.rectangle(400, 300, 800, 600, 0x000000, 0.4);

    // 标题
    this.add
      .text(400, 45, "「御门听政」", {
        font: "bold 34px serif",
        fill: "#FFD700",
        stroke: "#5a0000",
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    // 朝臣立绘
    const minister = this.add.image(130, 390, "minister").setAlpha(0.95);
    minister.setDisplaySize(140, 260);

    // 皇帝立绘（右侧）
    const emperor = this.add.image(670, 360, "emperor").setAlpha(0.9);
    emperor.setDisplaySize(150, 280);

    // 随机抽一张奏折
    const petitions = EventSystem.petitions.filter((e) => e.type === "court");
    this.currentEvent = Phaser.Utils.Array.GetRandom(petitions);

    // 对话框
    this.add.image(400, 300, "dialogBg");
    this.add
      .text(400, 220, "【 奏折 】", {
        font: "bold 22px serif",
        fill: "#FFD700",
      })
      .setOrigin(0.5);
    this.add
      .text(400, 295, this.currentEvent.text, {
        font: "20px Arial",
        fill: "#fff",
        wordWrap: { width: 580 },
        align: "center",
      })
      .setOrigin(0.5);

    // 效果预览
    const eff = this.currentEvent.effects;
    const effStr = this.formatEffects(eff);
    this.add
      .text(400, 375, "批准效果: " + effStr, {
        font: "16px Arial",
        fill: "#aaffaa",
      })
      .setOrigin(0.5);

    const rejEff = this.currentEvent.rejectEffects;
    const rejStr = this.formatEffects(rejEff);
    this.add
      .text(400, 400, "驳回效果: " + rejStr, {
        font: "16px Arial",
        fill: "#ffaaaa",
      })
      .setOrigin(0.5);

    // 按钮
    this.makeBtn(260, 465, "✅  准奏", "btnGreen", () =>
      this.applyEffects(this.currentEvent.effects, "准奏"),
    );
    this.makeBtn(540, 465, "❌  驳回", "btnRed", () =>
      this.applyEffects(this.currentEvent.rejectEffects, "驳回"),
    );

    // 退朝
    this.add
      .text(400, 555, "[ 不作处理，退朝 ]", {
        font: "18px Arial",
        fill: "#cccccc",
      })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerover", function () {
        this.setStyle({ fill: "#fff" });
      })
      .on("pointerout", function () {
        this.setStyle({ fill: "#cccccc" });
      })
      .on("pointerdown", () => this.scene.start("MenuScene"));

    this.makeBtn(700, 80, "📜 历史", "btnBlue", () => this.showHistoryPanel());
  }

  showHistoryPanel() {
    const history = EventSystem.getPetitionHistory();

    this.historyPanel = this.add.container(0, 0);
    this.historyPanel.add(
      this.add
        .rectangle(400, 300, 650, 500, 0x1a1a2e, 0.95)
        .setStrokeStyle(3, 0xffd700),
    );
    this.historyPanel.add(
      this.add
        .text(400, 75, "【 朱批历史 】", {
          font: "bold 28px serif",
          fill: "#FFD700",
        })
        .setOrigin(0.5),
    );

    const closeBtn = this.add
      .text(680, 75, "✕", {
        font: "bold 24px Arial",
        fill: "#ff6666",
      })
      .setOrigin(0.5)
      .setInteractive();
    closeBtn.on("pointerdown", () => this.historyPanel.destroy());
    this.historyPanel.add(closeBtn);

    if (history.length === 0) {
      this.historyPanel.add(
        this.add
          .text(400, 300, "暂无历史奏折记录", {
            font: "20px Arial",
            fill: "#888",
          })
          .setOrigin(0.5),
      );
      return;
    }

    const scrollArea = this.add
      .rectangle(400, 310, 600, 380, 0x0d1117)
      .setOrigin(0.5);
    this.historyPanel.add(scrollArea);

    const maskGraphics = this.make.graphics();
    maskGraphics.fillRect(100, 120, 600, 380);
    const mask = maskGraphics.createGeometryMask();

    this.historyItems = this.add.container(130, 140);
    this.historyItems.setMask(mask);
    this.historyPanel.add(this.historyItems);

    this.renderHistoryItems(history);

    if (history.length > 5) {
      this.setupScrolling(history.length);
    }
  }

  renderHistoryItems(history) {
    this.historyItems.removeAll(true);
    [...history].reverse().forEach((item, index) => {
      const y = index * 75;
      const bg = this.add
        .rectangle(270, y + 32, 540, 70, 0x161b22)
        .setOrigin(0.5)
        .setStrokeStyle(1, 0x30363d);
      this.historyItems.add(bg);

      this.historyItems.add(
        this.add.text(20, y, `第${item.year}年${item.month}月`, {
          font: "14px Arial",
          fill: "#888",
        }),
      );

      this.historyItems.add(
        this.add.text(120, y, item.title, {
          font: "15px Arial",
          fill: "#fff",
          wordWrap: { width: 300 },
        }),
      );

      const decisionColor = item.decision === "准奏" ? "#4ade80" : "#f87171";
      this.historyItems.add(
        this.add.text(450, y, item.decision, {
          font: "bold 15px Arial",
          fill: decisionColor,
        }),
      );

      this.historyItems.add(
        this.add.text(20, y + 35, this.formatEffects(item.effects), {
          font: "13px Arial",
          fill: "#a0a0a0",
        }),
      );
    });
  }

  setupScrolling(totalItems) {
    this.scrollY = 0;
    this.maxScroll = Math.max(0, (totalItems - 5) * 75);

    const scrollBarBg = this.add
      .rectangle(715, 310, 8, 380, 0x30363d)
      .setOrigin(0.5);
    this.historyPanel.add(scrollBarBg);

    this.scrollHandle = this.add
      .rectangle(715, 140, 8, Math.max(30, (380 * 5) / totalItems), 0xffd700)
      .setOrigin(0.5, 0);
    this.historyPanel.add(this.scrollHandle);

    this.input.on("wheel", (pointer, gameObjects, deltaX, deltaY) => {
      if (!this.historyPanel || !this.historyPanel.visible) return;
      this.scrollY = Phaser.Math.Clamp(
        this.scrollY + deltaY * 0.5,
        0,
        this.maxScroll,
      );
      this.historyItems.y = 140 - this.scrollY;
      this.scrollHandle.y =
        140 +
        (this.scrollY / this.maxScroll) * (380 - this.scrollHandle.height);
    });
  }

  formatEffects(fx) {
    if (!fx) return "无";
    return Object.entries(fx)
      .map(([k, v]) => {
        const names = {
          treasury: "国库",
          publicSentiment: "民心",
          militaryPower: "军力",
          prestige: "威望",
        };
        return `${names[k] || k} ${v > 0 ? "+" : ""}${v}`;
      })
      .join("  ");
  }

  makeBtn(x, y, label, texture, cb) {
    const btn = this.add.image(x, y, texture).setInteractive();
    this.add
      .text(x, y, label, { font: "bold 20px Arial", fill: "#fff" })
      .setOrigin(0.5);
    btn.on("pointerover", () => btn.setAlpha(0.8));
    btn.on("pointerout", () => btn.setAlpha(1.0));
    btn.on("pointerdown", cb);
  }

  applyEffects(effects, decision) {
    if (!effects) {
      this.scene.start("MenuScene");
      return;
    }
    EventSystem.addPetitionToHistory(this.currentEvent, decision, effects);

    if (effects.treasury) window.GameData.treasury += effects.treasury;
    if (effects.publicSentiment)
      window.GameData.publicSentiment += effects.publicSentiment;
    if (effects.militaryPower)
      window.GameData.militaryPower += effects.militaryPower;
    if (effects.prestige) window.GameData.prestige += effects.prestige;

    window.GameData.nextMonth();
    this.scene.get("HUDScene").updateHUD();

    const over = window.GameData.checkGameOver();
    if (over) {
      this.scene.stop("HUDScene");
      this.scene.start("GameOverScene", { reason: over });
      return;
    }
    this.scene.start("MenuScene");
  }
}
