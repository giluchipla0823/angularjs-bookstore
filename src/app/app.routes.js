import angular from 'angular';
import ngRoute from 'angular-route';

const MODULE_NAME = 'app.routes';

angular.module(MODULE_NAME, [ngRoute])
    .config(['$routeProvider', '$locationProvider', ($routeProvider, $locationProvider) => {
        $locationProvider.html5Mode(true);

        $routeProvider
            .when('/', { template: '<home></home>' })
            .when('/books', { template: '<books></books>' })
            .when('/authors', { template: '<authors></authors>' })
            .otherwise({
                redirectTo: '/'
            });
    }]);

export default MODULE_NAME;