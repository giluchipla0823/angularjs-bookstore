import angular from 'angular';

// Styles
import '../public/assets/css/styles.css';

// Config
import AppRoutes from './app.routes';
import AppRun from './app.run';

// Directives
import AppDirectives from './directives';

// Components
import NavbarComponent from './components/navbar/navbar.component';
import HomeComponent from './components/home/home.component';
import BooksComponent from './components/books/books.component';
import AuthorsComponent from './components/authors/authors.component';

const MODULE_NAME = 'BookstoreApp';

angular.module(MODULE_NAME, [
    AppRoutes,
    AppRun,
    NavbarComponent,
    HomeComponent,
    BooksComponent,
    AuthorsComponent,
    AppDirectives
]);
