class AuthorsService{
    constructor(restService){
        this.restService = restService;
    }

    getAuthors(){
        return this.restService.makeRequest(
            'GET',
            'authors'
        );
    }

    createAuthor(author){
        const id = author.id;

        return this.restService.makeRequest(
            'POST',
            'authors',
            author
        );
    }

    updateAuthor(author){
        const id = author.id;

        return this.restService.makeRequest(
            'PUT',
            `authors/${id}`,
            author
        );
    }

    deleteAuthor(id){
        return this.restService.makeRequest(
            'DELETE',
            `authors/${id}`
        );
    }
}

AuthorsService.$inject = ['restService'];

export default AuthorsService;