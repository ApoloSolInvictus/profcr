// github-proxy.js
require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use(express.json());

app.post('/github', async (req, res) => {
  const { endpoint, method = "GET", body } = req.body;
  const response = await fetch(`https://api.github.com/${endpoint}`, {
    method,
    headers: {
      'Authorization': `token ${process.env.GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github+json'
    },
    body: body ? JSON.stringify(body) : undefined
  });
  const data = await response.json();
  res.json(data);
});

app.listen(3001, () => console.log('GitHub proxy listening on port 3001'));