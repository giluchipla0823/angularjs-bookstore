import angular from 'angular';
import angularSanitize from 'angular-sanitize';

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
import FooterComponent from './components/shared/footer/footer.component';
import NavbarComponent from './components/shared/navbar/navbar.component';
import HomeComponent from './pages/home/home.component';
import ContactComponent from './pages/contact/contact.component';
import BooksComponent from './pages/books/books.component';
import AuthorsComponent from './pages/authors/authors.component';

// Services
import AppServices from './services';

const MODULE_NAME = 'BookstoreApp';

angular.module(MODULE_NAME, [
    angularSanitize,
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