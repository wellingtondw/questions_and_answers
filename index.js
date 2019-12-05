const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./config/database');

const Questions = require('./models/Questions');

connection.authenticate()
  .then(() => console.log('database connection success'))
  .catch(err => console.log('ERR:' + err));

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  Questions.findAll({
    raw: true, order: [
      ['id', 'DESC']
    ]
  }).then(questions => {
    res.render('index', { questions });
  }).catch(err => console.log(err));
});

app.get('/ask', (req, res) => {
  res.render('ask')
})

app.post('/save-ask', (req, res) => {
  const { title, description } = req.body

  Questions.create({
    title,
    description
  }).then(() => {
    res.redirect('/')
  }).catch(err => console.log(err))
})

app.listen(3000, () => {
  console.log(`Server is running on port: 3000`)
});