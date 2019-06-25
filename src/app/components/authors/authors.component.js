import angular from 'angular';

import AuthorsController from './authors.controller.js';
import AuthorsTemplate from './authors.template.html';

const MODULE_NAME = 'authors.component';

const AuthorsComponent = {
    template: AuthorsTemplate,
    controller: AuthorsController,
    controllerAs: 'vm'
};

angular.module(MODULE_NAME, [])
    .controller('AuthorsController', AuthorsController)
    .component('authors', AuthorsComponent);

export default MODULE_NAME;