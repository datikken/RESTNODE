function booksController(Book) {
    function post(req, res) {
        const book = new Book(req.body);

        book.save();
        res.status(201);

        return res.json(book);
    }

    function get(req, res) {
        const query = {};
        if (req.query.genre) {
            query.genre = req.query.genre;
        }
        Book.find(query, (err, books) => {
            if (err) {
                return res.send(err);
            }

            const returnBooks = books.map((book) => {
                const newBook = book.toJSON();

                newBook.links = {};
                newBook.links.self = `https://${req.headers.host}/api/books/${book._id}`;

                return newBook;
            });

            return res.json(returnBooks);
        });
    }

    return {post, get}
}

module.exports = booksController;