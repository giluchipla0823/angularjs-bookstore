import angular from 'angular';

const MODULE_NAME = 'app.run';

angular.module(MODULE_NAME, [])
    .run(['$rootScope', '$http', ($rootScope, $http) => {
        
        // cancel pending http ajax requests before change view
        $rootScope.$on('$routeChangeStart', function(event, next, current) {
            $http.pendingRequests.forEach(function(request) {
                if (request.canceller) {
                    request.canceller.resolve();
                }
            });
        });
    }])
    .run([
        'validator',
        'bootstrap3ElementModifier',
        'defaultErrorMessageResolver',
        (validator, bootstrap3ElementModifier, defaultErrorMessageResolver) => {
            var path = window.location.origin + document.getElementById('base-app').getAttribute('href');

            // Bootstrap 4
            /* validator.registerDomModifier(bootstrap4ElementModifier.key, bootstrap4ElementModifier);
            validator.setDefaultElementModifier(bootstrap4ElementModifier.key); */

            // Language
            defaultErrorMessageResolver.setI18nFileRootPath(path + 'assets/js/libs/auto-validate/lang');
            defaultErrorMessageResolver.setCulture('es-co');

            validator.setValidElementStyling(false);
            validator.setInvalidElementStyling(true);
            bootstrap3ElementModifier.enableValidationStateIcons(true);

            /* defaultErrorMessageResolver.getErrorMessages().then(function (errorMessages) {
                errorMessages['defaultMessageEmail'] = 'Please enter a valid email address.';
                errorMessages['defaultMessagePrice'] = 'Please enter a valid price.';
            }); */
        }]);

export default MODULE_NAME;