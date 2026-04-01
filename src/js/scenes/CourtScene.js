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
      this.applyEffects(this.currentEvent.effects, "准奏", "准奏，退朝！"),
    );
    this.makeBtn(540, 465, "❌  驳回", "btnRed", () =>
      this.applyEffects(
        this.currentEvent.rejectEffects,
        "驳回",
        "驳回，退朝！",
      ),
    );

    // 历史奏折按钮
    this.makeHistoryBtn(670, 80, "📜 历史奏折");

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

  makeHistoryBtn(x, y, label) {
    const bg = this.add.rectangle(x, y, 120, 42, 0x4a5568).setInteractive();
    this.add
      .text(x, y, label, { font: "bold 15px Arial", fill: "#FFD700" })
      .setOrigin(0.5);
    bg.on("pointerover", () => bg.setFillStyle(0x718096));
    bg.on("pointerout", () => bg.setFillStyle(0x4a5568));
    bg.on("pointerdown", () => this.showHistoryModal());
  }

  showHistoryModal() {
    const history = EventSystem.getHistory();

    // 遮罩层
    const mask = this.add
      .rectangle(400, 300, 800, 600, 0x000000, 0.85)
      .setInteractive();

    // 弹窗背景 - 缩小尺寸防止超出
    const modal = this.add
      .rectangle(400, 300, 560, 460, 0x1a1a2e)
      .setStrokeStyle(3, 0xffd700);

    // 标题
    this.add
      .text(400, 100, "【 历史奏折 】", {
        font: "bold 24px serif",
        fill: "#FFD700",
      })
      .setOrigin(0.5);

    // 关闭按钮 - 调整位置
    const closeBtn = this.add
      .text(650, 100, "✕", {
        font: "bold 26px Arial",
        fill: "#ff6b6b",
      })
      .setOrigin(0.5)
      .setInteractive();
    closeBtn.on("pointerover", () => closeBtn.setStyle({ fill: "#ff0000" }));
    closeBtn.on("pointerout", () => closeBtn.setStyle({ fill: "#ff6b6b" }));
    closeBtn.on("pointerdown", () => {
      mask.destroy();
      modal.destroy();
      closeBtn.destroy();
      scrollArea.destroy();
      scrollContent.destroy();
    });

    // 滚动区域 - 缩小宽度
    const scrollArea = this.add.zone(400, 310, 500, 320).setInteractive();
    const scrollContent = this.add.container(400, 310);

    if (history.length === 0) {
      this.add
        .text(0, 0, "暂无已处理的奏折", {
          font: "18px Arial",
          fill: "#aaaaaa",
        })
        .setOrigin(0.5)
        .setParent(scrollContent);
    } else {
      let yOffset = -140;
      history.forEach((item, index) => {
        const itemBg = this.add
          .rectangle(0, yOffset, 500, 85, 0x2d3748)
          .setOrigin(0.5);
        const title = this.add
          .text(-240, yOffset - 25, `#${item.id} ${item.timestamp}`, {
            font: "bold 14px Arial",
            fill: "#FFD700",
          })
          .setOrigin(0, 0.5);

        const decisionTag = this.add
          .text(170, yOffset - 25, item.decision, {
            font: "bold 14px Arial",
            fill: item.decision === "准奏" ? "#4ade80" : "#f87171",
          })
          .setOrigin(0, 0.5);

        const content = this.add
          .text(
            -240,
            yOffset,
            item.title.length > 35
              ? item.title.substring(0, 35) + "..."
              : item.title,
            {
              font: "14px Arial",
              fill: "#ffffff",
              wordWrap: { width: 480 },
            },
          )
          .setOrigin(0, 0.5);

        const effects = this.add
          .text(
            -240,
            yOffset + 25,
            "效果: " + this.formatEffects(item.effects),
            {
              font: "13px Arial",
              fill: "#a0aec0",
            },
          )
          .setOrigin(0, 0.5);

        scrollContent.add([itemBg, title, decisionTag, content, effects]);
        yOffset += 100;
      });
    }

    // 滚动逻辑
    let scrollY = 0;
    const maxScroll = Math.max(0, (scrollContent.height - 320) / 2);
    scrollArea.on("wheel", (pointer, gameObjects, deltaX, deltaY) => {
      scrollY = Phaser.Math.Clamp(
        scrollY + deltaY * 0.5,
        -maxScroll,
        maxScroll,
      );
      scrollContent.y = 310 + scrollY;
    });
  }

  applyEffects(effects, decision, msg) {
    if (!effects) {
      this.scene.start("MenuScene");
      return;
    }

    // 记录到历史
    EventSystem.addToHistory(this.currentEvent, decision, effects);

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
