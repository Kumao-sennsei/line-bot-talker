require('dotenv').config();
const express = require('express');
const { Client } = require('@line/bot-sdk');

const app = express();
const port = process.env.PORT || 3000;

const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

const client = new Client(config);

app.use(express.json());

app.post('/webhook', (req, res) => {
  Promise.all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  const replyText = `くまお先生です。\nあなたはこう言いましたね：「${event.message.text}」`;

  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: replyText,
  });
}

app.listen(port, () => {
  console.log(`LINE Bot is running on port ${port}`);
});
