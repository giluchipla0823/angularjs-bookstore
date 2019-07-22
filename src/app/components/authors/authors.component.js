import angular from 'angular';
import ngMessages from 'angular-messages';
import modal from 'angular-ui-bootstrap/src/modal';

// Ladda 
import 'ladda/dist/ladda-themeless.min.css';
import 'ladda/js/ladda.js';
import angularLadda from 'angular-ladda';

// Datatables
import 'datatables.net-dt/css/jquery.dataTables.css';
import 'angular-datatables/dist/plugins/bootstrap/datatables.bootstrap.min.css';
import '../../../public/assets/css/datatables/responsive.dataTables.min.css';
import 'datatables.net-responsive-bs/css/responsive.bootstrap.css';
import 'angular-datatables/dist/css/angular-datatables.css';
import '../../../public/assets/css/datatables/styles.css';

import 'datatables.net-dt';
import 'angular-datatables';
import 'datatables.net-responsive';
import 'datatables.net-responsive-bs';

// Sweetalert
import 'sweetalert';
import 'ng-sweet-alert';
import '../../../public/assets/css/sweetalert/sweetalert.css';

// Validation
import '../../../public/assets/js/libs/auto-validate/jcs-auto-validate.js';


import AuthorsController from './authors.controller.js';
import AuthorsModalController from './authors.modal.controller.js';
import AuthorsTemplate from './authors.template.html';
import AuthorsService from '../../services/authors.service.js';

const MODULE_NAME = 'authors.component';

const AuthorsComponent = {
    template: AuthorsTemplate,
    controller: AuthorsController,
    controllerAs: 'vm'
};

angular.module(MODULE_NAME, [
		modal, 
		'datatables', 
		'datatables.bootstrap', 
		'ng-sweet-alert', 
		ngMessages, 
		'jcs-autoValidate', 
		angularLadda
	])
    .controller('AuthorsController', AuthorsController)
    .controller('AuthorsModalController', AuthorsModalController)
    .service('AuthorsService', AuthorsService)
    .component('authors', AuthorsComponent);

export default MODULE_NAME;