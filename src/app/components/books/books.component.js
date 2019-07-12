import angular from 'angular';
import modal from 'angular-ui-bootstrap/src/modal';
//import angularDatatables from 'angular-datatables';

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



import BooksController from './books.controller.js';
import ModalController from './modal.controller.js';
import BooksTemplate from './books.template.html';
import BooksService from '../../services/books.service';

const MODULE_NAME = 'books.component';

const BooksComponent = {
    template: BooksTemplate,
    controller: BooksController,
    controllerAs: 'vm'
};

angular.module(MODULE_NAME, [modal, 'datatables', 'datatables.bootstrap'])
.controller('BooksController', BooksController)
.controller('ModalController', ModalController)
.service('BooksService', BooksService)
.component('books', BooksComponent);

export default MODULE_NAME;