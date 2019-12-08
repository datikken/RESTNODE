const express = require('express');
const booksController = require('../controllers/booksController');

function routes(Book) {
  const bookRouter = express.Router();
  const controller = booksController(Book);

  bookRouter.route('/books')
    .post(controller.post)
    .get(controller.get)

  bookRouter.use('/books/:bookId', (req, res, next) => {
      Book.findById(req.params.bookId, (err, book) => {
          if(err) {
            return res.send(err);
          }

          if(book) {
            req.book = book;
            return next();
          }

          return res.sendStatus(404);
      });
  });

  bookRouter.route('/books/:bookId')
      .put((req, res) => {

          const { book } = req;

          book.title = req.body.title;
          book.author = req.body.author;
          book.genre = req.body.genre;
          book.read = req.body.read;
          book.save();

          return res.json(book);
      })

      .patch((req, res) => {
         const { book } = req;

         if(req.body._id) {
            delete req.body._id;
         }

         Object.entries(req.body).forEach(item => {
           const key = item[0];
           const value = item[1];

           book[key] = value;
         });

        req.book.save((err) => {
          if(err) {
            return res.send(err);
          }

          return res.json(book);
        });
      })

      .get((req, res) => {
          const returnBook = req.book.toJSON();
          const genre = req.book.genre.replace(' ', '%20');

          returnBook.links = {};
          returnBook.links.FilterByThisGenre = `http://${req.headers.host}/api/book/?genre=${req.book.genre}`;

          res.json(returnBook);
      })

      .delete((req, res) => {
        req.book.remove((err) => {
          if(err) {
            return res.send(err);
          }

          return res.sendStatus(204);
        });
      })

  return bookRouter;
}

module.exports = routes;