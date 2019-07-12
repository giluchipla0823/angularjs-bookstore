import angular from 'angular';
import modal from 'angular-ui-bootstrap/src/modal';
import angularDatatables from 'angular-datatables';

// Datatables - bootstrap
import 'angular-datatables/dist/plugins/bootstrap/angular-datatables.bootstrap.js';
import 'angular-datatables/dist/plugins/bootstrap/datatables.bootstrap.min.css';

// Datatables - responsive
import 'datatables.net-responsive-bs/css/responsive.bootstrap.min.css';

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

angular.module(MODULE_NAME, [modal, angularDatatables, 'datatables.bootstrap'])
.controller('BooksController', BooksController)
.controller('ModalController', ModalController)
.service('BooksService', BooksService)
.component('books', BooksComponent);

export default MODULE_NAME;