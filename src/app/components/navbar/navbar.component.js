import angular from 'angular';

import NavbarController from './navbar.controller.js';
import NavbarTemplate from './navbar.template.html';

const MODULE_NAME = 'navbar.component';

const NavbarComponent = {
    template: NavbarTemplate,
    controller: NavbarController,
    controllerAs: 'navbar'
};

angular.module(MODULE_NAME, [])
    .controller('NavbarController', NavbarController)
    .component('navbar', NavbarComponent);

export default MODULE_NAME;