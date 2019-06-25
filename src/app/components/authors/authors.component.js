import angular from 'angular';

import AuthorsController from './authors.controller.js';
import AuthorsTemplate from './authors.template.html';
import AuthorsService from '../../services/authors.service.js';

const MODULE_NAME = 'authors.component';

const AuthorsComponent = {
    template: AuthorsTemplate,
    controller: AuthorsController,
    controllerAs: 'vm'
};

angular.module(MODULE_NAME, [])
    .controller('AuthorsController', AuthorsController)
    .service('AuthorsService', AuthorsService)
    .component('authors', AuthorsComponent);

export default MODULE_NAME;