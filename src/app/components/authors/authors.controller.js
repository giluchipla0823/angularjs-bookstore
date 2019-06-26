import { evalResponse }  from '../../../public/assets/js/jsCommonFunctions';

class AuthorsController{
    constructor(AuthorsService){
        this.authorsService = AuthorsService;
        this.title = 'Authors Page';

        this.authors = {
            data: []
        };

        this.getAuthors();
    }

    getAuthors(){
        this.authorsService.getAuthors()
            .then( response => {
                if(evalResponse(response)){
                    this.authors.data = response.data;
                }
            });
    }
}

AuthorsController.$inject = ['AuthorsService'];

export default AuthorsController;