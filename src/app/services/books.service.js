class BooksService{
    constructor(restService){
        this.restService = restService;
    }

    getBooks(){
        return this.restService.buildRequest(
            'GET',
            'books'
        );
    }

    createBook(book){
        const id = book.id;

        return this.restService.buildRequest(
            'POST',
            'books',
            book
        );
    }

    updateBook(book){
        const id = book.id;

        return this.restService.buildRequest(
            'PUT',
            `books/${id}`,
            book
        );
    }

    deleteBook(id){
        return this.restService.buildRequest(
            'DELETE',
            `books/${id}`
        );
    }
}

BooksService.$inject = ['restService'];

export default BooksService;