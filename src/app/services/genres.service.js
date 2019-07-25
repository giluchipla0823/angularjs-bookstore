class GenresService{
    constructor(restService){
        this.restService = restService;
    }

    getGenres(){
        return this.restService.buildRequest(
            'GET',
            'genres'
        );
    }

    createGenre(genre){
        const id = genre.id;

        return this.restService.buildRequest(
            'POST',
            'genres',
            genre
        );
    }

    updateGenre(genre){
        const id = genre.id;

        return this.restService.buildRequest(
            'PUT',
            `genres/${id}`,
            genre
        );
    }

    deleteGenre(id){
        return this.restService.buildRequest(
            'DELETE',
            `genres/${id}`
        );
    }
}

GenresService.$inject = ['restService'];

export default GenresService;