
require('dotenv').config();
const express = require('express');
const { middleware, Client } = require('@line/bot-sdk');

const app = express();

const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET
};

const client = new Client(config);

app.use(middleware(config));

app.post('/webhook', (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result));
});

function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  const userMessage = event.message.text;
  const replyMessage = `くまお先生です。\n「${userMessage}」って言ったね。\nお話しできてうれしいよ♪`;

  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: replyMessage
  });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`くまお先生Botが起動しました！ポート: ${PORT}`);
});
