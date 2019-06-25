class BooksController{
    constructor(BooksService){
        this.booksService = BooksService;
        this.title = 'Books Page';
        
        this.getBooks();
    }

    getBooks(){
        this.booksService.getBooks()
            .then(function(response){
                if(evalResponse(response)){
                    console.log('books', response.data);
                }
            });
    }
}

BooksController.$inject = ['BooksService'];

export default BooksController;