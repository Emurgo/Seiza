const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 4000;

app.use(express.static(path.join(__dirname, 'build')));
app.get('*', (req, res) => {
  res.sendFile(__dirname + '/build/index.html');
})

//start server
app.listen(port, (req, res) => {
  console.log( `server listening on port: ${port}`);
})
