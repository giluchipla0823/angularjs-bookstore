import angular from 'angular';

import FooterController from './footer.controller';
import FooterTemplate from './footer.template.html';

const MODULE_NAME = 'footer.component';

const FooterComponent = {
    template: FooterTemplate,
    controller: FooterController,
    controllerAs: 'vm'
};

angular.module(MODULE_NAME, [])
    .controller('FooterController', FooterController)
    .component('appFooter', FooterComponent);

export default MODULE_NAME;