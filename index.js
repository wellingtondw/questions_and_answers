const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./config/database');

const Questions = require('./models/Questions');
const Answers = require('./models/Answers');

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

app.get('/question/:id', (req, res) => {
  const { id } = req.params

  Questions.findOne({
    raw: true,
    where: { id }
  }).then(question => {
    if (question) {
      Answers.findAll({
        where: { questionId: question.id },
        order: [
          ['id', 'DESC']
        ]
      }).then((answers) => {
        res.render('question', { question, answers });

      }).catch(err => console.log(err));
    } else {
      res.redirect('/')
    }
  }).catch(err => console.log(err));
});


app.get('/ask', (req, res) => {
  res.render('ask')
});

app.post('/save-ask', (req, res) => {
  const { title, description } = req.body

  Questions.create({
    title,
    description
  }).then(() => {
    res.redirect('/')
  }).catch(err => console.log(err))
});

app.post('/reply', (req, res) => {
  const { body, questionId } = req.body;
  Answers.create({
    body,
    questionId
  }).then(() => {
    res.redirect(`/question/${questionId}`);
  }).catch(err => console.log(err));
});

app.listen(3000, () => {
  console.log(`Server is running on port: 3000`)
});