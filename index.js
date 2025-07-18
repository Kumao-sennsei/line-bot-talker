require('dotenv').config();
const express = require('express');
const { Client, middleware } = require('@line/bot-sdk');

const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

const app = express();
const client = new Client(config);

// Webhookエンドポイント
app.post('/webhook', middleware(config), (req, res) => {
  Promise.all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error('❌ Error in webhook handler:', err);
      res.status(500).end();
    });
});

// メッセージイベントの処理
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null); // テキスト以外は無視
  }

  const replyText = `こんにちは！「${event.message.text}」って言ったね♪`;
  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: replyText,
  });
}

// ポート設定
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 LINE Bot is running on port ${port}`);
});
