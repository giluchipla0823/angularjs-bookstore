import angular from 'angular';

import HomeController from './home.controller.js';
import HomeTemplate from './home.template.html';

const MODULE_NAME = 'home.component';

const HomeComponent = {
    template: HomeTemplate,
    controller: HomeController,
    controllerAs: 'vm'
};

angular.module(MODULE_NAME, [])
    // .controller('HomeController', HomeController)
    .component('home', HomeComponent);

export default MODULE_NAME;