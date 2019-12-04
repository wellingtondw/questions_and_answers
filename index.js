const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./config/database');

connection.authenticate()
  .then(() => console.log('database connection success'))
  .catch(err => console.log('ERR:' + err));

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/ask', (req, res) => {
  res.render('ask')
})

app.post('/save-ask', (req, res) => {
  const { title, description } = req.body
  res.send("formulario recebido" + title + description)
})

app.listen(3000, () => {
  console.log(`Server is running on port: 3000`)
});