import angular from 'angular';
import ngMessages from 'angular-messages';

import '../../../public/assets/js/libs/auto-validate/jcs-auto-validate.js';
import ContactController from './contact.controller';
import ContactTemplate from './contact.template.html';

const MODULE_NAME = 'contact.component';

const ContactComponent = {
    template: ContactTemplate,
    controller: ContactController,
    controllerAs: 'vm'
};

angular.module(MODULE_NAME, [ngMessages, 'jcs-autoValidate'])
    .component('contact', ContactComponent);


export default MODULE_NAME;