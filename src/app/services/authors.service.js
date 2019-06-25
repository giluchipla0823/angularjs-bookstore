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
}

AuthorsService.$inject = ['restService'];

export default AuthorsService;