import angular from 'angular';
import ngRoute from 'angular-route';

import '../public/assets/css/styles.css';

// Directives
import AppDirectives from './directives';

// Components
import NavbarComponent from './components/navbar/navbar.component';
import HomeComponent from './components/home/home.component';
import BooksComponent from './components/books/books.component';
import AuthorsComponent from './components/authors/authors.component';

const MODULE_NAME = 'BookstoreApp';

angular.module(MODULE_NAME, [
    ngRoute,
    NavbarComponent,
    HomeComponent,
    BooksComponent,
    AuthorsComponent,
    AppDirectives
])
.config(['$routeProvider', '$locationProvider', ($routeProvider, $locationProvider) => {
    $locationProvider.html5Mode(true);

    $routeProvider
        .when('/', { template: '<home></home>' })
        .when('/books', { template: '<books></books>' })
        .when('/authors', { template: '<authors></authors>' })
        .otherwise({
            redirectTo: '/'
        });
}])
.run(['$rootScope', '$location', ($rootScope, $location) => {
    console.log('run app');
}]);