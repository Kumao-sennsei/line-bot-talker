// ✅ たかちゃん専用：絶対に動くLINEおしゃべりBot 最小構成
// 2025年7月18日 完全修正版

require("dotenv").config();
const express = require("express");
const line = require("@line/bot-sdk");

// 🌟 安全チェック
if (!process.env.CHANNEL_ACCESS_TOKEN || !process.env.CHANNEL_SECRET) {
  throw new Error("LINE環境変数（アクセストークンとシークレット）が未設定です！");
}

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

const client = new line.Client(config);
const app = express();

app.post("/webhook", line.middleware(config), async (req, res) => {
  try {
    const events = req.body.events;
    const results = await Promise.all(events.map(handleEvent));
    res.json(results);
  } catch (err) {
    console.error("[Webhook Error]", err);
    res.status(500).end();
  }
});

async function handleEvent(event) {
  if (event.type !== "message" || event.message.type !== "text") {
    return Promise.resolve(null);
  }

  const replyText = `こんにちは(●・ω・●)
あなたは「${event.message.text}」って言いましたね！`;

  return client.replyMessage(event.replyToken, {
    type: "text",
    text: replyText,
  });
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("🚀 LINEトークBotが起動しました！ポート:", port);
});
