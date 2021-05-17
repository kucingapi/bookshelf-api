const { addNewBook, getAllBook, getBookById, changeBookById, deleteBookById} = require('./handler');

const routes = [
    {
        method: 'POST',
        path: '/books',
        handler: addNewBook,
    },
    {
        method: 'GET',
        path: '/books',
        handler: getAllBook,
    },
    {
        method: 'GET',
        path: '/books/{bookId}',
        handler: getBookById,
    },
    {
        method: 'PUT',
        path: '/books/{bookId}',
        handler: changeBookById,
    },
    {
        method: 'DELETE',
        path: '/books/{bookId}',
        handler: deleteBookById,
    }
]
module.exports = routes;