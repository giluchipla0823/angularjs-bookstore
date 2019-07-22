class AuthorsService{
    constructor(restService){
        this.restService = restService;
    }

    getAuthors(){
        return this.restService.buildRequest(
            'GET',
            'authors'
        );
    }

    createAuthor(author){
        const id = author.id;

        return this.restService.buildRequest(
            'POST',
            'authors',
            author
        );
    }

    updateAuthor(author){
        const id = author.id;

        return this.restService.buildRequest(
            'PUT',
            `authors/${id}`,
            author
        );
    }

    deleteAuthor(id){
        return this.restService.buildRequest(
            'DELETE',
            `authors/${id}`
        );
    }
}

AuthorsService.$inject = ['restService'];

export default AuthorsService;