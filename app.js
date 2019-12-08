const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

if(process.env.ENV === 'Test') {
    const db = mongoose.connect('mongodb://localhost/bookAPI_Test');
} else {
    const db = mongoose.connect('mongodb://localhost/bookAPI');
}

const port = process.env.PORT || 5000;
const Book = require('./models/bookModel');
const bookRouter = require('./routes/bookRouter')(Book);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/api', bookRouter);

app.get('/', (req, res) => {
  res.send('Welcome to my Nodemon API!');
});

app.server = app.listen(port, () => {
  console.log(`Running on port ${port}`);
});

module.exports = app;