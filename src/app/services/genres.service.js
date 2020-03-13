class GenresService{
    constructor(restService){
        this.restService = restService;
    }

    getGenres(){
        return this.restService.makeRequest(
            'GET',
            'genres'
        );
    }

    createGenre(genre){
        const id = genre.id;

        return this.restService.makeRequest(
            'POST',
            'genres',
            genre
        );
    }

    updateGenre(genre){
        const id = genre.id;

        return this.restService.makeRequest(
            'PUT',
            `genres/${id}`,
            genre
        );
    }

    deleteGenre(id){
        return this.restService.makeRequest(
            'DELETE',
            `genres/${id}`
        );
    }
}

GenresService.$inject = ['restService'];

export default GenresService;