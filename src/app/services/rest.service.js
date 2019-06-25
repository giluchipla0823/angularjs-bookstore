class RestService{
    constructor($http, $q){
        this.http = $http;
        this.q = $q;
    }

    buildRequest(method, url, data, extra) {
        const deferred = this.q.defer();

        const request = {
            method: method,
            url: API_URL + url,
            data: data,
            timeout: deferred.promise,
            canceller: deferred
        };

        this.http(request)
            .then( response => {
                deferred.resolve(response.data);
            })
            .catch( error => {
                deferred.reject(error);
            });

        return deferred.promise;
    }
}

RestService.$inject = ['$http', '$q'];

export default RestService;