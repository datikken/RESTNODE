require('should');

const request  = require('supertest');
const mongoose = require('mongoose');
const app      = require('../app.js');

const Book = mongoose.model('Book');

const agent = request.agent(app);

process.env.ENV = "Test";

describe('Book crud test', () => {
    it('should allow a book to be posted', (done) => {

        const bookPost = {
            title: 'my book',
            author: 'jon',
            genre: 'fiction'
        };

        agent.post('/api/books')
            .send(bookPost)
            .expect(200)
            .end((err, res) => {

                console.log(res.body);

                res.body.read.should.not.equal(false);
                res.body.should.have.property('_id');
                done();
            });
    });

    afterEach((done) => {
        Book.deleteMany({}).exec()
        done();
    });

    after((done) => {
        mongoose.connection.close();
    });
});