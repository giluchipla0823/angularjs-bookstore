import angular from 'angular';
import ngMessages from 'angular-messages';
import modal from 'angular-ui-bootstrap/src/modal';

// Ladda 
import 'ladda/dist/ladda-themeless.min.css';
import 'ladda/js/ladda.js';
import angularLadda from 'angular-ladda';

// Datatables
import 'datatables.net-dt/css/jquery.dataTables.css';
import 'angular-datatables/dist/plugins/bootstrap/datatables.bootstrap.min.css';
import '../../../public/assets/css/datatables/responsive.dataTables.min.css';
import 'datatables.net-responsive-bs/css/responsive.bootstrap.css';
import 'angular-datatables/dist/css/angular-datatables.css';
import '../../../public/assets/css/datatables/styles.css';

import 'datatables.net-dt';
import 'angular-datatables';
import 'datatables.net-responsive';
import 'datatables.net-responsive-bs';

// Sweetalert
import 'sweetalert';
import 'ng-sweet-alert';
import '../../../public/assets/css/sweetalert/sweetalert.css';

// Validation
import '../../../public/assets/js/libs/auto-validate/jcs-auto-validate.js';

// Select2 
import '../../../public/assets/css/select2/select2.css';
import '../../../public/assets/css/select2/ui-select2.css';
import '../../../public/assets/js/libs/select2/ui-select2.js';

// Jasny-bootstrap
import 'jasny-bootstrap/dist/css/jasny-bootstrap.min.css';
import 'jasny-bootstrap/dist/js/jasny-bootstrap.min.js';
import '../../../public/assets/js/libs/jasny-bootstrap-angular/dist/jasny-bootstrap-angular.min.js';

import BooksController from './books.controller.js';
import BooksFormController from './books-form.controller.js';
import BooksTemplate from './books.template.html';
import BooksService from '../../services/books.service';
import AuthorsService from '../../services/authors.service';
import PublishersService from '../../services/publishers.service';
import GenresService from '../../services/genres.service';

const MODULE_NAME = 'books.component';

const BooksComponent = {
    template: BooksTemplate,
    controller: BooksController,
    controllerAs: 'vm'
};

angular.module(MODULE_NAME, [
		modal, 
		'datatables', 
		'datatables.bootstrap', 
		'ng-sweet-alert', 
		ngMessages, 
		'jcs-autoValidate', 
		angularLadda, 
		'ui.select',
		'jasny-bootstrap-angular'
	])
.controller('BooksController', BooksController)
.controller('BooksFormController', BooksFormController)
.service('BooksService', BooksService)
.service('AuthorsService', AuthorsService)
.service('PublishersService', PublishersService)
.service('GenresService', GenresService)
.component('books', BooksComponent);

export default MODULE_NAME;