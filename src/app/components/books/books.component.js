import angular from 'angular';

import BooksController from './books.controller.js';
import BooksTemplate from './books.template.html';
import BooksService from '../../services/books.service';

const MODULE_NAME = 'books.component';

const BooksComponent = {
    template: BooksTemplate,
    controller: BooksController,
    controllerAs: 'vm'
};

angular.module(MODULE_NAME, [])
.controller('BooksController', BooksController)
.service('BooksService', BooksService)
.component('books', BooksComponent);

export default MODULE_NAME;