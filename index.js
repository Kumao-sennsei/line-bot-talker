require("dotenv").config();
const express = require("express");
const line = require("@line/bot-sdk");

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

const app = express();
const client = new line.Client(config);

// Webhookエンドポイント
app.post("/webhook", line.middleware(config), (req, res) => {
  Promise.all(req.body.events.map(handleEvent))
    .then(result => res.json(result))
    .catch(error => {
      console.error("Error handling event:", error);
      res.status(500).end();
    });
});

// イベント処理（テキストだけ）
function handleEvent(event) {
  if (event.type !== "message" || event.message.type !== "text") {
    return Promise.resolve(null);
  }

  return client.replyMessage(event.replyToken, {
    type: "text",
    text: `こんにちは！あなたは「${event.message.text}」と言いましたね(●´ω｀●)`,
  });
}

// サーバー起動
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`LINE bot is running on port ${port}`);
});
