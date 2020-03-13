class PublishersService{
    constructor(restService){
        this.restService = restService;
    }

    getPublishers(){
        return this.restService.makeRequest(
            'GET',
            'publishers'
        );
    }
}

PublishersService.$inject = ['restService'];

export default PublishersService;