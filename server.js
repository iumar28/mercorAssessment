const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

app.use(express.json());

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/process-speech', async (req, res) => {
  const speechResult = req.body.speech;
  console.log('Speech:', speechResult);

  try {
    const response = await callChatGPTAPI(speechResult);
    const chatGPTResponse = response.data.choices[0].message.content;
    console.log('ChatGPT:', response);
    res.json({ response: chatGPTResponse });
  } catch (error) {
    console.error('Error:', error.response.data);
    res.status(500).json({ error: 'An error occurred.' });
  }
});

async function callChatGPTAPI(input) {
  const url = 'https://api.openai.com/v1/chat/completions';
  const apiKey = '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';
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`
  };
  const data = {
    'model': 'gpt-3.5-turbo',
    'messages': [
    {'role': 'system', 'content': 'You are a helpful assistant.'},
    {'role': 'user', 'content': input}
    ]
  };

  return axios.post(url, data, { headers });
}

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});