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
}

BooksService.$inject = ['restService'];

export default BooksService;