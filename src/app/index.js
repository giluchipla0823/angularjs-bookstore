import angular from 'angular';

// Styles
import '../public/assets/css/styles.css';

// Angular loagin overlay
import 'angular-loading-overlay/dist/angular-loading-overlay.js';

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
    AppServices,
    'bsLoadingOverlay'
])
.config([
    '$httpProvider',
    function($httpProvider) {
        /* $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
        $httpProvider.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded'; */
        // $httpProvider.interceptors.push('myInterceptor');
}])
.run(['bsLoadingOverlayService', function(bsLoadingOverlayService) {
    bsLoadingOverlayService.setGlobalConfig({
         templateUrl: './templates/loading-overlay.html'
     });
}]);