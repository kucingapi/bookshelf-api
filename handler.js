const { nanoid } = require('nanoid');
const books = require('./book');

const addNewBook = (request, h) => {
    const { 
            name, 
            year, 
            author, 
            summary, 
            publisher, 
            pageCount, 
            readPage, 
            reading
        } = request.payload;

    const id = nanoid(16);
    const finished = readPage === pageCount;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    if( name === undefined){
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku'
        })
        response.code(400);
        return response;
    }

    if(readPage > pageCount){
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
        })
        response.code(400);
        return response;
    }

    const newBook = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        insertedAt,
        updatedAt
    };

    books.push(newBook);
    const isSuccess = books.findIndex((index) => index.id == id) >= 0;
    if(isSuccess){
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        })
        response.code(201);
        return response;
    }

    const response = h.response({
        status: 'error',
        message: 'Buku gagal ditambahkan'
    });
    response.code(500);
    return response;
}

const getAllBook = (request, h) =>{
    const query = request.query;

    var newBooks = books.map((book) => ({id:book.id,name:book.name,publisher:book.publisher}));

    if(query.name !== undefined){
        newBooks = 
        newBooks.filter(
            (book) => book.name.toLowerCase().includes(
                query.name.toLowerCase()
            )
        );
    }

    if(query.reading !== undefined){
        newBooks = 
        books.filter(
            (book) => book.reading === Boolean(query.reading)
        ); 
        newBooks = newBooks.map((book) => ({id:book.id,name:book.name,publisher:book.publisher}));
    }

    if(query.finished !== undefined){
        console.log(query.finished);
        newBooks = 
        books.filter(
            (book) => book.finished === Boolean(parseInt(query.finished))
        ); 
        console.log(newBooks);
        newBooks = newBooks.map((book) => ({id:book.id,name:book.name,publisher:book.publisher}));
    }
    const response = h.response({
        status: 'success',
        data:{
            books: newBooks,
        } 
    });
    
    response.code(200);
    return response;
}

const getBookById = (request, h) => {
    const {bookId} = request.params;
    const bookIndex = books.findIndex((index) => index.id == bookId);
    if(bookIndex >= 0){
        const book = books[bookIndex];
        const response = h.response({
            status: 'success',
            data: {
                book
            }
        })
        return response;
    }
    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    })
    response.code(404);
    return response;
}

const changeBookById = (request, h) =>{
    const {bookId} = request.params;
    const bookIndex = books.findIndex((index) => index.id == bookId);
    const { 
            name, 
            year, 
            author, 
            summary, 
            publisher, 
            pageCount, 
            readPage, 
            reading
        } = request.payload;
    
    if( name === undefined){
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku'
        })
        response.code(400);
        return response;
    }

    if(readPage > pageCount){
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
        })
        response.code(400);
        return response;
    }

    if(bookIndex < 0){
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Id tidak ditemukan',
        })
        response.code(404);
        return response;
    }
    const updatedAt = new Date().toISOString();
    const finished = readPage === pageCount;
    books[bookIndex] = {
        ...books[bookIndex],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        updatedAt
    }

    const response = h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
}

const deleteBookById = (request,h) => {
    const {bookId} = request.params;
    const bookIndex = books.findIndex((index) => index.id == bookId);

    if(bookIndex >= 0){
        books.splice(bookIndex);
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        })
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    })
    response.code(404);
    return response;
}

module.exports = { addNewBook, getAllBook, getBookById, changeBookById, deleteBookById};
