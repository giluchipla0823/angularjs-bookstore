import angular from 'angular';
import RestService from './rest.service';

const MODULE_NAME = 'app.services';

angular.module(MODULE_NAME, [])
    .service('restService', RestService);

export default MODULE_NAME;