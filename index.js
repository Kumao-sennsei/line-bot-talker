// index.js
require('dotenv').config();
const express = require('express');
const line = require('@line/bot-sdk');

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

const app = express();
const client = new line.Client(config);

// Webhook受信（LINE Platform → Bot）
app.post('/webhook', line.middleware(config), (req, res) => {
  console.log('Webhook received:', req.body.events);
  Promise.all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error('Error handling event:', err);
      res.status(500).end();
    });
});

// メッセージ処理（テキストのみ応答）
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null); // 無視するイベントはここでスキップ
  }

  // オウム返しスタイルで返信
  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: `くまお先生：『${event.message.text}』って言ったね？`,
  });
}

// サーバー起動（Railwayがポート指定してくれる）
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ LINE Bot is running on port ${PORT}`);
});
