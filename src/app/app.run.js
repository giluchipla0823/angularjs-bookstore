import angular from 'angular';

const MODULE_NAME = 'app.routes';

angular.module(MODULE_NAME)
    .run(['$rootScope', '$location', ($rootScope, $location) => {
        console.log('RUN APP!!');
    }]);

export default MODULE_NAME;