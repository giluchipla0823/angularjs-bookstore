import angular from 'angular';
import ngMessages from 'angular-messages';
import modal from 'angular-ui-bootstrap/src/modal';

import 'ladda/dist/ladda-themeless.min.css';
import 'ladda/js/ladda.js';
import 'angular-ladda/dist/angular-ladda.js';

// Datatables - Styles
import 'datatables.net-dt/css/jquery.dataTables.css';
import 'angular-datatables/dist/plugins/bootstrap/datatables.bootstrap.min.css';
// import 'datatables.net-responsive/css/responsive.dataTables.min.css';
import 'datatables.net-responsive-bs/css/responsive.bootstrap.css';
import 'angular-datatables/dist/css/angular-datatables.css';
import '../../../public/assets/css/datatables/styles.css';


// Datatables -js 
import 'datatables.net-dt/js/dataTables.dataTables.js';
import 'angular-datatables/dist/angular-datatables.js';
import 'angular-datatables/dist/plugins/bootstrap/angular-datatables.bootstrap.js';
import 'datatables.net-responsive/js/dataTables.responsive.min.js';
import 'datatables.net-responsive-bs/js/responsive.bootstrap.min.js';

// Sweetalert
import 'sweetalert';
import 'ng-sweet-alert/ng-sweet-alert.js';
import '../../../public/assets/css/sweetalert/sweetalert.css';

// Validation
import '../../../public/assets/js/libs/auto-validate/jcs-auto-validate.js';


import BooksController from './books.controller.js';
import BooksModalController from './books.modal.controller.js';
import BooksTemplate from './books.template.html';
import BooksService from '../../services/books.service';

const MODULE_NAME = 'books.component';

const BooksComponent = {
    template: BooksTemplate,
    controller: BooksController,
    controllerAs: 'vm'
};

angular.module(MODULE_NAME, [modal, 'datatables', 'datatables.bootstrap', 'ng-sweet-alert', ngMessages, 'jcs-autoValidate', 'angular-ladda'])
.controller('BooksController', BooksController)
.controller('BooksModalController', BooksModalController)
.service('BooksService', BooksService)
.component('books', BooksComponent);

export default MODULE_NAME;