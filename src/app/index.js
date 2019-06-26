import angular from 'angular';

// Styles
// import '../public/assets/css/bootstrap/bootstrap.min.css';
import '../public/assets/css/styles.css';

// Scripts
// import '../public/assets/js/libs/jquery/jquery-3.1.1.slim.min.js';
// import '../public/assets/js/libs/tether/tether.min.js';
// import '../public/assets/js/libs/bootstrap/bootstrap.min.js';


// require('../../node_modules/bootstrap/dist/js/bootstrap.js');

// import '../../node_modules/bootstrap/dist/js/bootstrap.js';


// Config
import AppRoutes from './app.routes';
import AppRun from './app.run';

// Directives
import AppDirectives from './directives';

// Components
import FooterComponent from './components/footer/footer.component';
import NavbarComponent from './components/navbar/navbar.component';
import HomeComponent from './components/home/home.component';
import ContactComponent from './components/contact/contact.component';
import BooksComponent from './components/books/books.component';
import AuthorsComponent from './components/authors/authors.component';

// Services
import AppServices from './services';

const MODULE_NAME = 'BookstoreApp';

angular.module(MODULE_NAME, [
    AppRoutes,
    AppRun,
    FooterComponent,
    NavbarComponent,
    HomeComponent,
    ContactComponent,
    BooksComponent,
    AuthorsComponent,
    AppDirectives,
    AppServices
]);