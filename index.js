// index.js
require('dotenv').config();
const express = require('express');
const { Client, middleware } = require('@line/bot-sdk');

const app = express();

const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

const client = new Client(config);

// Webhookエンドポイント（←これがないとLINEが404出す）
app.post('/webhook', middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error('❌ Error in webhook handler:', err);
      res.status(500).end();
    });
});

// メッセージ処理
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null); // テキスト以外はスルー
  }

  // オウム返しじゃなく、ひとこと返すBot
  const replyText = `こんにちは！「${event.message.text}」って言ったね♪`;

  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: replyText,
  });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 LINE Bot server running at http://localhost:${PORT}`);
});
