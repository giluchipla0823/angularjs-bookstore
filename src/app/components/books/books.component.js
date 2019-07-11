import angular from 'angular';
import modal from 'ui-bootstrap4/src/modal';

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

angular.module(MODULE_NAME, [modal])
.controller('BooksController', BooksController)
.controller('ModalController', ModalController)
.service('BooksService', BooksService)
.component('books', BooksComponent);

export default MODULE_NAME;