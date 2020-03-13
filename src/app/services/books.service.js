class BooksService{
    constructor(restService){
        this.restService = restService;
    }

    getBooks(){
        return this.restService.makeRequest(
            'GET',
            'books'
        );
    }

    createBook(book){
        const id = book.id;

        return this.restService.makeRequest(
            'POST',
            'books',
            book
        );
    }

    updateBook(book){
        const id = book.id;

        return this.restService.makeRequest(
            'PUT',
            `books/${id}`,
            book
        );
    }

    deleteBook(id){
        return this.restService.makeRequest(
            'DELETE',
            `books/${id}`
        );
    }
}

BooksService.$inject = ['restService'];

export default BooksService;