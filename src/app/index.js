import angular from 'angular';
import ngRoute from 'angular-route';

import '../public/assets/css/styles.css';

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
    AuthorsComponent
])
.config(['$routeProvider', ($routeProvider) => {
    $routeProvider
        .when('/', { template: '<home></home>' })
        .when('/books', { template: '<books></books>' })
        .when('/authors', { template: '<authors></authors>' });
}])
.run(['$rootScope', '$location', ($rootScope, $location) => {
    console.log('run app');
}]);